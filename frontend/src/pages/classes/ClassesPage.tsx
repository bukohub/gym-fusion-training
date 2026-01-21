import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Table, { TableColumn } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { classesApi } from '../../services/classes';
import { usersApi } from '../../services/users';
import { Class, ClassBooking, User } from '../../types';

const ClassesPage: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'classes' | 'bookings'>('classes');
  const [classes, setClasses] = useState<Class[]>([]);
  const [bookings, setBookings] = useState<ClassBooking[]>([]);
  const [trainers, setTrainers] = useState<User[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'book'>('create');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // Form states
  const [classForm, setClassForm] = useState({
    name: '',
    description: '',
    trainerId: '',
    startTime: '',
    endTime: '',
    maxCapacity: 20,
  });

  const [bookingForm, setBookingForm] = useState({
    userId: '',
    classId: '',
  });

  // Load data
  useEffect(() => {
    if (activeTab === 'classes') {
      loadClasses();
      loadTrainers();
    } else {
      loadBookings();
      loadClients();
    }
  }, [activeTab, pagination.page]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const response = await classesApi.getAll(pagination.page, pagination.limit);
      setClasses((response.data as any).classes || (response.data as any).data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 0,
      }));
    } catch (error) {
      toast.error('Failed to load classes');
      setClasses([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        totalPages: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      // For now, we'll load all bookings from all classes
      // In a real app, you might want to load bookings for a specific user or class
      const classesResponse = await classesApi.getAll(1, 100); // Load more classes for bookings
      const allBookings = classesResponse.data.data.flatMap((cls: Class) => 
        cls.bookings?.map((booking: ClassBooking) => ({ ...booking, class: cls })) || []
      );
      setBookings(allBookings);
      setPagination(prev => ({
        ...prev,
        total: allBookings.length,
        totalPages: Math.ceil(allBookings.length / pagination.limit),
      }));
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const loadTrainers = async () => {
    try {
      const response = await usersApi.getTrainers();
      setTrainers(response.data);
    } catch (error) {
      toast.error('Failed to load trainers');
    }
  };

  const loadClients = async () => {
    try {
      const response = await usersApi.getClients();
      setClients(response.data.data);
    } catch (error) {
      toast.error('Failed to load clients');
    }
  };

  // CRUD operations for Classes
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await classesApi.create(classForm);
      toast.success('Class created successfully');
      setIsModalOpen(false);
      loadClasses();
      resetClassForm();
    } catch (error) {
      toast.error('Failed to create class');
    }
  };

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    try {
      await classesApi.update(selectedClass.id, classForm);
      toast.success('Class updated successfully');
      setIsModalOpen(false);
      loadClasses();
      resetClassForm();
    } catch (error) {
      toast.error('Failed to update class');
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await classesApi.delete(id);
        toast.success('Class deleted successfully');
        loadClasses();
      } catch (error) {
        toast.error('Failed to delete class');
      }
    }
  };

  // Booking operations
  const handleBookClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await classesApi.bookClass(bookingForm);
      toast.success('Class booked successfully');
      setIsModalOpen(false);
      loadBookings();
      resetBookingForm();
    } catch (error) {
      toast.error('Failed to book class');
    }
  };

  const handleCancelBooking = async (userId: string, classId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await classesApi.cancelBooking(userId, classId);
        toast.success('Booking cancelled successfully');
        loadBookings();
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const handleMarkAttendance = async (bookingId: string, attended: boolean) => {
    try {
      await classesApi.markAttendance(bookingId, attended);
      toast.success(`Attendance marked as ${attended ? 'present' : 'absent'}`);
      loadBookings();
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  // Form helpers
  const resetClassForm = () => {
    setClassForm({
      name: '',
      description: '',
      trainerId: '',
      startTime: '',
      endTime: '',
      maxCapacity: 20,
    });
  };

  const resetBookingForm = () => {
    setBookingForm({
      userId: '',
      classId: '',
    });
  };

  const openCreateModal = () => {
    setModalType('create');
    setSelectedClass(null);
    resetClassForm();
    setIsModalOpen(true);
  };

  const openEditModal = (classItem: Class) => {
    setModalType('edit');
    setSelectedClass(classItem);
    setClassForm({
      name: classItem.name,
      description: classItem.description || '',
      trainerId: classItem.trainerId,
      startTime: new Date(classItem.startTime).toISOString().slice(0, 16),
      endTime: new Date(classItem.endTime).toISOString().slice(0, 16),
      maxCapacity: classItem.maxCapacity,
    });
    setIsModalOpen(true);
  };

  const openBookModal = () => {
    setModalType('book');
    resetBookingForm();
    setIsModalOpen(true);
  };

  // Table columns
  const classColumns: TableColumn<Class>[] = [
    { key: 'name', label: 'Nombre de Clase', sortable: true },
    {
      key: 'trainer',
      label: 'Entrenador',
      render: (trainer) => trainer ? `${trainer.firstName} ${trainer.lastName}` : 'N/A',
    },
    {
      key: 'startTime',
      label: 'Hora Inicio',
      render: (value) => new Date(value).toLocaleString(),
      sortable: true,
    },
    {
      key: 'endTime',
      label: 'Hora Fin',
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: 'maxCapacity',
      label: 'Capacidad',
      render: (_, item) => `${item.bookings?.length || 0}/${item.maxCapacity}`,
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
          value === 'COMPLETED' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
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
          <button
            onClick={() => openEditModal(item)}
            className="text-indigo-600 hover:text-indigo-900 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClass(item.id)}
            className="text-red-600 hover:text-red-900 text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const bookingColumns: TableColumn<ClassBooking>[] = [
    {
      key: 'user',
      label: 'Member',
      render: (user) => user ? `${user.firstName} ${user.lastName}` : 'N/A',
    },
    {
      key: 'class',
      label: 'Class',
      render: (cls) => cls?.name || 'N/A',
    },
    {
      key: 'bookedAt',
      label: 'Booked At',
      render: (value) => new Date(value).toLocaleString(),
      sortable: true,
    },
    {
      key: 'attended',
      label: 'Attendance',
      render: (value, item) => (
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            value === true ? 'bg-green-100 text-green-800' :
            value === false ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {value === true ? 'Present' : value === false ? 'Absent' : 'Pending'}
          </span>
          {value === null && (
            <div className="flex space-x-1">
              <button
                onClick={() => handleMarkAttendance(item.id, true)}
                className="text-green-600 hover:text-green-900 text-xs"
              >
                Present
              </button>
              <button
                onClick={() => handleMarkAttendance(item.id, false)}
                className="text-red-600 hover:text-red-900 text-xs"
              >
                Absent
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, item) => (
        <button
          onClick={() => handleCancelBooking(item.userId, item.classId)}
          className="text-red-600 hover:text-red-900 text-sm"
        >
          Cancel
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
        <div className="flex space-x-2">
          {activeTab === 'bookings' && (
            <button
              onClick={openBookModal}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Book Class
            </button>
          )}
          {activeTab === 'classes' && (
            <button
              onClick={openCreateModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Schedule Class
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'classes', label: 'Classes' },
            { key: 'bookings', label: 'Bookings' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'classes' | 'bookings')}
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
      {activeTab === 'classes' ? (
        <Table
          data={classes}
          columns={classColumns}
          loading={loading}
          emptyMessage="No se encontraron clases"
        />
      ) : (
        <Table
          data={bookings}
          columns={bookingColumns}
          loading={loading}
          emptyMessage="No se encontraron reservas"
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
        title={
          modalType === 'create' ? 'Schedule Class' : 
          modalType === 'edit' ? 'Edit Class' : 
          'Book Class'
        }
        size="md"
      >
        {modalType === 'book' ? (
          <form onSubmit={handleBookClass} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Member</label>
              <select
                value={bookingForm.userId}
                onChange={(e) => setBookingForm(prev => ({ ...prev, userId: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a member</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.firstName} {client.lastName} ({client.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Class</label>
              <select
                value={bookingForm.classId}
                onChange={(e) => setBookingForm(prev => ({ ...prev, classId: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a class</option>
                {classes.filter(cls => cls.status === 'SCHEDULED' && new Date(cls.startTime) > new Date()).map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - {new Date(cls.startTime).toLocaleString()} ({cls.bookings?.length || 0}/{cls.maxCapacity})
                  </option>
                ))}
              </select>
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
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Book Class
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={modalType === 'create' ? handleCreateClass : handleUpdateClass} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Class Name</label>
              <input
                type="text"
                value={classForm.name}
                onChange={(e) => setClassForm(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={classForm.description}
                onChange={(e) => setClassForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trainer</label>
              <select
                value={classForm.trainerId}
                onChange={(e) => setClassForm(prev => ({ ...prev, trainerId: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a trainer</option>
                {trainers.map(trainer => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.firstName} {trainer.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                value={classForm.startTime}
                onChange={(e) => setClassForm(prev => ({ ...prev, startTime: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="datetime-local"
                value={classForm.endTime}
                onChange={(e) => setClassForm(prev => ({ ...prev, endTime: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
              <input
                type="number"
                value={classForm.maxCapacity}
                onChange={(e) => setClassForm(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                min="1"
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
                {modalType === 'create' ? 'Schedule' : 'Update'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ClassesPage;