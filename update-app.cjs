const fs = require('fs');

const appTsxPath = 'src/App.tsx';
const content = fs.readFileSync(appTsxPath, 'utf8');

const lines = content.split('\n');

// Find the line index of "// ─── CART CONTEXT"
const cartContextIdx = lines.findIndex(l => l.includes('// ─── CART CONTEXT'));

if (cartContextIdx === -1) {
  console.error('Could not find Cart Context');
  process.exit(1);
}

const beforeCart = lines.slice(0, cartContextIdx).join('\n');

// We will append the new UI code to beforeCart
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

  const [currency, setCurrency] = useState<Currency>("ARS");

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
  const lines = items.map(i =>
    \`• \${i.serviceName}\${i.tierQty ? \` — \${i.tierQty}\` : ""} x\${i.qty} = \${sym}\${(i.price * i.qty).toLocaleString("es-AR")} \${currency}\`
  );
  const msg = [
    "¡Hola! Acabo de realizar el pago de mi pedido.",
    "",
    "📋 *DETALLE DEL PEDIDO:*",
    ...lines,
    "",
    \`💰 *Total: \${sym}\${total.toLocaleString("es-AR")} \${currency}*\`,
    "",
    \`✅ *El pago fue realizado por transferencia bancaria en \${currency}.*\`,
    "",
    "Por favor confirme la recepción y activen el servicio. ¡Gracias!",
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
    <div className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg border border-gray-100 bg-gray-50">
      <div className="min-w-0">
        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{label}</p>
        <p className="text-gray-900 text-sm font-mono font-semibold break-all leading-tight mt-0.5">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className={\`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 \${copied ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-600 hover:bg-red-100'}\`}
        title="Copiar"
      >
        {copied ? <CopyCheck size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────

function PaymentModal({
  items, total, onBack, onConfirm, currency
}: {
  items: CartItem[];
  total: number;
  onBack: () => void;
  onConfirm: () => void;
  currency: Currency;
}) {
  const sym = CURRENCY_SYMBOLS[currency];
  const [tab, setTab] = useState<"ARS" | "USD">("ARS");
  const data = tab === "ARS" ? PAYMENT_ARS : PAYMENT_USD;

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="w-full sm:max-w-md max-h-[95vh] flex flex-col rounded-t-3xl sm:rounded-2xl overflow-hidden bg-white shadow-2xl border border-gray-200"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-900 transition-colors">
            <ChevronLeft size={22} />
          </button>
          <div className="flex-1">
            <h2 className="text-base text-gray-900 font-bold tracking-tight">DATOS DE PAGO</h2>
            <p className="text-gray-500 text-[10px] font-medium mt-0.5 uppercase tracking-wider">Realizá la transferencia y luego confirmá</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 font-mono">TOTAL</p>
            <p className="text-lg text-primary font-black">{sym}{total.toLocaleString("es-AR")} {currency}</p>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-2">Tu pedido</p>
          <div className="space-y-1">
            {items.map(i => (
              <div key={i.id} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-gray-600 truncate">{i.serviceName} — {i.tierQty} ×{i.qty}</span>
                <span className="text-gray-900 font-mono font-bold shrink-0">{sym}{(i.price * i.qty).toLocaleString("es-AR")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 pt-4 pb-2">
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-3">Elegí la moneda de pago</p>
          <div className="flex gap-2">
            <button
              onClick={() => setTab("ARS")}
              className={\`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 \${tab === 'ARS' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}\`}
            >
              <Banknote size={16} />
              Pesos ARS
            </button>
            <button
              onClick={() => setTab("USD")}
              className={\`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 \${tab === 'USD' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}\`}
            >
              <DollarSign size={16} />
              Dólares USD
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
          {data.map(row => (
            <CopyRow key={row.label} label={row.label} value={row.value} />
          ))}
        </div>

        <div className="px-5 py-5 border-t border-gray-100 space-y-3 bg-gray-50">
          <button
            onClick={() => onConfirm()}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white text-base transition-all duration-300 hover:brightness-110 active:scale-95 bg-green-600 shadow-[0_4px_14px_0_rgba(22,163,74,0.39)]"
          >
            <CheckCircle2 size={20} />
            YA TRANSFERÍ — CONFIRMAR
          </button>
          <p className="text-center text-gray-500 text-[11px] leading-relaxed">
            Al confirmar, se abre WhatsApp con el detalle de tu pedido y la confirmación de pago.
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

  const handleCheckout = () => {
    if (items.length === 0) return;
    setShowPayment(true);
  };

  const handleConfirm = () => {
    const msg = buildWhatsAppMessage(items, total, currency);
    window.open(\`https://wa.me/\${WHATSAPP_NUMBER}?text=\${msg}\`, "_blank");
    setShowPayment(false);
    setOpen(false);
  };

  return (
    <>
      <div
        onClick={() => { setOpen(false); setShowPayment(false); }}
        className="fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 backdrop-blur-sm"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
      />
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-md z-[70] flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out border-l border-gray-100"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl text-gray-900 font-bold tracking-tight">MI PEDIDO</h2>
          <button onClick={() => { setOpen(false); setShowPayment(false); }} className="text-gray-400 hover:text-gray-900 transition-colors">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400 bg-gray-50/50">
            <ShoppingCart size={48} className="text-gray-300" />
            <p className="text-sm font-medium">Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gray-50/50">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-semibold truncate">{item.serviceName}</p>
                  <p className="font-mono text-gray-500 text-xs mt-0.5">{item.tierQty}</p>
                  <p className="text-primary text-sm font-bold mt-0.5">
                    {sym}{(item.price * item.qty).toLocaleString("es-AR")} {currency}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button onClick={() => changeQty(item.id, -1)} className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary transition-colors shadow-sm">
                    <Minus size={12} />
                  </button>
                  <span className="font-mono text-gray-900 font-semibold text-sm w-5 text-center">{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)} className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary transition-colors shadow-sm">
                    <Plus size={12} />
                  </button>
                  <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                  <button onClick={() => remove(item.id)} className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-6 py-5 border-t border-gray-100 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">Total</span>
            <span className="text-2xl text-gray-900 font-black">
              {sym}{total.toLocaleString("es-AR")} {currency}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 disabled:opacity-40 hover:brightness-110 active:scale-95 bg-primary shadow-[0_4px_14px_0_rgba(220,38,38,0.39)]"
          >
            <Banknote size={20} />
            PAGAR AHORA
          </button>
          <p className="text-center text-gray-400 text-xs font-medium">
            Transferencia bancaria · {currency === "ARS" ? "Pesos ARS" : currency === "USD" ? "Dólares USD" : currency}
          </p>
        </div>
      </aside>

      {showPayment && open && (
        <PaymentModal
          items={items}
          total={total}
          onBack={() => setShowPayment(false)}
          onConfirm={handleConfirm}
          currency={currency}
        />
      )}
    </>
  );
}

function CurrencySelector() {
  const { currency, setCurrency } = useCart();
  const currencies: Currency[] = ["ARS", "USD", "EUR", "COP", "MXN", "UYU", "BRL"];
  return (
    <div className="relative group">
      <button className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-xs font-bold border border-gray-200">
        <Globe size={14} className="text-gray-500" />
        {currency}
      </button>
      <div className="absolute top-full right-0 mt-2 hidden group-hover:flex flex-col gap-1 p-2 rounded-xl bg-white shadow-xl border border-gray-100 z-50">
        {currencies.map(c => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={\`px-4 py-2 text-xs font-bold rounded-lg transition-colors text-left \${currency === c ? "bg-primary/10 text-primary" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}\`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────

function Header() {
  const { count, setOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={\`fixed top-0 left-0 right-0 z-50 transition-all duration-300 \${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}\`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center transition-all bg-white group-hover:border-primary shadow-sm">
            <img src="/favicon-new.png" alt="Cyber Marketing Digital" className="w-full h-full object-contain p-1" />
          </div>
          <span className={\`font-black text-xl tracking-tight hidden sm:block \${isScrolled ? 'text-gray-900' : 'text-gray-900'}\`}>
            CYBER<span className="text-primary">MARKETING</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#catalogo" className="text-gray-700 font-semibold hover:text-primary transition-colors text-sm uppercase tracking-wide">Servicios</a>
          <a href="#garantia" className="text-gray-700 font-semibold hover:text-primary transition-colors text-sm uppercase tracking-wide">Garantía</a>
          <a href="#contacto" className="text-gray-700 font-semibold hover:text-primary transition-colors text-sm uppercase tracking-wide">Contacto</a>
        </nav>

        <div className="flex items-center gap-4">
          <CurrencySelector />
          <button onClick={() => setOpen(true)} className={\`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors \${isScrolled ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-white shadow-sm hover:shadow-md text-gray-800 border border-gray-100'}\`}>
            <ShoppingCart size={18} />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center font-mono border-2 border-white"
              >
                {count}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex items-center justify-center overflow-hidden px-4 bg-gray-50">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }} />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-xs text-gray-600 font-semibold tracking-wider uppercase">Servicios Activos 24/7</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
            Impulsa tus <br className="hidden md:block"/>
            <span className="text-primary">Redes Sociales</span>
          </h1>
        </motion.div>

        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Hacé crecer tu cuenta con seguidores reales, likes, vistas y más. Resultados garantizados en minutos.
          </p>
        </motion.div>

        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 items-center">
          <a href="#catalogo"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base transition-all duration-300 hover:scale-105 bg-primary shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] w-full sm:w-auto">
            <TrendingUp size={20} />
            VER SERVICIOS
          </a>
          <a href={\`https://wa.me/\${WHATSAPP_NUMBER}\`} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-gray-800 text-base border border-gray-200 bg-white transition-all duration-300 hover:bg-gray-50 shadow-sm w-full sm:w-auto">
            <MessageCircle size={20} className="text-green-600" />
            CONSULTAR DUDAS
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-20 grid grid-cols-3 gap-6 md:gap-12 border-t border-gray-200 pt-12 w-full max-w-2xl">
          {[
            { num: "+500", label: "Clientes Satisfechos" },
            { num: "30 min", label: "Tiempo de Entrega" },
            { num: "100%", label: "Garantía de Reposición" }
          ].map((stat, i) => (
            <div key={i} className="text-center flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{stat.num}</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider max-w-[120px]">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── SERVICE CARD ─────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: ServiceGroup }) {
  const { add, currency } = useCart();
  const [addedTier, setAddedTier] = useState<string | null>(null);

  const handleAdd = (tier: ServiceTier, finalPrice: number) => {
    const fullName = service.subtitle
      ? \`\${service.name} — \${service.subtitle}\`
      : service.name;
    add({
      id: \`\${service.id}-\${tier.tierQty}\`,
      serviceName: fullName,
      tierQty: tier.tierQty,
      price: finalPrice,
    });
    setAddedTier(tier.tierQty);
    setTimeout(() => setAddedTier(null), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={\`relative flex flex-col rounded-2xl overflow-hidden border bg-white transition-all duration-300 \${service.groupPopular ? 'border-primary/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)]' : 'border-gray-200 shadow-sm hover:shadow-md'}\`}
    >
      {service.groupPopular && (
        <div className="absolute top-0 left-0 right-0 py-1 bg-primary text-center">
           <span className="text-[10px] font-bold text-white uppercase tracking-widest">MÁS VENDIDO</span>
        </div>
      )}

      <div className={\`p-5 pb-3 \${service.groupPopular ? 'pt-8' : ''}\`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-800 shrink-0">
            {service.icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-snug">{service.name}</h3>
            {service.subtitle && (
              <span className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                {service.subtitle}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 flex-1">
        <div className="space-y-1.5">
          {service.tiers.map((tier, index) => {
            const finalPrice = getPrice(service.id, index, tier.price, currency);
            return (
            <div
              key={tier.tierQty}
              className={\`flex items-center justify-between gap-2 py-2 px-3 rounded-xl border transition-colors \${tier.popular ? 'bg-primary/5 border-primary/30' : 'bg-white border-gray-100 hover:border-gray-200'}\`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="font-mono font-bold text-gray-900 text-sm whitespace-nowrap">{tier.tierQty}</span>
                {tier.discount && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono text-green-700 bg-green-100 shrink-0">
                    {tier.discount}
                  </span>
                )}
                {tier.label && (
                  <span className="text-[10px] text-primary font-semibold truncate hidden sm:block">{tier.label}</span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono font-black text-gray-900 text-sm whitespace-nowrap">
                  {CURRENCY_SYMBOLS[currency]}{finalPrice.toLocaleString("es-AR")}
                </span>
                <button
                  onClick={() => handleAdd(tier, finalPrice)}
                  className={\`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-95 \${addedTier === tier.tierQty ? 'bg-green-500 text-white shadow-md' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}\`}
                  title="Agregar al carrito"
                >
                  {addedTier === tier.tierQty ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
        <ul className="space-y-2">
          {service.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600 font-medium">
              <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
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
  { id: "all",       label: "Todo",      icon: <Package size={16} /> },
  { id: "instagram", label: "Instagram", icon: <Instagram size={16} /> },
  { id: "tiktok",    label: "TikTok",    icon: <FaTiktok size={16} /> },
  { id: "facebook",  label: "Facebook",  icon: <FaFacebook size={16} /> },
  { id: "youtube",   label: "YouTube",   icon: <Youtube size={16} /> },
  { id: "spotify",   label: "Spotify",   icon: <FaSpotify size={16} /> },
];

function Catalog() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = activeCategory === "all"
    ? SERVICE_GROUPS
    : SERVICE_GROUPS.filter(s => s.category === activeCategory);

  return (
    <section id="catalogo" className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="font-bold text-primary text-sm tracking-widest uppercase block mb-3">Catálogo</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">NUESTROS SERVICIOS</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg font-medium">
              Elegí el paquete que necesites, agregalo al carrito y comenzá a crecer hoy mismo.
            </p>
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={\`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 \${activeCategory === cat.id ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(s => <ServiceCard key={s.id} service={s} />)}
        </div>
      </div>
    </section>
  );
}

// ─── GUARANTEE & HOW IT WORKS ────────────────────────────────────────────────

function Guarantee() {
  const items = [
    { icon: <Shield size={32} />, title: "100% Seguro", desc: "Nunca pedimos tu contraseña. Solo necesitamos el link o usuario de tu cuenta." },
    { icon: <Zap size={32} />, title: "Entrega Rápida", desc: "La mayoría de los pedidos comienzan a procesarse en menos de 30 minutos." },
    { icon: <Users size={32} />, title: "Perfiles Reales", desc: "Trabajamos con perfiles activos para mayor autenticidad y retención." },
    { icon: <Clock size={32} />, title: "Garantía Real", desc: "Si bajan los seguidores dentro del período garantizado, los reponemos sin cargo." },
  ];

  return (
    <section id="garantia" className="py-24 px-4 md:px-8 bg-gray-50 border-y border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="font-bold text-primary text-sm tracking-widest uppercase block mb-3">Confianza</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">POR QUÉ ELEGIRNOS</h2>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="p-8 rounded-3xl bg-white border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-primary bg-primary/10 p-4 rounded-2xl mb-6">
                {item.icon}
              </div>
              <h3 className="font-black text-gray-900 text-xl mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "1", title: "Elegí tu paquete", desc: "Navegá el catálogo y agregá los servicios al carrito." },
    { num: "2", title: "Enviá tu pedido", desc: "Hacé clic en Pagar. Se abre WhatsApp con el detalle listo." },
    { num: "3", title: "Confirmás y pagás", desc: "Abonás mediante transferencia y empezamos al instante." },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="font-bold text-primary text-sm tracking-widest uppercase block mb-3">Simple y Rápido</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">¿CÓMO FUNCIONA?</h2>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10" />
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center text-center bg-white"
            >
              <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-50 flex items-center justify-center font-black text-2xl text-primary mb-6 shadow-sm">
                {step.num}
              </div>
              <h3 className="font-black text-gray-900 text-xl mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium px-4">{step.desc}</p>
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
    <section id="contacto" className="py-24 px-4 relative bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: "radial-gradient(circle at center, #dc2626 0%, transparent 70%)"
      }} />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            ¿DUDAS SOBRE QUÉ <br />
            <span className="text-primary">PAQUETE ELEGIR?</span>
          </h2>
          <p className="text-gray-300 mb-10 text-xl font-medium">
            Asesoramiento gratuito por WhatsApp. Respondemos en minutos.
          </p>
          <a
            href={\`https://wa.me/\${WHATSAPP_NUMBER}?text=\${encodeURIComponent("Hola! Me interesa hacer crecer mi cuenta. ¿Pueden asesorarme?")}\`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-white text-lg transition-all duration-300 hover:scale-105 bg-green-600 shadow-[0_8px_30px_rgb(22,163,74,0.4)]"
          >
            <MessageCircle size={24} />
            HABLAR POR WHATSAPP
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

function Home() {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900 font-sans selection:bg-primary/20">
      <Header />
      <Hero />
      <Catalog />
      <HowItWorks />
      <Guarantee />
      <ContactCTA />
      <footer className="py-12 bg-white border-t border-gray-100 text-center font-medium">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-gray-200 p-1 mb-6 opacity-80">
            <img src="/favicon-new.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <p className="font-black text-xl text-gray-900 tracking-tight mb-4">
            CYBER<span className="text-primary">MARKETING</span>
          </p>
          <div className="flex gap-4 mb-8">
            <a href="https://www.instagram.com/seguidores_ventas_arg" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors">
              <Instagram size={20} />
            </a>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Cyber Marketing Digital. Todos los derechos reservados.
          </p>
        </div>
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
`;

fs.writeFileSync(appTsxPath, beforeCart + '\n' + newUiCode);
console.log('App.tsx updated successfully');
