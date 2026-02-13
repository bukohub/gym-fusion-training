import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { 
  PencilIcon, 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon, 
  ArrowPathIcon,
  EyeSlashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import Table, { TableColumn } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import PhotoCapture from '../../components/ui/PhotoCapture';
import { usersApi } from '../../services/users';
import { uploadsApi } from '../../services/uploads';
import { User, Role } from '../../types';

const UsersPage: React.FC = () => {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    search: '',
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'password'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [userForm, setUserForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    cedula: '',
    phone: '',
    weight: '',
    height: '',
    role: 'CLIENT' as keyof typeof Role,
    password: '',
    photo: '',
    holler: '',
    isActive: true,
  });

  // Debounced search state
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await usersApi.getAll(
        pagination.page,
        pagination.limit,
        filters.role || undefined,
        filters.isActive === '' ? undefined : filters.isActive === 'true',
        debouncedSearch || undefined
      );
      setUsers((response.data as any).users || (response.data as any).data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 0,
      }));
    } catch (error) {
      toast.error('Error al cargar usuarios');
      setUsers([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        totalPages: 0,
      }));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters.role, filters.isActive, debouncedSearch]);

  // Load users when filters or pagination change
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // CRUD operations
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // For clients, set empty password if not provided
      const userData = {
        ...userForm,
        weight: userForm.weight ? parseFloat(userForm.weight) : undefined,
        height: userForm.height ? parseFloat(userForm.height) : undefined,
      };
      if (userData.role === 'CLIENT' && !userData.password) {
        userData.password = '';
      }

      await usersApi.create(userData);
      toast.success('Usuario creado exitosamente');
      setIsModalOpen(false);
      loadUsers();
      resetUserForm();
    } catch (error) {
      toast.error('Error al crear usuario');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const { password, ...userData } = userForm;
      const updateData = {
        ...userData,
        weight: userData.weight ? parseFloat(userData.weight as string) : undefined,
        height: userData.height ? parseFloat(userData.height as string) : undefined,
      };
      await usersApi.update(selectedUser.id, updateData);
      toast.success('Usuario actualizado exitosamente');
      setIsModalOpen(false);
      loadUsers();
      resetUserForm();
    } catch (error) {
      toast.error('Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        await usersApi.delete(id);
        toast.success('Usuario eliminado exitosamente');
        loadUsers();
      } catch (error) {
        toast.error('Error al eliminar usuario');
      }
    }
  };

  const handleActivateUser = async (id: string) => {
    try {
      await usersApi.activate(id);
      toast.success('Usuario activado exitosamente');
      loadUsers();
    } catch (error) {
      toast.error('Error al activar usuario');
    }
  };

  const handleDeactivateUser = async (id: string) => {
    try {
      await usersApi.deactivate(id);
      toast.success('Usuario desactivado exitosamente');
      loadUsers();
    } catch (error) {
      toast.error('Error al desactivar usuario');
    }
  };

  const handleResetPassword = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea restablecer la contraseña de este usuario?')) {
      try {
        await usersApi.resetPassword(id);
        toast.success('Correo de restablecimiento de contraseña enviado exitosamente');
      } catch (error) {
        toast.error('Error al restablecer contraseña');
      }
    }
  };

  // Form helpers
  const resetUserForm = () => {
    setUserForm({
      email: '',
      firstName: '',
      lastName: '',
      cedula: '',
      phone: '',
      weight: '',
      height: '',
      role: 'CLIENT',
      password: '',
      photo: '',
      holler: '',
      isActive: true,
    });
  };

  const openCreateModal = () => {
    setModalType('create');
    setSelectedUser(null);
    resetUserForm();
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setModalType('edit');
    setSelectedUser(user);
    setUserForm({
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      cedula: user.cedula || '',
      phone: user.phone || '',
      weight: user.weight?.toString() || '',
      height: user.height?.toString() || '',
      role: user.role as keyof typeof Role,
      password: '',
      photo: user.photo || '',
      holler: user.holler || '',
      isActive: user.isActive,
    });
    setIsModalOpen(true);
  };

  // Table columns
  const userColumns: TableColumn<User>[] = [
    {
      key: 'photo',
      label: 'Foto',
      render: (_, item) => (
        <div className="flex items-center">
          {item.photo ? (
            <img
              src={uploadsApi.getPhotoUrl(item.photo)}
              alt={`${item.firstName} ${item.lastName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-xs">
                {(item.firstName || '').charAt(0)}{(item.lastName || '').charAt(0)}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'firstName',
      label: 'Nombre',
      render: (_, item) => `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A',
      sortable: true,
    },
    { key: 'cedula', label: 'Cédula', render: (value) => value || 'N/A', sortable: true },
    { key: 'phone', label: 'Teléfono' },
    {
      key: 'role',
      label: 'Rol',
      render: (value) => {
        const roleTranslations = {
          'ADMIN': 'Administrador',
          'RECEPTIONIST': 'Recepcionista',
          'TRAINER': 'Entrenador',
          'CLIENT': 'Cliente'
        };
        return (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
            value === 'RECEPTIONIST' ? 'bg-blue-100 text-blue-800' :
            value === 'TRAINER' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {roleTranslations[value as keyof typeof roleTranslations] || value}
          </span>
        );
      },
      sortable: true,
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Creado',
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'weight',
      label: 'Peso',
      render: (value) => value ? `${value} kg` : 'N/A',
      sortable: true,
    },
    {
      key: 'height',
      label: 'Altura',
      render: (value) => value ? `${value} cm` : 'N/A',
      sortable: true,
    },
    {
      key: 'id',
      label: 'Acciones',
      render: (_, item) => (
        <div className="flex space-x-1">
          <button
            onClick={() => openEditModal(item)}
            className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors"
            title="Editar usuario"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          {item.isActive ? (
            <button
              onClick={() => handleDeactivateUser(item.id)}
              className="p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-md transition-colors"
              title="Desactivar usuario"
            >
              <EyeSlashIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleActivateUser(item.id)}
              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors"
              title="Activar usuario"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleResetPassword(item.id)}
            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
            title="Restablecer contraseña"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteUser(item.id)}
            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
            title="Eliminar usuario"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Agregar Usuario
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los Roles</option>
              <option value="ADMIN">Administrador</option>
              <option value="RECEPTIONIST">Recepcionista</option>
              <option value="TRAINER">Entrenador</option>
              <option value="CLIENT">Cliente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los Estados</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Buscar</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Buscar por nombre, cédula o email..."
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Table
        data={users}
        columns={userColumns}
        loading={loading}
        emptyMessage="No se encontraron usuarios"
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
        title={modalType === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
        size="md"
      >
        <form onSubmit={modalType === 'create' ? handleCreateUser : handleUpdateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombre *</label>
              <input
                id="firstName"
                type="text"
                value={userForm.firstName}
                onChange={(e) => setUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido *</label>
              <input
                id="lastName"
                type="text"
                value={userForm.lastName}
                onChange={(e) => setUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">Cédula</label>
              <input
                id="cedula"
                type="text"
                value={userForm.cedula}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only numbers
                  setUserForm(prev => ({ ...prev, cedula: value }));
                }}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="123456789012345"
                maxLength={15}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              id="phone"
              type="tel"
              value={userForm.phone}
              onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="+57 300 123 4567"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Peso (kg)</label>
              <input
                id="weight"
                type="number"
                step="0.1"
                value={userForm.weight}
                onChange={(e) => setUserForm(prev => ({ ...prev, weight: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="70.5"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">Altura (cm)</label>
              <input
                id="height"
                type="number"
                value={userForm.height}
                onChange={(e) => setUserForm(prev => ({ ...prev, height: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="175"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <PhotoCapture
              currentPhoto={userForm.photo}
              onPhotoChange={(filename) => setUserForm(prev => ({ ...prev, photo: filename }))}
              userName={`${userForm.firstName} ${userForm.lastName}`.trim()}
            />
            <div>
              <label htmlFor="holler" className="block text-sm font-medium text-gray-700">Código Holler</label>
              <input
                id="holler"
                type="text"
                value={userForm.holler}
                onChange={(e) => setUserForm(prev => ({ ...prev, holler: e.target.value.toUpperCase() }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="HOLLER123"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
              <select
                id="role"
                value={userForm.role}
                onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value as keyof typeof Role }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="CLIENT">Cliente</option>
                <option value="TRAINER">Entrenador</option>
                <option value="RECEPTIONIST">Recepcionista</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={userForm.isActive}
                  onChange={(e) => setUserForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Activo</span>
              </label>
            </div>
          </div>
          {modalType === 'create' && userForm.role !== 'CLIENT' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                id="password"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          )}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              {modalType === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;