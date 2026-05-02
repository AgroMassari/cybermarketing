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
  Copy, CopyCheck, Banknote, DollarSign, ChevronLeft
} from "lucide-react";
import { FaFacebook, FaSpotify } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { useEffect, useState, createContext, useContext } from "react";

const WHATSAPP_NUMBER = "5491161789518";

// ─── DATOS DE PAGO ────────────────────────────────────────────────────────────

const PAYMENT_ARS = [
  { label: "Banco",    value: "Naranja X" },
  { label: "Titular",  value: "Sebastian Agustin Herrera" },
  { label: "CUIL",     value: "20414359621" },
  { label: "CBU",      value: "4530000800017621169436" },
  { label: "Alias",    value: "CYBER.MARKET" },
  { label: "Cuenta",   value: "Caja de ahorro en pesos · 1762116943" },
];

const PAYMENT_USD = [
  { label: "Banco",    value: "Naranja X" },
  { label: "Titular",  value: "Sebastian Agustin Herrera" },
  { label: "CUIL",     value: "20414359621" },
  { label: "CBU",      value: "4530000800028700556689" },
  { label: "Alias",    value: "CYBER.MARKET.USD" },
  { label: "Cuenta",   value: "Caja de ahorro en dólares · 2870055668" },
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
    subtitle: "LATINOS",
    features: [
      "Perfiles premium de América Latina",
      "Garantía: 90 días de recarga gratis",
      "Entrega: 30 minutos",
    ],
    icon: <Instagram size={16} />,
    tiers: [
      { tierQty: "100",    price: 3990,   label: "Pack Básico" },
      { tierQty: "500",    price: 18990 },
      { tierQty: "1.000",  price: 35990,  popular: true, label: "Pack Más Vendido" },
      { tierQty: "2.500",  price: 79990 },
      { tierQty: "5.000",  price: 85990 },
      { tierQty: "10.000", price: 164990, label: "Pack Influencer" },
    ],
  },
  {
    id: "ig-seg-globales",
    category: "instagram",
    name: "Seguidores Instagram",
    subtitle: "GLOBALES",
    features: [
      "Mejorá tu perfil de inmediato",
      "Mejor relación precio/calidad",
      "30 días de garantía · 1 reposición gratuita ante caída",
    ],
    icon: <Instagram size={16} />,
    tiers: [
      { tierQty: "500",    price: 5900 },
      { tierQty: "1.000",  price: 11100,  discount: "-6%" },
      { tierQty: "2.500",  price: 26500,  discount: "-10%" },
      { tierQty: "5.000",  price: 49000,  discount: "-13%" },
      { tierQty: "10.000", price: 89000,  discount: "-19%" },
      { tierQty: "20.000", price: 169000, discount: "-22%" },
      { tierQty: "50.000", price: 390000, discount: "-28%" },
    ],
  },
  {
    id: "ig-seg-premium",
    category: "instagram",
    name: "Seguidores Instagram",
    subtitle: "PREMIUM GARANTÍA EXTENDIDA",
    features: [
      "Mejorá tu perfil de inmediato",
      "Mejor relación precio/calidad",
      "30 días de garantía · 1 reposición gratuita ante caída",
    ],
    icon: <Instagram size={16} />,
    tiers: [
      { tierQty: "250",    price: 8400 },
      { tierQty: "500",    price: 11800,  discount: "-6%" },
      { tierQty: "1.000",  price: 22200,  discount: "-10%" },
      { tierQty: "2.500",  price: 53000,  discount: "-17%" },
      { tierQty: "5.000",  price: 98000,  discount: "-25%" },
      { tierQty: "10.000", price: 178000, discount: "-28%" },
      { tierQty: "20.000", price: 338000, discount: "-34%" },
    ],
  },
  {
    id: "ig-likes-mundiales",
    category: "instagram",
    name: "Likes Instagram",
    subtitle: "MUNDIALES",
    features: [
      "Perfiles de diferentes países del mundo",
      "Garantía: 30 días. Permanentes",
      "Entrega: 30 minutos",
    ],
    icon: <Heart size={16} />,
    tiers: [
      { tierQty: "100",   price: 500 },
      { tierQty: "250",   price: 1250 },
      { tierQty: "500",   price: 2000,  discount: "20% OFF" },
      { tierQty: "750",   price: 2800,  discount: "25% OFF" },
      { tierQty: "1.000", price: 3500,  discount: "30% OFF", popular: true },
      { tierQty: "2.500", price: 8000,  discount: "36% OFF" },
    ],
  },
  {
    id: "ig-likes-latinos",
    category: "instagram",
    name: "Likes Instagram",
    subtitle: "LATINOS",
    features: [
      "Perfiles premium de América Latina",
      "Garantía: 90 días. Permanentes",
      "Entrega: 30 minutos",
    ],
    icon: <Heart size={16} />,
    tiers: [
      { tierQty: "100",   price: 1000 },
      { tierQty: "250",   price: 2375,  discount: "5% OFF" },
      { tierQty: "500",   price: 4500,  discount: "10% OFF" },
      { tierQty: "750",   price: 6600,  discount: "12% OFF" },
      { tierQty: "1.000", price: 8500,  discount: "15% OFF" },
      { tierQty: "2.500", price: 20000, discount: "20% OFF" },
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
      { tierQty: "500",    price: 2700 },
      { tierQty: "1.000",  price: 4600,  discount: "-15%" },
      { tierQty: "2.500",  price: 9400,  discount: "-21%" },
      { tierQty: "5.000",  price: 17900, discount: "-33%" },
      { tierQty: "10.000", price: 35500, discount: "-47%" },
      { tierQty: "20.000", price: 65000, discount: "-52%" },
      { tierQty: "50.000", price: 150000, discount: "-56%" },
    ],
  },
  {
    id: "ig-likes-latinos-arg",
    category: "instagram",
    name: "Likes Instagram",
    subtitle: "LATINOS 🇦🇷",
    features: [
      "Dale vida a tu post al instante",
      "Mejorá el impacto de tus posts y reels",
      "Aumentá tus likes de forma económica",
    ],
    icon: <Heart size={16} />,
    tiers: [
      { tierQty: "250",    price: 2100 },
      { tierQty: "500",    price: 4050 },
      { tierQty: "1.000",  price: 6900,  discount: "-12%" },
      { tierQty: "2.500",  price: 14100, discount: "-35%" },
      { tierQty: "5.000",  price: 26850, discount: "-45%" },
      { tierQty: "10.000", price: 53250, discount: "-58%" },
      { tierQty: "20.000", price: 97500, discount: "-67%" },
    ],
  },
  {
    id: "ig-vistas-reels",
    category: "instagram",
    name: "Vistas Instagram",
    subtitle: "REELS",
    features: [
      "Perfiles de diferentes países del mundo",
      "Garantía: 30 días. Permanentes",
      "Entrega: 30 minutos",
    ],
    icon: <Eye size={16} />,
    tiers: [
      { tierQty: "2.500",   price: 1250 },
      { tierQty: "5.000",   price: 2375,  discount: "5% OFF" },
      { tierQty: "10.000",  price: 4500,  discount: "10% OFF" },
      { tierQty: "25.000",  price: 10000, discount: "20% OFF" },
      { tierQty: "50.000",  price: 18750, discount: "25% OFF" },
      { tierQty: "100.000", price: 35000, discount: "30% OFF" },
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
      "Entrega: 30 minutos",
    ],
    icon: <Eye size={16} />,
    tiers: [
      { tierQty: "500",    price: 1000 },
      { tierQty: "1.000",  price: 2000 },
      { tierQty: "2.500",  price: 4500 },
      { tierQty: "5.000",  price: 5000 },
      { tierQty: "10.000", price: 7500,  discount: "25% OFF" },
      { tierQty: "20.000", price: 12000, discount: "40% OFF" },
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
      { tierQty: "2.000",   price: 890 },
      { tierQty: "5.000",   price: 1750,  discount: "-19%" },
      { tierQty: "10.000",  price: 3500,  discount: "-22%" },
      { tierQty: "20.000",  price: 5900,  discount: "-34%" },
      { tierQty: "50.000",  price: 10500, discount: "-53%" },
      { tierQty: "150.000", price: 25000, discount: "-62%" },
      { tierQty: "300.000", price: 45000, discount: "-66%" },
    ],
  },
  {
    id: "ig-comentarios",
    category: "instagram",
    name: "Comentarios Instagram",
    subtitle: "P/ REELS & POST",
    features: [
      "Perfiles de diferentes países del mundo",
      "Garantía: 30 días. Permanentes. Personalizables",
      "Entrega: 30 minutos",
    ],
    icon: <MessageCircle size={16} />,
    tiers: [
      { tierQty: "10",    price: 500 },
      { tierQty: "25",    price: 1250 },
      { tierQty: "50",    price: 2500 },
      { tierQty: "100",   price: 4000,  discount: "20% OFF" },
      { tierQty: "500",   price: 18750, discount: "25% OFF" },
      { tierQty: "1.000", price: 30000, discount: "40% OFF" },
    ],
  },
  {
    id: "ig-compartidas",
    category: "instagram",
    name: "Compartidas Instagram",
    subtitle: "P/ REELS & POST",
    features: [
      "Compartidas por DM",
      "Garantía: 30 días. Permanentes",
      "Entrega: 2 hs",
    ],
    icon: <Send size={16} />,
    tiers: [
      { tierQty: "500",    price: 1000 },
      { tierQty: "1.000",  price: 2000 },
      { tierQty: "2.500",  price: 4500 },
      { tierQty: "5.000",  price: 5000 },
      { tierQty: "10.000", price: 7500,  discount: "25% OFF" },
      { tierQty: "20.000", price: 12000, discount: "40% OFF" },
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
      { tierQty: "200",    price: 2200 },
      { tierQty: "500",    price: 4900,  discount: "-11%" },
      { tierQty: "1.000",  price: 9500,  discount: "-14%", popular: true },
      { tierQty: "2.500",  price: 21000, discount: "-24%" },
      { tierQty: "5.000",  price: 39000, discount: "-30%" },
      { tierQty: "10.000", price: 55000, discount: "-51%" },
      { tierQty: "20.000", price: 99000, discount: "-56%" },
    ],
  },
  {
    id: "tt-likes",
    category: "tiktok",
    name: "Likes/Me Gusta TikTok",
    features: [
      "Se pueden dividir en varias publicaciones (mín. 100)",
      "Perfiles activos",
      "Entrega rápida",
    ],
    icon: <Heart size={16} />,
    tiers: [
      { tierQty: "500",    price: 1400 },
      { tierQty: "1.000",  price: 2600,  discount: "-8%" },
      { tierQty: "2.500",  price: 6200,  discount: "-12%" },
      { tierQty: "5.000",  price: 11500, discount: "-18%" },
      { tierQty: "10.000", price: 21000, discount: "-26%" },
      { tierQty: "20.000", price: 39000, discount: "-31%" },
      { tierQty: "50.000", price: 95000, discount: "-33%" },
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
      { tierQty: "2.000",   price: 3000 },
      { tierQty: "5.000",   price: 5000 },
      { tierQty: "10.000",  price: 8000 },
      { tierQty: "20.000",  price: 13000 },
      { tierQty: "50.000",  price: 25000 },
      { tierQty: "150.000", price: 35000 },
      { tierQty: "300.000", price: 55000 },
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
      { tierQty: "500",    price: 2200 },
      { tierQty: "1.000",  price: 3800 },
      { tierQty: "2.500",  price: 8800 },
      { tierQty: "5.000",  price: 16000 },
      { tierQty: "10.000", price: 29000 },
      { tierQty: "20.000", price: 55000 },
      { tierQty: "50.000", price: 125000 },
    ],
  },
  {
    id: "fb-likes-post",
    category: "facebook",
    name: "Likes en Post Facebook",
    features: [
      "Se pueden dividir en varias publicaciones (mín. 100)",
      "La herramienta clave que los influencers no te cuentan",
      "Entrega rápida",
    ],
    icon: <Heart size={16} />,
    tiers: [
      { tierQty: "200",    price: 1900 },
      { tierQty: "500",    price: 3500 },
      { tierQty: "1.000",  price: 6500 },
      { tierQty: "2.500",  price: 14900 },
      { tierQty: "5.000",  price: 27500 },
      { tierQty: "10.000", price: 49900 },
      { tierQty: "20.000", price: 95000 },
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
      "30 días de garantía",
      "Sin contraseña",
    ],
    icon: <Youtube size={16} />,
    tiers: [
      { tierQty: "100",   price: 17500 },
      { tierQty: "200",   price: 32000,  discount: "-7%" },
      { tierQty: "300",   price: 46000,  discount: "-10%" },
      { tierQty: "500",   price: 72500,  discount: "-15%" },
      { tierQty: "1.000", price: 117000, discount: "-33%", popular: true },
      { tierQty: "1.500", price: 165000, discount: "-35%" },
      { tierQty: "2.000", price: 209000, discount: "-39%" },
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
      { tierQty: "100", price: 8000 },
      { tierQty: "200", price: 16000 },
      { tierQty: "250", price: 19000 },
      { tierQty: "500", price: 37500 },
      { tierQty: "750", price: 55000 },
      { tierQty: "1.000", price: 73000 },
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
      { tierQty: "100",    price: 1400 },
      { tierQty: "200",    price: 2300 },
      { tierQty: "500",    price: 4900 },
      { tierQty: "1.000",  price: 8900 },
      { tierQty: "2.500",  price: 19000 },
      { tierQty: "5.000",  price: 32000 },
      { tierQty: "10.000", price: 59000 },
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
      "Entrega: 30 minutos",
    ],
    icon: <Heart size={16} />,
    tiers: [
      { tierQty: "100",   price: 500 },
      { tierQty: "250",   price: 1250 },
      { tierQty: "500",   price: 2500 },
      { tierQty: "1.000", price: 4500,  discount: "10% OFF" },
      { tierQty: "2.000", price: 9000,  discount: "10% OFF" },
      { tierQty: "5.000", price: 20000, discount: "20% OFF" },
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
      "Entrega: 30 minutos",
    ],
    icon: <MessageCircle size={16} />,
    tiers: [
      { tierQty: "10",  price: 2500 },
      { tierQty: "25",  price: 6250 },
      { tierQty: "50",  price: 12500 },
      { tierQty: "100", price: 22500,  discount: "10% OFF" },
      { tierQty: "250", price: 53125,  discount: "15% OFF" },
      { tierQty: "500", price: 100000, discount: "20% OFF" },
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
      { tierQty: "100 esp.",   price: 4990 },
      { tierQty: "200 esp.",   price: 9490 },
      { tierQty: "300 esp.",   price: 13790 },
      { tierQty: "400 esp.",   price: 17590 },
      { tierQty: "500 esp.",   price: 21190 },
      { tierQty: "1.000 esp.", price: 33990 },
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
      { tierQty: "1.000",  price: 4000 },
      { tierQty: "2.500",  price: 9000,  discount: "10% OFF" },
      { tierQty: "5.000",  price: 17000, discount: "15% OFF" },
      { tierQty: "10.000", price: 32000, discount: "20% OFF" },
      { tierQty: "25.000", price: 70000, discount: "25% OFF" },
      { tierQty: "50.000", price: 130000, discount: "30% OFF" },
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
      { tierQty: "1.000",  price: 10000 },
      { tierQty: "2.500",  price: 22500,  discount: "10% OFF" },
      { tierQty: "5.000",  price: 42500,  discount: "15% OFF" },
      { tierQty: "10.000", price: 80000,  discount: "20% OFF" },
      { tierQty: "25.000", price: 187500, discount: "25% OFF" },
      { tierQty: "50.000", price: 350000, discount: "30% OFF" },
    ],
  },
];

// ─── CART CONTEXT ─────────────────────────────────────────────────────────────

type CartItem = {
  id: string;
  serviceName: string;
  tierQty: string;
  price: number;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  total: number;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextType | null>(null);

function useCart() {
  return useContext(CartContext)!;
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const add = (item: Omit<CartItem, "qty">) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setOpen(true);
  };

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const changeQty = (id: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newQty = i.qty + delta;
      return newQty <= 0 ? null as unknown as CartItem : { ...i, qty: newQty };
    }).filter(Boolean));
  };

  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const count = items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, changeQty, total, count, open, setOpen }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── WHATSAPP CHECKOUT ────────────────────────────────────────────────────────

function buildWhatsAppMessage(items: CartItem[], total: number, currency: "ARS" | "USD"): string {
  const lines = items.map(i =>
    `• ${i.serviceName}${i.tierQty ? ` — ${i.tierQty}` : ""} x${i.qty} = $${(i.price * i.qty).toLocaleString("es-AR")} ARS`
  );
  const msg = [
    "¡Hola! Acabo de realizar el pago de mi pedido.",
    "",
    "📋 *DETALLE DEL PEDIDO:*",
    ...lines,
    "",
    `💰 *Total: $${total.toLocaleString("es-AR")} ARS*`,
    "",
    `✅ *El pago fue realizado por transferencia bancaria en ${currency}.*`,
    "",
    "Por favor confirme la recepción y activen el servicio. ¡Gracias!",
  ].join("\n");
  return encodeURIComponent(msg);
}

// ─── COPY ROW ─────────────────────────────────────────────────────────────────

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg border border-white/8"
      style={{ background: "rgba(255,255,255,0.03)" }}>
      <div className="min-w-0">
        <p className="text-[10px] text-white/35 font-mono uppercase tracking-wider">{label}</p>
        <p className="text-white text-sm font-mono font-semibold break-all leading-tight mt-0.5">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
        style={copied
          ? { background: "rgba(34,197,94,0.2)", color: "#4ade80" }
          : { background: "rgba(168,85,247,0.15)", color: "#A855F7" }
        }
        title="Copiar"
      >
        {copied ? <CopyCheck size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────

function PaymentModal({
  items, total, onBack, onConfirm
}: {
  items: CartItem[];
  total: number;
  onBack: () => void;
  onConfirm: (currency: "ARS" | "USD") => void;
}) {
  const [tab, setTab] = useState<"ARS" | "USD">("ARS");
  const data = tab === "ARS" ? PAYMENT_ARS : PAYMENT_USD;

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="w-full sm:max-w-md max-h-[95vh] flex flex-col rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{
          background: "rgba(8,2,20,0.99)",
          border: "1px solid rgba(168,85,247,0.3)",
          boxShadow: "0 0 60px rgba(168,85,247,0.2)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <button onClick={onBack} className="text-white/50 hover:text-white transition-colors">
            <ChevronLeft size={22} />
          </button>
          <div className="flex-1">
            <h2 className="font-cinzel text-base text-white font-bold tracking-widest">DATOS DE PAGO</h2>
            <p className="text-white/40 text-[10px] font-sans mt-0.5">Realizá la transferencia y luego confirmá</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40 font-mono">TOTAL</p>
            <p className="font-cinzel text-lg text-primary font-bold">${total.toLocaleString("es-AR")} ARS</p>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="px-5 py-3 border-b border-white/5">
          <p className="text-[10px] text-white/35 font-mono uppercase tracking-wider mb-2">Tu pedido</p>
          <div className="space-y-1">
            {items.map(i => (
              <div key={i.id} className="flex items-center justify-between gap-2 text-xs font-sans">
                <span className="text-white/60 truncate">{i.serviceName} — {i.tierQty} ×{i.qty}</span>
                <span className="text-primary font-mono font-bold shrink-0">${(i.price * i.qty).toLocaleString("es-AR")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Moneda tabs */}
        <div className="px-5 pt-4 pb-2">
          <p className="text-[10px] text-white/35 font-mono uppercase tracking-wider mb-3">Elegí la moneda de pago</p>
          <div className="flex gap-2">
            <button
              onClick={() => setTab("ARS")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
              style={tab === "ARS"
                ? { background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "#fff" }
                : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }
              }
            >
              <Banknote size={16} />
              Pesos ARS
            </button>
            <button
              onClick={() => setTab("USD")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
              style={tab === "USD"
                ? { background: "linear-gradient(135deg, #059669, #10b981)", color: "#fff" }
                : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }
              }
            >
              <DollarSign size={16} />
              Dólares USD
            </button>
          </div>
        </div>

        {/* Datos bancarios */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
          {data.map(row => (
            <CopyRow key={row.label} label={row.label} value={row.value} />
          ))}
        </div>

        {/* CTA */}
        <div className="px-5 py-5 border-t border-white/10 space-y-3">
          <button
            onClick={() => onConfirm(tab)}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white text-base transition-all duration-300 hover:brightness-110 active:scale-95"
            style={{ background: "linear-gradient(135deg, #059669, #10b981, #34d399)", boxShadow: "0 0 30px rgba(16,185,129,0.35)" }}
          >
            <CheckCircle2 size={20} />
            YA TRANSFERÍ — CONFIRMAR PEDIDO
          </button>
          <p className="text-center text-white/30 text-[11px] font-sans leading-relaxed">
            Al confirmar, se abre WhatsApp con el detalle de tu pedido y la confirmación de pago.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── CART DRAWER ──────────────────────────────────────────────────────────────

function CartDrawer() {
  const { items, remove, changeQty, total, open, setOpen } = useCart();
  const [showPayment, setShowPayment] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setShowPayment(true);
  };

  const handleConfirm = (currency: "ARS" | "USD") => {
    const msg = buildWhatsAppMessage(items, total, currency);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    setShowPayment(false);
    setOpen(false);
  };

  return (
    <>
      <div
        onClick={() => { setOpen(false); setShowPayment(false); }}
        className="fixed inset-0 z-[60] transition-all duration-300"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: open ? "blur(4px)" : "none",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-md z-[70] flex flex-col transition-transform duration-300 ease-out"
        style={{
          background: "rgba(8,2,20,0.99)",
          borderLeft: "1px solid rgba(168,85,247,0.25)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-widest">MI PEDIDO</h2>
          <button onClick={() => { setOpen(false); setShowPayment(false); }} className="text-white/50 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white/30">
            <ShoppingCart size={48} />
            <p className="font-sans text-sm">Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {items.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/10"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-white text-sm font-semibold truncate">{item.serviceName}</p>
                  <p className="font-mono text-primary/80 text-xs mt-0.5">{item.tierQty}</p>
                  <p className="font-sans text-primary text-sm font-bold mt-0.5">
                    ${(item.price * item.qty).toLocaleString("es-AR")} ARS
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => changeQty(item.id, -1)} className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-primary transition-all">
                    <Minus size={10} />
                  </button>
                  <span className="font-mono text-white text-sm w-4 text-center">{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)} className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-primary transition-all">
                    <Plus size={10} />
                  </button>
                  <button onClick={() => remove(item.id)} className="ml-1 text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-6 py-5 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-sans text-white/60 text-sm">Total</span>
            <span className="font-cinzel text-xl text-primary font-bold">
              ${total.toLocaleString("es-AR")} ARS
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 disabled:opacity-40 hover:brightness-110 active:scale-95"
            style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7, #EC4899)", boxShadow: "0 0 30px rgba(168,85,247,0.4)" }}
          >
            <Banknote size={20} />
            PAGAR AHORA
          </button>
          <p className="text-center text-white/30 text-xs font-sans">
            Transferencia bancaria · Pesos ARS o Dólares USD
          </p>
        </div>
      </aside>

      {showPayment && open && (
        <PaymentModal
          items={items}
          total={total}
          onBack={() => setShowPayment(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}

// ─── FLOATING NAV ─────────────────────────────────────────────────────────────

function FloatingNav() {
  const { count, setOpen } = useCart();
  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-3 rounded-full border border-white/10 shadow-2xl"
      style={{ background: "rgba(8,2,20,0.85)", backdropFilter: "blur(20px)" }}
    >
      <a href="#home" className="text-white/50 hover:text-primary transition-colors"><HomeIcon size={22} /></a>
      <button onClick={() => setOpen(true)} className="relative text-white/50 hover:text-primary transition-colors">
        <ShoppingCart size={22} />
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center font-mono"
            style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)" }}
          >
            {count}
          </motion.span>
        )}
      </button>
      <a href="#home" className="w-10 h-10 rounded-full overflow-hidden border border-primary/60 flex items-center justify-center transition-all hover:border-primary"
        style={{ boxShadow: "0 0 15px rgba(168,85,247,0.4)" }}>
        <img src="/favicon-new.png" alt="Cyber Marketing Digital" className="w-full h-full object-contain p-0.5" />
      </a>
      <a href="#garantia" className="text-white/50 hover:text-primary transition-colors"><Shield size={22} /></a>
      <a href="#contacto" className="text-white/50 hover:text-primary transition-colors"><MessageCircle size={22} /></a>
    </motion.nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.18) 0%, transparent 65%), radial-gradient(ellipse at 80% 80%, rgba(236,72,153,0.10) 0%, transparent 60%), #060010"
        }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(rgba(168,85,247,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9 }} className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 mb-6"
            style={{ background: "rgba(139,92,246,0.1)" }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-primary/80 tracking-widest uppercase">Entregas activas hoy</span>
          </div>
          <div className="flex items-center justify-center gap-5 mb-5">
            <img src="/favicon-new.png" alt="Cyber Marketing Digital" className="w-28 h-28 rounded-full object-contain"
              style={{ boxShadow: "0 0 40px rgba(139,92,246,0.7), 0 0 80px rgba(236,72,153,0.25)" }} />
          </div>
          <h1 className="font-cinzel text-5xl md:text-7xl font-black text-white tracking-tight leading-none"
            style={{ textShadow: "0 0 30px rgba(139,92,246,0.4)" }}>
            CYBER<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #A855F7, #EC4899, #60A5FA)" }}>
              MARKETING DIGITAL
            </span>
          </h1>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
          <p className="font-sans text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-4 leading-relaxed">
            Hacé crecer tu cuenta con <span className="text-primary font-semibold">seguidores reales</span>, likes, vistas y más.
          </p>
          <p className="font-sans text-base text-white/40 mb-10">
            Entrega rápida · Sin contraseña · Garantía real · Pago por WhatsApp
          </p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 items-center">
          <a href="#catalogo"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base transition-all duration-300 hover:scale-105 hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7, #EC4899)", boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}>
            <TrendingUp size={20} />
            VER CATÁLOGO
          </a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base border border-white/20 transition-all duration-300 hover:border-primary/50 hover:bg-white/5"
            style={{ backdropFilter: "blur(10px)" }}>
            <MessageCircle size={20} />
            CONSULTAR POR WHATSAPP
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="mt-16 grid grid-cols-3 gap-6 md:gap-12 border-t border-white/10 pt-12 w-full max-w-xl">
          {[
            { num: "+500", label: "Clientes" },
            { num: "24hs", label: "Entrega" },
            { num: "100%", label: "Seguro" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-cinzel text-2xl md:text-3xl font-bold text-primary">{stat.num}</div>
              <div className="font-sans text-xs text-white/40 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── SERVICE CARD ─────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: ServiceGroup }) {
  const { add } = useCart();
  const [addedTier, setAddedTier] = useState<string | null>(null);

  const handleAdd = (tier: ServiceTier) => {
    const fullName = service.subtitle
      ? `${service.name} — ${service.subtitle}`
      : service.name;
    add({
      id: `${service.id}-${tier.tierQty}`,
      serviceName: fullName,
      tierQty: tier.tierQty,
      price: tier.price,
    });
    setAddedTier(tier.tierQty);
    setTimeout(() => setAddedTier(null), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -3 }}
      className="relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300"
      style={{
        background: "rgba(12,4,24,0.95)",
        borderColor: service.groupPopular ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.07)",
        boxShadow: service.groupPopular ? "0 0 30px rgba(168,85,247,0.12)" : undefined,
      }}
    >
      {service.groupPopular && (
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, #A855F7, #EC4899, transparent)" }} />
      )}

      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-primary shrink-0">{service.icon}</span>
          <h3 className="font-sans font-bold text-white text-sm leading-snug">{service.name}</h3>
        </div>
        {service.subtitle && (
          <span className="inline-block text-[9px] font-bold font-mono tracking-wider px-2 py-0.5 rounded-full text-white/80"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.3))", border: "1px solid rgba(168,85,247,0.35)" }}>
            {service.subtitle}
          </span>
        )}
      </div>

      {/* Pricing rows */}
      <div className="px-3 pb-3 flex-1">
        <div className="space-y-1">
          {service.tiers.map(tier => (
            <div
              key={tier.tierQty}
              className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg"
              style={{
                background: tier.popular ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.02)",
                border: tier.popular ? "1px solid rgba(168,85,247,0.25)" : "1px solid transparent",
              }}
            >
              {/* Left: qty + discount + label */}
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <span className="font-mono font-bold text-white text-xs whitespace-nowrap">{tier.tierQty}</span>
                {tier.discount && (
                  <span className="text-[8px] font-bold px-1 py-0.5 rounded font-mono text-white shrink-0"
                    style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
                    {tier.discount}
                  </span>
                )}
                {tier.label && (
                  <span className="text-[8px] text-primary/50 font-mono truncate">{tier.label}</span>
                )}
              </div>
              {/* Right: price + button */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="font-mono font-bold text-primary text-xs whitespace-nowrap">
                  ${tier.price.toLocaleString("es-AR")}
                </span>
                <button
                  onClick={() => handleAdd(tier)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                  style={addedTier === tier.tierQty
                    ? { background: "rgba(34,197,94,0.2)", color: "#4ade80" }
                    : { background: "linear-gradient(135deg, #7C3AED, #EC4899)", color: "white" }
                  }
                  title="Agregar al carrito"
                >
                  {addedTier === tier.tierQty
                    ? <CheckCircle2 size={12} />
                    : <Plus size={12} />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="px-4 py-3 border-t border-white/5">
        <ul className="space-y-1">
          {service.features.map((f, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[10px] text-white/45 font-sans">
              <CheckCircle2 size={10} className="text-primary/60 shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ─── CATALOG ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all",       label: "Todo",      icon: <Package size={15} /> },
  { id: "instagram", label: "Instagram", icon: <Instagram size={15} /> },
  { id: "tiktok",    label: "TikTok",    icon: <FaTiktok size={15} /> },
  { id: "facebook",  label: "Facebook",  icon: <FaFacebook size={15} /> },
  { id: "youtube",   label: "YouTube",   icon: <Youtube size={15} /> },
  { id: "spotify",   label: "Spotify",   icon: <FaSpotify size={15} /> },
];

function Catalog() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = activeCategory === "all"
    ? SERVICE_GROUPS
    : SERVICE_GROUPS.filter(s => s.category === activeCategory);

  return (
    <section id="catalogo" className="py-24 px-4 md:px-8" style={{ background: "#060010" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="font-mono text-primary text-xs tracking-[0.3em] uppercase block mb-4">Catálogo</span>
            <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4">NUESTROS PAQUETES</h2>
            <p className="font-sans text-white/50 max-w-xl mx-auto">
              Elegí el servicio, hacé clic en <span className="text-primary font-semibold">+</span> para agregar al carrito y cerrá la compra por WhatsApp en segundos.
            </p>
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold font-sans transition-all duration-300"
              style={activeCategory === cat.id
                ? { background: "linear-gradient(135deg, #7C3AED, #A855F7, #EC4899)", color: "#fff" }
                : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }
              }
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(s => <ServiceCard key={s.id} service={s} />)}
        </div>
      </div>
    </section>
  );
}

// ─── GUARANTEE ───────────────────────────────────────────────────────────────

function Guarantee() {
  const items = [
    { icon: <Shield size={28} />, title: "100% Seguro", desc: "Nunca pedimos tu contraseña. Solo necesitamos el link o usuario de tu cuenta." },
    { icon: <Zap size={28} />, title: "Entrega Rápida", desc: "La mayoría de los pedidos comienzan a procesarse en menos de 30 minutos." },
    { icon: <Users size={28} />, title: "Perfiles Reales", desc: "No bots. Trabajamos con perfiles activos para mayor autenticidad." },
    { icon: <Clock size={28} />, title: "Garantía de Retención", desc: "Si bajan los seguidores dentro del período garantizado, los reponemos sin cargo." },
  ];

  return (
    <section id="garantia" className="py-24 px-4 md:px-8 border-y border-white/5" style={{ background: "#08001a" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="font-mono text-primary text-xs tracking-[0.3em] uppercase block mb-4">Confianza</span>
            <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white">POR QUÉ ELEGIRNOS</h2>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-white/5 flex flex-col items-start gap-4 transition-all duration-300 hover:border-primary/20"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="text-primary p-3 rounded-xl" style={{ background: "rgba(139,92,246,0.12)" }}>
                {item.icon}
              </div>
              <h3 className="font-sans font-bold text-white text-base">{item.title}</h3>
              <p className="font-sans text-white/50 text-sm leading-relaxed">{item.desc}</p>
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
    { num: "01", title: "Elegí tu paquete", desc: "Navegá el catálogo y hacé clic en + para agregar los servicios al carrito." },
    { num: "02", title: "Enviá tu pedido", desc: "Hacé clic en 'Finalizar compra'. Se abre WhatsApp con tu pedido completo ya escrito." },
    { num: "03", title: "Confirmás y pagás", desc: "Acordamos el pago (transferencia, Mercado Pago u otro). Empezamos de inmediato." },
  ];

  return (
    <section className="py-24 px-4 md:px-8" style={{ background: "#060010" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="font-mono text-primary text-xs tracking-[0.3em] uppercase block mb-4">Proceso</span>
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white">¿CÓMO FUNCIONA?</h2>
          </motion.div>
        </div>
        <div className="flex flex-col gap-6 relative">
          <div className="absolute left-7 top-8 bottom-8 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden md:block" />
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex items-start gap-6"
            >
              <div className="w-14 h-14 rounded-full border border-primary/50 flex items-center justify-center shrink-0 font-mono text-primary font-bold relative z-10"
                style={{ background: "#060010", boxShadow: "0 0 15px rgba(168,85,247,0.25)" }}>
                {step.num}
              </div>
              <div className="pt-3">
                <h3 className="font-sans font-bold text-white text-lg mb-1">{step.title}</h3>
                <p className="font-sans text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT / CTA ────────────────────────────────────────────────────────────

function ContactCTA() {
  return (
    <section id="contacto" className="py-24 px-4 relative overflow-hidden" style={{ background: "#06000f" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.12) 0%, transparent 70%)"
      }} />
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="font-mono text-primary text-xs tracking-[0.3em] uppercase block mb-6">Contacto</span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-6">
            ¿TENÉS DUDAS?<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #A855F7, #EC4899, #60A5FA)" }}>
              ESCRIBINOS AHORA
            </span>
          </h2>
          <p className="font-sans text-white/50 mb-10 text-lg">
            Respondemos en minutos. Asesoramiento gratis para elegir el mejor paquete para tu cuenta.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola! Me interesa hacer crecer mi cuenta. ¿Pueden asesorarme?")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-white text-lg transition-all duration-300 hover:scale-105 hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7, #EC4899)", boxShadow: "0 0 40px rgba(139,92,246,0.4)" }}
          >
            <MessageCircle size={24} />
            HABLAR POR WHATSAPP
          </a>
          <p className="font-sans text-white/30 text-sm mt-6">
            También podés visitarnos en Instagram:{" "}
            <a href="https://www.instagram.com/seguidores_ventas_arg" target="_blank" rel="noreferrer" className="text-primary hover:underline">
              @seguidores_ventas_arg
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

function Home() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans scroll-smooth">
      <FloatingNav />
      <Hero />
      <Catalog />
      <HowItWorks />
      <Guarantee />
      <ContactCTA />
      <footer className="py-12 border-t border-white/5 text-center text-white/30 font-sans pb-28" style={{ background: "#060010" }}>
        <div className="flex justify-center mb-4">
          <img src="/favicon-new.png" alt="Cyber Marketing Digital" className="w-12 h-12 rounded-full object-contain opacity-60" />
        </div>
        <p className="font-cinzel text-xl text-white/15 mb-4 tracking-widest">CYBER MARKETING DIGITAL</p>
        <p className="text-xs mb-2">
          Instagram:{" "}
          <a href="https://www.instagram.com/seguidores_ventas_arg" target="_blank" rel="noreferrer" className="text-primary/60 hover:text-primary">
            @seguidores_ventas_arg
          </a>
        </p>
        <p className="text-xs">&copy; {new Date().getFullYear()} Cyber Marketing Digital. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <CartDrawer />
          <WouterRouter base={""}>
            <Router />
          </WouterRouter>
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
