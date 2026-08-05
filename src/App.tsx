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

const WHATSAPP_NUMBER = "5491161789518";

// ─── DATOS DE PAGO ────────────────────────────────────────────────────────────

const PAYMENT_ARS = [
  { label: "Banco",    value: "Naranja X" },
  { label: "Titular",  value: "Sebastian Agustin Herrera" },
  { label: "CUIL",     value: "20414359621" },
  { label: "CBU",      value: "4530000800017621169436" },
  { label: "Alias",    value: "CYBER.MARKET" },
];

const PAYMENT_MXN = [
  { label: "Entidad",  value: "Arcus" },
  { label: "Nombre",   value: "Sebastian Agustin Herrera" },
  { label: "CLABE",    value: "706969138998275209" },
];

const PAYMENT_EUR = [
  { label: "Destinatario", value: "Bridge Building S.A." },
  { label: "IBAN",         value: "LU17 4080 0000 4761 8383" },
];

const PAYMENT_PREX = [
  { label: "Banco",    value: "PREX" },
  { label: "Nombre",   value: "Sebastián Agustín Herrera" },
  { label: "Cuenta",   value: "38903837" },
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
      { tierQty: "2.000",   price: 2890 },
      { tierQty: "5.000",   price: 3750,  discount: "-23%" },
      { tierQty: "10.000",  price: 5500,  discount: "-32%" },
      { tierQty: "20.000",  price: 7900,  discount: "-36%" },
      { tierQty: "50.000",  price: 12500, discount: "-57%" },
      { tierQty: "150.000", price: 27000, discount: "-64%" },
      { tierQty: "300.000", price: 47000, discount: "-67%" },
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
      "Compartidas por DM",
      "Garantía: 30 días. Permanentes",
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



// ─── CART CONTEXT ─────────────────────────────────────────────────────────────
type CartItem = { id: string; serviceName: string; tierQty: string; price: number; qty: number };
type CartContextType = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  total: number; count: number;
  open: boolean; setOpen: (v: boolean) => void;
  currency: Currency; setCurrency: (v: Currency) => void;
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
  const total = items.reduce((a, i) => a + i.price * i.qty, 0);
  const count = items.reduce((a, i) => a + i.qty, 0);
  return (
    <CartContext.Provider value={{ items, add, remove, changeQty, total, count, open, setOpen, currency, setCurrency }}>
      {children}
    </CartContext.Provider>
  );
}

function buildWhatsAppMsg(items: CartItem[], total: number, currency: Currency) {
  const sym = CURRENCY_SYMBOLS[currency];
  const ls = items.map(i => `• ${i.serviceName} — ${i.tierQty} x${i.qty} = ${sym}${(i.price*i.qty).toLocaleString("es-AR")} ${currency}`);
  return encodeURIComponent(["¡Hola! Quiero confirmar mi pedido.","","📋 *DETALLE:*",...ls,"",`💰 *Total: ${sym}${total.toLocaleString("es-AR")} ${currency}*`,"","Ya realicé la transferencia. ¡Gracias!"].join("\n"));
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

type PayMethod = "ARS" | "MXN" | "EUR" | "PREX" | "OTRA";

function PaymentModal({ items, total, onBack, whatsAppUrl, onClose, currency, setCurrency }: { items:CartItem[]; total:number; onBack:()=>void; whatsAppUrl:string; onClose:()=>void; currency:Currency; setCurrency:(c:Currency)=>void }) {
  const sym = CURRENCY_SYMBOLS[currency];
  
  let activeTab = "OTRA";
  if (currency === "ARS") activeTab = "ARS";
  else if (currency === "MXN") activeTab = "MXN";
  else if (currency === "EUR") activeTab = "EUR";
  else if (currency === "UYU" || currency === "BRL") activeTab = "PREX";
  
  let data: {label:string, value:string}[] = [];
  if (activeTab === "ARS") data = PAYMENT_ARS;
  else if (activeTab === "MXN") data = PAYMENT_MXN;
  else if (activeTab === "EUR") data = PAYMENT_EUR;
  else if (activeTab === "PREX") data = PAYMENT_PREX;

  const handleTabClick = (t: string) => {
    if (t === 'ARS') setCurrency('ARS');
    else if (t === 'MXN') setCurrency('MXN');
    else if (t === 'EUR') setCurrency('EUR');
    else if (t === 'PREX') setCurrency('UYU');
    else if (t === 'OTRA') setCurrency('USD');
  };

  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, zIndex:80, display:'flex', alignItems:'flex-end', justifyContent:'center', background:'rgba(18,0,61,.65)', WebkitTransform:'translateZ(0)', transform:'translateZ(0)' }}>
      <motion.div initial={{ y:80, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ type:"spring", stiffness:320, damping:26 }}
        style={{ width:'100%', maxWidth:480, maxHeight:'95vh', display:'flex', flexDirection:'column', borderRadius:'24px 24px 0 0', background:'#fff', overflow:'hidden', boxShadow:'0 -20px 60px rgba(118,40,240,.18)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'20px 24px', borderBottom:'1px solid #f3edfc' }}>
          <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:'#9a92a8', display:'flex' }}><ChevronLeft size={22}/></button>
          <div style={{ flex:1 }}>
            <h2 style={{ fontSize:16, fontWeight:800, color:'#121212', margin:0 }}>DATOS DE PAGO</h2>
          </div>
          <div style={{ textAlign:'right' }}>
            <p style={{ fontSize:10, color:'#9a92a8', margin:0, textTransform:'uppercase', letterSpacing:'0.08em' }}>TOTAL</p>
            <p style={{ fontSize:18, fontWeight:900, color:'#7628f0', margin:0 }}>{sym}{total.toLocaleString("es-AR")} {currency}</p>
          </div>
        </div>
        
        <div style={{ padding:'16px 24px 4px' }}>
          <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom: 8, whiteSpace: 'nowrap' }}>
            {(['ARS','MXN','EUR','PREX','OTRA'] as const).map(t => (
              <button key={t} onClick={() => handleTabClick(t)}
                style={{ flexShrink: 0, padding:'8px 14px', borderRadius:14, border:'none', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:12, transition:'all 0.2s', background: activeTab===t ? 'linear-gradient(135deg,#7f1fff,#bf5bff)' : '#f6f2ff', color: activeTab===t ? '#fff' : '#7628f0' }}>
                {t==='ARS' ? '🇦🇷 ARS' : t==='MXN' ? '🇲🇽 MXN' : t==='EUR' ? '💶 EUR' : t==='PREX' ? '🌎 Prex (UYU/BRL)' : '🌐 Otra moneda'}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', padding:'16px 24px', display:'flex', flexDirection:'column', gap:8 }}>
          {data.length > 0 ? (
            <>
              {data.map(row=><CopyRow key={row.label} label={row.label} value={row.value}/>)}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#121212', fontWeight: 600 }}>
              Por favor, contactanos por WhatsApp para obtener los datos de pago para tu moneda.
            </div>
          )}

          <div style={{ background: '#f6f2ff', border: '1px solid #e9d5ff', borderRadius: 12, padding: '16px', marginTop: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#7628f0', margin: '0 0 8px 0' }}>¿Querés pagar en otra moneda?</h3>
            <p style={{ fontSize: 12, color: '#4f4f59', margin: '0 0 8px 0', lineHeight: 1.4 }}>
              Aceptamos múltiples monedas y métodos de pago, como USDT, dólares (USD), euros (EUR), soles peruanos (PEN), pesos colombianos (COP), pesos mexicanos (MXN), entre otras.
            </p>
            <p style={{ fontSize: 12, color: '#4f4f59', margin: 0, lineHeight: 1.4 }}>
              Si la moneda o el método de pago que necesitás está disponible, seleccionalo al realizar tu pedido y completá el pago a la brevedad para agilizar la confirmación y el procesamiento de tu compra.
            </p>
          </div>
        </div>
        <div style={{ padding:'20px 24px calc(20px + env(safe-area-inset-bottom, 0px))', borderTop:'1px solid #f3edfc', display:'flex', flexDirection:'column', gap:12 }}>
          <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer"
            style={{ width:'100%', padding:16, borderRadius:16, cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:15, color:'#fff', background:'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow:'0 6px 24px rgba(22,163,74,.35)', display:'flex', alignItems:'center', justifyContent:'center', gap:10, textDecoration:'none', boxSizing:'border-box' }}>
            <CheckCircle2 size={20}/> YA TRANSFERÍ — CONFIRMAR PEDIDO
          </a>
          <p style={{ textAlign:'center', fontSize:11, color:'#9a92a8', margin:0 }}>Se abrirá WhatsApp para enviarnos el comprobante.</p>
        </div>
      </motion.div>
    </div>
  );
}

function CartDrawer() {
  const { items, remove, changeQty, total, open, setOpen, currency, setCurrency } = useCart();
  const sym = CURRENCY_SYMBOLS[currency];
  const [showPayment, setShowPayment] = useState(false);
  const whatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMsg(items,total,currency)}`;
  const handleClose = () => { setShowPayment(false); setOpen(false); };
  return (
    <>
      <div onClick={()=>{setOpen(false);setShowPayment(false);}} style={{ position:'fixed', top:0, left:0, right:0, bottom:0, zIndex:60, background:'rgba(18,0,61,.5)', opacity:open?1:0, pointerEvents:open?'auto':'none', transition:'opacity 0.3s' }}/>
      <aside style={{ position:'fixed', right:0, top:0, height:'100dvh', height:'-webkit-fill-available', width:'100%', maxWidth:420, zIndex:70, display:'flex', flexDirection:'column', background:'#fff', boxShadow:'-12px 0 50px rgba(118,40,240,.12)', transform:open?'translateX(0)':'translateX(100%)', transition:'transform 0.3s ease-out', WebkitTransform: open?'translateX(0)':'translateX(100%)' }}>
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
            <span style={{ fontWeight:600, color:'#9a92a8', fontSize:13 }}>Total</span>
            <span style={{ fontWeight:900, color:'#121212', fontSize:24 }}>{sym}{total.toLocaleString("es-AR")} {currency}</span>
          </div>
          <button onClick={()=>{if(items.length>0)setShowPayment(true);}} disabled={items.length===0}
            style={{ width:'100%', padding:16, borderRadius:16, border:'none', cursor:items.length>0?'pointer':'not-allowed', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:15, color:'#fff', background:'linear-gradient(135deg,#7f1fff 0%,#9c34ff 55%,#bf5bff 100%)', boxShadow:'0 6px 24px rgba(118,40,240,.35)', opacity:items.length===0?.4:1, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            <Banknote size={20}/> PAGAR AHORA
          </button>
        </div>
      </aside>
      {showPayment && open && <PaymentModal items={items} total={total} onBack={()=>setShowPayment(false)} whatsAppUrl={whatsAppUrl} onClose={handleClose} currency={currency} setCurrency={setCurrency} />}
    </>
  );
}

function CurrencySelector() {
  const { currency, setCurrency } = useCart();
  const currencies: Currency[] = ["ARS","USD","EUR","COP","MXN","UYU","BRL"];
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20M2 12h20"/></svg>
        {currency}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, background:'#1a0035', borderRadius:14, boxShadow:'0 8px 40px rgba(118,40,240,.4)', border:'1px solid rgba(168,85,247,.3)', padding:6, zIndex:100, minWidth:100 }}>
          {currencies.map(c=>(
            <button key={c} onClick={()=>{setCurrency(c);setOpen(false);}}
              style={{ display:'block', width:'100%', padding:'8px 14px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, textAlign:'left', background: currency===c ? 'linear-gradient(135deg,#7f1fff,#9c34ff)' : 'transparent', color: currency===c ? '#fff' : 'rgba(255,255,255,0.8)', transition:'background 0.15s' }}>
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── HEADER (pixel perfect) ───────────────────────────────────────────────────
// Announcement bar (black) → White header (logo centered, nav centered) → Purple sub-nav scrollable

const SERVICE_SHORTCUTS = [
  { label:'Instagram', icon: <Instagram size={18} strokeWidth={2} /> },
  { label:'TikTok', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg> },
  { label:'Facebook', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
  { label:'Youtube', icon: <Youtube size={18} strokeWidth={2} /> },
  { label:'Spotify', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 11.973c2.5-1.473 5.5-.973 7.5.527"></path><path d="M9 15c1.5-1 4-1 5 .5"></path><path d="M7 9c3-2 7-2 9 0"></path></svg> },
  { label:'OFERTAS ??', icon: null }
];

function Header() {
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:50 }}>
      {/* Announcement bar */}
      <div style={{ background:'linear-gradient(266deg,rgba(5,5,5,1),rgba(65,65,65,1) 100%)', color:'#fff', padding:'7px 24px', display:'flex', alignItems:'center', justifyContent:'center', gap:20 }}>
        <Instagram size={14} style={{ opacity:.8 }}/>
        <FaTiktok size={13} style={{ opacity:.8 }}/>
        <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>3 CUOTAS SIN INTERES</span>
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
              {['Inicio','¿Cómo funciona?','Preguntas Frecuentes'].map(label=>(
                <a key={label} href="#" style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.85)', textDecoration:'none' }}>{label}</a>
              ))}
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
            {['Inicio','¿Cómo funciona?','Preguntas Frecuentes','Saber Más','Blog'].map(label=>(
              <a key={label} href="#" onClick={()=>setMobileOpen(false)}
                style={{ display:'block', padding:'12px 0', fontSize:15, fontWeight:600, color:'rgba(255,255,255,0.9)', textDecoration:'none', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Purple sub-nav with service shortcuts */}
      <div style={{ background:'linear-gradient(135deg,#7628f0 0%,#9c34ff 100%)', overflowX:'auto', scrollbarWidth:'none' }}>
        <div style={{ display:'flex', gap:0, padding:'0 16px', maxWidth:1200, margin:'0 auto', width:'max-content', height: 42 }}>
          {SERVICE_SHORTCUTS.map((s,i)=>(
            <a key={i} href="#catalogo" style={{ display:'flex', alignItems:'center', gap:6, padding:'0 14px', color:'rgba(255,255,255,.9)', textDecoration:'none', borderRight:'1px solid rgba(255,255,255,.12)', whiteSpace:'nowrap', ...((i===SERVICE_SHORTCUTS.length-1) ? { borderRight: 'none', fontWeight: 800 } : {}) }}>
              {s.icon && <span style={{ display:'flex', alignItems:'center', opacity: 0.9 }}>{s.icon}</span>}
              <span style={{ fontSize:12, fontWeight:600, color:'#fff' }}>{s.label}</span>
            </a>
          ))}
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
import { gsap } from "gsap";

function Hero() {
  useEffect(() => {
    // Animate header logo with fade-in + glow pulse
    gsap.fromTo('.header-logo',
      { opacity: 0, scale: 0.7, filter: 'brightness(0)' },
      { opacity: 1, scale: 1, filter: 'brightness(1)', duration: 1.2, ease: 'back.out(1.5)' }
    );
    // Continuous neon glow pulse on header logo
    gsap.to('.header-logo', {
      filter: 'drop-shadow(0 0 18px rgba(156,52,255,0.9)) drop-shadow(0 0 40px rgba(80,100,255,0.6)) brightness(1.05)',
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.2
    });
    // Hero text animations
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
    // Floating animation for decorative shapes
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
      paddingTop:130, paddingBottom:90, position:'relative', overflow:'hidden',
      background:`radial-gradient(circle at 15% 18%, rgba(141,44,255,.18), transparent 32%), radial-gradient(circle at 85% 78%, rgba(176,82,255,.14), transparent 28%), linear-gradient(135deg, #18003d 0%, #2a0066 36%, #3a008c 72%, #4b0fb0 100%)`
    }}>
      {/* Decorative subtle shapes */}
      {[
        { left:40, top:'30%', size:70, rotate:15 },
        { left:80, top:'60%', size:40, rotate:-10 },
        { right:120, top:'20%', size:55, rotate:20 },
      ].map((s,i)=>(
        <div key={i} className="hero-shape-anim" style={{ position:'absolute', left:s.left, right:s.right, top:s.top, width:s.size, height:s.size, border:'4px solid rgba(255,255,255,0.06)', borderRadius:14, transform:`rotate(${s.rotate}deg)`, pointerEvents:'none' }}/>
      ))}

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', gap:60, flexWrap:'wrap' }}>
        {/* Left */}
        <div style={{ flex:'1 1 460px', maxWidth:580 }}>
          <div className="hero-subtitle-anim">
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:20, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', marginBottom:28 }}>
              <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.9)', letterSpacing:'0.06em', textTransform:'uppercase' }}>AR</span>
              <span style={{ fontSize:11, fontWeight:700, color:'#fff' }}>Sitio #1 en Argentina</span>
            </div>
            <h1 className="hero-title-anim" style={{ fontWeight:900, fontSize:'clamp(42px,6vw,72px)', lineHeight:1.05, color:'#fff', margin:'0 0 24px', letterSpacing:'-2px' }}>
              Marketing fácil <br/> <span style={{ color:'transparent', WebkitTextStroke:'1px rgba(255,255,255,.9)' }}>para vender</span><br/>mejor.
            </h1>
            <p className="hero-subtitle-anim" style={{ fontSize:18, color:'rgba(255,255,255,.7)', lineHeight:1.6, margin:'0 0 40px', fontWeight:500, maxWidth:480 }}>
              Impulsá tu perfil en minutos, de forma automática y segura.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:36 }}>
              {[['🤖','Automático con IA'],['🔒','Seguro'],['🚫','Sin contraseña'],['⚡','Entrega rápida']].map(([icon,label])=>(
                <span key={label as string} style={{ padding:'7px 14px', borderRadius:20, background:'rgba(0,0,0,.25)', border:'1px solid rgba(255,255,255,.2)', color:'#fff', fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
                  {icon} {label}
                </span>
              ))}
            </div>
            <a href="#catalogo" style={{ display:'inline-flex', alignItems:'center', padding:'17px 36px', borderRadius:14, textDecoration:'none', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:14, color:'#fff', letterSpacing:'0.05em', textTransform:'uppercase', background:'linear-gradient(135deg,#7f1fff 0%,#9c34ff 55%,#bf5bff 100%)', boxShadow:'0 8px 30px rgba(127,31,255,.45)' }}>
              QUIERO IMPULSAR MI PERFIL AHORA
            </a>
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
                <p style={{ fontWeight:900, fontSize:17, color:'#121212', margin:0 }}>CyberDigital</p>
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
              <p style={{ fontWeight:900, fontSize:14, color:'#7628f0', margin:0, lineHeight:1.3 }}>Perfil detectado<br/>correctamente</p>
            </div>
          </motion.div>
          <motion.div animate={{ y:[0,-10,0] }} transition={{ repeat:Infinity, duration:4, ease:'easeInOut' }}
            style={{ position:'absolute', top:-18, right:-10, background:'#fff', borderRadius:50, padding:'8px 16px', boxShadow:'0 8px 30px rgba(18,0,61,.18)', display:'flex', alignItems:'center', gap:8, zIndex:3, border:'1px solid rgba(141,44,255,.08)' }}>
            <span style={{ fontSize:14 }}>💜</span><span style={{ fontWeight:700, fontSize:12, color:'#121212' }}>Perfil más sólido</span>
          </motion.div>
          <motion.div animate={{ y:[0,10,0] }} transition={{ repeat:Infinity, duration:5, ease:'easeInOut', delay:1.5 }}
            style={{ position:'absolute', bottom:-14, left:-10, background:'#fff', borderRadius:50, padding:'8px 16px', boxShadow:'0 8px 30px rgba(18,0,61,.18)', display:'flex', alignItems:'center', gap:8, zIndex:3, border:'1px solid rgba(141,44,255,.08)' }}>
            <span style={{ fontSize:14 }}>🏆</span><span style={{ fontWeight:700, fontSize:12, color:'#121212' }}>Superior a la competencia</span>
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
    <div ref={containerRef} style={{ background:'#fff', padding:'36px 24px', borderBottom:'1px solid #ececec' }}>
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

// ─── CATALOG (platform cards + service tiers) ─────────────────────────────────
const PLATFORM_CARDS = [
  { id:'instagram', label:'INSTAGRAM', icon:'/instagram-3d.png', available:true },
  { id:'tiktok',    label:'TIKTOK',    icon:'/tiktok-3d.png', available:true },
  { id:'youtube',   label:'YOUTUBE',   icon:'/youtube-3d.png', available:true },
  { id:'facebook',  label:'FACEBOOK',  icon:'/facebook-3d.png', available:true },
  { id:'google',    label:'GOOGLE REVIEWS', icon:'/google-reviews-3d.png', available:false },
  { id:'ingresos',  label:'GENERÁ INGRESOS', icon:'/genera-ingresos-3d.png', available:false },
];

function ServiceTierView({ service }: { service: ServiceGroup }) {
  const { add, currency } = useCart();
  const [addedTier, setAddedTier] = useState<string|null>(null);
  const handleAdd = (tier: ServiceTier, price: number) => {
    const name = service.subtitle ? `${service.name} — ${service.subtitle}` : service.name;
    add({ id:`${service.id}-${tier.tierQty}`, serviceName:name, tierQty:tier.tierQty, price });
    setAddedTier(tier.tierQty);
    setTimeout(()=>setAddedTier(null), 1500);
  };
  return (
    <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:'1px solid rgba(141,44,255,.08)', boxShadow:'0 4px 20px rgba(118,40,240,.07)' }}>
      <div style={{ padding:'20px 20px 14px', textAlign:'center', borderBottom:'1px solid rgba(141,44,255,.06)' }}>
        <div style={{ fontSize:32, marginBottom:10 }}>{service.icon}</div>
        <h3 style={{ fontWeight:900, fontSize:17, color:'#121212', margin:0 }}>{service.name}</h3>
        {service.subtitle && <p style={{ fontWeight:700, fontSize:10, color:'#7628f0', margin:'4px 0 0', textTransform:'uppercase', letterSpacing:'0.1em' }}>{service.subtitle}</p>}
      </div>
      <div style={{ padding:14, display:'flex', flexDirection:'column', gap:8 }}>
        {service.tiers.map((tier,i)=>{
          const price = getPrice(service.id, i, tier.price, currency);
          return (
            <div key={tier.tierQty} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, padding:'10px 14px', borderRadius:12, background:'#f9fafb', border:'1.5px solid transparent' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontWeight:800, fontSize:15, color:'#121212' }}>{tier.tierQty}</span>
                {tier.discount && <span style={{ fontSize:9, fontWeight:800, padding:'3px 7px', borderRadius:6, background:'#fee2e2', color:'#dc2626', textTransform:'uppercase' }}>{tier.discount}</span>}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                <span style={{ fontWeight:900, fontSize:15, color:'#121212' }}>{CURRENCY_SYMBOLS[currency]}{price.toLocaleString("es-AR")}</span>
                <button onClick={()=>handleAdd(tier, price)}
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
  const [activePlatform, setActivePlatform] = useState<string|null>(null);

  const filteredServices = activePlatform
    ? SERVICE_GROUPS.filter(s => s.category === activePlatform)
    : [];

  return (
    <section id="catalogo" style={{ background:'linear-gradient(180deg,#f9fafb 0%,#f3f3f6 100%)' }}>
      {/* Section header */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'60px 24px 48px', textAlign:'center' }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div style={{ display:'inline-block', padding:'5px 18px', borderRadius:20, background:'rgba(118,40,240,.1)', border:'1px solid rgba(118,40,240,.15)', marginBottom:18 }}>
            <span style={{ fontWeight:700, fontSize:11, color:'#7628f0', textTransform:'uppercase', letterSpacing:'0.1em' }}>COLECCIONES</span>
          </div>
          <h2 style={{ fontWeight:900, fontSize:'clamp(26px,3.5vw,50px)', color:'#121212', margin:'0 0 14px', letterSpacing:'-1px' }}>
            Seleccioná la plataforma que querés potenciar
          </h2>
          <p style={{ fontSize:15, color:'#6d6282', margin:0, fontWeight:500, maxWidth:540, marginLeft:'auto', marginRight:'auto' }}>
            Explorá nuestras líneas de servicios y elegí la solución que mejor se adapta a tu presencia digital.
          </p>
        </motion.div>
      </div>

      {/* Platform grid */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px 40px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:20 }}>
          {PLATFORM_CARDS.map((p,i)=>(
            <motion.div key={p.id} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*.07 }}>
              <button onClick={()=>{ 
                  if(p.available) {
                    const isActivating = activePlatform !== p.id;
                    setActivePlatform(isActivating ? p.id : null); 
                    if(isActivating) {
                      setTimeout(() => {
                        document.getElementById('services-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 50);
                    }
                  }
                }}
                style={{ width:'100%', background:'#fff', borderRadius:20, padding:'32px 20px 24px', border: activePlatform===p.id?'2px solid #7628f0':'2px solid transparent', boxShadow: activePlatform===p.id?'0 8px 30px rgba(118,40,240,.2)':'0 4px 16px rgba(118,40,240,.07)', cursor:p.available?'pointer':'default', transition:'all 0.25s', display:'flex', flexDirection:'column', alignItems:'center', gap:14, textAlign:'center', fontFamily:'Poppins,sans-serif' }}>
                <img src={p.icon} alt={p.label} style={{ width: 100, height: 100, objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }} />
                <strong style={{ fontWeight:900, fontSize:15, color:'#121212', letterSpacing:'0.04em' }}>{p.label}</strong>
                {p.available ? (
                  <div style={{ padding:'10px 28px', borderRadius:8, background: activePlatform===p.id?'linear-gradient(135deg,#7f1fff,#bf5bff)':'linear-gradient(135deg,#7f1fff,#bf5bff)', color:'#fff', fontWeight:800, fontSize:12, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                    {activePlatform===p.id?'CERRAR':'EXPLORAR'}
                  </div>
                ) : (
                  <div style={{ padding:'10px 28px', borderRadius:8, background:'#ececec', color:'#9a92a8', fontWeight:700, fontSize:12, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                    PRÓXIMAMENTE
                  </div>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service tiers for selected platform */}
      {activePlatform && filteredServices.length > 0 && (
        <div id="services-grid" style={{ background:'#fff', borderTop:'1px solid rgba(118,40,240,.08)' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'40px 24px 60px' }}>
            <h3 style={{ fontWeight:900, fontSize:22, color:'#121212', marginBottom:28, letterSpacing:'-0.5px' }}>
              Servicios de {PLATFORM_CARDS.find(p=>p.id===activePlatform)?.label}
            </h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20 }}>
              {filteredServices.map(s => <ServiceTierView key={s.id} service={s}/>)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── BENEFITS (Prueba Social - purple dark) ───────────────────────────────────
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
    { num:'01', title:'Elegí tu servicio', desc:'Navegá el catálogo, encontrá el servicio y agregalo al carrito.' },
    { num:'02', title:'Enviá tu pedido', desc:'Hacé clic en Pagar Ahora. Te abrimos WhatsApp con los datos listos.' },
    { num:'03', title:'Confirmás y empezamos', desc:'Abonás por transferencia y activamos el servicio al instante.' },
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
function FAQ() {
  const [openIdx, setOpenIdx] = useState<number|null>(null);
  const faqs = [
    { q:'¿Es seguro para mi cuenta?', a:'Sí. Nunca pedimos tu contraseña. Solo necesitamos el link o nombre de usuario de tu perfil.' },
    { q:'¿Cuánto tarda en llegar?', a:'La mayoría comienzan en menos de 30 minutos. Algunos pueden demorar hasta 24hs.' },
    { q:'¿Los seguidores son reales?', a:'Trabajamos con perfiles activos para mayor autenticidad y retención.' },
    { q:'¿Ofrecen garantía?', a:'Sí. Si bajan dentro del período garantizado, los reponemos sin cargo adicional.' },
    { q:'¿Cómo pago?', a:'Transferencia bancaria en Pesos ARS o Dólares USD. Los datos se muestran al confirmar.' },
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

// ─── FLOATING WHATSAPP ────────────────────────────────────────────────────────
function FloatingWhatsApp() {
  return (
    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"
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
