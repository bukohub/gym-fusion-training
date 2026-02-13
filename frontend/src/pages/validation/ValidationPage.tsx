import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { CheckCircleIcon, XCircleIcon, UserIcon, CalendarIcon, ClockIcon, CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import { membershipsApi, ValidationResponse } from '../../services/memberships';
import { uploadsApi } from '../../services/uploads';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const UserPhoto: React.FC<{ photo?: string; name: string; className?: string }> = ({ photo, name, className = "w-20 h-20" }) => {
  if (photo) {
    return (
      <img
        src={uploadsApi.getPhotoUrl(photo)}
        alt={`${name} profile`}
        className={`${className} rounded-full object-cover border-4 border-white shadow-lg`}
      />
    );
  }
  
  return (
    <div className={`${className} rounded-full bg-gray-300 flex items-center justify-center border-4 border-white shadow-lg`}>
      <UserIcon className="w-1/2 h-1/2 text-gray-600" />
    </div>
  );
};

const ValidationPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [validationType, setValidationType] = useState<'cedula' | 'holler'>('cedula');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResponse | null>(null);
  const [showResult, setShowResult] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on input when component mounts
    inputRef.current?.focus();
  }, []);

  const handleValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      toast.error(`Por favor ingrese ${validationType === 'cedula' ? 'el número de cédula' : 'el código del holler'}`);
      return;
    }

    // Validation based on type
    if (validationType === 'cedula') {
      const cedulaRegex = /^\d{7,10}$/;
      if (!cedulaRegex.test(inputValue.trim())) {
        toast.error('Formato de cédula inválido. Debe contener solo números (7-10 dígitos)');
        return;
      }
    } else {
      // Basic holler validation (alphanumeric)
      if (inputValue.trim().length < 3) {
        toast.error('El código del holler debe tener al menos 3 caracteres');
        return;
      }
    }

    try {
      setLoading(true);
      const response = validationType === 'cedula' 
        ? await membershipsApi.validateByCedula(inputValue.trim())
        : await membershipsApi.validateByHoller(inputValue.trim());
      setResult(response.data);
      setShowResult(true);
      
      // Auto-clear after 5 seconds for quick validation
      setTimeout(() => {
        setShowResult(false);
        setResult(null);
        setInputValue('');
        inputRef.current?.focus();
      }, 5000);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al validar el pago';
      setResult({
        isValid: false,
        status: 'ERROR',
        message: errorMessage,
        payment: null,
      });
      setShowResult(true);

      // Auto-clear error after 3 seconds
      setTimeout(() => {
        setShowResult(false);
        setResult(null);
        setInputValue('');
        inputRef.current?.focus();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setResult(null);
    setShowResult(false);
    inputRef.current?.focus();
  };

  const formatCedulaDisplay = (cedula: string) => {
    // Format cedula with dots for better readability (e.g., 12.345.678)
    if (cedula.length <= 3) return cedula;
    if (cedula.length <= 6) return `${cedula.slice(0, 2)}.${cedula.slice(2)}`;
    return `${cedula.slice(0, 2)}.${cedula.slice(2, 5)}.${cedula.slice(5)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600';
      case 'EXPIRED':
        return 'text-red-600';
      case 'SUSPENDED':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Validación de Pago
          </h1>
          <p className="text-lg text-gray-600">
            Ingrese {validationType === 'cedula' ? 'el número de cédula' : 'el código del holler'} para validar el pago mensual
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          {!showResult ? (
            // Input Form
            <form onSubmit={handleValidation} className="space-y-6">
              {/* Validation Type Selector */}
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setValidationType('cedula');
                    setInputValue('');
                    inputRef.current?.focus();
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    validationType === 'cedula'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={loading}
                >
                  Cédula
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValidationType('holler');
                    setInputValue('');
                    inputRef.current?.focus();
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    validationType === 'holler'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={loading}
                >
                  Holler Digital
                </button>
              </div>

              <div>
                <label htmlFor="validationInput" className="block text-xl font-medium text-gray-700 mb-4">
                  {validationType === 'cedula' ? 'Número de Cédula' : 'Código del Holler'}
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  id="validationInput"
                  value={validationType === 'cedula' ? formatCedulaDisplay(inputValue) : inputValue}
                  onChange={(e) => {
                    const value = validationType === 'cedula' 
                      ? e.target.value.replace(/\D/g, '') // Only allow numbers for cedula
                      : e.target.value.toUpperCase(); // Allow alphanumeric for holler
                    setInputValue(value);
                  }}
                  className="w-full px-6 py-4 text-2xl border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder={validationType === 'cedula' ? 'Ej: 12.345.678' : 'Ej: HOLLER123'}
                  disabled={loading}
                  maxLength={validationType === 'cedula' ? 10 : 20}
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading || !inputValue.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl text-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Validando...</span>
                    </div>
                  ) : (
                    'Validar'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl text-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Limpiar
                </button>
              </div>
            </form>
          ) : (
            // Results Display
            <div className="text-center">
              {result?.isValid ? (
                // Valid Payment - Green Screen
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <CheckCircleIcon className="w-32 h-32 text-green-500 animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-green-600">ACCESO PERMITIDO</h2>
                    <p className="text-xl text-gray-600">{result.message}</p>
                  </div>

                  {result.payment && (
                    <div className="bg-green-50 rounded-xl p-6 space-y-4">
                      <div className="flex flex-col items-center space-y-4">
                        <UserPhoto
                          photo={result.payment.user.photo}
                          name={`${result.payment.user.firstName} ${result.payment.user.lastName}`}
                          className="w-24 h-24"
                        />
                        <h3 className="text-2xl font-semibold text-green-800">
                          {result.payment.user.firstName} {result.payment.user.lastName}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <BanknotesIcon className="w-5 h-5 text-green-600" />
                          <span>Último pago: <strong>${result.payment.amount.toLocaleString()}</strong></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CreditCardIcon className="w-5 h-5 text-green-600" />
                          <span>Método: <strong>{result.payment.method === 'CASH' ? 'Efectivo' : result.payment.method === 'CARD' ? 'Tarjeta' : result.payment.method === 'TRANSFER' ? 'Transferencia' : result.payment.method}</strong></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-5 h-5 text-green-600" />
                          <span>Fecha de pago: <strong>{formatDate(result.payment.paymentDate)}</strong></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="w-5 h-5 text-green-600" />
                          <span>Días restantes: <strong>{result.payment.daysUntilExpiry}</strong></span>
                        </div>
                        {(result.payment.membership?.plan || result.payment.plan) && (
                          <div className="flex items-center space-x-2 md:col-span-2">
                            <CalendarIcon className="w-5 h-5 text-green-600" />
                            <span>Plan: <strong>{result.payment.membership?.plan?.name || result.payment.plan?.name} ({result.payment.membership?.plan?.duration || result.payment.plan?.duration} días)</strong></span>
                          </div>
                        )}
                        {result.payment.description && (
                          <div className="flex items-center space-x-2 md:col-span-2">
                            <span>Descripción: <strong>{result.payment.description}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Invalid Payment - Red Screen
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <XCircleIcon className="w-32 h-32 text-red-500 animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-red-600">ACCESO DENEGADO</h2>
                    <p className="text-xl text-gray-600">{result?.message}</p>
                  </div>

                  {result?.status === 'USER_NOT_FOUND' && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-600">
                        {validationType === 'cedula' ? 'Cédula' : 'Holler'} consultado: <strong>{inputValue}</strong>
                      </p>
                    </div>
                  )}

                  {result?.user && (
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <div className="flex flex-col items-center space-y-4">
                        <UserPhoto
                          photo={result.user.photo}
                          name={`${result.user.firstName} ${result.user.lastName}`}
                          className="w-20 h-20"
                        />
                        <div className="text-center">
                          <p className="text-gray-600">
                            Usuario: <strong>{result.user.firstName} {result.user.lastName}</strong>
                          </p>
                          {result.user.cedula && (
                            <p className="text-gray-600">
                              Cédula: <strong>{result.user.cedula}</strong>
                            </p>
                          )}
                          {result.user.holler && (
                            <p className="text-gray-600">
                              Holler: <strong>{result.user.holler}</strong>
                            </p>
                          )}
                        </div>
                      </div>

                      {(result.status === 'NO_RECENT_PAYMENT' || result.status === 'NO_COMPLETED_PAYMENT') && (
                        <div className="bg-yellow-50 rounded-xl p-4">
                          <div className="flex items-center space-x-2 text-yellow-800">
                            <ClockIcon className="w-5 h-5" />
                            <p className="font-semibold">
                              Sin pagos completados. Se requiere realizar un pago para acceder al gimnasio.
                            </p>
                          </div>
                        </div>
                      )}

                      {result.status === 'PAYMENT_EXPIRED' && (
                        <div className="bg-red-50 rounded-xl p-4">
                          <div className="flex items-center space-x-2 text-red-800">
                            <XCircleIcon className="w-5 h-5" />
                            <p className="font-semibold">
                              Pago expirado. El tiempo del plan de membresía ha vencido.
                            </p>
                          </div>
                        </div>
                      )}

                      {result.status === 'NO_MEMBERSHIP_PLAN' && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center space-x-2 text-gray-800">
                            <XCircleIcon className="w-5 h-5" />
                            <p className="font-semibold">
                              Usuario sin plan de membresía asignado. Contacte administración.
                            </p>
                          </div>
                        </div>
                      )}

                      {result.status === 'USER_INACTIVE' && (
                        <div className="bg-red-50 rounded-xl p-4">
                          <div className="flex items-center space-x-2 text-red-800">
                            <XCircleIcon className="w-5 h-5" />
                            <p className="font-semibold">
                              Cuenta de usuario inactiva. Contacte administración.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-gray-600">
          <p className="text-sm">
            {showResult
              ? "El resultado se borrará automáticamente en unos segundos..."
              : "Sistema basado en plan de membresía - Valida pagos según duración del plan asignado"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValidationPage;