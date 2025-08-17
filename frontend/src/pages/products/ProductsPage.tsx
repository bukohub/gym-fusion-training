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
      setProducts(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
      }));
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadSales = async () => {
    try {
      setLoading(true);
      const response = await salesApi.getAll(pagination.page, pagination.limit);
      setSales(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
      }));
    } catch (error) {
      toast.error('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await usersApi.getAll(1, 100);
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  // CRUD operations for Products
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productsApi.create(productForm);
      toast.success('Product created successfully');
      setIsModalOpen(false);
      loadProducts();
      resetProductForm();
    } catch (error) {
      toast.error('Failed to create product');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await productsApi.update(selectedProduct.id, productForm);
      toast.success('Product updated successfully');
      setIsModalOpen(false);
      loadProducts();
      resetProductForm();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsApi.delete(id);
        toast.success('Product deleted successfully');
        loadProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await productsApi.updateStock(selectedProduct.id, stockForm.quantity, stockForm.operation);
      toast.success('Stock updated successfully');
      setIsModalOpen(false);
      loadProducts();
      resetStockForm();
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  // Sales operations
  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await salesApi.create(saleForm);
      toast.success('Sale recorded successfully');
      setIsModalOpen(false);
      loadSales();
      loadProducts(); // Refresh products to show updated stock
      resetSaleForm();
    } catch (error) {
      toast.error('Failed to record sale');
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
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', render: (value) => `$${value}`, sortable: true },
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
    { key: 'minStock', label: 'Min Stock', sortable: true },
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
            onClick={() => openStockModal(item)}
            className="text-blue-600 hover:text-blue-900 text-sm"
          >
            Stock
          </button>
          <button
            onClick={() => handleDeleteProduct(item.id)}
            className="text-red-600 hover:text-red-900 text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const salesColumns: TableColumn<Sale>[] = [
    {
      key: 'product',
      label: 'Product',
      render: (product) => product?.name || 'N/A',
    },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'unitPrice', label: 'Unit Price', render: (value) => `$${value}`, sortable: true },
    { key: 'totalPrice', label: 'Total', render: (value) => `$${value}`, sortable: true },
    { key: 'soldBy', label: 'Sold By' },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => new Date(value).toLocaleString(),
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products & Inventory</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => openCreateModal('sale')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Record Sale
          </button>
          <button
            onClick={() => openCreateModal('product')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'products', label: 'Products' },
            { key: 'sales', label: 'Sales History' },
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
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Filter by category"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search products..."
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
                <span className="ml-2 text-sm text-gray-700">Low Stock Only</span>
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
          emptyMessage="No products found"
        />
      ) : (
        <Table
          data={sales}
          columns={salesColumns}
          loading={loading}
          emptyMessage="No sales found"
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
          modalType === 'create' ? 'Add Product' :
          modalType === 'edit' ? 'Edit Product' :
          modalType === 'sale' ? 'Record Sale' :
          'Update Stock'
        }
        size="md"
      >
        {modalType === 'sale' ? (
          <form onSubmit={handleCreateSale} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select
                value={saleForm.productId}
                onChange={(e) => setSaleForm(prev => ({ ...prev, productId: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a product</option>
                {products.filter(product => product.isActive && product.stock > 0).map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price} (Stock: {product.stock})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
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
              <label className="block text-sm font-medium text-gray-700">Sold By</label>
              <select
                value={saleForm.soldBy}
                onChange={(e) => setSaleForm(prev => ({ ...prev, soldBy: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select staff member</option>
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
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Record Sale
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
              <label className="block text-sm font-medium text-gray-700">Operation</label>
              <select
                value={stockForm.operation}
                onChange={(e) => setStockForm(prev => ({ ...prev, operation: e.target.value as 'add' | 'subtract' }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="add">Add Stock</option>
                <option value="subtract">Remove Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
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
                Cancel
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
                <label className="block text-sm font-medium text-gray-700">Category</label>
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
        )}
      </Modal>
    </div>
  );
};

export default ProductsPage;