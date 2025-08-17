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
      setPayments(response.data.payments);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
      }));
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await usersApi.getAll(1, 100);
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const loadMemberships = async () => {
    try {
      const response = await membershipsApi.getAll(1, 100);
      setMemberships(response.data.memberships);
    } catch (error) {
      toast.error('Failed to load memberships');
    }
  };

  // CRUD operations
  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await paymentsApi.create(paymentForm);
      toast.success('Payment created successfully');
      setIsModalOpen(false);
      loadPayments();
      resetPaymentForm();
    } catch (error) {
      toast.error('Failed to create payment');
    }
  };

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;
    try {
      await paymentsApi.update(selectedPayment.id, {
        description: paymentForm.description,
      });
      toast.success('Payment updated successfully');
      setIsModalOpen(false);
      loadPayments();
      resetPaymentForm();
    } catch (error) {
      toast.error('Failed to update payment');
    }
  };

  const handleProcessPayment = async (id: string) => {
    try {
      await paymentsApi.process(id);
      toast.success('Payment processed successfully');
      loadPayments();
    } catch (error) {
      toast.error('Failed to process payment');
    }
  };

  const handleRefundPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;
    try {
      await paymentsApi.refund(selectedPayment.id, refundForm.reason);
      toast.success('Payment refunded successfully');
      setIsModalOpen(false);
      loadPayments();
      resetRefundForm();
    } catch (error) {
      toast.error('Failed to refund payment');
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await paymentsApi.delete(id);
        toast.success('Payment deleted successfully');
        loadPayments();
      } catch (error) {
        toast.error('Failed to delete payment');
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
      label: 'Customer',
      render: (user) => user ? `${user.firstName} ${user.lastName}` : 'N/A',
    },
    { key: 'amount', label: 'Amount', render: (value) => `$${value}`, sortable: true },
    { key: 'method', label: 'Method', sortable: true },
    {
      key: 'status',
      label: 'Status',
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
    { key: 'description', label: 'Description' },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'id',
      label: 'Actions',
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
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Process Payment
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Method</label>
            <select
              value={filters.method}
              onChange={(e) => setFilters(prev => ({ ...prev, method: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Methods</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <select
              value={filters.userId}
              onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Customers</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
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
        emptyMessage="No payments found"
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
          modalType === 'create' ? 'Process Payment' :
          modalType === 'edit' ? 'Edit Payment' :
          'Refund Payment'
        }
        size="md"
      >
        {modalType === 'refund' ? (
          <form onSubmit={handleRefundPayment} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-900">Payment Details</h4>
              <p className="text-sm text-gray-600">Amount: ${selectedPayment?.amount}</p>
              <p className="text-sm text-gray-600">Method: {selectedPayment?.method}</p>
              <p className="text-sm text-gray-600">Date: {selectedPayment ? new Date(selectedPayment.createdAt).toLocaleDateString() : ''}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Refund Reason</label>
              <textarea
                value={refundForm.reason}
                onChange={(e) => setRefundForm(prev => ({ ...prev, reason: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                required
                placeholder="Please provide a reason for the refund..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Process Refund
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={modalType === 'create' ? handleCreatePayment : handleUpdatePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <select
                value={paymentForm.userId}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, userId: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={modalType === 'edit'}
              >
                <option value="">Select a customer</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Membership (Optional)</label>
              <select
                value={paymentForm.membershipId}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, membershipId: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                disabled={modalType === 'edit'}
              >
                <option value="">No membership</option>
                {memberships.filter(m => m.userId === paymentForm.userId).map(membership => (
                  <option key={membership.id} value={membership.id}>
                    {membership.plan?.name} - {new Date(membership.startDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
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
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, method: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={modalType === 'edit'}
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="TRANSFER">Bank Transfer</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={paymentForm.description}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder="Payment description or notes..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {modalType === 'create' ? 'Process Payment' : 'Update Payment'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default PaymentsPage;