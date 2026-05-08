import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useCartStore } from '../stores/cartStore'
import { useProductStore } from '../stores/productStore'
import { useNotifStore } from '../stores/notifStore'
import { useLangStore } from '../stores/langStore'
import { whatsappOrderLink, formatPrice } from '../lib/whatsapp'
import { enrichCartItems, getCartTotal } from '../lib/products'

const DELIVERY_LABELS = { home: 'Livraison à domicile', hotel: 'Livraison à hôtel / riad', pickup: 'Retrait magasin' }

async function saveOrder(data, items) {
  const reference = `S3D-${Date.now().toString().slice(-6)}`
  const order = {
    reference,
    customerName: data.name ?? '',
    deliveryType: data.deliveryType ?? 'home',
    deliveryLabel: DELIVERY_LABELS[data.deliveryType] ?? '',
    formData: data,
    total: Number(data.total ?? 0),
    items: items.map((i) => ({ productId: i.productId, name: i.name, price: Number(i.price ?? 0), image: i.image ?? '', quantity: Number(i.quantity ?? 1), category: i.category ?? '', origin: i.origin ?? '' })),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: 'pending',
  }
  const ref = await addDoc(collection(db, 'orders'), order)
  return { id: ref.id, ...order, reference }
}

export default function CartPage() {
  const t = useLangStore((s) => s.t)
  const cartItems = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const products = useProductStore((s) => s.products)
  const loadProducts = useProductStore((s) => s.loadProducts)
  const showToast = useNotifStore((s) => s.showToast)
  const [form, setForm] = useState({ name: '', phone: '', address: '', deliveryType: 'home', hotelName: '', roomNumber: '', whatsappNumber: '', desiredDate: '', timeSlot: '', note: '' })
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { loadProducts().catch(console.error) }, [loadProducts])

  const enriched = useMemo(() => enrichCartItems(cartItems, products), [cartItems, products])
  const total = useMemo(() => getCartTotal(enriched), [enriched])
  const itemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0)

  const handleField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!enriched.length) return
    setLoading(true); setError('')
    try {
      const created = await saveOrder({ ...form, total }, enriched)
      setOrder(created)
      clearCart()
      showToast(t('notifications.new_order'), t('notifications.new_order_body', { ref: created.reference, total: created.total }))
    } catch (err) {
      console.error(err)
      setError('Impossible d\'enregistrer la commande.')
    } finally { setLoading(false) }
  }

  if (order) return (
    <section className="section-shell pb-16">
      <div className="panel-surface px-7 py-10">
        <span className="pill-badge">{t('cart.success_badge')}</span>
        <h1 className="mt-4 text-4xl">{t('cart.success_title')}</h1>
        <p className="mt-4 max-w-3xl text-base" style={{ color: '#5a4a3a' }}>
          {t('cart.success_msg', { ref: order.reference })}
        </p>
        <div className="mt-6 grid gap-4 rounded-[30px] p-6 md:grid-cols-3" style={{ background: '#faf6ee' }}>
          {[[t('cart.customer_label'), order.customerName],[t('cart.delivery_label'), order.deliveryLabel],[t('cart.total_label'), formatPrice(order.total)]].map(([label, val]) => (
            <div key={label}>
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: '#a09080' }}>{label}</p>
              <p className="mt-2 font-semibold" style={{ color: '#1a1612' }}>{val}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={whatsappOrderLink(order)} target="_blank" rel="noreferrer" className="public-btn-primary">{t('cart.whatsapp_confirm')}</a>
          <Link to="/boutique-3d" className="public-btn-secondary">{t('cart.back_store')}</Link>
        </div>
      </div>
    </section>
  )

  if (!enriched.length) return (
    <section className="section-shell pb-16">
      <div className="panel-surface px-8 py-14 text-center">
        <h1 className="text-4xl">{t('cart.empty_title')}</h1>
        <p className="mt-4 text-base" style={{ color: '#5a4a3a' }}>{t('cart.empty_msg')}</p>
        <Link to="/boutique-3d" className="public-btn-primary mt-6 inline-flex">{t('cart.explore_btn')}</Link>
      </div>
    </section>
  )

  return (
    <section className="section-shell pb-16">
      <div className="mb-6 panel-surface p-6">
        <span className="pill-badge">{t('cart.checkout_badge')}</span>
        <h1 className="mt-4 text-4xl">{t('cart.title')}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          {enriched.map((item) => (
            <article key={item.id} className="panel-surface p-5">
              <div className="flex flex-col gap-4 sm:flex-row">
                <img src={item.image} alt={item.name} className="h-32 w-full rounded-[24px] object-cover sm:w-32" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold">{item.name}</h3>
                      <p className="mt-1 text-sm" style={{ color: '#7a6a58' }}>{item.category}</p>
                    </div>
                    <p className="text-xl font-semibold" style={{ color: '#b05c3a' }}>{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-full border border-[#e8dfc8] p-1" style={{ background: '#faf6ee' }}>
                      <button type="button" className="public-btn-icon h-9 w-9" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span className="min-w-12 text-center text-sm font-semibold">{item.quantity}</span>
                      <button type="button" className="public-btn-icon h-9 w-9" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button type="button" className="public-btn-subtle px-4 py-2" onClick={() => removeItem(item.id)}>{t('cart.remove')}</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="panel-surface p-6">
          <div className="mb-6 rounded-[28px] p-5" style={{ background: '#faf6ee' }}>
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: '#7a6a58' }}>{t('cart.items')}</p>
              <p className="font-semibold">{itemCount}</p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm" style={{ color: '#7a6a58' }}>{t('cart.total')}</p>
              <p className="text-2xl font-semibold">{formatPrice(total)}</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <div className="rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <div>
              <label htmlFor="name" className="label-text">{t('cart.name')}</label>
              <input id="name" name="name" value={form.name} onChange={handleField} required className="input-field" placeholder="Ex. Salma El Idrissi" />
            </div>
            <div>
              <label htmlFor="phone" className="label-text">{t('cart.phone')}</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleField} required className="input-field" placeholder="+212 ..." />
            </div>
            <div>
              <label htmlFor="deliveryType" className="label-text">{t('cart.delivery_type')}</label>
              <select id="deliveryType" name="deliveryType" value={form.deliveryType} onChange={handleField} className="input-field">
                <option value="home">{t('cart.delivery_home')}</option>
                <option value="hotel">{t('cart.delivery_hotel')}</option>
                <option value="pickup">{t('cart.delivery_pickup')}</option>
              </select>
            </div>
            {form.deliveryType === 'home' && (
              <div>
                <label htmlFor="address" className="label-text">{t('cart.address')}</label>
                <textarea id="address" name="address" value={form.address} onChange={handleField} required rows={3} className="input-field resize-none" placeholder="Quartier, rue, repère..." />
              </div>
            )}
            {form.deliveryType === 'hotel' && (<>
              <div>
                <label htmlFor="hotelName" className="label-text">{t('cart.hotel_name')}</label>
                <input id="hotelName" name="hotelName" value={form.hotelName} onChange={handleField} required className="input-field" placeholder="Ex. Riad Yasmine" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="roomNumber" className="label-text">{t('cart.room')}</label>
                  <input id="roomNumber" name="roomNumber" value={form.roomNumber} onChange={handleField} className="input-field" placeholder="Ex. 205" />
                </div>
                <div>
                  <label htmlFor="whatsappNumber" className="label-text">{t('cart.whatsapp_num')}</label>
                  <input id="whatsappNumber" name="whatsappNumber" value={form.whatsappNumber} onChange={handleField} required className="input-field" placeholder="+212 ..." />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="desiredDate" className="label-text">{t('cart.desired_date')}</label>
                  <input id="desiredDate" name="desiredDate" type="date" value={form.desiredDate} onChange={handleField} required className="input-field" />
                </div>
                <div>
                  <label htmlFor="timeSlot" className="label-text">{t('cart.time_slot')}</label>
                  <input id="timeSlot" name="timeSlot" value={form.timeSlot} onChange={handleField} required className="input-field" placeholder="Ex. 18h - 20h" />
                </div>
              </div>
            </>)}
            {form.deliveryType === 'pickup' && (
              <div className="rounded-[26px] p-4 text-sm" style={{ background: '#faf6ee', color: '#5a4a3a' }}>{t('cart.pickup_info')}</div>
            )}
            <div>
              <label htmlFor="note" className="label-text">{t('cart.note')}</label>
              <textarea id="note" name="note" value={form.note} onChange={handleField} rows={3} className="input-field resize-none" placeholder="Instructions, repère, cadeau, etc." />
            </div>
            <button type="submit" className="public-btn-primary w-full">{loading ? t('cart.confirming') : t('cart.confirm_btn')}</button>
          </form>
        </div>
      </div>
    </section>
  )
}
