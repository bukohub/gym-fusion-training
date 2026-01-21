import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Table, { TableColumn } from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { productsApi, salesApi } from '../../services/products';
import { usersApi } from '../../services/users';
import { Product, Sale, User } from '../../types';

const ProductsPage: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'products' | 'sales'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
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
    category: '',
    lowStock: false,
    search: '',
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'sale' | 'stock'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    minStock: 5,
    category: '',
  });

  const [saleForm, setSaleForm] = useState({
    productId: '',
    quantity: 1,
    soldBy: '',
  });

  const [stockForm, setStockForm] = useState({
    quantity: 0,
    operation: 'add' as 'add' | 'subtract',
  });

  // Load data
  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts();
    } else {
      loadSales();
      loadUsers();
    }
  }, [activeTab, pagination.page, filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getAll(
        pagination.page,
        pagination.limit,
        filters.category || undefined,
        undefined,
        filters.lowStock || undefined,
        filters.search || undefined
      );
      setProducts((response.data as any).products || (response.data as any).data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 0,
      }));
    } catch (error) {
      toast.error('Error al cargar productos');
      setProducts([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        totalPages: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  const loadSales = async () => {
    try {
      setLoading(true);
      const response = await salesApi.getAll(pagination.page, pagination.limit);
      setSales((response.data as any).sales || (response.data as any).data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 0,
      }));
    } catch (error) {
      toast.error('Error al cargar ventas');
      setSales([]);
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
      toast.error('Error al cargar usuarios');
      setUsers([]);
    }
  };

  // CRUD operations for Products
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productsApi.create(productForm);
      toast.success('Producto creado exitosamente');
      setIsModalOpen(false);
      loadProducts();
      resetProductForm();
    } catch (error) {
      toast.error('Error al crear producto');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await productsApi.update(selectedProduct.id, productForm);
      toast.success('Producto actualizado exitosamente');
      setIsModalOpen(false);
      loadProducts();
      resetProductForm();
    } catch (error) {
      toast.error('Error al actualizar producto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      try {
        await productsApi.delete(id);
        toast.success('Producto eliminado exitosamente');
        loadProducts();
      } catch (error) {
        toast.error('Error al eliminar producto');
      }
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await productsApi.updateStock(selectedProduct.id, stockForm.quantity, stockForm.operation);
      toast.success('Stock actualizado exitosamente');
      setIsModalOpen(false);
      loadProducts();
      resetStockForm();
    } catch (error) {
      toast.error('Error al actualizar stock');
    }
  };

  // Sales operations
  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await salesApi.create(saleForm);
      toast.success('Venta registrada exitosamente');
      setIsModalOpen(false);
      loadSales();
      loadProducts(); // Refresh products to show updated stock
      resetSaleForm();
    } catch (error) {
      toast.error('Error al registrar venta');
    }
  };

  // Form helpers
  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      minStock: 5,
      category: '',
    });
  };

  const resetSaleForm = () => {
    setSaleForm({
      productId: '',
      quantity: 1,
      soldBy: '',
    });
  };

  const resetStockForm = () => {
    setStockForm({
      quantity: 0,
      operation: 'add',
    });
  };

  const openCreateModal = (type: 'product' | 'sale') => {
    setModalType(type === 'product' ? 'create' : 'sale');
    setSelectedProduct(null);
    if (type === 'product') {
      resetProductForm();
    } else {
      resetSaleForm();
    }
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalType('edit');
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      category: product.category,
    });
    setIsModalOpen(true);
  };

  const openStockModal = (product: Product) => {
    setModalType('stock');
    setSelectedProduct(product);
    resetStockForm();
    setIsModalOpen(true);
  };

  // Table columns
  const productColumns: TableColumn<Product>[] = [
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'category', label: 'Categoría', sortable: true },
    { key: 'price', label: 'Precio', render: (value) => `$${value}`, sortable: true },
    {
      key: 'stock',
      label: 'Stock',
      render: (value, item) => (
        <span className={value <= item.minStock ? 'text-red-600 font-semibold' : 'text-gray-900'}>
          {value}
        </span>
      ),
      sortable: true,
    },
    { key: 'minStock', label: 'Stock Mínimo', sortable: true },
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
            Editar
          </button>
          <button
            onClick={() => openStockModal(item)}
            className="text-blue-600 hover:text-blue-900 text-sm"
          >
            Stock
          </button>
          <button
            onClick={() => handleDeleteProduct(item.id)}
            className="text-red-600 hover:text-red-900 text-sm"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  const salesColumns: TableColumn<Sale>[] = [
    {
      key: 'product',
      label: 'Producto',
      render: (product) => product?.name || 'N/A',
    },
    { key: 'quantity', label: 'Cantidad', sortable: true },
    { key: 'unitPrice', label: 'Precio Unitario', render: (value) => `$${value}`, sortable: true },
    { key: 'totalPrice', label: 'Total', render: (value) => `$${value}`, sortable: true },
    { key: 'soldBy', label: 'Vendido Por' },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (value) => new Date(value).toLocaleString(),
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Productos e Inventario</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => openCreateModal('sale')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Registrar Venta
          </button>
          <button
            onClick={() => openCreateModal('product')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Agregar Producto
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'products', label: 'Productos' },
            { key: 'sales', label: 'Historial de Ventas' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'products' | 'sales')}
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

      {/* Filters for Products */}
      {activeTab === 'products' && (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <input
                type="text"
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Filtrar por categoría"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Buscar</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Buscar productos..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.lowStock}
                  onChange={(e) => setFilters(prev => ({ ...prev, lowStock: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Solo Stock Bajo</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'products' ? (
        <Table
          data={products}
          columns={productColumns}
          loading={loading}
          emptyMessage="No se encontraron productos"
        />
      ) : (
        <Table
          data={sales}
          columns={salesColumns}
          loading={loading}
          emptyMessage="No se encontraron ventas"
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
          modalType === 'create' ? 'Agregar Producto' :
          modalType === 'edit' ? 'Editar Producto' :
          modalType === 'sale' ? 'Registrar Venta' :
          'Actualizar Stock'
        }
        size="md"
      >
        {modalType === 'sale' ? (
          <form onSubmit={handleCreateSale} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Producto</label>
              <select
                value={saleForm.productId}
                onChange={(e) => setSaleForm(prev => ({ ...prev, productId: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Seleccionar un producto</option>
                {products.filter(product => product.isActive && product.stock > 0).map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price} (Stock: {product.stock})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input
                type="number"
                value={saleForm.quantity}
                onChange={(e) => setSaleForm(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vendido Por</label>
              <select
                value={saleForm.soldBy}
                onChange={(e) => setSaleForm(prev => ({ ...prev, soldBy: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Seleccionar miembro del personal</option>
                {users.filter(user => ['ADMIN', 'RECEPTIONIST'].includes(user.role)).map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.role})
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
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Registrar Venta
              </button>
            </div>
          </form>
        ) : modalType === 'stock' ? (
          <form onSubmit={handleUpdateStock} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-900">{selectedProduct?.name}</h4>
              <p className="text-sm text-gray-600">Current Stock: {selectedProduct?.stock}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Operación</label>
              <select
                value={stockForm.operation}
                onChange={(e) => setStockForm(prev => ({ ...prev, operation: e.target.value as 'add' | 'subtract' }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="add">Agregar Stock</option>
                <option value="subtract">Quitar Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input
                type="number"
                value={stockForm.quantity}
                onChange={(e) => setStockForm(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
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
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Update Stock
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={modalType === 'create' ? handleCreateProduct : handleUpdateProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <input
                  type="text"
                  value={productForm.category}
                  onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Initial Stock</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Stock</label>
                <input
                  type="number"
                  value={productForm.minStock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, minStock: parseInt(e.target.value) }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  min="0"
                />
              </div>
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
                {modalType === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ProductsPage;