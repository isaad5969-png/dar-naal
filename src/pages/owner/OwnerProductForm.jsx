import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useProductStore } from '../../stores/productStore'

const EMPTY = { name: '', category: '', price: '', stock: '', status: 'active', isHandmade: true, isPremium: false, isTouristFriendly: true, origin: 'Marrakech', artisan: '', material: '', description: '', detailedDescription: '', story: '', weight: '', dimensions: '' }

export default function OwnerProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const products = useProductStore((s) => s.products)
  const loadProducts = useProductStore((s) => s.loadProducts)
  const saveProduct = useProductStore((s) => s.saveProduct)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isNew = !id || id === 'new'

  useEffect(() => {
    loadProducts().catch(console.error)
  }, [loadProducts])

  useEffect(() => {
    if (!isNew) {
      const p = products.find((p) => p.id === id)
      if (p) setForm({ ...EMPTY, ...p, price: String(p.price), stock: String(p.stock) })
    }
  }, [id, isNew, products])

  const handleField = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await saveProduct({ ...form, id: isNew ? undefined : id, price: Number(form.price), stock: Number(form.stock) })
      navigate('/owner/products')
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la sauvegarde.')
    } finally { setSaving(false) }
  }

  const Field = ({ label, name, type = 'text', ...props }) => (
    <div>
      <label htmlFor={name} className="label-text">{label}</label>
      {type === 'textarea'
        ? <textarea id={name} name={name} value={form[name]} onChange={handleField} rows={3} className="input-field resize-none" {...props} />
        : <input id={name} name={name} type={type} value={form[name]} onChange={handleField} className="input-field" {...props} />
      }
    </div>
  )

  const Check = ({ label, name }) => (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#e8dfc8] bg-white px-4 py-3">
      <input type="checkbox" name={name} checked={!!form[name]} onChange={handleField} className="h-4 w-4 rounded accent-[#b05c3a]" />
      <span className="text-sm font-medium" style={{ color: '#1a1612' }}>{label}</span>
    </label>
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Link to="/owner/products" className="public-btn-subtle">← Retour</Link>
        <h2 className="text-3xl font-semibold" style={{ color: '#1a1612' }}>{isNew ? 'Nouveau produit' : 'Modifier le produit'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
        <div className="panel-surface p-6 space-y-4">
          <h3 className="text-lg font-semibold">Informations de base</h3>
          {error && <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
          <Field label="Nom du produit *" name="name" required />
          <Field label="Catégorie *" name="category" required placeholder="Ex. Babouches, Décoration, Bijoux..." />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Prix (MAD) *" name="price" type="number" min="0" required />
            <Field label="Stock *" name="stock" type="number" min="0" required />
          </div>
          <div>
            <label htmlFor="status" className="label-text">Statut</label>
            <select id="status" name="status" value={form.status} onChange={handleField} className="input-field">
              <option value="active">Actif</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Check label="Fait main" name="isHandmade" />
            <Check label="Premium" name="isPremium" />
            <Check label="Transportable" name="isTouristFriendly" />
          </div>
        </div>

        <div className="panel-surface p-6 space-y-4">
          <h3 className="text-lg font-semibold">Origine & Artisan</h3>
          <Field label="Origine" name="origin" placeholder="Ex. Marrakech, Fès, Tiznit..." />
          <Field label="Artisan" name="artisan" placeholder="Ex. Hassan Tazi" />
          <Field label="Matière" name="material" placeholder="Ex. Cuir pleine fleur" />
          <Field label="Poids" name="weight" placeholder="Ex. 320g" />
          <Field label="Dimensions" name="dimensions" placeholder="Ex. 28×10×6 cm" />
        </div>

        <div className="panel-surface p-6 space-y-4 lg:col-span-2">
          <h3 className="text-lg font-semibold">Descriptions</h3>
          <Field label="Description courte *" name="description" type="textarea" required />
          <Field label="Description détaillée" name="detailedDescription" type="textarea" />
          <Field label="Histoire artisanale *" name="story" type="textarea" required />
        </div>

        <div className="lg:col-span-2 flex gap-3">
          <button type="submit" className="primary-button" disabled={saving}>{saving ? 'Sauvegarde…' : 'Sauvegarder'}</button>
          <Link to="/owner/products" className="secondary-button">Annuler</Link>
        </div>
      </form>
    </div>
  )
}
