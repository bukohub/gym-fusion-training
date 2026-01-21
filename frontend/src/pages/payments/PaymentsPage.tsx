import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Table, { TableColumn } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { paymentsApi } from '../../services/payments';
import { usersApi } from '../../services/users';
import { membershipsApi } from '../../services/memberships';
import { Payment, User, Membership } from '../../types';

const PaymentsPage: React.FC = () => {
  // State management
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    userId: '',
    startDate: '',
    endDate: '',
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'refund'>('create');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Form states
  const [paymentForm, setPaymentForm] = useState({
    userId: '',
    membershipId: '',
    amount: 0,
    method: 'CASH',
    description: '',
  });

  const [refundForm, setRefundForm] = useState({
    reason: '',
  });

  // Load data
  useEffect(() => {
    loadPayments();
    loadUsers();
    loadMemberships();
  }, [pagination.page, filters]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentsApi.getAll(
        pagination.page,
        pagination.limit,
        filters.status || undefined,
        filters.method || undefined,
        filters.userId || undefined,
        filters.startDate || undefined,
        filters.endDate || undefined
      );
      setPayments((response.data as any).payments || (response.data as any).data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 0,
      }));
    } catch (error) {
      toast.error('Error al cargar los pagos');
      setPayments([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        totalPages: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await usersApi.getAll(1, 100);
      setUsers((response.data as any).users || (response.data as any).data || []);
    } catch (error) {
      toast.error('Error al cargar los usuarios');
      setUsers([]);
    }
  };

  const loadMemberships = async () => {
    try {
      const response = await membershipsApi.getAll(1, 100);
      setMemberships((response.data as any).memberships || (response.data as any).data || []);
    } catch (error) {
      toast.error('Error al cargar las membresías');
      setMemberships([]);
    }
  };

  // CRUD operations
  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await paymentsApi.create(paymentForm);
      toast.success('Pago procesado exitosamente');
      setIsModalOpen(false);
      loadPayments();
      resetPaymentForm();
    } catch (error) {
      toast.error('Error al procesar el pago');
    }
  };

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;
    try {
      await paymentsApi.update(selectedPayment.id, {
        description: paymentForm.description,
      });
      toast.success('Pago actualizado exitosamente');
      setIsModalOpen(false);
      loadPayments();
      resetPaymentForm();
    } catch (error) {
      toast.error('Error al actualizar el pago');
    }
  };

  const handleProcessPayment = async (id: string) => {
    try {
      await paymentsApi.process(id);
      toast.success('Pago procesado exitosamente');
      loadPayments();
    } catch (error) {
      toast.error('Error al procesar el pago');
    }
  };

  const handleRefundPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;
    try {
      await paymentsApi.refund(selectedPayment.id, refundForm.reason);
      toast.success('Pago reembolsado exitosamente');
      setIsModalOpen(false);
      loadPayments();
      resetRefundForm();
    } catch (error) {
      toast.error('Error al reembolsar el pago');
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este pago?')) {
      try {
        await paymentsApi.delete(id);
        toast.success('Pago eliminado exitosamente');
        loadPayments();
      } catch (error) {
        toast.error('Error al eliminar el pago');
      }
    }
  };

  // Form helpers
  const resetPaymentForm = () => {
    setPaymentForm({
      userId: '',
      membershipId: '',
      amount: 0,
      method: 'CASH',
      description: '',
    });
  };

  const resetRefundForm = () => {
    setRefundForm({
      reason: '',
    });
  };

  const openCreateModal = () => {
    setModalType('create');
    setSelectedPayment(null);
    resetPaymentForm();
    setIsModalOpen(true);
  };

  const openEditModal = (payment: Payment) => {
    setModalType('edit');
    setSelectedPayment(payment);
    setPaymentForm({
      userId: payment.userId,
      membershipId: payment.membershipId || '',
      amount: payment.amount,
      method: payment.method,
      description: payment.description || '',
    });
    setIsModalOpen(true);
  };

  const openRefundModal = (payment: Payment) => {
    setModalType('refund');
    setSelectedPayment(payment);
    resetRefundForm();
    setIsModalOpen(true);
  };

  // Table columns
  const paymentColumns: TableColumn<Payment>[] = [
    {
      key: 'user',
      label: 'Cliente',
      render: (user) => user ? `${user.firstName} ${user.lastName}` : 'N/A',
    },
    { key: 'amount', label: 'Monto', render: (value) => `$${value}`, sortable: true },
    { key: 'method', label: 'Método', sortable: true },
    {
      key: 'status',
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'COMPLETED' ? 'bg-green-100 text-green-800' :
          value === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
          value === 'FAILED' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
      sortable: true,
    },
    { key: 'description', label: 'Descripción' },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'id',
      label: 'Acciones',
      render: (_, item) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openEditModal(item)}
            className="text-indigo-600 hover:text-indigo-900 text-sm"
          >
            Edit
          </button>
          {item.status === 'PENDING' && (
            <button
              onClick={() => handleProcessPayment(item.id)}
              className="text-green-600 hover:text-green-900 text-sm"
            >
              Process
            </button>
          )}
          {item.status === 'COMPLETED' && (
            <button
              onClick={() => openRefundModal(item)}
              className="text-orange-600 hover:text-orange-900 text-sm"
            >
              Refund
            </button>
          )}
          <button
            onClick={() => handleDeletePayment(item.id)}
            className="text-red-600 hover:text-red-900 text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Procesar Pago
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los Estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="COMPLETED">Completado</option>
              <option value="FAILED">Fallido</option>
              <option value="REFUNDED">Reembolsado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Método</label>
            <select
              value={filters.method}
              onChange={(e) => setFilters(prev => ({ ...prev, method: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los Métodos</option>
              <option value="CASH">Efectivo</option>
              <option value="CARD">Tarjeta</option>
              <option value="TRANSFER">Transferencia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cliente</label>
            <select
              value={filters.userId}
              onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los Clientes</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Desde</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Hasta</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <Table
        data={payments}
        columns={paymentColumns}
        loading={loading}
        emptyMessage="No se encontraron pagos"
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === 'create' ? 'Procesar Pago' :
          modalType === 'edit' ? 'Editar Pago' :
          'Reembolsar Pago'
        }
        size="md"
      >
        {modalType === 'refund' ? (
          <form onSubmit={handleRefundPayment} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-900">Detalles del Pago</h4>
              <p className="text-sm text-gray-600">Monto: ${selectedPayment?.amount}</p>
              <p className="text-sm text-gray-600">Método: {selectedPayment?.method}</p>
              <p className="text-sm text-gray-600">Fecha: {selectedPayment ? new Date(selectedPayment.createdAt).toLocaleDateString() : ''}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Motivo del Reembolso</label>
              <textarea
                value={refundForm.reason}
                onChange={(e) => setRefundForm(prev => ({ ...prev, reason: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                required
                placeholder="Por favor proporcione el motivo del reembolso..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Procesar Reembolso
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={modalType === 'create' ? handleCreatePayment : handleUpdatePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cliente</label>
              <select
                value={paymentForm.userId}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, userId: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={modalType === 'edit'}
              >
                <option value="">Seleccionar cliente</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Membresía (Opcional)</label>
              <select
                value={paymentForm.membershipId}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, membershipId: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                disabled={modalType === 'edit'}
              >
                <option value="">Sin membresía</option>
                {memberships.filter(m => m.userId === paymentForm.userId).map(membership => (
                  <option key={membership.id} value={membership.id}>
                    {membership.plan?.name} - {new Date(membership.startDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Monto ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  min="0"
                  disabled={modalType === 'edit'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, method: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={modalType === 'edit'}
                >
                  <option value="CASH">Efectivo</option>
                  <option value="CARD">Tarjeta</option>
                  <option value="TRANSFER">Transferencia</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={paymentForm.description}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder="Descripción o notas del pago..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {modalType === 'create' ? 'Procesar Pago' : 'Actualizar Pago'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default PaymentsPage;