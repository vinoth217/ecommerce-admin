export const getProductImage = (product) =>
  product?.images?.find((img) => img.isPrimary)?.url ||
  product?.images?.[0]?.url ||
  product?.variants?.[0]?.images?.[0]?.url ||
  '';

export const getProductStock = (product) => {
  if (!product?.variants?.length) return 0;
  return product.variants.reduce(
    (sum, variant) => sum + (variant.isActive === false ? 0 : Number(variant.stock) || 0),
    0
  );
};

export const getProductPrice = (product) =>
  Number(product?.basePrice ?? product?.variants?.[0]?.price ?? 0);

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const emptyProductForm = {
  title: '',
  description: '',
  price: '',
  category: '',
  brand: '',
  stock: '',
  imageUrl: '',
};

export const productToForm = (product) => ({
  title: product?.name || '',
  description: product?.description || '',
  price: String(getProductPrice(product) || ''),
  category: product?.category || '',
  brand: product?.brand || '',
  stock: String(getProductStock(product) || ''),
  imageUrl: getProductImage(product),
});
