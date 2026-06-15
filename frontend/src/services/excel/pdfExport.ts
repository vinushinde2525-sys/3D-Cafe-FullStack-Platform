/**
 * pdfExport.ts — generate PDF reports
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MOCK_RECENT_ORDERS } from '@/services/mockAnalytics';
import { MOCK_FOOD_ITEMS } from '@/services/mockData';
import type { Order } from '@/types';

const BRAND = 'Café 3D';
const BRAND_COLOR: [number,number,number] = [61, 31, 13]; // espresso brown

function header(doc: jsPDF, title: string, subtitle = '') {
  doc.setFillColor(...BRAND_COLOR);
  doc.rect(0, 0, 210, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(BRAND, 12, 11);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-IN', { dateStyle: 'long' }), 150, 11);
  doc.setTextColor(...BRAND_COLOR);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 12, 28);
  if (subtitle) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 80, 60);
    doc.text(subtitle, 12, 34);
  }
}

function footer(doc: jsPDF) {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(160, 140, 120);
    doc.text(`${BRAND} — Confidential`, 12, 290);
    doc.text(`Page ${i} of ${pages}`, 180, 290);
  }
}

export function exportOrdersPDF(orders: Order[] = MOCK_RECENT_ORDERS) {
  const doc = new jsPDF({ orientation: 'landscape' });
  header(doc, 'Orders Report', `${orders.length} orders`);

  autoTable(doc, {
    startY: 38,
    head: [['Order #','Date','Items','Subtotal','Tax','Delivery','Total','Status','Payment']],
    body: orders.map(o => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString('en-IN'),
      o.items.map(i => `${i.name} ×${i.quantity}`).join(', '),
      `₹${o.subtotal}`,
      `₹${o.tax}`,
      `₹${o.deliveryFee}`,
      `₹${o.total}`,
      o.status,
      o.paymentStatus,
    ]),
    headStyles:  { fillColor: BRAND_COLOR, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles:  { fontSize: 7, textColor: [50, 30, 10] as [number,number,number] },
    alternateRowStyles: { fillColor: [255, 248, 240] as [number,number,number] },
    columnStyles: { 2: { cellWidth: 60 } },
  });

  // Totals row
  const total = orders.reduce((s, o) => s + o.total, 0);
  const y = (doc as any).lastAutoTable.finalY + 6;
  doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND_COLOR);
  doc.text(`Total Revenue: ₹${total.toLocaleString('en-IN')}`, 14, y);

  footer(doc);
  doc.save(`orders_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportInventoryPDF() {
  const doc = new jsPDF();
  header(doc, 'Inventory Report', `${MOCK_FOOD_ITEMS.length} products`);

  autoTable(doc, {
    startY: 38,
    head: [['Name','Category','Price','Offer Price','Veg','Vegan','GF','Rating','Orders']],
    body: MOCK_FOOD_ITEMS.map(i => [
      i.name, i.category,
      `₹${i.price}`, i.discountPrice ? `₹${i.discountPrice}` : '-',
      i.isVegetarian ? '✓' : '✗',
      i.isVegan ? '✓' : '✗',
      i.isGlutenFree ? '✓' : '✗',
      i.rating.toFixed(1),
      i.orderCount,
    ]),
    headStyles:  { fillColor: BRAND_COLOR, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles:  { fontSize: 7 },
    alternateRowStyles: { fillColor: [255, 248, 240] as [number,number,number] },
  });

  footer(doc);
  doc.save(`inventory_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportRevenuePDF(salesData: { _id: string; revenue: number; orders: number }[]) {
  const doc = new jsPDF();
  header(doc, 'Revenue Report', `${salesData.length} day trend`);

  const totalRev = salesData.reduce((s, d) => s + d.revenue, 0);
  const totalOrd = salesData.reduce((s, d) => s + d.orders, 0);

  doc.setFontSize(9); doc.setTextColor(...BRAND_COLOR);
  doc.text(`Total Revenue: ₹${totalRev.toLocaleString('en-IN')}   Total Orders: ${totalOrd}`, 12, 38);

  autoTable(doc, {
    startY: 44,
    head: [['Date','Revenue (₹)','Orders','Avg Order (₹)']],
    body: salesData.map(d => [
      d._id, d.revenue.toLocaleString('en-IN'), d.orders,
      d.orders > 0 ? Math.round(d.revenue / d.orders).toLocaleString('en-IN') : '-'
    ]),
    headStyles:  { fillColor: BRAND_COLOR, textColor: 255, fontStyle: 'bold' },
    bodyStyles:  { fontSize: 8 },
    alternateRowStyles: { fillColor: [255, 248, 240] as [number,number,number] },
  });

  footer(doc);
  doc.save(`revenue_${new Date().toISOString().split('T')[0]}.pdf`);
}
