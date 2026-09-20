// Helper utilities

export const formatNumber = (n, decimals = 0) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: decimals }).format(n);

export const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

export const getSeverityColor = (severity) => {
  const map = { High: 'danger', Medium: 'warning', Low: 'success', Critical: 'danger' };
  return map[severity] || 'info';
};

export const getStatusColor = (status) => {
  const map = {
    Active: 'success', Online: 'success', Completed: 'success', Applied: 'success', Good: 'success', Excellent: 'success',
    Warning: 'warning', Running: 'info', Scheduled: 'info', Pending: 'warning', Fair: 'warning', Inactive: 'danger',
    Offline: 'danger', Ready: 'primary', Perennial: 'primary',
  };
  return map[status] || 'info';
};

export const truncate = (str, len = 40) =>
  str.length > len ? str.slice(0, len) + '…' : str;

export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const randomBetween = (min, max) => Math.random() * (max - min) + min;
