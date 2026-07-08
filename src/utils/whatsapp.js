export const WHATSAPP_NUMBER = '916304460957';

export function buildOrderMessage(items, customerName = '') {
  const lines = [
    'Hello Mother Daughter Roots! 🌿',
    'I would like to place an order:',
    '',
    ...items.map(i => `• ${i.name} (${i.netQty}) × ${i.qty} — ₹${i.price * i.qty}`),
    '',
    `Total Items: ${items.reduce((s, i) => s + i.qty, 0)}`,
    `Estimated Total: ₹${items.reduce((s, i) => s + i.qty * i.price, 0)}`,
    '',
    customerName ? `Customer Name: ${customerName}` : 'Customer Name: _______',
    '',
    'Please confirm availability. Thank you! 💚',
  ];
  return lines.join('\n');
}

export function getWhatsAppOrderLink(items, customerName = '') {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderMessage(items, customerName))}`;
}

export function getWhatsAppGeneralLink(msg = 'Hi! I had a question about your products.') {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
