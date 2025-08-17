import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Table, { TableColumn } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { membershipPlansApi, membershipsApi } from '../../services/memberships';
import { usersApi } from '../../services/users';
import { MembershipPlan, Membership, User } from '../../types';

const MembershipsPage: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'plans' | 'memberships'>('plans');
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<MembershipPlan | Membership | null>(null);

  // Form states
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0,
  });

  const [membershipForm, setMembershipForm] = useState({
    userId: '',
    planId: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  // Load data
  useEffect(() => {
    if (activeTab === 'plans') {
      loadPlans();
    } else {
      loadMemberships();
      loadUsers();
    }
  }, [activeTab, pagination.page]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await membershipPlansApi.getAll(pagination.page, pagination.limit);
      setPlans(response.data.plans);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
      }));
    } catch (error) {
      toast.error('Failed to load membership plans');
    } finally {
      setLoading(false);
    }
  };

  const loadMemberships = async () => {
    try {
      setLoading(true);
      const response = await membershipsApi.getAll(pagination.page, pagination.limit);
      setMemberships(response.data.memberships);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
      }));
    } catch (error) {
      toast.error('Failed to load memberships');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await usersApi.getClients();
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  // CRUD operations for Plans
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await membershipPlansApi.create(planForm);
      toast.success('Membership plan created successfully');
      setIsModalOpen(false);
      loadPlans();
      resetPlanForm();
    } catch (error) {
      toast.error('Failed to create membership plan');
    }
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await membershipPlansApi.update(selectedItem.id, planForm);
      toast.success('Membership plan updated successfully');
      setIsModalOpen(false);
      loadPlans();
      resetPlanForm();
    } catch (error) {
      toast.error('Failed to update membership plan');
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this membership plan?')) {
      try {
        await membershipPlansApi.delete(id);
        toast.success('Membership plan deleted successfully');
        loadPlans();
      } catch (error) {
        toast.error('Failed to delete membership plan');
      }
    }
  };

  // CRUD operations for Memberships
  const handleCreateMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await membershipsApi.create(membershipForm);
      toast.success('Membership created successfully');
      setIsModalOpen(false);
      loadMemberships();
      resetMembershipForm();
    } catch (error) {
      toast.error('Failed to create membership');
    }
  };

  const handleSuspendMembership = async (id: string) => {
    try {
      await membershipsApi.suspend(id);
      toast.success('Membership suspended successfully');
      loadMemberships();
    } catch (error) {
      toast.error('Failed to suspend membership');
    }
  };

  const handleReactivateMembership = async (id: string) => {
    try {
      await membershipsApi.reactivate(id);
      toast.success('Membership reactivated successfully');
      loadMemberships();
    } catch (error) {
      toast.error('Failed to reactivate membership');
    }
  };

  // Form helpers
  const resetPlanForm = () => {
    setPlanForm({
      name: '',
      description: '',
      duration: 30,
      price: 0,
    });
  };

  const resetMembershipForm = () => {
    setMembershipForm({
      userId: '',
      planId: '',
      startDate: new Date().toISOString().split('T')[0],
    });
  };

  const openCreateModal = (type: 'plans' | 'memberships') => {
    setModalType('create');
    setSelectedItem(null);
    if (type === 'plans') {
      resetPlanForm();
    } else {
      resetMembershipForm();
    }
    setIsModalOpen(true);
  };

  const openEditModal = (item: MembershipPlan | Membership) => {
    setModalType('edit');
    setSelectedItem(item);
    if ('duration' in item) {
      // It's a MembershipPlan
      setPlanForm({
        name: item.name,
        description: item.description || '',
        duration: item.duration,
        price: item.price,
      });
    }
    setIsModalOpen(true);
  };

  // Table columns
  const planColumns: TableColumn<MembershipPlan>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'duration', label: 'Duration (days)', sortable: true },
    { key: 'price', label: 'Price', render: (value) => `$${value}`, sortable: true },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
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
          <button
            onClick={() => handleDeletePlan(item.id)}
            className="text-red-600 hover:text-red-900 text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const membershipColumns: TableColumn<Membership>[] = [
    {
      key: 'user',
      label: 'Member',
      render: (user) => user ? `${user.firstName} ${user.lastName}` : 'N/A',
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (plan) => plan?.name || 'N/A',
    },
    { key: 'startDate', label: 'Start Date', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'endDate', label: 'End Date', render: (value) => new Date(value).toLocaleDateString() },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'ACTIVE' ? 'bg-green-100 text-green-800' :
          value === 'EXPIRED' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, item) => (
        <div className="flex space-x-2">
          {item.status === 'ACTIVE' ? (
            <button
              onClick={() => handleSuspendMembership(item.id)}
              className="text-yellow-600 hover:text-yellow-900 text-sm"
            >
              Suspend
            </button>
          ) : (
            <button
              onClick={() => handleReactivateMembership(item.id)}
              className="text-green-600 hover:text-green-900 text-sm"
            >
              Reactivate
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Memberships</h1>
        <button
          onClick={() => openCreateModal(activeTab)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          {activeTab === 'plans' ? 'Add Plan' : 'Add Membership'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'plans', label: 'Membership Plans' },
            { key: 'memberships', label: 'Active Memberships' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'plans' | 'memberships')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'plans' ? (
        <Table
          data={plans}
          columns={planColumns}
          loading={loading}
          emptyMessage="No membership plans found"
        />
      ) : (
        <Table
          data={memberships}
          columns={membershipColumns}
          loading={loading}
          emptyMessage="No memberships found"
        />
      )}

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
        title={`${modalType === 'create' ? 'Create' : 'Edit'} ${activeTab === 'plans' ? 'Plan' : 'Membership'}`}
        size="md"
      >
        {activeTab === 'plans' ? (
          <form onSubmit={modalType === 'create' ? handleCreatePlan : handleUpdatePlan} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={planForm.name}
                onChange={(e) => setPlanForm(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={planForm.description}
                onChange={(e) => setPlanForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
              <input
                type="number"
                value={planForm.duration}
                onChange={(e) => setPlanForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={planForm.price}
                onChange={(e) => setPlanForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                min="0"
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
                {modalType === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateMembership} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Member</label>
              <select
                value={membershipForm.userId}
                onChange={(e) => setMembershipForm(prev => ({ ...prev, userId: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a member</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plan</label>
              <select
                value={membershipForm.planId}
                onChange={(e) => setMembershipForm(prev => ({ ...prev, planId: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a plan</option>
                {plans.filter(plan => plan.isActive).map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - ${plan.price} ({plan.duration} days)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={membershipForm.startDate}
                onChange={(e) => setMembershipForm(prev => ({ ...prev, startDate: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
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
                Create Membership
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default MembershipsPage;