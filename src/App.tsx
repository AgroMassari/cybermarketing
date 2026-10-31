import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion } from "framer-motion";
import {
  Home as HomeIcon, ShoppingCart, Zap, TrendingUp, Eye, Heart,
  MessageCircle, X, Plus, Minus, CheckCircle2, Instagram,
  Youtube, Music2, Shield, Clock, Users, Package, Send, Trash2, Headphones, Globe,
  Copy, CopyCheck, Banknote, DollarSign, ChevronLeft, Search, User, Lock
} from "lucide-react";
import { FaFacebook, FaSpotify, FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { useEffect, useState, createContext, useContext, useMemo, useRef } from "react";
import { Currency, CURRENCY_SYMBOLS, PRICING_DATA, getPrice } from "./data/pricing";
import { ErrorBoundary } from "./ErrorBoundary";
import { gsap } from "gsap";

// ─── CONTACTO OFICIAL ────────────────────────────────────────────────────────
export const WHATSAPP_LINK = "https://wa.me/5491166168096";

export function getWhatsAppUrl(text?: string): string {
  if (!text) return WHATSAPP_LINK;
  return `https://wa.me/5491166168096?text=${encodeURIComponent(text)}`;
}

// ─── DATOS DE PAGO (SOLO TRANSFERENCIA ARGENTINA) ───────────────────────────
const PAYMENT_ARS = [
  { label: "Banco",    value: "Naranja X" },
  { label: "Titular",  value: "Sebastian Agustin Herrera" },
  { label: "CUIL",     value: "20414359621" },
  { label: "CBU",      value: "4530000800017621169436" },
  { label: "Alias",    value: "CYBER.MARKET" },
];

export const CURRENCY_LIST: { code: Currency; label: string; flag: string }[] = [
  { code: 'ARS', label: 'ARS (Argentina)', flag: '🇦🇷' },
  { code: 'USD', label: 'USD (Dólares)', flag: '🇺🇸' },
  { code: 'CLP', label: 'CLP (Chile)', flag: '🇨🇱' },
  { code: 'UYU', label: 'UYU (Uruguay)', flag: '🇺🇾' },
  { code: 'MXN', label: 'MXN (México)', flag: '🇲🇽' },
  { code: 'COP', label: 'COP (Colombia)', flag: '🇨🇴' },
  { code: 'BRL', label: 'BRL (Brasil)', flag: '🇧🇷' },
  { code: 'EUR', label: 'EUR (Europa)', flag: '🇪🇺' },
];

const queryClient = new QueryClient();

// ─── TYPES ────────────────────────────────────────────────────────────────────
type ServiceTier = {
  tierQty: string;
  price: number;
  discount?: string;
  popular?: boolean;
  label?: string;
};

type ServiceGroup = {
  id: string;
  category: "instagram" | "tiktok" | "youtube" | "facebook" | "spotify";
  name: string;
  subtitle?: string;
  features: string[];
  icon: React.ReactNode;
  tiers: ServiceTier[];
  groupPopular?: boolean;
};

// ─── CATÁLOGO COMPLETO ────────────────────────────────────────────────────────
const SERVICE_GROUPS: ServiceGroup[] = [

  // ──────────────────────────── INSTAGRAM ────────────────────────────────────

  {
    id: "ig-seg-latinos",
    category: "instagram",
    name: "Seguidores Instagram",
    subtitle: "LATINO PREMIUM",
    features: [
      "Perfiles premium de América Latina",
    ],
    icon: <Instagram size={16} />,
    tiers: [
      { tierQty: "100",    price: 10990, label: "Pack Básico" },
      { tierQty: "500",    price: 25990 },
      { tierQty: "1.000",  price: 42990, popular: true, label: "Pack Más Vendido" },
      { tierQty: "2.500",  price: 86990 },
      { tierQty: "5.000",  price: 92990 },
      { tierQty: "10.000", price: 171990, label: "Pack Influencer" },
    ],
  },
  {
    id: "ig-seg-globales",
    category: "instagram",
    name: "Seguidores Instagram",
    subtitle: "GLOBAL ECONOMICS",
    features: [
      "Mejorá tu perfil de inmediato",
      "Mejor relación precio/calidad",
    ],
    icon: <Instagram size={16} />,
    tiers: [
      { tierQty: "250",    price: 8900 },
      { tierQty: "500",    price: 12300 },
      { tierQty: "1.000",  price: 22700, popular: true },
      { tierQty: "2.500",  price: 53500 },
      { tierQty: "5.000",  price: 98500 },
      { tierQty: "10.000", price: 178500 },
      { tierQty: "20.000", price: 338500 },
    ],
  },
  {
    id: "ig-seg-vip",
    category: "instagram",
    name: "Seguidores Instagram",
    subtitle: "PREMIUM VIP",
    features: [
      "Máxima calidad garantizada",
      "Entrega rápida y segura",
    ],
    icon: <Instagram size={16} />,
    tiers: [
      { tierQty: "200",   price: 8990 },
      { tierQty: "500",   price: 16000 },
      { tierQty: "1.000", price: 28500, popular: true },
      { tierQty: "2.500", price: 57000 },
      { tierQty: "5.000", price: 100000 },
    ],
  },
  {
    id: "ig-likes-globales",
    category: "instagram",
    name: "Likes Instagram",
    subtitle: "GLOBALES",
    features: [
      "Dale vida a tu post al instante",
      "Mejorá el impacto de tus posts y reels",
      "Aumentá tus likes de forma económica",
    ],
    icon: <Heart size={16} />,
    tiers: [
      { tierQty: "500",    price: 4700 },
      { tierQty: "1.000",  price: 6600, popular: true },
      { tierQty: "2.500",  price: 11400 },
      { tierQty: "5.000",  price: 19900 },
      { tierQty: "10.000", price: 37500 },
      { tierQty: "50.000", price: 152000 },
    ],
  },
  {
    id: "ig-likes-latinos",
    category: "instagram",
    name: "Likes Instagram",
    subtitle: "PREMIUM",
    features: [
      "Perfiles premium de alta interacción",
      "Permanentes",
    ],
    icon: <Heart size={16} />,
    tiers: [
      { tierQty: "250",    price: 4500 },
      { tierQty: "500",    price: 7300 },
      { tierQty: "1.000",  price: 8300, popular: true },
      { tierQty: "2.500",  price: 15500 },
      { tierQty: "5.000",  price: 28250 },
      { tierQty: "10.000", price: 54650 },
      { tierQty: "20.000", price: 99400 },
    ],
  },
  {
    id: "ig-visualizaciones-videos",
    category: "instagram",
    name: "Visualizaciones Instagram",
    subtitle: "PARA VÍDEOS/REELS",
    features: [
      "Impulsá tu próximo reel/vídeo",
      "Aumentá el atractivo visual",
      "Entrega progresiva",
    ],
    icon: <Eye size={16} />,
    tiers: [
      { tierQty: "2.000",   price: 3500 },
      { tierQty: "5.000",   price: 5250 },
      { tierQty: "10.000",  price: 7100, popular: true },
      { tierQty: "20.000",  price: 9500 },
      { tierQty: "50.000",  price: 14100 },
      { tierQty: "150.000", price: 28600 },
      { tierQty: "300.000", price: 48600 },
    ],
  },
  {
    id: "ig-mix-acciones",
    category: "instagram",
    name: "Mix de Acciones Instagram",
    subtitle: "REPOSTS + COMPARTIDOS + GUARDADOS",
    features: [
      "Mix equilibrado: Reposts + Compartidos + Guardados",
      "Mejora métricas y alcance orgánico",
      "Entrega rápida y progresiva",
    ],
    icon: <Send size={16} />,
    tiers: [
      { tierQty: "MIX 1: 100+100+100",  price: 1500, label: "Básico" },
      { tierQty: "MIX 2: 300+300+300",  price: 3000, label: "Intermedio" },
      { tierQty: "MIX 3: 1500+500+500", price: 5000, popular: true, label: "Recomendado" },
      { tierQty: "MIX 4: 1k+1k+1k",     price: 10000, label: "Pro" },
    ],
  },
  {
    id: "ig-vistas-historias",
    category: "instagram",
    name: "Vistas Instagram",
    subtitle: "HISTORIAS",
    features: [
      "Perfiles premium de Argentina",
      "Llegan en todas las historias activas del perfil",
    ],
    icon: <Eye size={16} />,
    tiers: [
      { tierQty: "500",    price: 2500 },
      { tierQty: "1.000",  price: 4250 },
      { tierQty: "2.500",  price: 6100 },
      { tierQty: "5.000",  price: 8500 },
      { tierQty: "10.000", price: 13100 },
      { tierQty: "20.000", price: 27600 },
    ],
  },
  {
    id: "ig-comentarios",
    category: "instagram",
    name: "Comentarios Instagram",
    subtitle: "P/ REELS & POST",
    features: [
      "Perfiles de diferentes países del mundo", "Comentarios permanentes",
    ],
    icon: <MessageCircle size={16} />,
    tiers: [
      { tierQty: "10",    price: 2500 },
      { tierQty: "25",    price: 3250 },
      { tierQty: "50",    price: 4500 },
      { tierQty: "100",   price: 6000,  discount: "17% OFF" },
      { tierQty: "500",   price: 20750, discount: "21% OFF" },
      { tierQty: "1.000", price: 32000, discount: "38% OFF" },
    ],
  },
  {
    id: "ig-compartidas",
    category: "instagram",
    name: "Compartidas Instagram",
    subtitle: "P/ REELS & POST",
    features: [
      "Compartidas por DM", "Permanentes",
      "Entrega: 2 hs",
    ],
    icon: <Send size={16} />,
    tiers: [
      { tierQty: "500",    price: 3000 },
      { tierQty: "1.000",  price: 4000 },
      { tierQty: "2.500",  price: 6500 },
      { tierQty: "5.000",  price: 7000 },
      { tierQty: "10.000", price: 9500,  discount: "19% OFF" },
      { tierQty: "20.000", price: 14000, discount: "32% OFF" },
    ],
  },

  // ──────────────────────────── TIKTOK ───────────────────────────────────────

  {
    id: "tt-seguidores",
    category: "tiktok",
    name: "Seguidores TikTok",
    groupPopular: true,
    features: [
      "Crecimiento orgánico progresivo",
      "Perfiles reales y activos",
      "Sin contraseña",
    ],
    icon: <Music2 size={16} />,
    tiers: [
      { tierQty: "200",    price: 6200 },
      { tierQty: "500",    price: 7900 },
      { tierQty: "1.000",  price: 13500, popular: true },
      { tierQty: "2.500",  price: 24000 },
      { tierQty: "5.000",  price: 43000 },
      { tierQty: "10.000", price: 59000 },
      { tierQty: "20.000", price: 103000 },
    ],
  },
  {
    id: "tt-likes",
    category: "tiktok",
    name: "Likes TikTok",
    features: [
      "Se pueden dividir en varias publicaciones (mín. 100)",
      "Perfiles activos",
      "Entrega rápida",
    ],
    icon: <Heart size={16} />,
    tiers: [
      { tierQty: "500",    price: 3700 },
      { tierQty: "1.000",  price: 4900, popular: true },
      { tierQty: "2.500",  price: 8500 },
      { tierQty: "5.000",  price: 13800 },
      { tierQty: "10.000", price: 23300 },
      { tierQty: "20.000", price: 41300 },
      { tierQty: "50.000", price: 97300 },
    ],
  },
  {
    id: "tt-visualizaciones",
    category: "tiktok",
    name: "Visualizaciones TikTok",
    features: [
      "Impulsá tu próximo vídeo",
      "Aumentá el atractivo visual",
      "Entrega progresiva",
    ],
    icon: <Eye size={16} />,
    tiers: [
      { tierQty: "2.000",   price: 5000 },
      { tierQty: "5.000",   price: 7000 },
      { tierQty: "10.000",  price: 10000 },
      { tierQty: "20.000",  price: 15000 },
      { tierQty: "50.000",  price: 27000 },
      { tierQty: "150.000", price: 37000 },
      { tierQty: "300.000", price: 57000 },
    ],
  },

  // ──────────────────────────── FACEBOOK ─────────────────────────────────────

  {
    id: "fb-seguidores",
    category: "facebook",
    name: "Seguidores Facebook",
    groupPopular: true,
    features: [
      "Mejor relación precio/calidad",
      "Perfiles activos y reales",
      "Sin contraseña",
    ],
    icon: <Globe size={16} />,
    tiers: [
      { tierQty: "500",    price: 4100 },
      { tierQty: "1.000",  price: 5700, popular: true },
      { tierQty: "2.500",  price: 10700 },
      { tierQty: "5.000",  price: 17900 },
      { tierQty: "10.000", price: 30900 },
      { tierQty: "20.000", price: 56900 },
      { tierQty: "50.000", price: 126900 },
    ],
  },
  {
    id: "fb-likes-post",
    category: "facebook",
    name: "Likes/Reacciones Facebook",
    features: [
      "Se pueden dividir en varias publicaciones (mín. 100)",
      "La herramienta clave que los influencers no te cuentan",
      "Entrega rápida",
    ],
    icon: <Heart size={16} />,
    tiers: [
      { tierQty: "200",    price: 3900 },
      { tierQty: "500",    price: 5500 },
      { tierQty: "1.000",  price: 8500, popular: true },
      { tierQty: "2.500",  price: 16900 },
      { tierQty: "5.000",  price: 29500 },
      { tierQty: "10.000", price: 51900 },
      { tierQty: "20.000", price: 97000 },
    ],
  },

  // ──────────────────────────── YOUTUBE ──────────────────────────────────────

  {
    id: "yt-subscriptores",
    category: "youtube",
    name: "Subscriptores YouTube",
    groupPopular: true,
    features: [
      "Crecimiento real de tu canal",
      "Sin contraseña",
    ],
    icon: <Youtube size={16} />,
    tiers: [
      { tierQty: "100",   price: 19500 },
      { tierQty: "200",   price: 34000,  discount: "-7%" },
      { tierQty: "300",   price: 48000,  discount: "-10%" },
      { tierQty: "500",   price: 74500,  discount: "-15%" },
      { tierQty: "1.000", price: 119000, discount: "-33%", popular: true },
      { tierQty: "1.500", price: 167000, discount: "-35%" },
      { tierQty: "2.000", price: 211000, discount: "-39%" },
    ],
  },
  {
    id: "yt-suscriptores-canales",
    category: "youtube",
    name: "Suscriptores YouTube",
    subtitle: "P/ CANALES",
    features: [
      "Para canales de YouTube",
      "Entrega gradual y progresiva",
      "Sin contraseña",
    ],
    icon: <Youtube size={16} />,
    tiers: [
      { tierQty: "100", price: 19500 },
      { tierQty: "200", price: 34000 },
      { tierQty: "250", price: 48000 },
      { tierQty: "500", price: 74500 },
      { tierQty: "750", price: 119000 },
      { tierQty: "1.000", price: 167000 },
    ],
  },
  {
    id: "yt-likes-megusta",
    category: "youtube",
    name: "Likes/Me Gusta YouTube",
    features: [
      "Se pueden dividir en varias publicaciones (mín. 100)",
      "Perfiles activos",
      "Entrega rápida",
    ],
    icon: <Heart size={16} />,
    tiers: [
      { tierQty: "100",    price: 2000 },
      { tierQty: "200",    price: 2900 },
      { tierQty: "500",    price: 5500 },
      { tierQty: "1.000",  price: 9500 },
      { tierQty: "2.500",  price: 19600 },
      { tierQty: "5.000",  price: 32600 },
      { tierQty: "10.000", price: 59600 },
    ],
  },
  {
    id: "yt-likes-videos-shorts",
    category: "youtube",
    name: "Likes YouTube",
    subtitle: "P/ VIDEOS & SHORTS",
    features: [
      "Para videos y shorts de YouTube",
      "Hasta 20% OFF en paquetes grandes",
    ],
    icon: <Heart size={16} />,
    tiers: [
      { tierQty: "100",   price: 2000 },
      { tierQty: "200",   price: 2900 },
      { tierQty: "500",   price: 5500 },
      { tierQty: "1.000", price: 9500,  discount: "10% OFF" },
      { tierQty: "2.000", price: 19600, discount: "10% OFF" },
      { tierQty: "5.000", price: 32600, discount: "20% OFF" },
    ],
  },
  {
    id: "yt-visitas-mundiales",
    category: "youtube",
    name: "Visitas YouTube",
    subtitle: "MUNDIALES",
    features: [
      "Tiempo de retención alto",
      "Visitas de todo el mundo",
      "Entrega progresiva",
    ],
    icon: <Eye size={16} />,
    tiers: [
      { tierQty: "1.000",  price: 5400,  discount: "10% OFF" },
      { tierQty: "2.500",  price: 12750, discount: "15% OFF" },
      { tierQty: "5.000",  price: 24000, discount: "20% OFF" },
      { tierQty: "10.000", price: 45000, discount: "25% OFF" },
      { tierQty: "20.000", price: 84000, discount: "30% OFF" },
      { tierQty: "50.000", price: 156000, discount: "35% OFF" },
    ],
  },
  {
    id: "yt-visitas-argentinas",
    category: "youtube",
    name: "Visitas YouTube",
    subtitle: "ARGENTINAS",
    features: [
      "Visitas argentinas premium",
      "Tiempo de retención alto",
      "Entrega progresiva",
    ],
    icon: <Eye size={16} />,
    tiers: [
      { tierQty: "500",    price: 7500 },
      { tierQty: "1.000",  price: 15000 },
      { tierQty: "2.500",  price: 37500 },
      { tierQty: "5.000",  price: 75000 },
      { tierQty: "10.000", price: 150000 },
      { tierQty: "25.000", price: 375000 },
    ],
  },
  {
    id: "yt-comentarios",
    category: "youtube",
    name: "Comentarios YouTube",
    subtitle: "P/ VIDEOS",
    features: [
      "Comentarios personalizables",
      "Para videos de YouTube",
    ],
    icon: <MessageCircle size={16} />,
    tiers: [
      { tierQty: "10",  price: 4500 },
      { tierQty: "25",  price: 8250 },
      { tierQty: "50",  price: 14500 },
      { tierQty: "100", price: 24500,  discount: "8% OFF" },
      { tierQty: "250", price: 55125,  discount: "12% OFF" },
      { tierQty: "500", price: 102000, discount: "19% OFF" },
    ],
  },
  {
    id: "yt-espectadores",
    category: "youtube",
    name: "Espectadores YouTube",
    subtitle: "TRANSMISIONES EN VIVO · 1HS",
    features: [
      "Para streams en vivo",
      "Paquetes de 2HS y 3HS disponibles — consultar por WhatsApp",
      "Entrega inmediata al iniciar stream",
    ],
    icon: <Eye size={16} />,
    tiers: [
      { tierQty: "100 esp.",   price: 6990 },
      { tierQty: "200 esp.",   price: 11490 },
      { tierQty: "300 esp.",   price: 15790 },
      { tierQty: "400 esp.",   price: 19590 },
      { tierQty: "500 esp.",   price: 23190 },
      { tierQty: "1.000 esp.", price: 35990 },
    ],
  },

  // ──────────────────────────── SPOTIFY ──────────────────────────────────────

  {
    id: "sp-reproducciones-mundiales",
    category: "spotify",
    name: "Reproducciones Spotify",
    subtitle: "MUNDIALES",
    groupPopular: true,
    features: [
      "Aplicable sobre Canción / Todas las canciones / Álbum",
      "Entrega natural y progresiva (100-300 reps. diarias)",
      "Avances en 48hs",
    ],
    icon: <Headphones size={16} />,
    tiers: [
      { tierQty: "1.000",  price: 6000 },
      { tierQty: "2.500",  price: 11000, discount: "8% OFF" },
      { tierQty: "5.000",  price: 19000, discount: "11% OFF" },
      { tierQty: "10.000", price: 34000, discount: "18% OFF" },
      { tierQty: "25.000", price: 72000, discount: "22% OFF" },
      { tierQty: "50.000", price: 132000, discount: "27% OFF" },
    ],
  },
  {
    id: "sp-reproducciones-argentinas",
    category: "spotify",
    name: "Reproducciones Spotify",
    subtitle: "ARGENTINAS",
    features: [
      "Aplicable sobre Canción / Todas las canciones / Álbum",
      "Entrega natural y progresiva (1.000 reps. diarias)",
      "Avances en 48hs",
    ],
    icon: <Headphones size={16} />,
    tiers: [
      { tierQty: "1.000",  price: 12000 },
      { tierQty: "2.500",  price: 24500,  discount: "9% OFF" },
      { tierQty: "5.000",  price: 44500,  discount: "13% OFF" },
      { tierQty: "10.000", price: 82000,  discount: "18% OFF" },
      { tierQty: "25.000", price: 189500, discount: "24% OFF" },
      { tierQty: "50.000", price: 352000, discount: "29% OFF" },
    ],
  },
];

// ─── CART CONTEXT & HELPERS ───────────────────────────────────────────────────
type CartItem = { id: string; serviceName: string; tierQty: string; price: number; qty: number };

function getItemPriceInCurrency(item: CartItem, targetCurrency: Currency): number {
  for (const svc of SERVICE_GROUPS) {
    if (item.id.startsWith(svc.id + '-') || item.id === svc.id) {
      const tierIndex = svc.tiers.findIndex(t => t.tierQty === item.tierQty);
      if (tierIndex !== -1) {
        const tier = svc.tiers[tierIndex];
        const p = getPrice(svc.id, tierIndex, tier.price, targetCurrency);
        if (p > 0) return p;
      }
    }
  }
  return item.price;
}

type CartContextType = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  total: number;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  currency: Currency;
  setCurrency: (v: Currency) => void;
  activePlatform: string;
  selectPlatform: (platformId: string) => void;
  checkoutOpen: boolean;
  startCheckout: (directItem?: CartItem) => void;
  closeCheckout: () => void;
  checkoutItems: CartItem[];
  checkoutTotal: number;
};

const CartContext = createContext<CartContextType | null>(null);
function useCart() { return useContext(CartContext)!; }

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>("ARS");

  const add = (item: Omit<CartItem, "qty">) => {
    setItems(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setOpen(true);
  };

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const changeQty = (id: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const nq = i.qty + delta;
      return nq <= 0 ? null as unknown as CartItem : { ...i, qty: nq };
    }).filter(Boolean));
  };

  // Dynamically compute item prices in selected currency
  const displayItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      price: getItemPriceInCurrency(item, currency),
    }));
  }, [items, currency]);

  const total = displayItems.reduce((a, i) => a + i.price * i.qty, 0);
  const count = displayItems.reduce((a, i) => a + i.qty, 0);

  const [activePlatform, setActivePlatform] = useState<string>("instagram");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [directItem, setDirectItem] = useState<CartItem | null>(null);

  const selectPlatform = (platformId: string) => {
    setActivePlatform(platformId);
    setTimeout(() => {
      const el = document.getElementById("services-grid");
      if (el) {
        const headerOffset = 150;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 60);
  };

  const startCheckout = (singleItem?: CartItem) => {
    if (singleItem) {
      setDirectItem(singleItem);
    } else {
      setDirectItem(null);
    }
    setCheckoutOpen(true);
    setOpen(false);
  };

  const closeCheckout = () => {
    setCheckoutOpen(false);
    setDirectItem(null);
  };

  const checkoutItems = directItem ? [directItem] : displayItems;
  const checkoutTotal = directItem ? directItem.price * directItem.qty : total;

  return (
    <CartContext.Provider value={{
      items: displayItems, add, remove, changeQty, total, count, open, setOpen,
      currency, setCurrency, activePlatform, selectPlatform,
      checkoutOpen, startCheckout, closeCheckout, checkoutItems, checkoutTotal
    }}>
      {children}
      {checkoutOpen && <PaymentModal items={checkoutItems} total={checkoutTotal} onBack={closeCheckout} currency={currency} />}
    </CartContext.Provider>
  );
}

function buildWhatsAppMsg(items: CartItem[], total: number, currency: Currency, targetLink: string, contactInfo?: string) {
  const sym = CURRENCY_SYMBOLS[currency];
  const isArs = currency === "ARS";
  const ls = items.map(i => `• *${i.serviceName}* — ${i.tierQty} x${i.qty} = ${sym}${(i.price * i.qty).toLocaleString("es-AR")} ${currency}`);
  
  const lines = [
    "¡Hola! Quiero confirmar mi pedido en *Cyber Marketing Digital*:",
    "",
    "📋 *DETALLE DEL PEDIDO:*",
    ...ls,
    "",
    "🔗 *LINK / PERFIL DESTINO:*",
    targetLink && targetLink.trim() ? targetLink.trim() : "(A coordinar por chat)"
  ];

  if (contactInfo && contactInfo.trim()) {
    lines.push("", `👤 *CONTACTO:* ${contactInfo.trim()}`);
  }

  lines.push(
    "",
    `💰 *TOTAL: ${sym}${total.toLocaleString("es-AR")} ${currency}*`,
    "",
    isArs
      ? "✅ Ya realicé la transferencia bancaria. Te adjunto el comprobante por acá. ¡Muchas gracias!"
      : "🌎 Deseo coordinar el pago por este medio (Binance USDT, PayPal, tarjeta, etc.). ¡Muchas gracias!"
  );

  return lines.join("\n");
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:'10px 14px', borderRadius:12, background:'#f6f2ff', border:'1px solid rgba(141,44,255,.1)' }}>
      <div style={{ minWidth:0 }}>
        <p style={{ fontSize:10, color:'#9a92a8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', margin:0 }}>{label}</p>
        <p style={{ fontSize:13, color:'#121212', fontWeight:700, wordBreak:'break-all', margin:'2px 0 0' }}>{value}</p>
      </div>
      <button onClick={() => { navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(()=>setCopied(false),2000); }); }}
        style={{ flexShrink:0, width:32, height:32, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer', background: copied ? '#dcfce7' : 'rgba(118,40,240,.12)', color: copied ? '#16a34a' : '#7628f0' }}>
        {copied ? <CheckCircle2 size={14}/> : <Copy size={14}/>}
      </button>
    </div>
  );
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────
// Solo muestra opción de transferir para ARS. Para las demás divisas se coordina vía WhatsApp.
function PaymentModal({ items, total, onBack, currency }: { items:CartItem[]; total:number; onBack:()=>void; currency:Currency }) {
  const sym = CURRENCY_SYMBOLS[currency];
  const isArs = currency === "ARS";

  const [step, setStep] = useState<1 | 2>(1);
  const [targetLink, setTargetLink] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [linkError, setLinkError] = useState(false);

  const firstItem = items[0];
  const summaryTitle = items.length === 1 && firstItem
    ? `${firstItem.serviceName} (${firstItem.tierQty})`
    : `${items.length} servicios seleccionados`;

  const handleContinueToStep2 = () => {
    if (!targetLink.trim()) {
      setLinkError(true);
      return;
    }
    setLinkError(false);
    setStep(2);
  };

  const waMsg = buildWhatsAppMsg(items, total, currency, targetLink, contactInfo);
  const waUrl = getWhatsAppUrl(waMsg);

  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(18,0,61,.7)', backdropFilter:'blur(5px)', padding:'16px' }}>
      <motion.div initial={{ scale:0.95, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} transition={{ type:"spring", stiffness:340, damping:28 }}
        style={{ width:'100%', maxWidth:480, maxHeight:'92vh', display:'flex', flexDirection:'column', borderRadius:24, background:'#fff', overflow:'hidden', boxShadow:'0 24px 70px rgba(0,0,0,.35)', position:'relative' }}>
        
        {/* Modal Top Bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px 12px', borderBottom:'1px solid #f3edfc' }}>
          {step === 2 ? (
            <button onClick={() => setStep(1)} style={{ background:'none', border:'none', cursor:'pointer', color:'#7628f0', display:'flex', alignItems:'center', gap:4, fontWeight:700, fontSize:13 }}>
              <ChevronLeft size={18}/> Volver
            </button>
          ) : (
            <div style={{ width:24 }}/>
          )}

          {/* Stepper Progress Circles (1) --- (2) */}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:32, height:32, borderRadius:'50%',
              background: step === 1 ? 'linear-gradient(135deg,#7f1fff,#bf5bff)' : '#22c55e',
              color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:800, fontSize:13, boxShadow:'0 2px 8px rgba(0,0,0,.15)'
            }}>
              {step === 1 ? '1' : <CheckCircle2 size={16}/>}
            </div>

            <div style={{ width:36, height:3, borderRadius:2, background: step === 2 ? '#22c55e' : '#e5e7eb' }}/>

            <div style={{
              width:32, height:32, borderRadius:'50%',
              background: step === 2 ? 'linear-gradient(135deg,#7f1fff,#bf5bff)' : '#f3f4f6',
              color: step === 2 ? '#fff' : '#9ca3af', display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:800, fontSize:13, boxShadow: step === 2 ? '0 2px 8px rgba(127,31,255,.3)' : 'none'
            }}>
              2
            </div>
          </div>

          <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', display:'flex', padding:4 }}>
            <X size={20}/>
          </button>
        </div>

        {/* Product summary pill */}
        <div style={{ padding:'12px 24px 0', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:20, background:'#f8f6fc', border:'1px solid #ebdffd', fontSize:12, fontWeight:700, color:'#5b21b6' }}>
            <span>{summaryTitle}</span>
            <span style={{ color:'#9ca3af' }}>•</span>
            <span style={{ fontWeight:800, color:'#7628f0' }}>{sym}{total.toLocaleString("es-AR")} {currency}</span>
          </div>
        </div>

        {/* STEP 1: LINK & CONTACT INFO COLLECTION */}
        {step === 1 && (
          <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', padding:'20px 24px 24px', display:'flex', flexDirection:'column' }}>
            <div style={{ textAlign:'center', marginBottom:20 }}>
              <h2 style={{ fontSize:20, fontWeight:900, color:'#111827', margin:'0 0 6px', letterSpacing:'-0.5px' }}>
                ¿En qué publicación o perfil querés el servicio?
              </h2>
              <p style={{ fontSize:13, color:'#6b7280', margin:0, lineHeight:1.5 }}>
                Pegá el link directo de tu publicación, reel, video o el @usuario de tu perfil.
              </p>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:16, flex:1 }}>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:800, color:'#374151', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>
                  Link del contenido o @usuario <span style={{ color:'#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={targetLink}
                  onChange={(e) => {
                    setTargetLink(e.target.value);
                    if (linkError) setLinkError(false);
                  }}
                  placeholder="https://www.instagram.com/p/... o @tu_usuario"
                  style={{
                    width:'100%', boxSizing:'border-box', padding:'14px 16px', borderRadius:14,
                    border: linkError ? '2px solid #ef4444' : '1.5px solid #d1d5db',
                    fontSize:14, fontWeight:500, outline:'none', background:'#fafafa',
                    transition:'all 0.2s', color:'#111827'
                  }}
                />
                {linkError ? (
                  <p style={{ fontSize:11, color:'#ef4444', fontWeight:700, margin:'5px 0 0' }}>
                    ⚠️ Por favor pegá el link o usuario de destino para procesar tu orden.
                  </p>
                ) : (
                  <p style={{ fontSize:11, color:'#9ca3af', margin:'5px 0 0', lineHeight:1.4 }}>
                    Asegurate de que la cuenta sea pública. No solicitamos contraseñas.
                  </p>
                )}
              </div>

              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#4b5563', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>
                  Email o WhatsApp de contacto <span style={{ fontSize:11, color:'#9ca3af', textTransform:'none' }}>(opcional)</span>
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="tu@email.com o teléfono"
                  style={{
                    width:'100%', boxSizing:'border-box', padding:'14px 16px', borderRadius:14,
                    border:'1.5px solid #e5e7eb', fontSize:14, fontWeight:500, outline:'none',
                    background:'#fafafa', color:'#111827'
                  }}
                />
              </div>

              <div style={{ marginTop:'auto', paddingTop:16 }}>
                <button
                  type="button"
                  onClick={handleContinueToStep2}
                  style={{
                    width:'100%', padding:'16px', borderRadius:16, border:'none', cursor:'pointer',
                    fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:15, color:'#fff',
                    background:'linear-gradient(135deg,#7f1fff 0%,#9c34ff 55%,#bf5bff 100%)',
                    boxShadow:'0 8px 24px rgba(127,31,255,.35)', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    letterSpacing:'0.02em', transition:'transform 0.15s ease'
                  }}
                >
                  Continuar al Pago →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT & WHATSAPP CONFIRMATION */}
        {step === 2 && (
          <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', padding:'18px 24px 20px', display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ textAlign:'center' }}>
              <h2 style={{ fontSize:20, fontWeight:900, color:'#111827', margin:'0 0 4px', letterSpacing:'-0.5px' }}>
                {isArs ? "Elegí tu método de pago" : "Coordinar Pago Internacional"}
              </h2>
              <p style={{ fontSize:12, color:'#6b7280', margin:0 }}>
                {isArs ? "Pago 100% seguro por transferencia bancaria en pesos argentinos" : `Pago protegido y coordinado en ${currency}`}
              </p>
            </div>

            {/* Recipient summary badge */}
            <div style={{ background:'#fcfbff', border:'1px solid #e9d5ff', borderRadius:14, padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
              <div style={{ minWidth:0 }}>
                <span style={{ fontSize:10, fontWeight:800, color:'#7628f0', textTransform:'uppercase', letterSpacing:'0.06em' }}>DESTINO INGRESADO:</span>
                <p style={{ fontSize:13, fontWeight:700, color:'#111827', margin:'2px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {targetLink}
                </p>
              </div>
              <button onClick={() => setStep(1)} style={{ background:'none', border:'none', cursor:'pointer', color:'#7628f0', fontWeight:800, fontSize:11, padding:'4px 8px' }}>
                Editar
              </button>
            </div>

            {/* ARS Bank Transfer Card */}
            {isArs ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <div style={{ background:'#f9fafb', borderRadius:14, padding:'10px 14px', border:'1px solid #e5e7eb' }}>
                  <p style={{ fontSize:12, color:'#4b5563', margin:0, lineHeight:1.4 }}>
                    Transferí el total de <strong>${total.toLocaleString("es-AR")} ARS</strong> a nuestra cuenta oficial y hacé clic en el botón de abajo para enviar el comprobante por WhatsApp:
                  </p>
                </div>
                {PAYMENT_ARS.map(row => (
                  <CopyRow key={row.label} label={row.label} value={row.value}/>
                ))}
              </div>
            ) : (
              /* International Payment Guidance */
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <div style={{ background:'linear-gradient(135deg, #f6f2ff 0%, #ede9fe 100%)', border:'1.5px solid #c4b5fd', borderRadius:16, padding:'16px 18px', textAlign:'center' }}>
                  <div style={{ width:42, height:42, borderRadius:'50%', background:'#7c3aed', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', boxShadow:'0 4px 12px rgba(124,58,237,.3)' }}>
                    <Globe size={22} />
                  </div>
                  <h3 style={{ fontSize:15, fontWeight:800, color:'#5b21b6', margin:'0 0 4px' }}>
                    Pago Internacional ({currency})
                  </h3>
                  <p style={{ fontSize:12, color:'#4b5563', margin:0, lineHeight:1.5 }}>
                    Para compras fuera de Argentina coordinamos el pago directo por WhatsApp con métodos internacionales: <strong>Binance (USDT)</strong>, <strong>PayPal</strong> o <strong>tarjetas</strong>.
                  </p>
                </div>

                <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'12px 14px' }}>
                  <p style={{ fontSize:11, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', margin:'0 0 6px' }}>
                    Resumen del pedido
                  </p>
                  {items.map(item => (
                    <div key={item.id} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'3px 0' }}>
                      <span style={{ fontWeight:600, color:'#1f2937' }}>{item.serviceName} ({item.tierQty})</span>
                      <span style={{ fontWeight:700, color:'#7c3aed' }}>{sym}{(item.price * item.qty).toLocaleString("es-AR")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final CTA button to WhatsApp */}
            <div style={{ marginTop:'auto', paddingTop:10, display:'flex', flexDirection:'column', gap:8 }}>
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                style={{ width:'100%', padding:16, borderRadius:16, cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:15, color:'#fff', background:'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow:'0 6px 24px rgba(22,163,74,.35)', display:'flex', alignItems:'center', justifyContent:'center', gap:10, textDecoration:'none', boxSizing:'border-box' }}>
                <FaWhatsapp size={20}/> {isArs ? `PAGAR ${sym}${total.toLocaleString("es-AR")} ARS →` : `COORDINAR PAGO ${sym}${total.toLocaleString("es-AR")} ${currency} →`}
              </a>
              <p style={{ textAlign:'center', fontSize:11, color:'#9ca3af', margin:0 }}>
                Se abrirá WhatsApp con el link de tu perfil y el detalle del pedido listo para enviar.
              </p>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
// ─── CART DRAWER ──────────────────────────────────────────────────────────────
function CartDrawer() {
  const { items, remove, changeQty, total, open, setOpen, currency, startCheckout } = useCart();
  const sym = CURRENCY_SYMBOLS[currency];
  const isArs = currency === "ARS";

  return (
    <>
      <div onClick={()=>{setOpen(false);setShowPayment(false);}} style={{ position:'fixed', top:0, left:0, right:0, bottom:0, zIndex:60, background:'rgba(18,0,61,.5)', opacity:open?1:0, pointerEvents:open?'auto':'none', transition:'opacity 0.3s' }}/>
      <aside style={{ position:'fixed', right:0, top:0, height:'100dvh', width:'100%', maxWidth:420, zIndex:70, display:'flex', flexDirection:'column', background:'#fff', boxShadow:'-12px 0 50px rgba(118,40,240,.12)', transform:open?'translateX(0)':'translateX(100%)', transition:'transform 0.3s ease-out', WebkitTransform: open?'translateX(0)':'translateX(100%)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid #f3edfc' }}>
          <h2 style={{ fontSize:20, fontWeight:900, color:'#121212', margin:0 }}>Tu carrito</h2>
          <button onClick={()=>{setOpen(false);setShowPayment(false);}} style={{ background:'none', border:'none', cursor:'pointer', color:'#9a92a8', display:'flex' }}><X size={22}/></button>
        </div>
        {items.length===0 ? (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, color:'#9a92a8' }}>
            <ShoppingCart size={48} style={{ opacity:.3 }}/>
            <p style={{ fontWeight:600, fontSize:14, margin:0 }}>Tu carrito está vacío</p>
          </div>
        ) : (
          <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', padding:'16px 24px', display:'flex', flexDirection:'column', gap:12 }}>
            {items.map(item=>(
              <div key={item.id} style={{ display:'flex', alignItems:'center', gap:12, padding:14, borderRadius:16, background:'#fcfbff', border:'1px solid rgba(141,44,255,.08)' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, fontSize:13, color:'#121212', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.serviceName}</p>
                  <p style={{ fontWeight:500, fontSize:12, color:'#9a92a8', margin:'2px 0' }}>{item.tierQty}</p>
                  <p style={{ fontWeight:800, fontSize:14, color:'#7628f0', margin:0 }}>{sym}{(item.price*item.qty).toLocaleString("es-AR")} {currency}</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:4, background:'#f6f2ff', borderRadius:12, padding:'4px 6px' }}>
                  <button onClick={()=>changeQty(item.id,-1)} style={{ width:28, height:28, borderRadius:8, border:'1px solid rgba(141,44,255,.15)', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#7628f0' }}><Minus size={12}/></button>
                  <span style={{ fontWeight:800, color:'#121212', fontSize:14, width:22, textAlign:'center' }}>{item.qty}</span>
                  <button onClick={()=>changeQty(item.id,1)} style={{ width:28, height:28, borderRadius:8, border:'1px solid rgba(141,44,255,.15)', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#7628f0' }}><Plus size={12}/></button>
                  <div style={{ width:1, height:20, background:'rgba(141,44,255,.15)', margin:'0 2px' }}/>
                  <button onClick={()=>remove(item.id)} style={{ width:28, height:28, borderRadius:8, border:'none', background:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#9a92a8' }}><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ padding:'20px 24px calc(20px + env(safe-area-inset-bottom, 0px))', borderTop:'1px solid #f3edfc', display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontWeight:600, color:'#9a92a8', fontSize:13 }}>Total ({currency})</span>
            <span style={{ fontWeight:900, color:'#121212', fontSize:24 }}>{sym}{total.toLocaleString("es-AR")} {currency}</span>
          </div>
          <button onClick={()=>{if(items.length>0)startCheckout();}} disabled={items.length===0}
            style={{ width:'100%', padding:16, borderRadius:16, border:'none', cursor:items.length>0?'pointer':'not-allowed', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:15, color:'#fff', background: isArs ? 'linear-gradient(135deg,#7f1fff 0%,#9c34ff 55%,#bf5bff 100%)' : 'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow: isArs ? '0 6px 24px rgba(118,40,240,.35)' : '0 6px 24px rgba(34,197,94,.35)', opacity:items.length===0?.4:1, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            {isArs ? <><Banknote size={20}/> PAGAR / TRANSFERIR</> : <><FaWhatsapp size={20}/> COORDINAR PAGO EN WHATSAPP</>}
          </button>
        </div>
      </aside>

    </>
  );
}

function CurrencySelector() {
  const { currency, setCurrency } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position:'relative' }}>
      <button onClick={()=>setOpen(!open)}
        style={{
          display:'flex', alignItems:'center', gap:6,
          padding:'8px 14px', borderRadius:30,
          background:'linear-gradient(135deg,#7f1fff,#a855f7)',
          border:'none', cursor:'pointer',
          fontFamily:'Poppins,sans-serif', fontWeight:800,
          fontSize:13, color:'#fff',
          boxShadow:'0 2px 12px rgba(168,85,247,0.45)',
          letterSpacing:'0.04em'
        }}>
        <Globe size={14}/>
        {currency}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, background:'#1a0035', borderRadius:14, boxShadow:'0 8px 40px rgba(118,40,240,.4)', border:'1px solid rgba(168,85,247,.3)', padding:6, zIndex:100, minWidth:160 }}>
          {CURRENCY_LIST.map(c=>(
            <button key={c.code} onClick={()=>{setCurrency(c.code);setOpen(false);}}
              style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'8px 12px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:12, textAlign:'left', background: currency===c.code ? 'linear-gradient(135deg,#7f1fff,#9c34ff)' : 'transparent', color: currency===c.code ? '#fff' : 'rgba(255,255,255,0.85)', transition:'background 0.15s' }}>
              <span>{c.flag}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
const SERVICE_SHORTCUTS = [
  { label:'Instagram', icon: <Instagram size={18} strokeWidth={2} />, platform: 'instagram' },
  { label:'TikTok', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>, platform: 'tiktok' },
  { label:'Facebook', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>, platform: 'facebook' },
  { label:'Youtube', icon: <Youtube size={18} strokeWidth={2} />, platform: 'youtube' },
  { label:'Spotify', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 11.973c2.5-1.473 5.5-.973 7.5.527"></path><path d="M9 15c1.5-1 4-1 5 .5"></path><path d="M7 9c3-2 7-2 9 0"></path></svg>, platform: 'spotify' },
];

function Header() {
  const { count, setOpen, activePlatform, selectPlatform } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:50 }}>
      {/* Announcement bar: WhatsApp change notice */}
      <div style={{ background:'linear-gradient(266deg,#111b21 0%,#1f2c34 100%)', color:'#fff', padding:'8px 24px', display:'flex', alignItems:'center', justifyContent:'center', gap:12, fontSize:12, fontWeight:700, borderBottom:'1px solid rgba(37,211,102,0.3)', flexWrap:'wrap', textAlign:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <FaWhatsapp color="#25d366" size={16}/>
          <span style={{ color:'#25d366', fontWeight:800 }}>¡NUEVO WHATSAPP OFICIAL!</span>
        </div>
        <span style={{ color:'rgba(255,255,255,0.9)' }}>Cambiamos nuestra línea de atención:</span>
        <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" style={{ color:'#fff', background:'#25d366', padding:'2px 10px', borderRadius:20, textDecoration:'none', fontWeight:800, fontSize:11 }}>
          CHATEAR AHORA »
        </a>
      </div>

      {/* Main dark header */}
      <header style={{ background:'#0a0015', borderBottom:'1px solid rgba(156,52,255,0.2)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'8px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
          {/* Left: Logo + Brand name */}
          <a href="#home" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
            <img src="/neon-logo.jpg" alt="Cyber Digital" style={{ height: 60, width: 60, objectFit: 'cover', borderRadius: '50%' }} className="header-logo" />
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight:900, fontSize:18, color:'#fff', letterSpacing:'-0.5px' }}>CYBER</div>
              <div style={{ fontWeight:700, fontSize:10, color:'#a855f7', letterSpacing:'0.12em', textTransform:'uppercase' }}>MARKETING DIGITAL</div>
            </div>
          </a>

          {/* Desktop: nav + icons */}
          <div className="desktop-nav" style={{ display:'flex', alignItems:'center', gap:20 }}>
            <nav style={{ display:'flex', alignItems:'center', gap:20 }}>
              <a href="#home" style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.85)', textDecoration:'none' }}>Inicio</a>
              <a href="#catalogo" style={{ fontSize:13, fontWeight:700, color:'#c084fc', textDecoration:'none' }}>Catálogo y Precios</a>
              <a href="#como-funciona" style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.85)', textDecoration:'none' }}>¿Cómo funciona?</a>
              <a href="#faq" style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.85)', textDecoration:'none' }}>Preguntas Frecuentes</a>
            </nav>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <CurrencySelector/>
              <button onClick={()=>setOpen(true)} style={{ position:'relative', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.85)', display:'flex', padding:2 }}>
                <ShoppingCart size={20}/>
                {count>0 && <span style={{ position:'absolute', top:-5, right:-5, width:18, height:18, borderRadius:'50%', background:'linear-gradient(135deg,#7f1fff,#9c34ff)', color:'#fff', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #0a0015' }}>{count}</span>}
              </button>
            </div>
          </div>

          {/* Mobile: icons + hamburger */}
          <div className="mobile-nav" style={{ display:'none', alignItems:'center', gap:10 }}>
            <CurrencySelector/>
            <button onClick={()=>setOpen(true)} style={{ position:'relative', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.85)', display:'flex', padding:2 }}>
              <ShoppingCart size={20}/>
              {count>0 && <span style={{ position:'absolute', top:-5, right:-5, width:18, height:18, borderRadius:'50%', background:'linear-gradient(135deg,#7f1fff,#9c34ff)', color:'#fff', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #0a0015' }}>{count}</span>}
            </button>
            <button onClick={()=>setMobileOpen(!mobileOpen)} style={{ background:'none', border:'1px solid rgba(168,85,247,.4)', borderRadius:8, cursor:'pointer', color:'#fff', padding:'6px 8px', display:'flex', flexDirection:'column', gap:4 }}>
              <span style={{ display:'block', width:20, height:2, background:'#fff', borderRadius:2 }}></span>
              <span style={{ display:'block', width:20, height:2, background:'#fff', borderRadius:2 }}></span>
              <span style={{ display:'block', width:14, height:2, background:'#a855f7', borderRadius:2 }}></span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div style={{ background:'#0d0025', borderTop:'1px solid rgba(168,85,247,.2)', padding:'12px 20px 20px' }}>
            <a href="#home" onClick={()=>setMobileOpen(false)} style={{ display:'block', padding:'12px 0', fontSize:15, fontWeight:600, color:'rgba(255,255,255,0.9)', textDecoration:'none', borderBottom:'1px solid rgba(255,255,255,.06)' }}>Inicio</a>
            <a href="#catalogo" onClick={()=>setMobileOpen(false)} style={{ display:'block', padding:'12px 0', fontSize:15, fontWeight:700, color:'#c084fc', textDecoration:'none', borderBottom:'1px solid rgba(255,255,255,.06)' }}>Catálogo y Precios</a>
            <a href="#como-funciona" onClick={()=>setMobileOpen(false)} style={{ display:'block', padding:'12px 0', fontSize:15, fontWeight:600, color:'rgba(255,255,255,0.9)', textDecoration:'none', borderBottom:'1px solid rgba(255,255,255,.06)' }}>¿Cómo funciona?</a>
            <a href="#faq" onClick={()=>setMobileOpen(false)} style={{ display:'block', padding:'12px 0', fontSize:15, fontWeight:600, color:'rgba(255,255,255,0.9)', textDecoration:'none', borderBottom:'1px solid rgba(255,255,255,.06)' }}>Preguntas Frecuentes</a>
          </div>
        )}
      </header>

      {/* Purple sub-nav with service shortcuts */}
      <div style={{ background:'linear-gradient(135deg,#7628f0 0%,#9c34ff 100%)', overflowX:'auto', scrollbarWidth:'none' }}>
        <div style={{ display:'flex', gap:0, padding:'0 16px', maxWidth:1200, margin:'0 auto', width:'max-content', height: 42 }}>
          {SERVICE_SHORTCUTS.map((s,i)=>{
            const isActive = activePlatform === s.platform;
            return (
              <a
                key={i}
                href="#services-grid"
                onClick={(e)=>{
                  e.preventDefault();
                  selectPlatform(s.platform);
                }}
                style={{
                  display:'flex',
                  alignItems:'center',
                  gap:6,
                  padding:'0 16px',
                  color: isActive ? '#fff' : 'rgba(255,255,255,.85)',
                  background: isActive ? 'rgba(255,255,255,0.22)' : 'transparent',
                  textDecoration:'none',
                  borderRight: i === SERVICE_SHORTCUTS.length - 1 ? 'none' : '1px solid rgba(255,255,255,.15)',
                  whiteSpace:'nowrap',
                  cursor:'pointer',
                  transition:'all 0.2s',
                  fontWeight: isActive ? 800 : 600,
                  boxShadow: isActive ? 'inset 0 -3px 0 #fff' : 'none',
                }}
              >
                {s.icon && <span style={{ display:'flex', alignItems:'center', opacity: isActive ? 1 : 0.85 }}>{s.icon}</span>}
                <span style={{ fontSize:12 }}>{s.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Global responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
        @media (max-width: 600px) {
          #home { padding-top: 150px !important; padding-bottom: 50px !important; }
          .hero-card { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { selectPlatform } = useCart();
  useEffect(() => {
    gsap.fromTo('.header-logo',
      { opacity: 0, scale: 0.7, filter: 'brightness(0)' },
      { opacity: 1, scale: 1, filter: 'brightness(1)', duration: 1.2, ease: 'back.out(1.5)' }
    );
    gsap.to('.header-logo', {
      filter: 'drop-shadow(0 0 18px rgba(156,52,255,0.9)) drop-shadow(0 0 40px rgba(80,100,255,0.6)) brightness(1.05)',
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.2
    });
    gsap.fromTo('.hero-title-anim', 
      { opacity: 0, y: 50, scale: 0.9 }, 
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)', stagger: 0.1 }
    );
    gsap.fromTo('.hero-subtitle-anim',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power3.out' }
    );
    gsap.fromTo('.hero-buttons-anim',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 0.6, ease: 'elastic.out(1, 0.5)' }
    );
    gsap.to('.hero-shape-anim', {
      y: 'random(-20, 20)',
      rotation: 'random(-15, 15)',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.2
    });
  }, []);

  return (
    <section id="home" style={{
      paddingTop:130, paddingBottom:80, position:'relative', overflow:'hidden',
      background:`radial-gradient(circle at 15% 18%, rgba(141,44,255,.18), transparent 32%), radial-gradient(circle at 85% 78%, rgba(176,82,255,.14), transparent 28%), linear-gradient(135deg, #18003d 0%, #2a0066 36%, #3a008c 72%, #4b0fb0 100%)`
    }}>
      {[
        { left:40, top:'30%', size:70, rotate:15 },
        { left:80, top:'60%', size:40, rotate:-10 },
        { right:120, top:'20%', size:55, rotate:20 },
      ].map((s,i)=>(
        <div key={i} className="hero-shape-anim" style={{ position:'absolute', left:s.left, right:s.right, top:s.top, width:s.size, height:s.size, border:'4px solid rgba(255,255,255,0.06)', borderRadius:14, transform:`rotate(${s.rotate}deg)`, pointerEvents:'none' }}/>
      ))}

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', gap:60, flexWrap:'wrap' }}>
        <div style={{ flex:'1 1 460px', maxWidth:580 }}>
          <div className="hero-subtitle-anim">
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:20, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', marginBottom:28 }}>
              <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.9)', letterSpacing:'0.06em', textTransform:'uppercase' }}>AR</span>
              <span style={{ fontSize:11, fontWeight:700, color:'#fff' }}>Sitio #1 en Crecimiento Digital</span>
            </div>
            <h1 className="hero-title-anim" style={{ fontWeight:900, fontSize:'clamp(40px,5.5vw,70px)', lineHeight:1.05, color:'#fff', margin:'0 0 24px', letterSpacing:'-2px' }}>
              Marketing fácil <br/> <span style={{ color:'transparent', WebkitTextStroke:'1px rgba(255,255,255,.9)' }}>para vender</span><br/>mejor.
            </h1>
            <p className="hero-subtitle-anim" style={{ fontSize:17, color:'rgba(255,255,255,.75)', lineHeight:1.6, margin:'0 0 36px', fontWeight:500, maxWidth:480 }}>
              Impulsá tus redes con seguidores, likes y reproducciones de calidad. Resultados rápidos, seguros y transparentes.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:32 }}>
              {[['🤖','Automático con IA'],['🔒','100% Seguro'],['🚫','Sin contraseña'],['⚡','Entrega inmediata']].map(([icon,label])=>(
                <span key={label as string} style={{ padding:'7px 14px', borderRadius:20, background:'rgba(0,0,0,.25)', border:'1px solid rgba(255,255,255,.2)', color:'#fff', fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
                  {icon} {label}
                </span>
              ))}
            </div>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              <a href="#services-grid" onClick={(e)=>{ e.preventDefault(); selectPlatform('instagram'); }} style={{ display:'inline-flex', alignItems:'center', padding:'16px 32px', borderRadius:14, textDecoration:'none', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:14, color:'#fff', letterSpacing:'0.05em', textTransform:'uppercase', background:'linear-gradient(135deg,#7f1fff 0%,#9c34ff 55%,#bf5bff 100%)', boxShadow:'0 8px 30px rgba(127,31,255,.45)', cursor:'pointer' }}>
                VER PRECIOS Y SERVICIOS
              </a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'16px 26px', borderRadius:14, textDecoration:'none', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, color:'#fff', background:'rgba(37,211,102,0.2)', border:'1.5px solid #25d366', boxShadow:'0 4px 20px rgba(37,211,102,.25)' }}>
                <FaWhatsapp size={18} color="#25d366"/> WhatsApp Oficial
              </a>
            </div>
          </div>
        </div>

        {/* Right: profile card */}
        <div style={{ flex:'1 1 320px', maxWidth:400, position:'relative' }}>
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.8 }}
            style={{ background:'rgba(255,255,255,.95)', borderRadius:24, padding:28, boxShadow:'0 24px 80px rgba(18,0,61,.35)', position:'relative', zIndex:2 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
              <div style={{ width:50, height:50, borderRadius:'50%', background:'linear-gradient(135deg,#7f1fff,#bf5bff)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Users size={24} color="#fff"/>
              </div>
              <div>
                <p style={{ fontWeight:800, fontSize:14, color:'#121212', margin:0 }}>tu perfil con</p>
                <p style={{ fontWeight:900, fontSize:17, color:'#121212', margin:0 }}>CyberMarketing</p>
                <p style={{ fontWeight:500, fontSize:12, color:'#9a92a8', margin:'2px 0 0' }}>@tu perfil</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginBottom:18 }}>
              {[{n:'53',l:'posts',hi:false},{n:'20.000',l:'seguidores',hi:true},{n:'391',l:'seguidos',hi:false}].map(stat=>(
                <div key={stat.l} style={{ flex:1, textAlign:'center', padding:'12px 6px', borderRadius:14, background: stat.hi?'rgba(118,40,240,.08)':'#f6f2ff', border: stat.hi?'1.5px solid rgba(118,40,240,.2)':'1.5px solid transparent' }}>
                  <p style={{ fontWeight:900, fontSize:16, color: stat.hi?'#7628f0':'#121212', margin:0 }}>{stat.n}</p>
                  <p style={{ fontWeight:600, fontSize:9, color: stat.hi?'#7628f0':'#9a92a8', margin:'2px 0 0', textTransform:'uppercase', letterSpacing:'0.06em' }}>{stat.l}</p>
                </div>
              ))}
            </div>
            <div style={{ background:'linear-gradient(135deg,#f6f2ff,#eee7ff)', borderRadius:14, padding:'12px 16px', textAlign:'center', border:'1px solid rgba(118,40,240,.1)' }}>
              <p style={{ fontSize:9, fontWeight:700, color:'#9a92a8', textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 4px' }}>VALIDACIÓN INTELIGENTE</p>
              <p style={{ fontWeight:900, fontSize:14, color:'#7628f0', margin:0, lineHeight:1.3 }}>Entrega garantizada<br/>sin riesgo para tu cuenta</p>
            </div>
          </motion.div>
          <motion.div animate={{ y:[0,-10,0] }} transition={{ repeat:Infinity, duration:4, ease:'easeInOut' }}
            style={{ position:'absolute', top:-18, right:-10, background:'#fff', borderRadius:50, padding:'8px 16px', boxShadow:'0 8px 30px rgba(18,0,61,.18)', display:'flex', alignItems:'center', gap:8, zIndex:3, border:'1px solid rgba(141,44,255,.08)' }}>
            <span style={{ fontSize:14 }}>💜</span><span style={{ fontWeight:700, fontSize:12, color:'#121212' }}>Perfil más sólido</span>
          </motion.div>
          <motion.div animate={{ y:[0,10,0] }} transition={{ repeat:Infinity, duration:5, ease:'easeInOut', delay:1.5 }}
            style={{ position:'absolute', bottom:-14, left:-10, background:'#fff', borderRadius:50, padding:'8px 16px', boxShadow:'0 8px 30px rgba(18,0,61,.18)', display:'flex', alignItems:'center', gap:8, zIndex:3, border:'1px solid rgba(141,44,255,.08)' }}>
            <span style={{ fontSize:14 }}>🏆</span><span style={{ fontWeight:700, fontSize:12, color:'#121212' }}>Autoridad en tu nicho</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────
function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const num1Ref = useRef<HTMLParagraphElement>(null);
  const num2Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const obj1 = { val: 0 };
        const obj2 = { val: 0 };
        
        gsap.to(obj1, {
          val: 248731,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            if (num1Ref.current) num1Ref.current.innerText = '+' + Math.floor(obj1.val).toLocaleString('es-AR');
          }
        });
        
        gsap.to(obj2, {
          val: 49286,
          duration: 2,
          ease: "power2.out",
          delay: 0.2,
          onUpdate: () => {
            if (num2Ref.current) num2Ref.current.innerText = '+' + Math.floor(obj2.val).toLocaleString('es-AR');
          }
        });
        
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ background:'#fff', padding:'32px 24px', borderBottom:'1px solid #ececec' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', justifyContent:'center', gap:'clamp(40px,8vw,120px)', flexWrap:'wrap' }}>
        <div style={{ textAlign:'center' }}>
          <p ref={num1Ref} style={{ fontWeight:900, fontSize:'clamp(28px,4vw,48px)', color:'#121212', margin:0, letterSpacing:'-1px' }}>+0</p>
          <p style={{ fontWeight:600, fontSize:11, color:'#9a92a8', margin:'6px 0 0', letterSpacing:'0.1em', textTransform:'uppercase' }}>ÓRDENES COMPLETADAS</p>
        </div>
        <div style={{ textAlign:'center' }}>
          <p ref={num2Ref} style={{ fontWeight:900, fontSize:'clamp(28px,4vw,48px)', color:'#121212', margin:0, letterSpacing:'-1px' }}>+0</p>
          <p style={{ fontWeight:600, fontSize:11, color:'#9a92a8', margin:'6px 0 0', letterSpacing:'0.1em', textTransform:'uppercase' }}>CLIENTES SATISFECHOS</p>
        </div>
      </div>
    </div>
  );
}

// ─── AVISO DE CAMBIO DE WHATSAPP ──────────────────────────────────────────────
function WhatsAppNoticeBanner() {
  return (
    <section style={{ maxWidth: 1200, margin: '28px auto 10px', padding: '0 24px' }}>
      <motion.div initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        style={{
          background: 'linear-gradient(135deg, #0b141a 0%, #111b21 50%, #1f2c34 100%)',
          border: '1.5px solid #25d366',
          borderRadius: 22,
          padding: '22px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
          boxShadow: '0 12px 36px rgba(37, 211, 102, 0.18)',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '1 1 500px' }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: '#25d366',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 24px rgba(37,211,102,0.6)',
          }}>
            <FaWhatsapp size={30} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{
                background: '#25d366',
                color: '#0b141a',
                fontWeight: 900,
                fontSize: 10,
                padding: '3px 10px',
                borderRadius: 20,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                COMUNICADO OFICIAL
              </span>
              <h4 style={{ margin: 0, color: '#fff', fontWeight: 900, fontSize: 17, letterSpacing: '-0.3px' }}>
                ¡Cambiamos nuestro número de WhatsApp!
              </h4>
            </div>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 1.5, fontWeight: 500 }}>
              Para brindarte una atención más rápida, profesional y directa, toda la comunicación y confirmación de pedidos se gestiona desde nuestro nuevo enlace oficial.
            </p>
          </div>
        </div>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'linear-gradient(135deg, #25d366 0%, #1eb954 100%)',
            color: '#0b141a',
            fontWeight: 900,
            fontSize: 14,
            padding: '13px 26px',
            borderRadius: 14,
            textDecoration: 'none',
            boxShadow: '0 6px 20px rgba(37,211,102,0.45)',
            whiteSpace: 'nowrap',
            transition: 'transform 0.15s ease',
          }}
        >
          <FaWhatsapp size={18} /> Chatear al Nuevo WhatsApp
        </a>
      </motion.div>
    </section>
  );
}

// ─── CATALOG (platform cards + service tiers) ─────────────────────────────────
const PLATFORM_CARDS = [
  { id:'instagram', label:'INSTAGRAM', icon:'/instagram-3d.png', available:true },
  { id:'tiktok',    label:'TIKTOK',    icon:'/tiktok-3d.png', available:true },
  { id:'facebook',  label:'FACEBOOK',  icon:'/facebook-3d.png', available:true },
  { id:'youtube',   label:'YOUTUBE',   icon:'/youtube-3d.png', available:true },
  { id:'google',    label:'GOOGLE REVIEWS', icon:'/google-reviews-3d.png', available:false },
  { id:'ingresos',  label:'GENERÁ INGRESOS', icon:'/genera-ingresos-3d.png', available:false },
];

function ServiceTierView({ service }: { service: ServiceGroup }) {
  const { add, currency, startCheckout } = useCart();
  const [addedTier, setAddedTier] = useState<string|null>(null);
  
  const handleAdd = (tier: ServiceTier, price: number) => {
    const name = service.subtitle ? `${service.name} — ${service.subtitle}` : service.name;
    add({ id:`${service.id}-${tier.tierQty}`, serviceName:name, tierQty:tier.tierQty, price });
    setAddedTier(tier.tierQty);
    setTimeout(()=>setAddedTier(null), 1500);
  };

  const name = service.subtitle ? `${service.name} (${service.subtitle})` : service.name;

  return (
    <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:'1px solid rgba(141,44,255,.08)', boxShadow:'0 4px 20px rgba(118,40,240,.07)', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'20px 20px 14px', textAlign:'center', borderBottom:'1px solid rgba(141,44,255,.06)', background:'linear-gradient(180deg, #fdfcff 0%, #fff 100%)' }}>
        <div style={{ fontSize:30, marginBottom:8 }}>{service.icon}</div>
        <h3 style={{ fontWeight:900, fontSize:17, color:'#121212', margin:0 }}>{service.name}</h3>
        {service.subtitle && <p style={{ fontWeight:700, fontSize:10, color:'#7628f0', margin:'4px 0 0', textTransform:'uppercase', letterSpacing:'0.08em' }}>{service.subtitle}</p>}
      </div>
      
      {/* Features preview */}
      {service.features && service.features.length > 0 && (
        <div style={{ padding:'10px 16px', background:'#faf9fd', borderBottom:'1px solid rgba(141,44,255,.04)' }}>
          {service.features.map((f, idx) => (
            <div key={idx} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#6d6282', lineHeight:1.4, margin:'2px 0' }}>
              <span style={{ color:'#7628f0', fontWeight:800 }}>✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding:14, display:'flex', flexDirection:'column', gap:8, flex:1 }}>
        {service.tiers.map((tier,i)=>{
          const price = getPrice(service.id, i, tier.price, currency);
          const quickWaText = `¡Hola! Quiero pedir el servicio:\n• ${name} — Cantidad: ${tier.tierQty}\n• Precio: ${CURRENCY_SYMBOLS[currency]}${price.toLocaleString("es-AR")} ${currency}`;
          const quickWaUrl = getWhatsAppUrl(quickWaText);

          return (
            <div key={tier.tierQty} style={{
              display:'flex', alignItems:'center', justifyContent:'space-between', gap:8,
              padding:'10px 12px', borderRadius:12,
              background: tier.popular ? '#fcf9ff' : '#f9fafb',
              border: tier.popular ? '1.5px solid #d8b4fe' : '1px solid #f0f0f4',
              transition:'all 0.15s'
            }}>
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontWeight:800, fontSize:15, color:'#121212' }}>{tier.tierQty}</span>
                  {tier.popular && <span style={{ fontSize:9, fontWeight:800, padding:'2px 6px', borderRadius:6, background:'#fae8ff', color:'#a855f7', textTransform:'uppercase' }}>Popular</span>}
                  {tier.label && !tier.popular && <span style={{ fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:6, background:'#f3f4f6', color:'#4b5563', textTransform:'uppercase' }}>{tier.label}</span>}
                  {tier.discount && <span style={{ fontSize:9, fontWeight:800, padding:'2px 6px', borderRadius:6, background:'#fee2e2', color:'#dc2626', textTransform:'uppercase' }}>{tier.discount}</span>}
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                <span style={{ fontWeight:900, fontSize:15, color:'#7628f0', letterSpacing:'-0.3px' }}>
                  {CURRENCY_SYMBOLS[currency]}{price.toLocaleString("es-AR")}
                </span>
                
                {/* Direct WhatsApp request button */}
                <button type="button" onClick={() => startCheckout({ id:`${service.id}-${tier.tierQty}`, serviceName:name, tierQty:tier.tierQty, price, qty:1 })} title="Pedir por WhatsApp"
                  style={{ width:34, height:34, borderRadius:10, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', background:'#22c55e', color:'#fff', boxShadow:'0 3px 10px rgba(34,197,94,.3)', transition:'transform 0.15s' }}>
                  <FaWhatsapp size={16}/>
                </button>

                {/* Add to cart button */}
                <button onClick={()=>handleAdd(tier, price)} title="Agregar al carrito"
                  style={{ width:34, height:34, borderRadius:10, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s', background: addedTier===tier.tierQty?'#22c55e':'linear-gradient(135deg,#7f1fff,#bf5bff)', color:'#fff', boxShadow: addedTier===tier.tierQty?'0 4px 12px rgba(34,197,94,.35)':'0 4px 12px rgba(127,31,255,.3)' }}>
                  {addedTier===tier.tierQty ? <CheckCircle2 size={16}/> : <Plus size={16}/>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Catalog() {
  const { currency, setCurrency, activePlatform, selectPlatform } = useCart();

  const filteredServices = SERVICE_GROUPS.filter(s => s.category === activePlatform);

  const platforms = [
    { id: 'instagram', label: 'Instagram', icon: <Instagram size={17} /> },
    { id: 'tiktok',    label: 'TikTok',    icon: <FaTiktok size={15} /> },
    { id: 'facebook',  label: 'Facebook',  icon: <FaFacebook size={16} /> },
    { id: 'youtube',   label: 'YouTube',   icon: <Youtube size={17} /> },
    { id: 'spotify',   label: 'Spotify',   icon: <FaSpotify size={16} /> },
  ];

  return (
    <section id="catalogo" style={{ background:'linear-gradient(180deg,#f9fafb 0%,#f3f3f6 100%)', padding:'40px 0 60px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>

        {/* Section title */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <motion.div initial={{ opacity:0, y:15 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <div style={{ display:'inline-block', padding:'5px 18px', borderRadius:20, background:'rgba(118,40,240,.1)', border:'1px solid rgba(118,40,240,.15)', marginBottom:12 }}>
              <span style={{ fontWeight:700, fontSize:11, color:'#7628f0', textTransform:'uppercase', letterSpacing:'0.1em' }}>CATÁLOGO Y PRECIOS</span>
            </div>
            <h2 style={{ fontWeight:900, fontSize:'clamp(26px,3.5vw,44px)', color:'#121212', margin:'0 0 10px', letterSpacing:'-1px' }}>
              Servicios Disponibles y Precios
            </h2>
            <p style={{ fontSize:15, color:'#6d6282', margin:0, fontWeight:500, maxWidth:580, marginLeft:'auto', marginRight:'auto' }}>
              Accedé a precios transparentes y actualizados en tu moneda local. Hacé tu pedido por la web o directo por WhatsApp.
            </p>
          </motion.div>
        </div>

        {/* Fast Currency Selector Bar */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '18px 22px',
          boxShadow: '0 4px 24px rgba(118,40,240,.06)',
          border: '1px solid rgba(141,44,255,.1)',
          marginBottom: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#4b5563' }}>
            <Globe size={16} color="#7628f0" />
            <span>Seleccioná tu moneda para calcular los precios automáticamente:</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            {CURRENCY_LIST.map(c => {
              const isSelected = currency === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 24,
                    border: isSelected ? '1.5px solid #7628f0' : '1px solid #e5e7eb',
                    background: isSelected ? 'linear-gradient(135deg,#7f1fff,#9c34ff)' : '#f9fafb',
                    color: isSelected ? '#fff' : '#1f2937',
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: isSelected ? '0 4px 14px rgba(118,40,240,.35)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{c.flag}</span>
                  <span>{c.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Platform Tabs Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 28,
        }}>
          {platforms.map(p => {
            const isActive = activePlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 22px',
                  borderRadius: 14,
                  border: isActive ? '2px solid #7628f0' : '1px solid rgba(0,0,0,0.06)',
                  background: isActive ? '#fff' : '#f0eef6',
                  color: isActive ? '#7628f0' : '#4b5563',
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: isActive ? '0 8px 24px rgba(118,40,240,.18)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Platform visual 3D cards row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:14, marginBottom: 36 }}>
          {PLATFORM_CARDS.map((p) => {
            const isActive = activePlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  if (p.available) setActivePlatform(p.id);
                }}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '18px 14px',
                  border: isActive ? '2px solid #7628f0' : '1px solid rgba(141,44,255,.08)',
                  boxShadow: isActive ? '0 8px 24px rgba(118,40,240,.2)' : '0 2px 10px rgba(0,0,0,.03)',
                  cursor: p.available ? 'pointer' : 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  opacity: p.available ? 1 : 0.6,
                  transition: 'all 0.2s',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                <img src={p.icon} alt={p.label} style={{ width: 56, height: 56, objectFit: 'contain' }} />
                <span style={{ fontWeight: 800, fontSize: 13, color: '#121212' }}>{p.label}</span>
                {p.available ? (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: isActive ? '#7628f0' : '#9a92a8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>
                    {isActive ? '● Seleccionado' : 'Ver servicios'}
                  </span>
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#9a92a8' }}>Próximamente</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Services Grid (Always visible for activePlatform!) */}
        <div id="services-grid" style={{ scrollMarginTop: 160 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <h3 style={{ fontWeight: 900, fontSize: 22, color: '#121212', margin: 0 }}>
              Servicios de {PLATFORM_CARDS.find(p => p.id === activePlatform)?.label || activePlatform.toUpperCase()}
            </h3>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#7628f0', background: '#f6f2ff', padding: '6px 14px', borderRadius: 20 }}>
              Precios en {currency} ({CURRENCY_SYMBOLS[currency]})
            </span>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(290px, 1fr))', gap:20 }}>
            {filteredServices.map(s => <ServiceTierView key={s.id} service={s}/>)}
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── BENEFITS (Prueba Social) ─────────────────────────────────────────────────
function Benefits() {
  const benefits = [
    { icon:'⚡', title:'Primera impresión sólida', desc:'Un perfil con buenos números transmite más actividad, presencia y autoridad.' },
    { icon:'🛡️', title:'Más confianza', desc:'La prueba social ayuda a que una persona nueva perciba tu perfil con más respaldo.' },
    { icon:'📊', title:'Apoyo para tus anuncios', desc:'Si invertís en publicidad, tu perfil no debería verse vacío cuando hacen clic.' },
    { icon:'💎', title:'Más coherencia', desc:'Una presencia consistente genera reconocimiento y posicionamiento de marca.' },
    { icon:'🤖', title:'Automático y rápido', desc:'El sistema detecta y procesa tu pedido de forma automatizada, sin demoras.' },
    { icon:'🔒', title:'Compra más segura', desc:'Nunca pedimos contraseñas. Solo el link o nombre de usuario de tu perfil.' },
  ];
  return (
    <section style={{
      padding:'80px 24px',
      background:`radial-gradient(circle at 15% 18%, rgba(141,44,255,.18), transparent 32%), radial-gradient(circle at 85% 78%, rgba(176,82,255,.14), transparent 28%), linear-gradient(135deg, #18003d 0%, #2a0066 36%, #3a008c 72%, #4b0fb0 100%)`
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <div style={{ display:'inline-block', padding:'6px 20px', borderRadius:20, background:'rgba(0,0,0,.3)', border:'1px solid rgba(255,255,255,.2)', marginBottom:22 }}>
              <span style={{ fontWeight:700, fontSize:11, color:'#fff', textTransform:'uppercase', letterSpacing:'0.12em' }}>PRUEBA SOCIAL</span>
            </div>
            <h2 style={{ fontWeight:900, fontSize:'clamp(32px,4.5vw,64px)', color:'#fff', margin:'0 0 18px', letterSpacing:'-1.5px', lineHeight:1.05 }}>
              Tu perfil también vende por vos.
            </h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,.8)', maxWidth:740, margin:'0 auto', lineHeight:1.7, fontWeight:500 }}>
              Antes de leer tu oferta, muchas personas ya sacaron una conclusión sobre tu marca. Un perfil fuerte ayuda a que esa primera impresión juegue a tu favor.
            </p>
          </motion.div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16 }}>
          {benefits.map((b,i)=>(
            <motion.div key={i} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*.07 }}
              style={{ background:'rgba(255,255,255,.08)', borderRadius:20, padding:'28px 24px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', border:'1px solid rgba(255,255,255,.1)', backdropFilter:'blur(4px)' }}>
              <span style={{ fontSize:32, marginBottom:16 }}>{b.icon}</span>
              <h3 style={{ fontWeight:800, fontSize:16, color:'#fff', margin:'0 0 10px' }}>{b.title}</h3>
              <p style={{ fontSize:13, color:'rgba(255,255,255,.75)', lineHeight:1.65, margin:0, fontWeight:500 }}>{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num:'01', title:'Elegí tu servicio', desc:'Navegá el catálogo y seleccioná el paquete que querés potenciar.' },
    { num:'02', title:'Hacé tu pedido', desc:'Agregalo al carrito o hacé clic en el botón de WhatsApp directo.' },
    { num:'03', title:'Confirmamos y activamos', desc:'Abonás en tu moneda (transferencia en ARS o coordinás por WhatsApp) y activamos al instante.' },
  ];
  return (
    <section id="como-funciona" style={{ padding:'80px 24px', background:'#fff' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <div style={{ display:'inline-block', padding:'6px 20px', borderRadius:20, background:'rgba(118,40,240,.08)', border:'1px solid rgba(118,40,240,.15)', marginBottom:18 }}>
              <span style={{ fontWeight:700, fontSize:11, color:'#7628f0', textTransform:'uppercase', letterSpacing:'0.1em' }}>SIMPLE Y RÁPIDO</span>
            </div>
            <h2 style={{ fontWeight:900, fontSize:'clamp(26px,3.5vw,48px)', color:'#121212', margin:0, letterSpacing:'-1px' }}>¿Cómo funciona?</h2>
          </motion.div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:32 }}>
          {steps.map((step,i)=>(
            <motion.div key={i} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*.15 }}
              style={{ textAlign:'center' }}>
              <div style={{ width:72, height:72, borderRadius:20, background:'linear-gradient(135deg,#7f1fff,#bf5bff)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 8px 28px rgba(127,31,255,.3)' }}>
                <span style={{ fontWeight:900, fontSize:22, color:'#fff' }}>{step.num}</span>
              </div>
              <h3 style={{ fontWeight:800, fontSize:18, color:'#121212', margin:'0 0 10px' }}>{step.title}</h3>
              <p style={{ fontSize:14, color:'#6d6282', lineHeight:1.65, margin:0, fontWeight:500 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
const REVIEWS = [
  { id: 1, name: 'Tomi', date: 'Mayo 2026', service: 'LIKES INSTAGRAM', text: 'Tenía miedo de que se viera falso. Elegí una cantidad acorde a mi perfil y quedó bastante natural, sin verse forzado.', letter: 'T', color: '#8b5cf6' },
  { id: 2, name: 'Seba', date: 'Julio 2026', service: 'LIKES INSTAGRAM', text: 'Pedí una cantidad moderada de likes y el resultado quedó bien. Me gustó porque no se ve exagerado.', letter: 'S', color: '#a855f7' },
  { id: 3, name: 'Agus', date: 'Marzo 2026', service: 'SEGUIDORES INSTAGRAM', text: 'Para una cuenta de indumentaria o productos, una comunidad más amplia puede mejorar la impresión al recibir nuevas visitas.', letter: 'A', color: '#c084fc' },
  { id: 4, name: 'Pablo', date: 'Junio 2026', service: 'EASYMARKETING', text: 'Recibí la confirmación y pude seguir aproximadamente cómo avanzaba el pedido. Eso está bueno.', letter: 'P', color: '#9333ea' },
  { id: 5, name: 'Eze', date: 'Mayo 2026', service: 'LIKES Y VIEWS INSTAGRAM', text: 'Tenía un reel importante y le agregué views y likes. Se notó que empezó a moverse más.', letter: 'E', color: '#a855f7' },
  { id: 6, name: 'Fede', date: 'Junio 2026', service: 'SEGUIDORES INSTAGRAM', text: 'El seguimiento del pedido permite comprobar de manera completa lo solicitado.', letter: 'F', color: '#7e22ce' },
];

function Testimonials() {
  return (
    <section style={{ padding: '80px 24px 40px', background: 'linear-gradient(180deg, #f9fafb 0%, #fcfcfd 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', color: '#121212', margin: '0 0 10px', letterSpacing: '-1px' }}>
            Lo que dicen nuestros <span style={{ color: '#9c34ff' }}>clientes</span>
          </h2>
          <p style={{ fontWeight: 500, fontSize: 16, color: '#6d6282', margin: 0 }}>Comentarios de clientes sobre nuestros servicios.</p>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', padding: '10px 24px', borderRadius: 30, marginTop: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width: 18, height: 18, background: '#00b67a', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
              ))}
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#121212' }}>4,7 / 5</div>
            <div style={{ fontWeight: 500, fontSize: 12, color: '#9a92a8', margin: '0 4px' }}>Más de 689 reseñas</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 800, fontSize: 14, color: '#121212' }}>
              <span style={{ color: '#00b67a', fontSize: 18 }}>★</span> Trustpilot
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {REVIEWS.map(r => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 10px 40px -10px rgba(118,40,240,.15)', border: '1px solid rgba(141,44,255,.05)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #9333ea, #c084fc)' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ width: 14, height: 14, background: '#00b67a', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00b67a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#00b67a', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Opinión verificada</span>
                  </div>
                </div>
                
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #7e22ce)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(168,85,247,.3)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"/></svg>
                </div>
              </div>
              
              <div style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(168,85,247,.1)', color: '#9333ea', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', borderRadius: 4, marginBottom: 16, width: 'max-content', letterSpacing: '0.05em' }}>
                {r.service}
              </div>
              
              <p style={{ fontWeight: 500, fontSize: 15, color: '#4a4358', lineHeight: 1.7, fontStyle: 'italic', flex: 1, margin: '0 0 24px' }}>
                {r.text}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,.04)', paddingTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                    {r.letter}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#121212' }}>{r.name}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#9a92a8' }}>{r.date}</span>
              </div>
              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIdx, setOpenIdx] = useState<number|null>(null);
  const faqs = [
    { q:'¿Es seguro para mi cuenta?', a:'Sí. Nunca pedimos tu contraseña. Solo necesitamos el link o nombre de usuario de tu perfil.' },
    { q:'¿Cuánto tarda en llegar?', a:'La mayoría de los pedidos comienzan a procesarse de forma rápida una vez confirmado el pago. Algunos pueden demorar entre 12 y 24hs según el volumen.' },
    { q:'¿Los seguidores son reales?', a:'Trabajamos con perfiles activos y de alta calidad para mayor autenticidad y excelente retención.' },
    { q:'¿Ofrecen soporte y reposición?', a:'Sí. Trabajamos con perfiles de la más alta calidad y brindamos soporte personalizado por WhatsApp ante cualquier consulta.' },
    { q:'¿Cuáles son los medios de pago disponibles?', a:'En Argentina podés abonar por transferencia bancaria (Naranja X / Alias / CBU). Para el resto del mundo (USD, EUR, CLP, COP, MXN, UYU, BRL) coordinamos el pago directo por WhatsApp vía Binance USDT, PayPal o tarjetas.' },
  ];
  return (
    <section id="faq" style={{ padding:'80px 24px', background:'#f9fafb' }}>
      <div style={{ maxWidth:760, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <div style={{ display:'inline-block', padding:'6px 20px', borderRadius:20, background:'rgba(118,40,240,.08)', border:'1px solid rgba(118,40,240,.15)', marginBottom:18 }}>
              <span style={{ fontWeight:700, fontSize:11, color:'#7628f0', textTransform:'uppercase', letterSpacing:'0.1em' }}>FAQ</span>
            </div>
            <h2 style={{ fontWeight:900, fontSize:'clamp(24px,3vw,42px)', color:'#121212', margin:0, letterSpacing:'-1px' }}>Preguntas Frecuentes</h2>
          </motion.div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {faqs.map((faq,i)=>(
            <motion.div key={i} initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*.06 }}
              style={{ background:'#fff', borderRadius:16, border:'1px solid rgba(141,44,255,.08)', overflow:'hidden', boxShadow:'0 2px 12px rgba(118,40,240,.05)' }}>
              <button onClick={()=>setOpenIdx(openIdx===i?null:i)}
                style={{ width:'100%', padding:'18px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'none', border:'none', cursor:'pointer', fontFamily:'Poppins,sans-serif', textAlign:'left' }}>
                <span style={{ fontWeight:700, fontSize:14, color:'#121212' }}>{faq.q}</span>
                <motion.div animate={{ rotate: openIdx===i?180:0 }} style={{ flexShrink:0, marginLeft:12 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7628f0" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </motion.div>
              </button>
              {openIdx===i && <div style={{ padding:'0 22px 18px' }}><p style={{ fontWeight:500, fontSize:14, color:'#6d6282', lineHeight:1.7, margin:0 }}>{faq.a}</p></div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── NOTIFICACIONES EN VIVO DE COMPRA (Prueba Social Dinámica) ────────────────
const NOTIF_NAMES = [
  "Camila", "Lucas", "Valentina", "Mateo", "Martina", "Santiago", "Sofía",
  "Joaquín", "Julieta", "Tomás", "Florencia", "Agustín", "Micaela", "Nicolás",
  "Belén", "Facundo", "Lucía", "Lautaro", "Franco", "Candela", "Ignacio", "Paula", "Gonzalo"
];

const NOTIF_CITIES = [
  "CABA", "Córdoba", "Rosario", "Mendoza", "La Plata", "Mar del Plata",
  "San Isidro", "Vicente López", "Neuquén", "Salta", "Tucumán", "Santa Fe",
  "Montevideo", "Santiago de Chile", "Buenos Aires", "Quilmes", "Pilar", "Tigre"
];

const NOTIF_SERVICES = [
  { item: "1.000 seguidores", platform: "instagram" },
  { item: "500 likes", platform: "instagram" },
  { item: "2.500 seguidores", platform: "instagram" },
  { item: "10.000 visualizaciones", platform: "instagram" },
  { item: "5.000 seguidores", platform: "instagram" },
  { item: "250 likes Premium", platform: "instagram" },
  { item: "Mix de Acciones", platform: "instagram" },
  { item: "Pack Influencer", platform: "instagram" },
  { item: "1.000 seguidores", platform: "tiktok" },
  { item: "500 likes", platform: "tiktok" },
  { item: "500 seguidores", platform: "facebook" },
  { item: "1.000 visualizaciones", platform: "youtube" },
];

function LivePurchaseNotification() {
  const [currentNotif, setCurrentNotif] = useState<{
    name: string;
    city: string;
    service: string;
    platform: string;
    minutesAgo: number;
  } | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    let timeoutId: NodeJS.Timeout;
    let hideTimeoutId: NodeJS.Timeout;

    const showNext = () => {
      const randomName = NOTIF_NAMES[Math.floor(Math.random() * NOTIF_NAMES.length)];
      const randomCity = NOTIF_CITIES[Math.floor(Math.random() * NOTIF_CITIES.length)];
      const randomService = NOTIF_SERVICES[Math.floor(Math.random() * NOTIF_SERVICES.length)];
      const randomMinutes = Math.floor(Math.random() * 24) + 2; // entre 2 y 25 minutos

      setCurrentNotif({
        name: randomName,
        city: randomCity,
        service: randomService.item,
        platform: randomService.platform,
        minutesAgo: randomMinutes
      });
      setVisible(true);

      // Desaparece a los 5.5 segundos
      hideTimeoutId = setTimeout(() => {
        setVisible(false);
        // Próxima notificación en 8 a 15 segundos
        const nextInterval = Math.floor(Math.random() * 7000) + 8000;
        timeoutId = setTimeout(showNext, nextInterval);
      }, 5500);
    };

    // Primera aparición a los 3.5 segundos de cargar
    timeoutId = setTimeout(showNext, 3500);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(hideTimeoutId);
    };
  }, [dismissed]);

  if (!visible || !currentNotif || dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 350, damping: 26 }}
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 55,
        background: '#ffffff',
        borderRadius: 18,
        padding: '10px 14px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        maxWidth: 360,
      }}
    >
      {/* Icono de la plataforma */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {currentNotif.platform === 'tiktok' ? (
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaTiktok size={18} color="#fff" />
          </div>
        ) : currentNotif.platform === 'facebook' ? (
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaFacebook size={18} color="#fff" />
          </div>
        ) : currentNotif.platform === 'youtube' ? (
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Youtube size={18} color="#fff" />
          </div>
        ) : (
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(220,39,67,0.3)'
          }}>
            <Instagram size={19} color="#fff" />
          </div>
        )}
      </div>

      {/* Contenido del texto */}
      <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <strong>{currentNotif.name}</strong> de <strong>{currentNotif.city}</strong> compró <span style={{ color: '#7628f0', fontWeight: 800 }}>{currentNotif.service}</span>
        </p>
        <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, display: 'block', marginTop: 2 }}>
          hace {currentNotif.minutesAgo} minutos
        </span>
      </div>

      {/* Botón de cerrar */}
      <button
        onClick={() => setDismissed(true)}
        title="Ocultar"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 2,
          color: '#d1d5db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'color 0.15s',
          marginLeft: 4,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#6b7280')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

// ─── FLOATING WHATSAPP ────────────────────────────────────────────────────────
function FloatingWhatsApp() {
  return (
    <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer"
      style={{ position:'fixed', bottom:24, right:24, zIndex:50, display:'flex', alignItems:'center', gap:10, background:'#fff', padding:'12px 20px', borderRadius:50, boxShadow:'0 8px 32px rgba(18,0,61,.15)', textDecoration:'none', border:'1px solid rgba(141,44,255,.06)' }}>
      <div style={{ width:32, height:32, borderRadius:'50%', background:'#25d366', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <FaWhatsapp size={17} color="#fff"/>
      </div>
      <span style={{ fontWeight:700, fontSize:13, color:'#121212' }}>Atención personalizada</span>
    </a>
  );
}

// ─── PAGE & APP ───────────────────────────────────────────────────────────────
function Home() {
  return (
    <div style={{ minHeight:'100vh', fontFamily:'Poppins,sans-serif', background:'#f5f6f9' }}>
      <Header/>
      <div style={{ paddingTop:117 }}>
        <Hero/>
        <StatsBar/>
        <WhatsAppNoticeBanner/>
        <Catalog/>
        <Benefits/>
        <HowItWorks/>
        <Testimonials/>
        <FAQ/>
      </div>
      <footer style={{ background:'#121212', padding:'48px 24px', textAlign:'center' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', marginBottom: 20, gap: 8 }}>
            <img src="/neon-logo.jpg" alt="Cyber Digital" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '50%' }} />
            <div style={{ fontWeight:900, fontSize:22, color:'#fff', letterSpacing:'-0.5px' }}>CYBER <span style={{ color:'#a855f7' }}>MARKETING DIGITAL</span></div>
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:16, marginBottom:20 }}>
            <a href="https://www.instagram.com/seguidores_ventas_arg?igsh=M2Focm9oNXJxZWVv&utm_source=qr" target="_blank" rel="noreferrer" style={{ color:'#9a92a8' }}><Instagram size={20}/></a>
            <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" style={{ color:'#9a92a8' }}><FaTiktok size={18}/></a>
          </div>
          <p style={{ fontSize:13, color:'#4f4f59', margin:0, fontWeight:500 }}>&copy; {new Date().getFullYear()} Todos los derechos reservados.</p>
        </div>
      </footer>
      <LivePurchaseNotification/>
      <FloatingWhatsApp/>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route component={NotFound}/>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <CartDrawer/>
          <WouterRouter base={""}>
            <Router/>
          </WouterRouter>
          <Toaster/>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
