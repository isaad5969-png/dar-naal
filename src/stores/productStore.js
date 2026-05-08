import { create } from 'zustand'
import { db, isFirebaseConfigured } from '../lib/firebase'

const COLLECTION = 'products'

const SEED_PRODUCTS = [
  { id: 'babouches-camel-brodees', name: 'Babouches Camel Brodées', category: 'Babouches', price: 350, stock: 12, status: 'active', isHandmade: true, isPremium: false, isTouristFriendly: true, origin: 'Marrakech', artisan: 'Hassan Tazi', material: 'Cuir pleine fleur', description: 'Babouches traditionnelles en cuir camel brodées à la main.', detailedDescription: 'Confectionnées selon les techniques ancestrales des artisans de la Médina de Marrakech.', story: 'Chaque paire raconte l\'histoire d\'un savoir-faire transmis de père en fils depuis cinq générations.', weight: '320g', dimensions: '28×10×6 cm' },
  { id: 'babouches-noir-atelier', name: 'Babouches Noir Atelier', category: 'Babouches', price: 280, stock: 8, status: 'active', isHandmade: true, isPremium: false, isTouristFriendly: true, origin: 'Marrakech', artisan: 'Youssef El Fassi', material: 'Cuir tanné végétal', description: 'Babouches noires de style atelier, sobres et élégantes.', detailedDescription: 'Le cuir tanné végétalement offre une durabilité exceptionnelle et un toucher unique.', story: 'Inspirées du style des maîtres artisans de Fès, adaptées au goût contemporain.', weight: '300g', dimensions: '27×9×5 cm' },
  { id: 'babouches-ivoire-fines', name: 'Babouches Ivoire Fines', category: 'Babouches', price: 320, stock: 5, status: 'active', isHandmade: true, isPremium: true, isTouristFriendly: true, origin: 'Marrakech', artisan: 'Fatima Zahra', material: 'Cuir cheveau', description: 'Babouches ivoire fines, légères et raffinées.', detailedDescription: 'La légèreté du cuir cheveau les rend idéales pour les journées longues.', story: 'Façonnées par Fatima Zahra, l\'une des rares artisanes femmes du quartier des Tanneurs.', weight: '240g', dimensions: '27×9×4 cm' },
  { id: 'babouches-bleu-majorelle', name: 'Babouches Bleu Majorelle', category: 'Babouches', price: 390, stock: 7, status: 'active', isHandmade: true, isPremium: true, isTouristFriendly: true, origin: 'Marrakech', artisan: 'Rachid Benali', material: 'Cuir teint naturel', description: 'Babouches d\'un bleu intense inspiré du célèbre jardin Majorelle.', detailedDescription: 'La teinte est obtenue par des colorants naturels traditionnels, garantissant une couleur durable.', story: 'Le bleu Majorelle est devenu l\'emblème de Marrakech. Ces babouches en capturent toute l\'essence.', weight: '310g', dimensions: '28×10×5 cm' },
  { id: 'babouches-sable-dore', name: 'Babouches Sable Doré', category: 'Babouches', price: 295, stock: 10, status: 'active', isHandmade: true, isPremium: false, isTouristFriendly: true, origin: 'Marrakech', artisan: 'Omar Berrada', material: 'Cuir naturel', description: 'Babouches couleur sable, idéales pour toutes les occasions.', detailedDescription: 'La teinte sable s\'accorde avec toutes les tenues, du traditionnel au contemporain.', story: 'Une couleur intemporelle qui évoque les dunes du désert marocain.', weight: '290g', dimensions: '27×9×5 cm' },
  { id: 'babouches-rouges', name: 'Babouches Rouges', category: 'Babouches', price: 310, stock: 15, status: 'active', isHandmade: true, isPremium: false, isTouristFriendly: true, origin: 'Marrakech', artisan: 'Ahmed Cherkaoui', material: 'Cuir teint naturel', description: 'Les classiques babouches rouges de Marrakech, indémodables.', detailedDescription: 'Le rouge est la couleur traditionnelle par excellence des babouches marocaines.', story: 'Portées par les sultans, les babouches rouges sont le symbole du Maroc authentique.', weight: '300g', dimensions: '28×10×5 cm' },
  { id: 'tapis-berbere', name: 'Tapis Berbère', category: 'Décoration', price: 1200, stock: 3, status: 'active', isHandmade: true, isPremium: true, isTouristFriendly: false, origin: 'Haut Atlas', artisan: 'Tribu Aït Benhaddou', material: 'Laine naturelle', description: 'Tapis berbère tissé à la main, motifs géométriques ancestraux.', detailedDescription: 'Chaque tapis est unique, tissé par les femmes berbères selon des motifs transmis oralement.', story: 'Ces tapis racontent l\'histoire de tribus entières à travers leurs symboles géométriques.', weight: '3.2kg', dimensions: '200×140 cm' },
  { id: 'lanterne-cuivre', name: 'Lanterne en Cuivre', category: 'Décoration', price: 450, stock: 6, status: 'active', isHandmade: true, isPremium: true, isTouristFriendly: false, origin: 'Marrakech', artisan: 'Mustapha Rami', material: 'Cuivre martelé', description: 'Lanterne en cuivre martelé, éclairage tamisé et chaleureux.', detailedDescription: 'Le cuivre est travaillé à la main par des artisans qui martèlent chaque motif individuellement.', story: 'La lumière qui filtre à travers les perforations crée des arabesques magiques sur les murs.', weight: '1.8kg', dimensions: '30×20 cm' },
  { id: 'huile-argan-premium', name: 'Huile d\'Argan Premium', category: 'Beauté', price: 180, stock: 20, status: 'active', isHandmade: true, isPremium: true, isTouristFriendly: true, origin: 'Essaouira', artisan: 'Coopérative Féminine Tifaout', material: '100% pure argan', description: 'Huile d\'argan pure pressée à froid, certifiée bio.', detailedDescription: 'Pressée à froid par une coopérative de femmes de la région d\'Essaouira, cette huile préserve tous ses bienfaits.', story: 'L\'arganier, arbre endémique du Maroc, produit ses fruits précieux une fois par an.', weight: '100ml', dimensions: '5×5×12 cm' },
  { id: 'bijou-amazigh', name: 'Bijou Amazigh', category: 'Bijoux', price: 680, stock: 4, status: 'active', isHandmade: true, isPremium: true, isTouristFriendly: true, origin: 'Tiznit', artisan: 'Fadma Ait Ouali', material: 'Argent et résine', description: 'Parure berbère en argent et résine colorée, pièce unique.', detailedDescription: 'Chaque bijou amazigh est une œuvre d\'art portant les symboles de protection et de fertilité.', story: 'Fadma crée chaque pièce à la main dans son atelier de Tiznit, capitale de la bijouterie amazighe.', weight: '85g', dimensions: '12×8 cm' },
  { id: 'coffret-hammam-argan', name: 'Coffret Hammam Argan', category: 'Beauté', price: 240, stock: 9, status: 'active', isHandmade: true, isPremium: false, isTouristFriendly: true, origin: 'Marrakech', artisan: 'Dar Beldi', material: 'Savon beldi, gant kessa, huile argan', description: 'Coffret complet pour un rituel hammam authentique chez soi.', detailedDescription: 'Comprend du savon beldi, un gant kessa en lin, et de l\'huile d\'argan. Idéal pour retrouver le rituel du hammam.', story: 'Le hammam est au cœur de la culture marocaine. Ce coffret vous permet de le vivre partout dans le monde.', weight: '650g', dimensions: '22×16×8 cm' },
  { id: 'coussin-brode-marocain', name: 'Coussin Brodé Marocain', category: 'Décoration', price: 290, stock: 7, status: 'active', isHandmade: true, isPremium: false, isTouristFriendly: false, origin: 'Fès', artisan: 'Atelier Fassi', material: 'Coton et fils de soie', description: 'Coussin brodé à la main selon la technique fassi traditionnelle.', detailedDescription: 'La broderie fassi est l\'une des plus fines du monde islamique, reconnue par l\'UNESCO.', story: 'Des brodeuses de Fès passent des dizaines d\'heures sur chaque coussin pour créer ces motifs complexes.', weight: '400g', dimensions: '45×45 cm' },
  { id: 'sac-cuir-marrakech', name: 'Sac Cuir Marrakech', category: 'Maroquinerie', price: 520, stock: 5, status: 'active', isHandmade: true, isPremium: true, isTouristFriendly: true, origin: 'Marrakech', artisan: 'Atelier Tannerie Chouara', material: 'Cuir pleine fleur', description: 'Sac en cuir tanné végétalement, style souk moderne.', detailedDescription: 'Le cuir pleine fleur est la qualité la plus noble. Tanné végétalement, il développe une belle patine avec le temps.', story: 'Issu des tanneries historiques de Marrakech, chaque sac porte l\'empreinte d\'un artisanat millénaire.', weight: '850g', dimensions: '35×28×12 cm' },
  { id: 'tajine-decoratif', name: 'Tajine Décoratif', category: 'Décoration', price: 320, stock: 8, status: 'active', isHandmade: true, isPremium: false, isTouristFriendly: true, origin: 'Safi', artisan: 'Poterie de Safi', material: 'Argile émaillée', description: 'Tajine en argile peint à la main, pure décoration.', detailedDescription: 'Ce tajine n\'est pas destiné à la cuisson mais à la décoration. Ses motifs sont peints à la main.', story: 'La poterie de Safi est l\'une des plus anciennes traditions artisanales du Maroc.', weight: '1.2kg', dimensions: '35×20 cm' },
  { id: 'verres-beldi', name: 'Verres Beldi', category: 'Art de la table', price: 160, stock: 14, status: 'active', isHandmade: true, isPremium: false, isTouristFriendly: true, origin: 'Marrakech', artisan: 'Verrerie Médina', material: 'Verre soufflé', description: 'Set de 6 verres à thé en verre soufflé, colorés et festifs.', detailedDescription: 'Ces verres beldi sont soufflés à la bouche par des artisans verriers. Chaque pièce est légèrement différente.', story: 'Le thé à la menthe servi dans ces verres colorés est un symbole de l\'hospitalité marocaine.', weight: '480g', dimensions: '7×7×9 cm (x6)' },
]

function normalize(data, id) {
  return { id, status: 'active', isHandmade: false, isPremium: false, isTouristFriendly: true, stock: 0, price: 0, ...data }
}

export const useProductStore = create((set, get) => ({
  products: [],
  hasLoaded: false,
  isLoading: false,

  loadProducts: async () => {
    if (get().isLoading) return get().products
    set({ isLoading: true })
    if (!isFirebaseConfigured) {
      set({ products: SEED_PRODUCTS, hasLoaded: true, isLoading: false })
      return SEED_PRODUCTS
    }
    try {
      const { collection, getDocs } = await import('firebase/firestore')
      const snap = await getDocs(collection(db, COLLECTION))
      if (snap.empty) {
        set({ products: SEED_PRODUCTS, hasLoaded: true, isLoading: false })
        return SEED_PRODUCTS
      }
      const products = snap.docs.map((d) => normalize(d.data(), d.id))
      set({ products, hasLoaded: true, isLoading: false })
      return products
    } catch {
      set({ products: SEED_PRODUCTS, hasLoaded: true, isLoading: false })
      return SEED_PRODUCTS
    }
  },

  saveProduct: async (data) => {
    const id = data.id || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const product = normalize({ ...data }, id)
    if (isFirebaseConfigured && db) {
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
      await setDoc(doc(db, COLLECTION, id), { ...product, updatedAt: serverTimestamp() })
    }
    const products = get().products.filter((p) => p.id !== id)
    set({ products: [...products, product] })
    return product
  },

  deleteProduct: async (id) => {
    if (isFirebaseConfigured && db) {
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(db, COLLECTION, id))
    }
    set({ products: get().products.filter((p) => p.id !== id) })
  },
}))
