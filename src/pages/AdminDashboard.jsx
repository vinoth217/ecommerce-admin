import { useCallback, useEffect, useMemo, useState } from 'react';
import { productApi } from '../api/services';
import AdminLayout from '../components/AdminLayout';
import ProductFormModal from '../components/ProductFormModal';
import ProductTable from '../components/ProductTable';
import {
  emptyProductForm,
  productToForm,
} from '../utils/productHelpers';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [formError, setFormError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      const { data } = await productApi.getAll();
      setProducts(data.data.products || []);
    } catch (err) {
      setListError(
        err.response?.data?.message || 'Failed to load products. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q) ||
        product.brand?.toLowerCase().includes(q)
    );
  }, [products, search]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setEditingProduct(null);
    setFormError('');
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setFormError('');

    try {
      if (editingProduct) {
        const { data } = await productApi.update(editingProduct._id, payload);
        const updated = data.data.product;
        setProducts((prev) =>
          prev.map((item) => (item._id === updated._id ? updated : item))
        );
      } else {
        const { data } = await productApi.create(payload);
        const created = data.data.product;
        setProducts((prev) => [created, ...prev]);
      }
      setModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Could not save product. Check your inputs.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}" permanently? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(product._id);
    setListError('');

    try {
      await productApi.remove(product._id);
      setProducts((prev) => prev.filter((item) => item._id !== product._id));
    } catch (err) {
      setListError(
        err.response?.data?.message || 'Failed to delete product. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Product management
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Create, update, and remove catalog items.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-dark)]"
        >
          + Add product
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, category, or brand…"
          className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-teal-100 sm:max-w-sm"
        />
        <p className="text-sm text-[var(--muted)]">
          {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
        </p>
      </div>

      {listError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[var(--danger)]">
          {listError}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-[var(--line)] bg-white px-6 py-16 text-center text-[var(--muted)]">
          Loading products…
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={openEditModal}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}

      <ProductFormModal
        open={modalOpen}
        mode={editingProduct ? 'edit' : 'create'}
        initialValues={
          editingProduct ? productToForm(editingProduct) : emptyProductForm
        }
        submitting={submitting}
        error={formError}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}
