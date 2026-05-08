export function getProductImage(product) {
  if (!product) return ''
  return `/images/products/${product.id}.svg`
}

export function getCartItemsCount(items) {
  return items.reduce((acc, i) => acc + i.quantity, 0)
}

export function getCartTotal(enrichedItems) {
  return enrichedItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
}

export function enrichCartItems(cartItems, products) {
  return cartItems.map((ci) => {
    const p = products.find((p) => p.id === ci.productId) ?? {}
    return {
      ...ci,
      id: ci.productId,
      name: p.name ?? ci.name ?? '—',
      price: p.price ?? ci.price ?? 0,
      image: getProductImage(p),
      category: p.category ?? '',
      origin: p.origin ?? '',
    }
  })
}
