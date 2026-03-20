import { jsPDF } from 'jspdf';
import { formatINR } from './currency';

/**
 * @param {object} order — _id, orderNumber, items[], subtotal, discount, total, customerName, shippingAddress, createdAt
 */
export function downloadOrderPdf(order) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const black = [16, 16, 19];
  const gold = [201, 162, 39];
  const lightBg = [250, 249, 245];
  const bodyText = [28, 26, 24];
  let y = 20;

  // Header: black canvas with subtle gold details.
  doc.setFillColor(...black);
  doc.rect(0, 0, pageW, 38, 'F');
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.6);
  doc.line(0, 37, pageW, 37);
  doc.setLineWidth(0.2);
  doc.line(0, 33, pageW, 33);

  // Left logo block (vector mark + monogram).
  doc.setDrawColor(...gold);
  doc.setFillColor(...gold);
  doc.circle(17, 18, 8, 'S');
  doc.setFillColor(...black);
  doc.circle(17, 18, 6.3, 'F');
  doc.setTextColor(...gold);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('LP', 14.7, 19.4);

  // Right company details.
  doc.setTextColor(...gold);
  doc.setFontSize(17);
  doc.setFont('times', 'bold');
  doc.text('Lumiere Perfumes', pageW - 14, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.7);
  doc.setTextColor(236, 227, 199);
  doc.text('Near by Matuki Restaurant, 60 Ft Ring Road, Mavdi, Rajkot - 360004', pageW - 14, 20, {
    align: 'right'
  });
  doc.text('Mobile: 9876543210', pageW - 14, 25, { align: 'right' });

  // Body background panel for readability.
  doc.setFillColor(...lightBg);
  doc.rect(10, 43, pageW - 20, pageH - 65, 'F');
  doc.setDrawColor(236, 220, 170);
  doc.setLineWidth(0.3);
  doc.rect(10, 43, pageW - 20, pageH - 65, 'S');

  doc.setTextColor(...bodyText);
  y = 54;
  doc.setFontSize(16);
  doc.setFont('times', 'bold');
  doc.text('Order Receipt', 14, y);
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(14, y + 2, 72, y + 2);
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...bodyText);
  doc.text(`Order ID: ${order.orderNumber || order._id}`, 14, y);
  y += 6;
  if (order.transactionId) {
    doc.text(`Transaction: ${order.transactionId}`, 14, y);
    y += 6;
  }
  const date = order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString();
  doc.text(`Date: ${date}`, 14, y);
  y += 6;
  if (order.customerName) doc.text(`Customer: ${order.customerName}`, 14, y);
  y += 10;

  doc.setDrawColor(220, 202, 146);
  doc.setLineWidth(0.35);
  doc.line(14, y, pageW - 14, y);
  y += 8;

  doc.setTextColor(...gold);
  doc.setFont('helvetica', 'bold');
  doc.text('Product', 14, y);
  doc.text('Qty', 120, y);
  doc.text('Price', 140, y);
  doc.text('Line total', 165, y);
  y += 6;
  doc.setTextColor(...bodyText);
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
    doc.text(formatINR(price), 140, y);
    doc.text(formatINR(lineTotal), 165, y);
    y += 7;
  }

  y += 6;
  doc.line(14, y, pageW - 14, y);
  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(...bodyText);
  doc.text(`Subtotal: ${formatINR(order.subtotal || 0)}`, 140, y);
  y += 6;
  if (order.discount > 0) {
    doc.text(`Discount: ${formatINR(-Number(order.discount))}`, 140, y);
    y += 6;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...gold);
  doc.text(`Total: ${formatINR(order.total || 0)}`, 140, y);

  // Footer: luxury strip with brand lineup.
  const footerY = pageH - 18;
  doc.setFillColor(...black);
  doc.rect(0, pageH - 26, pageW, 26, 'F');
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.6);
  doc.line(0, pageH - 26, pageW, pageH - 26);
  doc.setTextColor(...gold);
  doc.setFont('times', 'italic');
  doc.setFontSize(8.8);
  doc.text('Dior  \u25C6  Chanel  \u25C6  Gucci  \u25C6  Armani  \u25C6  YSL  \u25C6  Versace', pageW / 2, footerY, {
    align: 'center'
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(230, 218, 177);
  doc.text('Thank you for your order.', 14, pageH - 6);

  const safeName = String(order.orderNumber || order._id || 'order').replace(/[^\w-]/g, '_');
  doc.save(`Lumiere-Receipt-${safeName}.pdf`);
}
