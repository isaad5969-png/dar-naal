import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useLangStore } from './stores/langStore'
import Navbar from './components/ui/Navbar'
import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import OwnerLayout from './pages/owner/OwnerLayout'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import OwnerProducts from './pages/owner/OwnerProducts'
import OwnerProductForm from './pages/owner/OwnerProductForm'
import OwnerHotspots from './pages/owner/OwnerHotspots'

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen" style={{ background: '#FAF7F2' }}>
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default function App() {
  const { locale, setLocale } = useLangStore()

  useEffect(() => {
    // Sync HTML lang/dir on first render
    setLocale(locale)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/boutique-3d" element={<PublicLayout><StorePage /></PublicLayout>} />
        <Route path="/catalogue" element={<PublicLayout><CatalogPage /></PublicLayout>} />
        <Route path="/products/:id" element={<PublicLayout><ProductPage /></PublicLayout>} />
        <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />

        {/* Back-office */}
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<OwnerDashboard />} />
          <Route path="products" element={<OwnerProducts />} />
          <Route path="products/:id" element={<OwnerProductForm />} />
          <Route path="hotspots" element={<OwnerHotspots />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
