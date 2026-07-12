// export const WHATSAPP_NUMBER = '916304460957';

// export function buildOrderMessage(items, customerName = '') {
//   const lines = [
//     'Hello Mother Daughter Roots! 🌿',
//     'I would like to place an order:',
//     '',
//     ...items.map(i => `• ${i.name} (${i.netQty}) × ${i.qty} — ₹${i.price * i.qty}`),
//     '',
//     `Total Items: ${items.reduce((s, i) => s + i.qty, 0)}`,
//     `Estimated Total: ₹${items.reduce((s, i) => s + i.qty * i.price, 0)}`,
//     '',
//     customerName ? `Customer Name: ${customerName}` : 'Customer Name: _______',
//     '',
//     'Please confirm availability. Thank you! 💚',
//   ];
//   return lines.join('\n');
// }

// export function getWhatsAppOrderLink(items, customerName = '') {
//   return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderMessage(items, customerName))}`;
// }

// export function getWhatsAppGeneralLink(msg = 'Hi! I had a question about your products.') {
//   return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
// }

export const WHATSAPP_NUMBER = '916304460957';

export function isInternationalCustomer(country = '') {
  return country.trim().toLowerCase() !== 'india';
}

export function buildOrderMessage(items, customerName = '', customerLocation = '', customerCountry = '', discountedTotal = null, totalSaved = 0) {
  const originalTotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  if (isInternationalCustomer(customerCountry)) {
    return [
      'Hello Mother Daughter Roots!',
      'I would like to place an international order.',
      '',
      ...items.map(i => `- ${i.name} (${i.netQty}) x ${i.qty}`),
      '',
      `Total Items: ${items.reduce((s, i) => s + i.qty, 0)}`,
      `Customer Name: ${customerName}`,
      `Country: ${customerCountry}`,
      `Delivery Location: ${customerLocation}`,
      '',
      'Please share international shipping charges and available payment methods. Thank you!',
    ].join('\n');
  }

  const lines = [
    'Hello Mother Daughter Roots! 🌿',
    'I would like to place an order:',
    '',
    ...items.map(i => `• ${i.name} (${i.netQty}) × ${i.qty} — ₹${i.price * i.qty}`),
    '',
    `Total Items: ${items.reduce((s, i) => s + i.qty, 0)}`,
  ];

  if (totalSaved > 0 && discountedTotal !== null) {
    lines.push(`Original Total: ₹${originalTotal}`);
    lines.push(`Bulk Discount (15% off): -₹${totalSaved} 🎉`);
    lines.push(`Final Total: ₹${discountedTotal}`);
  } else {
    lines.push(`Total: ₹${originalTotal}`);
  }

  lines.push('');
  lines.push(customerName ? `Customer Name: ${customerName}` : 'Customer Name: _______');
  lines.push(customerCountry ? `Country: ${customerCountry}` : 'Country: _______');
  lines.push(customerLocation ? `Location: ${customerLocation}` : 'Location: _______');
  lines.push('');
  lines.push('Please confirm availability. Thank you! 💚');
  return lines.join('\n');
}

export function getWhatsAppOrderLink(items, customerName = '', customerLocation = '', customerCountry = '', discountedTotal = null, totalSaved = 0) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildOrderMessage(items, customerName, customerLocation, customerCountry, discountedTotal, totalSaved)
  )}`;
}

export function getWhatsAppGeneralLink(msg = 'Hi! I had a question about your products.') {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
