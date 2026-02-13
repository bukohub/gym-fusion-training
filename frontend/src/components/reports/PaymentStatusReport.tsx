import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  UserIcon,
  CalendarIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/solid';
import { membershipsApi } from '../../services/memberships';
import { uploadsApi } from '../../services/uploads';
import LoadingSpinner from '../ui/LoadingSpinner';
import Pagination from '../ui/Pagination';

interface PaymentStatusUser {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    cedula?: string;
    photo?: string;
  };
  payment?: {
    id: string;
    amount: number;
    method: string;
    description?: string;
  };
  membership: {
    id: string;
    plan: {
      name: string;
      duration: number;
      price: number;
    };
  };
  status: string;
  statusLabel: string;
  daysUntilPaymentExpiry?: number;
  paymentExpirationDate?: string;
  lastPaymentDate?: string;
}

interface PaymentStatusReportData {
  users: PaymentStatusUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    total: number;
    expired: number;
    expiringToday: number;
    expiringSoon: number;
    current: number;
    noPayment: number;
  };
  filters: {
    status: string;
    expiringDays: number;
  };
}

const UserPhoto: React.FC<{ photo?: string; name: string; className?: string }> = ({
  photo,
  name,
  className = "w-10 h-10"
}) => {
  if (photo) {
    return (
      <img
        src={uploadsApi.getPhotoUrl(photo)}
        alt={`${name} profile`}
        className={`${className} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${className} rounded-full bg-gray-300 flex items-center justify-center`}>
      <UserIcon className="w-1/2 h-1/2 text-gray-600" />
    </div>
  );
};

const PaymentStatusReport: React.FC = () => {
  const [data, setData] = useState<PaymentStatusReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all' as 'expired' | 'expiring_today' | 'expiring_soon' | 'current' | 'all',
    expiringDays: 7,
    page: 1,
    limit: 20,
  });

  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await membershipsApi.getPaymentStatusReport(
        filters.page,
        filters.limit,
        filters.status,
        filters.expiringDays
      );
      setData(response.data);
    } catch (error) {
      toast.error('Error al cargar el reporte de estado de pagos');
      console.error('Error loading payment status report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [filters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'expiring_today':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'expiring_soon':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'current':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'no_payment':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired':
        return <XCircleIcon className="w-5 h-5" />;
      case 'expiring_today':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'expiring_soon':
        return <ClockIcon className="w-5 h-5" />;
      case 'current':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'no_payment':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatMethod = (method: string) => {
    const methods = {
      'CASH': 'Efectivo',
      'CARD': 'Tarjeta',
      'TRANSFER': 'Transferencia',
    };
    return methods[method as keyof typeof methods] || method;
  };

  const formatDaysUntilExpiry = (days: number) => {
    if (days > 0) {
      return `${days} días restantes`;
    } else if (days === 0) {
      return 'Expira hoy';
    } else {
      return `Expirado hace ${Math.abs(days)} días`;
    }
  };

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reporte de Estado de Pagos</h2>
        <button
          onClick={loadReport}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Statistics Cards */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-xl font-semibold text-gray-900">{data.stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border border-red-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-500">Pagos Expirados</p>
                <p className="text-xl font-semibold text-red-600">{data.stats.expired}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border border-orange-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-500">Expiran Hoy</p>
                <p className="text-xl font-semibold text-orange-600">{data.stats.expiringToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border border-yellow-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-500">Expiran Pronto</p>
                <p className="text-xl font-semibold text-yellow-600">{data.stats.expiringSoon}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border border-green-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-500">Pagos Vigentes</p>
                <p className="text-xl font-semibold text-green-600">{data.stats.current}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Sin Pagos</p>
                <p className="text-xl font-semibold text-gray-600">{data.stats.noPayment}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                status: e.target.value as typeof prev.status,
                page: 1
              }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Todos los Estados de Pago</option>
              <option value="expired">Pagos Expirados</option>
              <option value="expiring_today">Pagos que Expiran Hoy</option>
              <option value="expiring_soon">Pagos que Expiran Pronto</option>
              <option value="current">Pagos Vigentes</option>
              <option value="no_payment">Sin Pagos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Días para "Pago Expira Pronto"</label>
            <select
              value={filters.expiringDays}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                expiringDays: parseInt(e.target.value),
                page: 1
              }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={3}>3 días</option>
              <option value={7}>7 días</option>
              <option value={15}>15 días</option>
              <option value={30}>30 días</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Elementos por página</label>
            <select
              value={filters.limit}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                limit: parseInt(e.target.value),
                page: 1
              }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
              <option value={100}>100 por página</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      {data && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {data.users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No se encontraron usuarios con el filtro seleccionado
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {data.users.map((userReport) => (
                <div key={userReport.user.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <UserPhoto
                      photo={userReport.user.photo}
                      name={`${userReport.user.firstName} ${userReport.user.lastName}`}
                      className="w-12 h-12"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            {userReport.user.firstName} {userReport.user.lastName}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
                            {userReport.user.cedula && (
                              <span>Cédula: {userReport.user.cedula}</span>
                            )}
                            {userReport.user.email && (
                              <span>• {userReport.user.email}</span>
                            )}
                            {userReport.user.phone && (
                              <span>• {userReport.user.phone}</span>
                            )}
                          </div>
                        </div>

                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(userReport.status)}`}>
                          {getStatusIcon(userReport.status)}
                          <span className="ml-2">{userReport.statusLabel}</span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          <span>Plan: <strong>{userReport.membership.plan.name}</strong> ({userReport.membership.plan.duration} días)</span>
                        </div>

                        {userReport.payment && (
                          <>
                            <div className="flex items-center space-x-2">
                              <BanknotesIcon className="w-4 h-4 text-gray-400" />
                              <span>Último pago: <strong>${userReport.payment.amount.toLocaleString()}</strong></span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <CreditCardIcon className="w-4 h-4 text-gray-400" />
                              <span>Método: <strong>{formatMethod(userReport.payment.method)}</strong></span>
                            </div>

                            {userReport.lastPaymentDate && (
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                <span>Fecha pago: <strong>{formatDate(userReport.lastPaymentDate)}</strong></span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {userReport.paymentExpirationDate && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span>Fecha de vencimiento del pago: <strong>{formatDate(userReport.paymentExpirationDate)}</strong></span>
                          {userReport.daysUntilPaymentExpiry !== null && userReport.daysUntilPaymentExpiry !== undefined && (
                            <span className="ml-4">
                              ({formatDaysUntilExpiry(userReport.daysUntilPaymentExpiry)})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <Pagination
          currentPage={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
          showingFrom={(data.pagination.page - 1) * data.pagination.limit + 1}
          showingTo={Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)}
          total={data.pagination.total}
        />
      )}
    </div>
  );
};

export default PaymentStatusReport;