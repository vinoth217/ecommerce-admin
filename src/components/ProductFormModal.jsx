import { useEffect, useState } from 'react';
import { emptyProductForm } from '../utils/productHelpers';

export default function ProductFormModal({
  open,
  mode = 'create',
  initialValues,
  submitting,
  error,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(emptyProductForm);

  useEffect(() => {
    if (open) {
      setForm(initialValues || emptyProductForm);
    }
  }, [open, initialValues]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      brand: form.brand.trim() || 'Generic',
      stock: Number(form.stock),
      imageUrl: form.imageUrl.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(20,33,43,0.45)] p-4 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[var(--line)] bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-[var(--line)] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              {mode === 'edit' ? 'Edit product' : 'Create product'}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Fill in catalog details. Stock maps to the default variant.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-[var(--muted)] hover:bg-[var(--surface)]"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[var(--danger)]">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium">Title</span>
              <input
                name="title"
                required
                minLength={2}
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-[var(--line)] px-4 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-teal-100"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium">Description</span>
              <textarea
                name="description"
                required
                minLength={10}
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full resize-y rounded-xl border border-[var(--line)] px-4 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-teal-100"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Price (INR)</span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-xl border border-[var(--line)] px-4 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-teal-100"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Stock</span>
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                required
                value={form.stock}
                onChange={handleChange}
                className="w-full rounded-xl border border-[var(--line)] px-4 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-teal-100"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Category</span>
              <input
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-[var(--line)] px-4 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-teal-100"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Brand</span>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Generic"
                className="w-full rounded-xl border border-[var(--line)] px-4 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-teal-100"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium">Image URL</span>
              <input
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-[var(--line)] px-4 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-teal-100"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-[var(--line)] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--surface)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-dark)] disabled:opacity-60"
            >
              {submitting
                ? 'Saving…'
                : mode === 'edit'
                  ? 'Update product'
                  : 'Create product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
