import { useCallback, useEffect, useState } from 'react';
import { customerApi } from '../api/services';
import AdminLayout from '../components/AdminLayout';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCustomers = useCallback(async (query = '') => {
    setLoading(true);
    setListError('');
    try {
      const { data } = await customerApi.getAll({ search: query || undefined });
      setCustomers(data.data.customers || []);
    } catch (err) {
      setListError(
        err.response?.data?.message || 'Failed to load customers.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError('');
    setSuccess('');

    try {
      const { data } = await customerApi.create({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
      });

      setCustomers((prev) => [data.data.customer, ...prev]);
      setForm(emptyForm);
      setSuccess(
        `Customer created. They can log in on the website with ${data.data.customer.email}.`
      );
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Could not create customer. Check the form.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchCustomers(search.trim());
  };

  const toggleStatus = async (customer) => {
    setUpdatingId(customer._id);
    setListError('');
    try {
      const { data } = await customerApi.updateStatus(customer._id, {
        isActive: !customer.isActive,
      });
      setCustomers((prev) =>
        prev.map((item) =>
          item._id === customer._id ? data.data.customer : item
        )
      );
    } catch (err) {
      setListError(
        err.response?.data?.message || 'Failed to update customer status.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Customers
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Create website customer accounts. They can sign in at the storefront with the same email and password.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[380px_1fr]">
        <section className="h-fit rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Create customer</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Password needs 8+ characters with upper, lower, and a number.
          </p>

          <form onSubmit={handleCreate} className="mt-4 space-y-3">
            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
                {formError}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-[var(--accent)]">
                {success}
              </div>
            )}

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Full name</span>
              <input
                name="name"
                required
                minLength={2}
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Email</span>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Phone (optional)</span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Password</span>
              <input
                name="password"
                type="text"
                required
                minLength={8}
                value={form.password}
                onChange={handleChange}
                placeholder="Customer123!"
                className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-dark)] disabled:opacity-60"
            >
              {submitting ? 'Creating…' : 'Create customer'}
            </button>
          </form>
        </section>

        <section>
          <form
            onSubmit={handleSearch}
            className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone…"
              className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] sm:max-w-sm"
            />
            <button
              type="submit"
              className="rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-medium hover:bg-[var(--surface)]"
            >
              Search
            </button>
            <p className="text-sm text-[var(--muted)]">
              {customers.length} customer{customers.length === 1 ? '' : 's'}
            </p>
          </form>

          {listError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[var(--danger)]">
              {listError}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-[var(--line)] bg-white px-6 py-16 text-center text-[var(--muted)]">
              Loading customers…
            </div>
          ) : customers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white px-6 py-16 text-center">
              <p className="text-lg font-medium">No customers yet</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Create a customer on the left to enable website login.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[var(--surface)] text-[var(--muted)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Phone</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer._id} className="border-t border-[var(--line)]">
                        <td className="px-4 py-3 font-medium">{customer.name}</td>
                        <td className="px-4 py-3 text-[var(--muted)]">{customer.email}</td>
                        <td className="px-4 py-3 text-[var(--muted)]">
                          {customer.phone || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              customer.isActive
                                ? 'bg-teal-50 text-[var(--accent)]'
                                : 'bg-red-50 text-[var(--danger)]'
                            }`}
                          >
                            {customer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            disabled={updatingId === customer._id}
                            onClick={() => toggleStatus(customer)}
                            className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--surface)] disabled:opacity-60"
                          >
                            {updatingId === customer._id
                              ? 'Updating…'
                              : customer.isActive
                                ? 'Deactivate'
                                : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
