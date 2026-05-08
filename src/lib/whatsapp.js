const STORE_PHONE = '212600000000' // Remplacez par le numéro réel de la boutique

export function whatsappProductLink(product) {
  const msg = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par : ${product.name} (${product.price} MAD). Est-il disponible ?`
  )
  return `https://wa.me/${STORE_PHONE}?text=${msg}`
}

export function whatsappOrderLink(order) {
  const items = order.items
    .map((i) => `• ${i.name} x${i.quantity} — ${i.price * i.quantity} MAD`)
    .join('\n')
  const msg = encodeURIComponent(
    `Bonjour ! Je souhaite confirmer ma commande :\nRéf : ${order.reference}\n\n${items}\n\nTotal : ${order.total} MAD\nLivraison : ${order.deliveryLabel}\nNom : ${order.customerName}`
  )
  return `https://wa.me/${STORE_PHONE}?text=${msg}`
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(amount)
}
