import {
  formatCurrency,
  getProductImage,
  getProductPrice,
  getProductStock,
} from '../utils/productHelpers';

export default function ProductTable({ products, onEdit, onDelete, deletingId }) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white px-6 py-16 text-center">
        <p className="text-lg font-medium">No products yet</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Add a product and it will appear here for your account.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Added by</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const image = getProductImage(product);
              const stock = getProductStock(product);
              const addedBy =
                product.createdBy?.name ||
                product.createdBy?.email ||
                'You';

              return (
                <tr key={product._id} className="border-t border-[var(--line)]">
                  <td className="px-4 py-3">
                    <div className="h-14 w-14 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-[var(--muted)]">
                          N/A
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-[var(--ink)]">{product.name}</div>
                    <div className="mt-0.5 text-xs text-[var(--muted)]">
                      {product.isActive === false ? 'Inactive' : 'Active'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{product.category}</td>
                  <td className="px-4 py-3 font-medium">
                    {formatCurrency(getProductPrice(product))}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        stock === 0
                          ? 'bg-red-50 text-[var(--danger)]'
                          : stock <= 5
                            ? 'bg-amber-50 text-[var(--warn)]'
                            : 'bg-teal-50 text-[var(--accent)]'
                      }`}
                    >
                      {stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{addedBy}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--surface)]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        disabled={deletingId === product._id}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-[var(--danger)] hover:bg-red-100 disabled:opacity-60"
                      >
                        {deletingId === product._id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
