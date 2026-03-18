export function orderStatusLabel(status) {
  const s = (status || '').toLowerCase();
  const map = {
    pending: 'Pending',
    paid: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return map[s] || status || 'Unknown';
}
