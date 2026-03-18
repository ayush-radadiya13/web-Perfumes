import { jsPDF } from 'jspdf';

/**
 * @param {object} order — _id, orderNumber, items[], subtotal, discount, total, customerName, shippingAddress, createdAt
 */
export function downloadOrderPdf(order) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFillColor(26, 21, 35);
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setTextColor(201, 162, 39);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Lumière Parfums', 14, 18);
  doc.setTextColor(250, 247, 242);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Luxury Fragrances', 14, 24);

  doc.setTextColor(26, 21, 35);
  y = 38;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Order receipt', 14, y);
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order ID: ${order.orderNumber || order._id}`, 14, y);
  y += 6;
  const date = order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString();
  doc.text(`Date: ${date}`, 14, y);
  y += 6;
  if (order.customerName) doc.text(`Customer: ${order.customerName}`, 14, y);
  y += 10;

  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, pageW - 14, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('Product', 14, y);
  doc.text('Qty', 120, y);
  doc.text('Price', 140, y);
  doc.text('Line total', 165, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  const items = order.items || [];
  for (const line of items) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    const name = (line.name || 'Item').slice(0, 42);
    const qty = line.quantity || 1;
    const price = Number(line.price || 0);
    const lineTotal = price * qty;
    doc.text(name, 14, y);
    doc.text(String(qty), 120, y);
    doc.text(`$${price.toFixed(2)}`, 140, y);
    doc.text(`$${lineTotal.toFixed(2)}`, 165, y);
    y += 7;
  }

  y += 6;
  doc.line(14, y, pageW - 14, y);
  y += 10;
  doc.setFontSize(10);
  doc.text(`Subtotal: $${Number(order.subtotal || 0).toFixed(2)}`, 140, y);
  y += 6;
  if (order.discount > 0) {
    doc.text(`Discount: -$${Number(order.discount).toFixed(2)}`, 140, y);
    y += 6;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Total: $${Number(order.total || 0).toFixed(2)}`, 140, y);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for your order.', 14, 285);

  const safeName = String(order.orderNumber || order._id || 'order').replace(/[^\w-]/g, '_');
  doc.save(`Lumiere-Receipt-${safeName}.pdf`);
}
