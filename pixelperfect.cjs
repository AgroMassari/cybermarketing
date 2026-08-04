const fs = require('fs');

const appTsxPath = 'src/App.tsx';
const content = fs.readFileSync(appTsxPath, 'utf8');

const lines = content.split('\n');

// Keep everything up to (not including) line 634 (index 633)
const beforeCart = lines.slice(0, 633).join('\n');

const newUiCode = `
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
  currency: Currency;
  setCurrency: (v: Currency) => void;
};

const CartContext = createContext<CartContextType | null>(null);

function useCart() {
  return useContext(CartContext)!;
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>("ARS");

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
    <CartContext.Provider value={{ items, add, remove, changeQty, total, count, open, setOpen, currency, setCurrency }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── WHATSAPP CHECKOUT ────────────────────────────────────────────────────────

function buildWhatsAppMessage(items: CartItem[], total: number, currency: Currency): string {
  const sym = CURRENCY_SYMBOLS[currency];
  const msgLines = items.map(i =>
    \`• \${i.serviceName} — \${i.tierQty} x\${i.qty} = \${sym}\${(i.price * i.qty).toLocaleString("es-AR")} \${currency}\`
  );
  const msg = [
    "¡Hola! Quiero confirmar mi pedido.",
    "",
    "📋 *DETALLE DEL PEDIDO:*",
    ...msgLines,
    "",
    \`💰 *Total: \${sym}\${total.toLocaleString("es-AR")} \${currency}*\`,
    "",
    "Ya realicé la transferencia. Por favor confirmar recepción y activar el servicio. ¡Gracias!",
  ].join("\\n");
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', borderRadius: 12, background: '#f6f2ff', border: '1px solid rgba(141,44,255,0.1)' }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 10, color: '#9a92a8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{label}</p>
        <p style={{ fontSize: 13, color: '#121212', fontWeight: 700, wordBreak: 'break-all', margin: '2px 0 0' }}>{value}</p>
      </div>
      <button
        onClick={handleCopy}
        style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: copied ? '#dcfce7' : 'rgba(118,40,240,0.12)', color: copied ? '#16a34a' : '#7628f0', transition: 'all 0.2s' }}
        title="Copiar"
      >
        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────

function PaymentModal({ items, total, onBack, onConfirm, currency }: {
  items: CartItem[]; total: number; onBack: () => void; onConfirm: () => void; currency: Currency;
}) {
  const sym = CURRENCY_SYMBOLS[currency];
  const [tab, setTab] = useState<"ARS" | "USD">("ARS");
  const data = tab === "ARS" ? PAYMENT_ARS : PAYMENT_USD;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(18,0,61,0.6)', backdropFilter: 'blur(6px)' }}>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        style={{ width: '100%', maxWidth: 480, maxHeight: '95vh', display: 'flex', flexDirection: 'column', borderRadius: '24px 24px 0 0', background: '#fff', overflow: 'hidden', boxShadow: '0 -20px 60px rgba(118,40,240,0.18)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 24px', borderBottom: '1px solid #f3edfc' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a92a8', display: 'flex' }}>
            <ChevronLeft size={22} />
          </button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#121212', margin: 0 }}>DATOS DE PAGO</h2>
            <p style={{ fontSize: 11, color: '#9a92a8', margin: '2px 0 0', fontWeight: 500 }}>Realizá la transferencia y confirmá</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 10, color: '#9a92a8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>TOTAL</p>
            <p style={{ fontSize: 18, fontWeight: 900, color: '#7628f0', margin: 0 }}>{sym}{total.toLocaleString("es-AR")} {currency}</p>
          </div>
        </div>

        <div style={{ padding: '16px 24px 12px', borderBottom: '1px solid #f3edfc' }}>
          <p style={{ fontSize: 11, color: '#9a92a8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Moneda de pago</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['ARS', 'USD'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, padding: '10px', borderRadius: 14, border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
                  background: tab === t ? 'linear-gradient(135deg, #7f1fff 0%, #9c34ff 55%, #bf5bff 100%)' : '#f6f2ff',
                  color: tab === t ? '#fff' : '#7628f0' }}>
                {t === 'ARS' ? '🇦🇷 Pesos ARS' : '🇺🇸 Dólares USD'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.map(row => <CopyRow key={row.label} label={row.label} value={row.value} />)}
        </div>

        <div style={{ padding: '20px 24px', borderTop: '1px solid #f3edfc', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={onConfirm}
            style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 15, color: '#fff', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', boxShadow: '0 6px 24px rgba(22,163,74,0.35)', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <CheckCircle2 size={20} />
            YA TRANSFERÍ — CONFIRMAR PEDIDO
          </button>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#9a92a8', margin: 0, lineHeight: 1.5 }}>
            Se abrirá WhatsApp para enviarnos el comprobante.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── CART DRAWER ──────────────────────────────────────────────────────────────

function CartDrawer() {
  const { items, remove, changeQty, total, open, setOpen, currency } = useCart();
  const sym = CURRENCY_SYMBOLS[currency];
  const [showPayment, setShowPayment] = useState(false);

  const handleConfirm = () => {
    const msg = buildWhatsAppMessage(items, total, currency);
    window.open(\`https://wa.me/\${WHATSAPP_NUMBER}?text=\${msg}\`, "_blank");
    setShowPayment(false);
    setOpen(false);
  };

  return (
    <>
      <div onClick={() => { setOpen(false); setShowPayment(false); }}
        style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(18,0,61,0.4)', backdropFilter: 'blur(4px)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.3s' }} />
      <aside style={{ position: 'fixed', right: 0, top: 0, height: '100%', width: '100%', maxWidth: 420, zIndex: 70, display: 'flex', flexDirection: 'column', background: '#fff', boxShadow: '-12px 0 50px rgba(118,40,240,0.12)', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease-out' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f3edfc' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#121212', margin: 0, letterSpacing: '-0.5px' }}>Tu carrito</h2>
          <button onClick={() => { setOpen(false); setShowPayment(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a92a8', display: 'flex' }}>
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: '#9a92a8' }}>
            <ShoppingCart size={48} style={{ opacity: 0.3 }} />
            <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>Tu carrito está vacío</p>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', borderRadius: 16, background: '#fcfbff', border: '1px solid rgba(141,44,255,0.08)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#121212', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.serviceName}</p>
                  <p style={{ fontWeight: 500, fontSize: 12, color: '#9a92a8', margin: '2px 0' }}>{item.tierQty}</p>
                  <p style={{ fontWeight: 800, fontSize: 14, color: '#7628f0', margin: 0 }}>{sym}{(item.price * item.qty).toLocaleString("es-AR")} {currency}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f6f2ff', borderRadius: 12, padding: '4px 6px' }}>
                  <button onClick={() => changeQty(item.id, -1)} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(141,44,255,0.15)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7628f0' }}>
                    <Minus size={12} />
                  </button>
                  <span style={{ fontWeight: 800, color: '#121212', fontSize: 14, width: 22, textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(141,44,255,0.15)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7628f0' }}>
                    <Plus size={12} />
                  </button>
                  <div style={{ width: 1, height: 20, background: 'rgba(141,44,255,0.15)', margin: '0 2px' }}></div>
                  <button onClick={() => remove(item.id)} style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a92a8' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #f3edfc', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: '#9a92a8', fontSize: 13 }}>Total</span>
            <span style={{ fontWeight: 900, color: '#121212', fontSize: 24 }}>{sym}{total.toLocaleString("es-AR")} {currency}</span>
          </div>
          <button onClick={() => { if (items.length > 0) setShowPayment(true); }} disabled={items.length === 0}
            style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', cursor: items.length > 0 ? 'pointer' : 'not-allowed', fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 15, color: '#fff', background: 'linear-gradient(135deg, #7f1fff 0%, #9c34ff 55%, #bf5bff 100%)', boxShadow: '0 6px 24px rgba(118,40,240,0.35)', opacity: items.length === 0 ? 0.4 : 1, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Banknote size={20} />
            PAGAR AHORA
          </button>
        </div>
      </aside>

      {showPayment && open && (
        <PaymentModal items={items} total={total} onBack={() => setShowPayment(false)} onConfirm={handleConfirm} currency={currency} />
      )}
    </>
  );
}

// ─── CURRENCY SELECTOR ────────────────────────────────────────────────────────

function CurrencySelector() {
  const { currency, setCurrency } = useCart();
  const currencies: Currency[] = ["ARS", "USD", "EUR", "COP", "MXN", "UYU", "BRL"];
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 20, background: '#f3f3f6', border: '1px solid #ececec', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 12, color: '#121212' }}>
        {currency}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.5 }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(118,40,240,0.15)', border: '1px solid rgba(141,44,255,0.1)', padding: 8, zIndex: 50, minWidth: 90 }}>
          {currencies.map(c => (
            <button key={c} onClick={() => { setCurrency(c); setOpen(false); }}
              style={{ display: 'block', width: '100%', padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 13, textAlign: 'left',
                background: currency === c ? 'linear-gradient(135deg, #7f1fff 0%, #9c34ff 100%)' : 'transparent',
                color: currency === c ? '#fff' : '#121212' }}>
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────

function Header() {
  const { count, setOpen } = useCart();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
      {/* Announcement bar - exact from source */}
      <div style={{ background: 'linear-gradient(266deg, rgba(5,5,5,1), rgba(65,65,65,1) 100%)', color: '#fff', padding: '9px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Instagram size={14} style={{ opacity: 0.7 }} />
        <FaTiktok size={14} style={{ opacity: 0.7 }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>3 CUOTAS SIN INTERES</span>
      </div>

      {/* Main header - white */}
      <header style={{ background: 'rgba(255,255,255,0.97)', borderBottom: '1px solid #ececec', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          {/* Logo */}
          <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(118,40,240,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/favicon-new.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, color: '#121212', letterSpacing: '-0.5px', lineHeight: 1 }}>
                CYBER<span style={{ color: '#7628f0' }}>MARKETING</span>
              </div>
              <div style={{ fontSize: 9, fontWeight: 600, color: '#9a92a8', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>Digital</div>
            </div>
          </a>

          {/* Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden lg:flex">
            {[
              { href: '#home', label: 'Inicio' },
              { href: '#como-funciona', label: '¿Cómo funciona?' },
              { href: '#faq', label: 'Preguntas Frecuentes' },
              { href: '#catalogo', label: 'Ver Servicios' },
            ].map(link => (
              <a key={link.href} href={link.href} style={{ fontSize: 13, fontWeight: 600, color: '#4f4f59', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#7628f0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4f4f59')}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <CurrencySelector />
            <button onClick={() => setOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#121212', display: 'flex', alignItems: 'center', padding: 4 }}>
              <ShoppingCart size={22} />
              {count > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg, #7f1fff 0%, #9c34ff 100%)', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="home" style={{ paddingTop: 110, paddingBottom: 80, position: 'relative', overflow: 'hidden' }} className="hero-bg">
      {/* Decorative shapes */}
      <div style={{ position: 'absolute', left: 40, top: '25%', width: 80, height: 80, border: '6px solid rgba(255,255,255,0.07)', borderRadius: 18, transform: 'rotate(15deg)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 60, bottom: '20%', width: 60, height: 60, border: '5px solid rgba(255,255,255,0.07)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: '20%', top: '15%', width: 20, height: 20, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap' }}>
        {/* Left */}
        <div style={{ flex: '1 1 480px', maxWidth: 600 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', marginBottom: 28 }}>
              <span style={{ fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>AR Sitio #1 en Argentina</span>
            </div>
            <h1 style={{ fontSize: 'clamp(42px, 5.5vw, 78px)', fontWeight: 900, color: '#ffffff', lineHeight: 1.08, letterSpacing: '-1.5px', margin: '0 0 24px', fontFamily: 'Poppins, sans-serif' }}>
              Marketing fácil<br/>para vender<br/>mejor.
            </h1>
            <p style={{ fontSize: 17, fontWeight: 500, color: 'rgba(255,255,255,0.82)', marginBottom: 32, lineHeight: 1.65, maxWidth: 500 }}>
              Impulsá tu perfil en minutos, de forma automática y segura.
            </p>

            {/* Feature badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
              {[
                { label: 'Automático con IA', color: 'rgba(255,255,255,0.12)' },
                { label: 'Seguro', color: 'rgba(255,255,255,0.12)' },
                { label: 'Sin contraseña', color: 'rgba(255,255,255,0.12)' },
                { label: 'Entrega rápida', color: 'rgba(255,255,255,0.12)' },
              ].map(b => (
                <span key={b.label} style={{ padding: '7px 14px', borderRadius: 10, background: b.color, border: '1px solid rgba(255,255,255,0.18)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {b.label}
                </span>
              ))}
            </div>

            <a href="#catalogo" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '16px 36px', borderRadius: 16, border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 14, color: '#fff', textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #7f1fff 0%, #9c34ff 55%, #bf5bff 100%)', boxShadow: '0 8px 30px rgba(127,31,255,0.45)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(127,31,255,0.55)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(127,31,255,0.45)'; }}>
              QUIERO IMPULSAR MI PERFIL AHORA
            </a>
          </motion.div>
        </div>

        {/* Right - Profile card mockup */}
        <div style={{ flex: '1 1 340px', maxWidth: 420, position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
            style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: 28, boxShadow: '0 24px 80px rgba(18,0,61,0.35)', width: '100%', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #7f1fff, #bf5bff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={26} color="#fff" />
              </div>
              <div>
                <p style={{ fontWeight: 900, fontSize: 15, color: '#121212', margin: 0, lineHeight: 1.2 }}>tu perfil con</p>
                <p style={{ fontWeight: 900, fontSize: 18, color: '#121212', margin: 0, lineHeight: 1.2 }}>EasyMarketing</p>
                <p style={{ fontWeight: 500, fontSize: 12, color: '#9a92a8', margin: '3px 0 0' }}>@tu perfil</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[{ num: '53', label: 'posts' }, { num: '20.000', label: 'seguidores', highlight: true }, { num: '391', label: 'seguidos' }].map(stat => (
                <div key={stat.label} style={{ flex: 1, textAlign: 'center', padding: '12px 8px', borderRadius: 14, background: stat.highlight ? 'rgba(118,40,240,0.08)' : '#f6f2ff', border: stat.highlight ? '1.5px solid rgba(118,40,240,0.2)' : '1.5px solid transparent' }}>
                  <p style={{ fontWeight: 900, fontSize: 17, color: stat.highlight ? '#7628f0' : '#121212', margin: 0, lineHeight: 1.1 }}>{stat.num}</p>
                  <p style={{ fontWeight: 600, fontSize: 10, color: stat.highlight ? '#7628f0' : '#9a92a8', margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'linear-gradient(135deg, #f6f2ff, #eee7ff)', borderRadius: 16, padding: '14px 16px', textAlign: 'center', border: '1px solid rgba(118,40,240,0.1)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9a92a8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>VALIDACIÓN INTELIGENTE</p>
              <p style={{ fontWeight: 900, fontSize: 15, color: '#7628f0', margin: 0, lineHeight: 1.3 }}>Perfil detectado<br/>correctamente</p>
            </div>
          </motion.div>

          {/* Floating badges */}
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: -16, right: -10, background: '#fff', borderRadius: 50, padding: '8px 16px', boxShadow: '0 8px 30px rgba(18,0,61,0.18)', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(141,44,255,0.08)' }}>
            <Shield size={14} style={{ color: '#7628f0' }} />
            <span style={{ fontWeight: 700, fontSize: 12, color: '#121212' }}>Perfil más sólido</span>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1.5 }}
            style={{ position: 'absolute', bottom: -12, left: -10, background: '#fff', borderRadius: 50, padding: '8px 16px', boxShadow: '0 8px 30px rgba(18,0,61,0.18)', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(141,44,255,0.08)' }}>
            <Zap size={14} style={{ color: '#fbcd0a' }} />
            <span style={{ fontWeight: 700, fontSize: 12, color: '#121212' }}>Superior a la competencia</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────

function StatsBar() {
  return (
    <div style={{ background: '#121212', padding: '20px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 'clamp(32px, 6vw, 80px)', flexWrap: 'wrap' }}>
        {[
          { num: '+348.731', label: 'Likes vendidos' },
          { num: '+49.386', label: 'Seguidores entregados' },
          { num: '+16.741', label: 'Clientes satisfechos' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 900, fontSize: 'clamp(22px, 3vw, 34px)', color: '#fff', margin: 0, letterSpacing: '-1px' }}>{stat.num}</p>
            <p style={{ fontWeight: 500, fontSize: 12, color: '#9a92a8', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CATEGORY BAR ─────────────────────────────────────────────────────────────

const ALL_CATS = [
  { id: "all",       label: "Todo",      icon: <Package size={18} /> },
  { id: "instagram", label: "Seguidores Instagram", icon: <Instagram size={18} /> },
  { id: "tiktok",    label: "TikTok",    icon: <FaTiktok size={18} /> },
  { id: "facebook",  label: "Facebook",  icon: <FaFacebook size={18} /> },
  { id: "youtube",   label: "YouTube",   icon: <Youtube size={18} /> },
  { id: "spotify",   label: "Spotify",   icon: <FaSpotify size={18} /> },
];

function CategoryBar({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #7f1fff 0%, #9c34ff 55%, #bf5bff 100%)', padding: '0 24px', overflowX: 'auto', scrollbarWidth: 'none' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 0 }}>
        {ALL_CATS.map(cat => (
          <button key={cat.id} onClick={() => onChange(cat.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '0.02em', whiteSpace: 'nowrap', borderBottom: active === cat.id ? '3px solid #fff' : '3px solid transparent', transition: 'all 0.2s',
              background: 'transparent', color: active === cat.id ? '#fff' : 'rgba(255,255,255,0.7)' }}>
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SERVICE CARD ─────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: ServiceGroup }) {
  const { add, currency } = useCart();
  const [addedTier, setAddedTier] = useState<string | null>(null);

  const handleAdd = (tier: ServiceTier, finalPrice: number) => {
    const fullName = service.subtitle ? \`\${service.name} — \${service.subtitle}\` : service.name;
    add({ id: \`\${service.id}-\${tier.tierQty}\`, serviceName: fullName, tierQty: tier.tierQty, price: finalPrice });
    setAddedTier(tier.tierQty);
    setTimeout(() => setAddedTier(null), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(141,44,255,0.08)', boxShadow: '0 4px 24px rgba(118,40,240,0.07)', display: 'flex', flexDirection: 'column', transition: 'transform 0.25s, box-shadow 0.25s' }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(118,40,240,0.14)' }}
    >
      {/* Card header */}
      <div style={{ padding: '24px 20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid rgba(141,44,255,0.06)' }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, background: 'linear-gradient(135deg, #f6f2ff, #eee7ff)', fontSize: 28 }}>
          {service.icon}
        </div>
        <h3 style={{ fontWeight: 900, fontSize: 18, color: '#121212', margin: 0, letterSpacing: '-0.3px' }}>{service.name}</h3>
        {service.subtitle && <p style={{ fontWeight: 600, fontSize: 11, color: '#7628f0', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{service.subtitle}</p>}
      </div>

      {/* Tiers */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {service.tiers.map((tier, index) => {
          const finalPrice = getPrice(service.id, index, tier.price, currency);
          return (
            <div key={tier.tierQty}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', borderRadius: 14, background: tier.popular ? 'linear-gradient(135deg, rgba(127,31,255,0.06), rgba(191,91,255,0.04))' : '#f9fafb', border: tier.popular ? '1.5px solid rgba(118,40,240,0.18)' : '1.5px solid transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span style={{ fontWeight: 800, fontSize: 15, color: '#121212', whiteSpace: 'nowrap' }}>{tier.tierQty}</span>
                {tier.discount && <span style={{ fontSize: 9, fontWeight: 800, padding: '3px 7px', borderRadius: 6, background: '#fee2e2', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{tier.discount}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontWeight: 900, fontSize: 15, color: '#121212' }}>{CURRENCY_SYMBOLS[currency]}{finalPrice.toLocaleString("es-AR")}</span>
                <button onClick={() => handleAdd(tier, finalPrice)}
                  style={{ width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s',
                    background: addedTier === tier.tierQty ? '#22c55e' : 'linear-gradient(135deg, #7f1fff, #bf5bff)', color: '#fff', boxShadow: addedTier === tier.tierQty ? '0 4px 12px rgba(34,197,94,0.35)' : '0 4px 12px rgba(127,31,255,0.3)' }}>
                  {addedTier === tier.tierQty ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features */}
      {service.features && service.features.length > 0 && (
        <div style={{ padding: '14px 20px 20px', borderTop: '1px solid rgba(141,44,255,0.06)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {service.features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <CheckCircle2 size={14} style={{ color: '#7628f0', flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#6d6282' }}>{f}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── CATALOG ─────────────────────────────────────────────────────────────────

function Catalog() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = activeCategory === "all"
    ? SERVICE_GROUPS
    : SERVICE_GROUPS.filter(s => s.category === activeCategory);

  return (
    <div id="catalogo">
      <CategoryBar active={activeCategory} onChange={setActiveCategory} />
      <section className="section-catalog" style={{ padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {filtered.map(s => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── BENEFITS (Prueba Social) ─────────────────────────────────────────────────

function Benefits() {
  const benefits = [
    { icon: '⚡', title: 'Primera impresión sólida', desc: 'Un perfil con buenos números transmite más actividad, presencia y autoridad.' },
    { icon: '🛡️', title: 'Más confianza', desc: 'La prueba social ayuda a que una persona nueva perciba tu perfil con más respaldo.' },
    { icon: '📊', title: 'Apoyo para tus anuncios', desc: 'Si invertís en publicidad, tu perfil no debería verse vacío cuando hacen clic.' },
    { icon: '💎', title: 'Más coherencia', desc: 'Una presencia consistente en redes genera reconocimiento y posicionamiento de marca.' },
    { icon: '🤖', title: 'Automático y rápido', desc: 'El sistema detecta y procesa tu pedido de forma automatizada, sin demoras.' },
    { icon: '🔒', title: 'Compra más segura', desc: 'Nunca pedimos contraseñas. Solo el link o nombre de usuario de tu perfil.' },
  ];

  return (
    <section style={{ padding: '80px 24px' }} className="section-light-gradient">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ display: 'inline-block', padding: '6px 20px', borderRadius: 20, background: 'rgba(118,40,240,0.08)', border: '1px solid rgba(118,40,240,0.15)', marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 12, color: '#7628f0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PRUEBA SOCIAL</span>
            </div>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(28px, 4vw, 52px)', color: '#121212', margin: '0 0 16px', letterSpacing: '-1px' }}>
              Tu perfil también vende por vos.
            </h2>
            <p style={{ fontSize: 16, color: '#6d6282', maxWidth: 680, margin: '0 auto', lineHeight: 1.7, fontWeight: 500 }}>
              Antes de leer tu oferta, muchas personas ya sacaron una conclusión sobre tu marca. Un perfil fuerte ayuda a que esa primera impresión juegue a tu favor.
            </p>
          </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {benefits.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(141,44,255,0.07)', boxShadow: '0 4px 20px rgba(118,40,240,0.06)', transition: 'transform 0.25s, box-shadow 0.25s' }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{b.icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: 16, color: '#121212', margin: '0 0 10px', letterSpacing: '-0.2px' }}>{b.title}</h3>
              <p style={{ fontSize: 13, color: '#6d6282', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>{b.desc}</p>
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
    { num: '01', title: 'Elegí tu servicio', desc: 'Navegá el catálogo, encontrá el servicio que necesitás y agregalo al carrito.' },
    { num: '02', title: 'Enviá tu pedido', desc: 'Hacé clic en Pagar Ahora. Te abrimos WhatsApp con todos los datos listos.' },
    { num: '03', title: 'Confirmás y empezamos', desc: 'Abonás por transferencia y activamos el servicio al instante.' },
  ];

  return (
    <section id="como-funciona" style={{ padding: '80px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ display: 'inline-block', padding: '6px 20px', borderRadius: 20, background: 'rgba(118,40,240,0.08)', border: '1px solid rgba(118,40,240,0.15)', marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 12, color: '#7628f0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SIMPLE Y RÁPIDO</span>
            </div>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(28px, 4vw, 52px)', color: '#121212', margin: 0, letterSpacing: '-1px' }}>
              ¿Cómo funciona?
            </h2>
          </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, position: 'relative' }}>
          {steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #7f1fff 0%, #bf5bff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 8px 28px rgba(127,31,255,0.3)' }}>
                <span style={{ fontWeight: 900, fontSize: 24, color: '#fff' }}>{step.num}</span>
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 18, color: '#121212', margin: '0 0 10px' }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: '#6d6282', lineHeight: 1.65, margin: 0, fontWeight: 500, maxWidth: 280 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const faqs = [
    { q: '¿Es seguro para mi cuenta?', a: 'Sí, totalmente. Nunca pedimos tu contraseña. Solo necesitamos el link o nombre de usuario de tu perfil, que es información pública.' },
    { q: '¿Cuánto tarda en llegar?', a: 'La mayoría de los servicios comienzan en menos de 30 minutos. Algunos pueden demorar hasta 24hs según el volumen del pedido.' },
    { q: '¿Los seguidores son reales?', a: 'Trabajamos con perfiles activos para mayor autenticidad y retención. Los resultados varían según el tipo de servicio elegido.' },
    { q: '¿Ofrecen garantía?', a: 'Sí. Si bajan los seguidores/likes dentro del período garantizado, los reponemos sin cargo adicional.' },
    { q: '¿Cómo pago?', a: 'Aceptamos transferencia bancaria en Pesos ARS o Dólares USD. Los datos de pago se muestran al confirmar el pedido.' },
  ];

  return (
    <section id="faq" style={{ padding: '80px 24px', background: '#f9fafb' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ display: 'inline-block', padding: '6px 20px', borderRadius: 20, background: 'rgba(118,40,240,0.08)', border: '1px solid rgba(118,40,240,0.15)', marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 12, color: '#7628f0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>FAQ</span>
            </div>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 44px)', color: '#121212', margin: 0, letterSpacing: '-1px' }}>Preguntas Frecuentes</h2>
          </motion.div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(141,44,255,0.08)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(118,40,240,0.05)' }}>
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{ width: '100%', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', textAlign: 'left' }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#121212' }}>{faq.q}</span>
                <motion.div animate={{ rotate: openIdx === i ? 180 : 0 }} style={{ flexShrink: 0, marginLeft: 12 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7628f0" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </motion.div>
              </button>
              {openIdx === i && (
                <div style={{ padding: '0 22px 18px' }}>
                  <p style={{ fontWeight: 500, fontSize: 14, color: '#6d6282', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                </div>
              )}
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
    <a href={\`https://wa.me/\${WHATSAPP_NUMBER}\`} target="_blank" rel="noreferrer"
      style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', padding: '12px 20px', borderRadius: 50, boxShadow: '0 8px 32px rgba(18,0,61,0.15)', textDecoration: 'none', border: '1px solid rgba(141,44,255,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <FaWhatsapp size={18} color="#fff" />
      </div>
      <span style={{ fontWeight: 700, fontSize: 13, color: '#121212' }}>Atención personalizada</span>
    </a>
  );
}

// ─── PAGE & APP ───────────────────────────────────────────────────────────────

function Home() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Poppins, sans-serif', background: '#f5f6f9' }}>
      <Header />
      <div style={{ paddingTop: 76 }}>
        <Hero />
        <StatsBar />
        <Catalog />
        <Benefits />
        <HowItWorks />
        <FAQ />
      </div>

      {/* Footer */}
      <footer style={{ background: '#121212', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/favicon-new.png" alt="Logo" style={{ width: '100%', objectFit: 'contain', padding: 4 }} />
            </div>
          </div>
          <p style={{ fontWeight: 900, fontSize: 20, color: '#fff', letterSpacing: '-0.5px', margin: '0 0 8px' }}>
            CYBER<span style={{ color: '#9c34ff' }}>MARKETING</span>
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
            <a href="https://www.instagram.com/seguidores_ventas_arg" target="_blank" rel="noreferrer" style={{ color: '#9a92a8', display: 'flex' }}>
              <Instagram size={20} />
            </a>
          </div>
          <p style={{ fontSize: 13, color: '#4f4f59', margin: 0, fontWeight: 500 }}>
            &copy; {new Date().getFullYear()} Cyber Marketing Digital. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      <FloatingWhatsApp />
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
`;

fs.writeFileSync(appTsxPath, beforeCart + '\n' + newUiCode);
console.log('App.tsx updated successfully with pixel-perfect design');
