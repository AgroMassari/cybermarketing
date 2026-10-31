import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Zap,
  Star,
  Lock,
  ArrowRight,
  Info,
  ExternalLink
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { NeonPhoneMockup } from "./NeonPhoneMockup";
import { SubServiceDef } from "@/data/subServices";
import { Currency, CURRENCY_SYMBOLS, getPrice } from "@/data/pricing";

// We import the types and helper from App
export interface ServiceTier {
  tierQty: string;
  price: number;
  discount?: string;
  popular?: boolean;
  label?: string;
}

export interface ServiceGroup {
  id: string;
  category: "instagram" | "tiktok" | "youtube" | "facebook" | "spotify";
  name: string;
  subtitle?: string;
  features: string[];
  icon: React.ReactNode;
  tiers: ServiceTier[];
  groupPopular?: boolean;
}

interface ProductDetailViewProps {
  subService: SubServiceDef;
  serviceGroups: ServiceGroup[];
  currency: Currency;
  onBack: () => void;
  onAddToCart: (item: { id: string; serviceName: string; tierQty: string; price: number }, targetAccount?: string) => void;
  onStartCheckout: (item: { id: string; serviceName: string; tierQty: string; price: number; qty: number }, targetAccount?: string) => void;
}

export function ProductDetailView({
  subService,
  serviceGroups,
  currency,
  onBack,
  onAddToCart,
  onStartCheckout,
}: ProductDetailViewProps) {
  // Find all service groups (variations) that match this sub-service
  const matchingGroups = useMemo(() => {
    return subService.serviceGroupIds
      .map(id => serviceGroups.find(g => g.id === id))
      .filter((g): g is ServiceGroup => Boolean(g));
  }, [subService, serviceGroups]);

  // Selected variation tab
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    matchingGroups[0]?.id || subService.serviceGroupIds[0] || ""
  );

  const activeGroup = useMemo(() => {
    return matchingGroups.find(g => g.id === selectedGroupId) || matchingGroups[0];
  }, [matchingGroups, selectedGroupId]);

  // Selected tier index inside the active group
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(() => {
    if (!activeGroup) return 0;
    // Default to a popular tier or 2nd/3rd tier if available
    const popIdx = activeGroup.tiers.findIndex(t => t.popular);
    return popIdx !== -1 ? popIdx : Math.min(2, Math.max(0, activeGroup.tiers.length - 1));
  });

  // Account / link input
  const [accountInput, setAccountInput] = useState("");
  const [reviewCheckbox, setReviewCheckbox] = useState(true);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Fallback if activeGroup or tier is missing
  const activeTier = activeGroup?.tiers[selectedTierIndex] || activeGroup?.tiers[0];

  // Price calculations
  const price = useMemo(() => {
    if (!activeGroup || !activeTier) return 0;
    return getPrice(activeGroup.id, selectedTierIndex, activeTier.price, currency);
  }, [activeGroup, activeTier, selectedTierIndex, currency]);

  // Regular price for discount anchor (~30% higher)
  const regularPrice = useMemo(() => {
    return Math.round(price * 1.33);
  }, [price]);

  // 3 cuotas sin interés
  const installmentPrice = useMemo(() => {
    return Math.round(price / 3);
  }, [price]);

  const sym = CURRENCY_SYMBOLS[currency] || "$";

  // Bonus calculation
  const bonusInfo = useMemo(() => {
    if (!activeTier || !subService.bonusPercent) return null;
    // Try to extract numeric quantity from tierQty like "1.000" -> 1000
    const cleanNum = parseInt(activeTier.tierQty.replace(/\./g, "").replace(/,/g, "").match(/\d+/)?.[0] || "0", 10);
    if (!cleanNum || cleanNum < 50) return null;
    const bonus = Math.round(cleanNum * (subService.bonusPercent / 100));
    const total = cleanNum + bonus;
    return {
      bonusStr: bonus.toLocaleString("es-AR"),
      totalStr: total.toLocaleString("es-AR"),
      percent: subService.bonusPercent,
    };
  }, [activeTier, subService.bonusPercent]);

  // Build full item name for cart/checkout
  const fullName = useMemo(() => {
    if (!activeGroup) return subService.name;
    return activeGroup.subtitle
      ? `${activeGroup.name} (${activeGroup.subtitle})`
      : activeGroup.name;
  }, [activeGroup, subService.name]);

  const handleAdd = () => {
    if (!activeGroup || !activeTier) return;
    onAddToCart({
      id: `${activeGroup.id}-${activeTier.tierQty}`,
      serviceName: fullName,
      tierQty: activeTier.tierQty,
      price,
    }, accountInput);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2200);
  };

  const handleCheckout = () => {
    if (!activeGroup || !activeTier) return;
    onStartCheckout({
      id: `${activeGroup.id}-${activeTier.tierQty}`,
      serviceName: fullName,
      tierQty: activeTier.tierQty,
      price,
      qty: 1,
    }, accountInput);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "10px 0 40px" }}>
      {/* Top Back Navigation Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1px solid rgba(141,44,255,.15)",
            borderRadius: 12,
            padding: "10px 18px",
            color: "#7628f0",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(118,40,240,.06)",
            transition: "all 0.15s",
          }}
        >
          <ChevronLeft size={18} />
          <span>Volver a servicios de {subService.platform.toUpperCase()}</span>
        </button>

        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "#7628f0",
            background: "#f6f2ff",
            padding: "8px 16px",
            borderRadius: 20,
            border: "1px solid rgba(118,40,240,.1)",
          }}
        >
          Precios en {currency} ({sym})
        </span>
      </div>

      {/* Main Product Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 28,
          border: "1px solid rgba(141,44,255,.1)",
          boxShadow: "0 10px 40px rgba(18,0,61,.06)",
          overflow: "hidden",
          marginBottom: 40,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, padding: "36px 32px" }}>
          {/* Left Column: Visual Showcase Mockup */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 16px",
              background: "linear-gradient(180deg, #18003d 0%, #290059 100%)",
              borderRadius: 22,
              color: "#fff",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Ambient neon light inside */}
            <div
              style={{
                position: "absolute",
                top: "20%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 260,
                height: 260,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
                filter: "blur(30px)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 2, marginBottom: 18 }}>
              <NeonPhoneMockup type={subService.iconType} label={subService.name} size="lg" />
            </div>

            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "rgba(255,255,255,0.92)",
                maxWidth: 280,
                lineHeight: 1.45,
                margin: "0 0 6px",
                position: "relative",
                zIndex: 2,
              }}
            >
              Al comprar {subService.name.toLowerCase()} vas a recibir perfiles de alta calidad y entrega garantizada
            </p>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#c084fc",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                position: "relative",
                zIndex: 2,
              }}
            >
              ⚡ Entrega automática 24/7 sin contraseña
            </span>
          </div>

          {/* Right Column: Interactive Configurator */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Header: Title + Price + Installments */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: "#121212", margin: 0, letterSpacing: "-0.5px" }}>
                  {subService.name}
                </h2>
                {activeTier?.popular && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#fff",
                      background: "linear-gradient(135deg, #7f1fff, #bf5bff)",
                      padding: "3px 10px",
                      borderRadius: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    MÁS VENDIDO
                  </span>
                )}
              </div>

              {/* Price row */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: "#7628f0", letterSpacing: "-0.8px" }}>
                  {sym}{price.toLocaleString("es-AR")}
                </span>
                <span style={{ fontSize: 16, color: "#9a92a8", textDecoration: "line-through", fontWeight: 600 }}>
                  {sym}{regularPrice.toLocaleString("es-AR")}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#dc2626",
                    background: "#fee2e2",
                    padding: "3px 8px",
                    borderRadius: 8,
                    letterSpacing: "0.04em",
                  }}
                >
                  {activeTier?.discount || "25% OFF"}
                </span>
              </div>

              {/* Installments notice */}
              <p style={{ fontSize: 13, fontWeight: 700, color: "#4b5563", margin: "4px 0 0" }}>
                💳 3 cuotas sin interés de <span style={{ color: "#7628f0" }}>{sym}{installmentPrice.toLocaleString("es-AR")}</span>
              </p>
            </div>

            {/* Quality / Variation Tabs (if multiple available) */}
            {matchingGroups.length > 1 && (
              <div style={{
                background: "linear-gradient(180deg, #f5effe 0%, #ece2fb 100%)",
                border: "2px solid #d8b4fe",
                borderRadius: 22,
                padding: "18px 16px",
                boxShadow: "0 6px 20px rgba(118,40,240,.08), inset 0 2px 4px rgba(255,255,255,.6)"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: "#4c1d95", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    ⭐ TIPO DE SERVICIO / CALIDAD:
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#6d28d9", background: "#ffffff", padding: "3px 10px", borderRadius: 12, border: "1px solid #ddd6fe" }}>
                    Elegí tu opción preferida
                  </span>
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(auto-fit, minmax(${matchingGroups.length === 3 ? "125px" : "150px"}, 1fr))`,
                  gap: 10,
                }}>
                  {matchingGroups.map(g => {
                    const isSelected = g.id === selectedGroupId;
                    const tabLabel = g.subtitle || g.name;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          setSelectedGroupId(g.id);
                          if (selectedTierIndex >= g.tiers.length) {
                            setSelectedTierIndex(0);
                          }
                        }}
                        style={{
                          padding: "14px 10px",
                          borderRadius: 16,
                          fontWeight: 900,
                          fontSize: 13,
                          cursor: "pointer",
                          fontFamily: "Poppins, sans-serif",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          border: isSelected ? "2.5px solid #581c87" : "2px solid #cbd5e1",
                          background: isSelected ? "linear-gradient(135deg, #7f1fff 0%, #9c34ff 100%)" : "#ffffff",
                          color: isSelected ? "#ffffff" : "#0f172a",
                          boxShadow: isSelected ? "0 8px 24px rgba(118,40,240,.45)" : "0 3px 10px rgba(0,0,0,.08)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          textAlign: "center",
                          transition: "all 0.18s ease",
                          transform: isSelected ? "scale(1.02)" : "scale(1)",
                        }}
                      >
                        <span style={{
                          fontSize: 10,
                          fontWeight: 900,
                          padding: "2px 8px",
                          borderRadius: 8,
                          background: isSelected ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                          color: isSelected ? "#ffffff" : "#475569",
                          letterSpacing: "0.06em",
                        }}>
                          {isSelected ? "✓ SELECCIONADO" : "OPCIÓN"}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 900, lineHeight: 1.25 }}>
                          {tabLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Retention & Stability Banner (Easy Marketing style) */}
            <div
              style={{
                background: "linear-gradient(135deg, #fbf7ff 0%, #f6efff 100%)",
                border: "1.5px solid rgba(168, 85, 247, 0.25)",
                borderRadius: 16,
                padding: "14px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#7628f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  <Star size={13} fill="#fff" />
                </div>
                <span style={{ fontWeight: 900, fontSize: 13, color: "#4c1d95", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {subService.stabilityTitle || "MENOS CAÍDAS, MÁS ESTABILIDAD"}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "#581c87", lineHeight: 1.45, fontWeight: 500 }}>
                {subService.stabilityDesc || "Seguidores premium y estables. Inicio: 0 a 72 hs. Carga progresiva y garantía de reposición."}
              </p>
            </div>

            {/* Quantity Selector Pills (SELECCIONÁ LA CANTIDAD) */}
            <div style={{
              background: "linear-gradient(180deg, #f5effe 0%, #ece2fb 100%)",
              border: "2px solid #d8b4fe",
              borderRadius: 22,
              padding: "18px 16px",
              boxShadow: "0 6px 20px rgba(118,40,240,.08), inset 0 2px 4px rgba(255,255,255,.6)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 900, color: "#4c1d95", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  📦 SELECCIONÁ LA CANTIDAD:
                </span>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#6d28d9", background: "#ffffff", padding: "3px 10px", borderRadius: 12, border: "1px solid #ddd6fe" }}>
                  Elegida: {activeTier?.tierQty}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                  gap: 10,
                }}
              >
                {activeGroup?.tiers.map((t, idx) => {
                  const isSelected = idx === selectedTierIndex;
                  return (
                    <button
                      key={t.tierQty}
                      type="button"
                      onClick={() => setSelectedTierIndex(idx)}
                      style={{
                        padding: "12px 8px",
                        borderRadius: 14,
                        border: isSelected ? "2.5px solid #581c87" : "2px solid #cbd5e1",
                        background: isSelected ? "linear-gradient(135deg, #7f1fff 0%, #9c34ff 100%)" : "#ffffff",
                        color: isSelected ? "#ffffff" : "#0f172a",
                        fontWeight: 900,
                        fontSize: 15,
                        cursor: "pointer",
                        fontFamily: "Poppins, sans-serif",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        boxShadow: isSelected ? "0 8px 22px rgba(118,40,240,.45)" : "0 3px 8px rgba(0,0,0,.08)",
                        transition: "all 0.18s ease",
                        transform: isSelected ? "scale(1.04)" : "scale(1)",
                      }}
                    >
                      <span>{t.tierQty}</span>
                      {t.popular && (
                        <span
                          style={{
                            fontSize: 8,
                            fontWeight: 900,
                            padding: "2px 6px",
                            borderRadius: 6,
                            background: isSelected ? "#ffffff" : "#fae8ff",
                            color: isSelected ? "#7628f0" : "#9333ea",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          TOP
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gift Bonus Box (Easy Marketing style) */}
            {bonusInfo && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "#faf5ff",
                  border: "1px dashed #c084fc",
                  borderRadius: 14,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 12,
                  color: "#6b21a8",
                  fontWeight: 600,
                }}
              >
                <span style={{ fontSize: 18 }}>🎁</span>
                <span>
                  Incluye <strong>+{bonusInfo.bonusStr} {subService.bonusLabel || "de regalo"}</strong> ({bonusInfo.percent}%).
                  ¡Recibís <strong>{bonusInfo.totalStr}</strong> en total!
                </span>
              </motion.div>
            )}

            {/* Target Account Input Box (Cyan/Lilac container) */}
            <div
              style={{
                background: "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)",
                border: "1.5px solid #a7f3d0",
                borderRadius: 18,
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 800, color: "#065f46" }}>
                <span>{subService.accountLabel || "¿Tu cuenta está lista para crecer?"}</span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={accountInput}
                  onChange={(e) => setAccountInput(e.target.value)}
                  placeholder={subService.accountPlaceholder || "@tu.cuenta"}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1.5px solid #6ee7b7",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#064e3b",
                    background: "#fff",
                    outline: "none",
                    fontFamily: "Poppins, sans-serif",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,.02)",
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#047857", fontWeight: 600 }}>
                <Lock size={12} />
                <span>{subService.accountHelper || "Escribí tu usuario. No necesitás contraseña."}</span>
              </div>
            </div>

            {/* Checkbox for Instagram review guide */}
            <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: "#1f2937",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "10px 14px",
                  background: "#f9fafb",
                  borderRadius: 14,
                  border: "1.5px solid #e5e7eb",
                }}
              >
                <input
                  type="checkbox"
                  checked={reviewCheckbox}
                  onChange={(e) => setReviewCheckbox(e.target.checked)}
                  style={{ width: 17, height: 17, accentColor: "#7628f0", cursor: "pointer" }}
                />
                <span>
                  Perfil público para la operación / carga
                </span>
              </label>

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
              {/* Add to Cart button */}
              <button
                type="button"
                onClick={handleAdd}
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  borderRadius: 16,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 900,
                  fontSize: 15,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#fff",
                  background: addedSuccess
                    ? "#22c55e"
                    : "linear-gradient(135deg, #7f1fff 0%, #9c34ff 50%, #bf5bff 100%)",
                  boxShadow: addedSuccess
                    ? "0 8px 24px rgba(34,197,94,.4)"
                    : "0 8px 28px rgba(127,31,255,.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  transition: "all 0.2s ease",
                }}
              >
                {addedSuccess ? (
                  <>
                    <CheckCircle2 size={20} />
                    <span>¡Agregado al Carrito!</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} strokeWidth={2.5} />
                    <span>Agregar al Carrito</span>
                  </>
                )}
              </button>

              {/* Direct WhatsApp request button */}
              <button
                type="button"
                onClick={handleCheckout}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: 16,
                  border: "1.5px solid #25d366",
                  background: "rgba(37, 211, 102, 0.08)",
                  color: "#166534",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontFamily: "Poppins, sans-serif",
                  transition: "all 0.15s ease",
                }}
              >
                <FaWhatsapp size={19} color="#25d366" />
                <span>Pedir directo por WhatsApp / Transferencia</span>
              </button>
            </div>

            {/* Badges of Security & Payment methods */}
            <div
              style={{
                borderTop: "1px solid #f3edfc",
                paddingTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                textAlign: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#4b5563" }}>
                <Zap size={14} color="#7628f0" />
                <span>Entrega automática 24/7 · Tu pedido comienza a procesarse inmediatamente.</span>
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 11, fontWeight: 700, color: "#9a92a8" }}>
                <span>🇦🇷 Mercado Pago</span>
                <span>•</span>
                <span>💳 Tarjetas / Débito</span>
                <span>•</span>
                <span>🏦 Transferencia ARS</span>
                <span>•</span>
                <span>🌐 USDT / Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persuasion / Social Proof Landing Section (Easy Marketing style) */}
      <section
        style={{
          background: "#fff",
          borderRadius: 28,
          border: "1px solid rgba(141,44,255,.1)",
          boxShadow: "0 8px 30px rgba(18,0,61,.04)",
          padding: "36px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Title & Headline */}
        <div style={{ textAlign: "center", maxWidth: 740, margin: "0 auto" }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#7628f0",
              background: "#f6f2ff",
              padding: "4px 12px",
              borderRadius: 20,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            PRUEBA SOCIAL
          </span>
          <h3
            style={{
              fontSize: "clamp(22px, 3.5vw, 32px)",
              fontWeight: 900,
              color: "#121212",
              margin: "12px 0 10px",
              letterSpacing: "-0.5px",
            }}
          >
            {subService.persuasion.title}
          </h3>
          <p style={{ fontSize: 15, color: "#6d6282", margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
            {subService.persuasion.description}
          </p>
        </div>

        {/* Benefits Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {/* Card 1: Business Benefits */}
          <div
            style={{
              background: "linear-gradient(180deg, #fbf9ff 0%, #f6f0ff 100%)",
              borderRadius: 20,
              padding: "24px 22px",
              border: "1px solid rgba(141,44,255,.12)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#7628f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#121212" }}>
                Beneficios directos para tu emprendimiento
              </h4>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {subService.persuasion.businessBenefits.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#374151", fontWeight: 600 }}>
                  <span style={{ color: "#7628f0", fontWeight: 900, marginTop: 1 }}>✔</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Personal Accounts & Why Ads */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                background: "linear-gradient(180deg, #fbf9ff 0%, #f6f0ff 100%)",
                borderRadius: 20,
                padding: "24px 22px",
                border: "1px solid rgba(141,44,255,.12)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>🌟</span>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#121212" }}>
                  También funciona para cuentas personales
                </h4>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {subService.persuasion.personalBenefits.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#374151", fontWeight: 600 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a855f7" }} />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why combine with ads */}
            <div
              style={{
                background: "#fdf4ff",
                borderRadius: 20,
                padding: "20px 22px",
                border: "1px solid #f0abfc",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <h5 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: "#86198f" }}>
                💡 ¿Por qué combinarlo con publicidad?
              </h5>
              <p style={{ margin: 0, fontSize: 12, color: "#701a75", lineHeight: 1.5, fontWeight: 500 }}>
                {subService.persuasion.whyAds}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

