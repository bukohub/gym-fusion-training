import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import Table, { TableColumn } from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import { validationLogsApi, ValidationLog, ValidationLogStats } from '../../services/validation-logs';
import { uploadsApi } from '../../services/uploads';

const ValidationLogsPage: React.FC = () => {
  // State management
  const [logs, setLogs] = useState<ValidationLog[]>([]);
  const [stats, setStats] = useState<ValidationLogStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    validationType: '',
    success: '',
    startDate: '',
    endDate: '',
    userId: '',
  });

  // Load data
  useEffect(() => {
    loadLogs();
    loadStats();
  }, [pagination.page, filters]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await validationLogsApi.getAll(
        pagination.page,
        pagination.limit,
        filters.validationType || undefined,
        filters.success === '' ? undefined : filters.success === 'true',
        filters.startDate || undefined,
        filters.endDate || undefined,
        filters.userId || undefined
      );
      setLogs(response.data.logs);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
      }));
    } catch (error) {
      toast.error('Error al cargar los registros de validación');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await validationLogsApi.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading validation stats:', error);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      validationType: '',
      success: '',
      startDate: '',
      endDate: '',
      userId: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Table columns
  const logColumns: TableColumn<ValidationLog>[] = [
    {
      key: 'success',
      label: 'Estado',
      render: (value) => (
        <div className="flex items-center">
          {value ? (
            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
          ) : (
            <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />
          )}
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {value ? 'Exitoso' : 'Fallido'}
          </span>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'Usuario',
      render: (user, item) => (
        <div className="flex items-center">
          {user?.photo ? (
            <img
              src={uploadsApi.getPhotoUrl(user.photo)}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-8 h-8 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
              <UserIcon className="w-4 h-4 text-gray-600" />
            </div>
          )}
          <div>
            {user ? (
              <>
                <div className="font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {user.cedula}
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 italic">
                Usuario no encontrado
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'identifier',
      label: 'Identificador',
      render: (value) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {value}
        </span>
      ),
    },
    {
      key: 'validationType',
      label: 'Tipo',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'CEDULA' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {value === 'CEDULA' ? 'Cédula' : 'Holler'}
        </span>
      ),
    },
    {
      key: 'reason',
      label: 'Razón',
      render: (value, item) => (
        <div>
          {value && !item.success && (
            <span className="text-sm text-red-600">
              {value}
            </span>
          )}
          {item.success && (
            <span className="text-sm text-green-600">
              Acceso autorizado
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'validatedAt',
      label: 'Fecha y Hora',
      render: (value) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {new Date(value).toLocaleDateString('es-ES')}
          </div>
          <div className="text-gray-500">
            {new Date(value).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </div>
        </div>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Registros de Validación</h1>
        <div className="text-sm text-gray-500">
          Seguimiento de todas las validaciones de membresía
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Validaciones
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.total.all.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Exitosas
                    </dt>
                    <dd className="text-lg font-medium text-green-600">
                      {stats.total.successful.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Fallidas
                    </dt>
                    <dd className="text-lg font-medium text-red-600">
                      {stats.total.failed.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tasa de Éxito
                    </dt>
                    <dd className="text-lg font-medium text-blue-600">
                      {stats.successRate.toFixed(1)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FunnelIcon className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-indigo-600 hover:text-indigo-900"
          >
            Limpiar filtros
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              value={filters.validationType}
              onChange={(e) => setFilters(prev => ({ ...prev, validationType: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los Tipos</option>
              <option value="CEDULA">Cédula</option>
              <option value="HOLLER">Holler</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              value={filters.success}
              onChange={(e) => setFilters(prev => ({ ...prev, success: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los Estados</option>
              <option value="true">Exitoso</option>
              <option value="false">Fallido</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">ID Usuario</label>
            <input
              type="text"
              value={filters.userId}
              onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
              placeholder="ID del usuario..."
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <Table
        data={logs}
        columns={logColumns}
        loading={loading}
        emptyMessage="No se encontraron registros de validación"
      />

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        showingFrom={(pagination.page - 1) * pagination.limit + 1}
        showingTo={Math.min(pagination.page * pagination.limit, pagination.total)}
        total={pagination.total}
      />
    </div>
  );
};

export default ValidationLogsPage;