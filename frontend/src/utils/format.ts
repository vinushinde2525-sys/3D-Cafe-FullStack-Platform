export const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

export const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));

export const formatRelative = (date: string | Date): string => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(date));
};

export const truncate = (str: string, n: number) => (str.length > n ? `${str.slice(0, n)}…` : str);

export const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const getOrderStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'text-amber-600 bg-amber-50 border-amber-200',
    accepted: 'text-blue-600 bg-blue-50 border-blue-200',
    preparing: 'text-orange-600 bg-orange-50 border-orange-200',
    ready: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    out_for_delivery: 'text-purple-600 bg-purple-50 border-purple-200',
    delivered: 'text-green-700 bg-green-50 border-green-200',
    cancelled: 'text-red-600 bg-red-50 border-red-200',
    rejected: 'text-red-700 bg-red-50 border-red-200',
  };
  return map[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const getOrderStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'Pending', accepted: 'Accepted', preparing: 'Preparing',
    ready: 'Ready', out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered', cancelled: 'Cancelled', rejected: 'Rejected',
  };
  return map[status] || status;
};
