const fs = require('fs');

const appTsxPath = 'src/App.tsx';
const content = fs.readFileSync(appTsxPath, 'utf8');

const lines = content.split('\n');

const cartContextIdx = lines.findIndex(l => l.includes('// ─── CART CONTEXT'));

if (cartContextIdx === -1) {
  console.error('Could not find Cart Context');
  process.exit(1);
}

const beforeCart = lines.slice(0, cartContextIdx).join('\n');

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
    <div className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl border border-gray-100 bg-gray-50/50">
      <div className="min-w-0">
        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-gray-900 text-sm font-semibold break-all leading-tight mt-0.5">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className={\`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 \${copied ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}\`}
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
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="w-full sm:max-w-md max-h-[95vh] flex flex-col rounded-t-[2rem] sm:rounded-3xl overflow-hidden bg-white shadow-2xl"
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-900 transition-colors">
            <ChevronLeft size={22} />
          </button>
          <div className="flex-1">
            <h2 className="text-lg text-gray-900 font-bold tracking-tight">DATOS DE PAGO</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">TOTAL</p>
            <p className="text-lg text-primary font-black">{sym}{total.toLocaleString("es-AR")} {currency}</p>
          </div>
        </div>

        <div className="px-6 pt-5 pb-3">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-3">Elegí la moneda de pago</p>
          <div className="flex gap-2">
            <button
              onClick={() => setTab("ARS")}
              className={\`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-200 \${tab === 'ARS' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}\`}
            >
              <Banknote size={16} />
              Pesos ARS
            </button>
            <button
              onClick={() => setTab("USD")}
              className={\`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-200 \${tab === 'USD' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}\`}
            >
              <DollarSign size={16} />
              Dólares USD
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
          {data.map(row => (
            <CopyRow key={row.label} label={row.label} value={row.value} />
          ))}
        </div>

        <div className="px-6 py-5 border-t border-gray-100 space-y-3 bg-gray-50/50">
          <button
            onClick={() => onConfirm()}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 hover:brightness-110 active:scale-95 bg-[#25d366] shadow-[0_4px_20px_0_rgba(37,211,102,0.4)]"
          >
            <CheckCircle2 size={20} />
            YA TRANSFERÍ — CONFIRMAR
          </button>
          <p className="text-center text-gray-500 text-[11px] font-medium leading-relaxed">
            Se abrirá WhatsApp para enviarnos el comprobante de pago.
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
        className="fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 backdrop-blur-sm"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
      />
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-md z-[70] flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl text-gray-900 font-black tracking-tight">CARRITO</h2>
          <button onClick={() => { setOpen(false); setShowPayment(false); }} className="text-gray-400 hover:text-gray-900 transition-colors">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400 bg-gray-50/50">
            <ShoppingCart size={48} className="text-gray-300" />
            <p className="text-sm font-semibold">Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gray-50/30">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-bold truncate">{item.serviceName}</p>
                  <p className="text-gray-500 font-medium text-xs mt-0.5">{item.tierQty}</p>
                  <p className="text-primary text-sm font-black mt-0.5">
                    {sym}{(item.price * item.qty).toLocaleString("es-AR")} {currency}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 bg-gray-100 rounded-xl p-1">
                  <button onClick={() => changeQty(item.id, -1)} className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-600 hover:text-primary transition-colors shadow-sm">
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-gray-900 text-sm w-5 text-center">{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)} className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-600 hover:text-primary transition-colors shadow-sm">
                    <Plus size={14} />
                  </button>
                  <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                  <button onClick={() => remove(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-6 py-6 border-t border-gray-100 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Total a pagar</span>
            <span className="text-2xl text-gray-900 font-black">
              {sym}{total.toLocaleString("es-AR")} {currency}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 disabled:opacity-40 hover:brightness-110 active:scale-95 bg-primary shadow-[0_8px_25px_-5px_rgba(175,77,255,0.5)]"
          >
            <Banknote size={20} />
            PAGAR AHORA
          </button>
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
      <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-gray-700 hover:bg-gray-100 transition-colors text-sm font-bold">
        {currency}
        <ChevronLeft size={14} className="rotate-[-90deg] text-gray-400" />
      </button>
      <div className="absolute top-full right-0 mt-2 hidden group-hover:flex flex-col gap-1 p-2 rounded-2xl bg-white shadow-2xl border border-gray-100 z-50">
        {currencies.map(c => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={\`px-4 py-2 text-sm font-bold rounded-xl transition-colors text-left \${currency === c ? "bg-primary text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}\`}
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Top Black Bar */}
      <div className="bg-black text-white text-xs font-bold py-2 px-4 flex justify-center items-center gap-4 uppercase tracking-widest">
        <Instagram size={14} />
        <FaTiktok size={14} />
        <span>3 CUOTAS SIN INTERES</span>
      </div>
      
      {/* Main White Header */}
      <header className="bg-white border-b border-gray-100 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2">
            <span className="font-black text-2xl tracking-tighter text-black flex items-center gap-1">
              <span className="text-3xl leading-none">W</span>
              <span>EASY</span>
            </span>
            <span className="font-black text-[10px] uppercase tracking-widest text-black flex flex-col justify-center leading-none mt-1">
              MARKETING
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            <a href="#home" className="text-black font-semibold text-sm hover:text-primary transition-colors border-b-2 border-black pb-1">Inicio</a>
            <a href="#como-funciona" className="text-gray-500 font-semibold text-sm hover:text-primary transition-colors">¿Cómo funciona?</a>
            <a href="#faq" className="text-gray-500 font-semibold text-sm hover:text-primary transition-colors">Preguntas Frecuentes</a>
            <a href="#saber-mas" className="text-gray-500 font-semibold text-sm hover:text-primary transition-colors">Saber Más</a>
            <a href="#blog" className="text-gray-500 font-semibold text-sm hover:text-primary transition-colors">blog</a>
          </nav>

          <div className="flex items-center gap-3">
            <CurrencySelector />
            <button className="text-gray-800 hover:text-primary transition-colors hidden sm:block">
              <Search size={20} />
            </button>
            <button className="text-gray-800 hover:text-primary transition-colors hidden sm:block">
              <User size={20} />
            </button>
            <button onClick={() => setOpen(true)} className="relative text-gray-800 hover:text-primary transition-colors p-2">
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center font-mono border-2 border-white">
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
    <section id="home" className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden px-4">
      {/* Deep Purple Background is set in index.css on body, but we can ensure it here too */}
      <div className="absolute inset-0 bg-background z-[-2]"></div>
      
      {/* Subtle background decoration */}
      <div className="absolute top-20 left-10 w-24 h-24 border-4 border-white/5 rounded-xl rotate-12 z-[-1]"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 border-4 border-white/5 rounded-full z-[-1]"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8 relative z-10">
        
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 mb-6 backdrop-blur-sm">
              <span className="font-bold text-xs text-white uppercase tracking-wider">AR Sitio #1 en Argentina</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white tracking-tighter leading-[1.05] mb-6">
              Marketing fácil<br/>para vender<br/>mejor.
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-lg mb-10 font-medium leading-relaxed">
              Impulsá tu perfil en minutos, de forma automática y segura.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap gap-3 mb-10">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-bold border border-white/10"><CheckCircle2 size={16} className="text-green-400"/> Automático con IA</span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-bold border border-white/10"><Shield size={16} className="text-yellow-400"/> Seguro</span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-bold border border-white/10"><Lock size={16} className="text-red-400"/> Sin contraseña</span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-bold border border-white/10"><Zap size={16} className="text-yellow-400"/> Entrega rápida</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
            <a href="#catalogo"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-white text-lg transition-all duration-300 hover:scale-105 bg-primary shadow-[0_0_30px_-5px_rgba(175,77,255,0.6)] uppercase tracking-wide">
              QUIERO IMPULSAR MI PERFIL AHORA
            </a>
          </motion.div>
        </div>

        {/* Right Content - Floating Cards Mockup */}
        <div className="flex-1 w-full flex justify-center lg:justify-end relative h-[400px] lg:h-[500px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }} 
            animate={{ opacity: 1, scale: 1, rotate: 0 }} 
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="absolute top-10 right-0 md:right-10 w-[300px] md:w-[350px] bg-white rounded-3xl p-6 shadow-2xl z-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-lg leading-none">tu perfil con</h3>
                <h3 className="font-black text-gray-900 text-xl leading-none mt-1">EasyMarketing</h3>
                <p className="text-gray-500 text-sm font-medium mt-1">@tu perfil</p>
              </div>
            </div>
            <div className="flex justify-between mb-6">
              <div className="text-center bg-gray-50 rounded-2xl py-3 px-2 flex-1 mx-1">
                <p className="font-black text-gray-900 text-xl">53</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">posts</p>
              </div>
              <div className="text-center bg-primary/10 rounded-2xl py-3 px-2 flex-1 mx-1 border border-primary/20">
                <p className="font-black text-primary text-xl">20.000</p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider">seguidores</p>
              </div>
              <div className="text-center bg-gray-50 rounded-2xl py-3 px-2 flex-1 mx-1">
                <p className="font-black text-gray-900 text-xl">391</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">seguidos</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">VALIDACIÓN INTELIGENTE</p>
              <p className="font-black text-primary text-sm">Perfil detectado<br/>correctamente</p>
            </div>
          </motion.div>

          {/* Floating small badges */}
          <motion.div 
            animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-0 right-20 md:right-40 bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-xl z-20"
          >
            <Shield size={16} className="text-primary" />
            <span className="font-bold text-gray-900 text-sm">Perfil más sólido</span>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 right-40 md:right-60 bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-xl z-20"
          >
            <Zap size={16} className="text-yellow-500" />
            <span className="font-bold text-gray-900 text-sm">Superior a la competencia</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL PROOF / BENEFITS ──────────────────────────────────────────────────

function Benefits() {
  const items = [
    { icon: <Zap size={24} className="text-yellow-500" />, title: "Primera impresión sólida", desc: "Un perfil con buenos números transmite más actividad, presencia y autoridad." },
    { icon: <Shield size={24} className="text-red-500" />, title: "Más confianza", desc: "La prueba social ayuda a que una persona nueva perciba tu perfil con más respaldo." },
    { icon: <TrendingUp size={24} className="text-blue-500" />, title: "Apoyo para tus anuncios", desc: "Si invertís en publicidad, tu perfil no debería verse vacío cuando hacen clic." },
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="font-bold text-white/60 text-xs tracking-widest uppercase block mb-3 border border-white/20 rounded-full px-4 py-1 inline-block">PRUEBA SOCIAL</span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
              Tu perfil también vende por vos.
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto text-lg font-medium">
              Antes de leer tu oferta, muchas personas ya sacaron una conclusión sobre tu marca. Un perfil fuerte ayuda a que esa primera impresión juegue a tu favor.
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="p-8 rounded-[2rem] bg-white flex flex-col items-center text-center shadow-2xl"
            >
              <div className="bg-gray-50 p-4 rounded-2xl mb-6 shadow-sm border border-gray-100">
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
      className="relative flex flex-col rounded-[2rem] overflow-hidden bg-white shadow-xl border-4 border-white/10 hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="p-6 pb-4 flex flex-col items-center text-center border-b border-gray-100">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 shadow-inner flex items-center justify-center text-gray-800 mb-4">
          {service.icon}
        </div>
        <h3 className="font-black text-gray-900 text-2xl leading-none mb-1">{service.name}</h3>
        {service.subtitle && (
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            {service.subtitle}
          </span>
        )}
      </div>

      <div className="p-6 flex-1 bg-gray-50/50">
        <div className="space-y-2">
          {service.tiers.map((tier, index) => {
            const finalPrice = getPrice(service.id, index, tier.price, currency);
            return (
            <div
              key={tier.tierQty}
              className="flex items-center justify-between gap-2 py-3 px-4 rounded-2xl bg-white shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <span className="font-black text-gray-900 text-lg">{tier.tierQty}</span>
                {tier.discount && (
                  <span className="text-[9px] font-black px-2 py-1 rounded-lg text-white bg-red-500 uppercase">
                    {tier.discount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-gray-900 text-base">
                  {CURRENCY_SYMBOLS[currency]}{finalPrice.toLocaleString("es-AR")}
                </span>
                <button
                  onClick={() => handleAdd(tier, finalPrice)}
                  className={\`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 \${addedTier === tier.tierQty ? 'bg-green-500 text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}\`}
                >
                  {addedTier === tier.tierQty ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                </button>
              </div>
            </div>
            );
          })}
        </div>
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
    <section id="catalogo" className="py-24 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">Generá ingresos</h2>
            <p className="text-white/80 max-w-xl mx-auto text-lg font-medium">
              Elegí la plataforma y empezá a crecer.
            </p>
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap mb-16">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={\`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 \${activeCategory === cat.id ? 'bg-white text-gray-900 shadow-xl' : 'bg-white/10 text-white hover:bg-white/20'}\`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(s => <ServiceCard key={s.id} service={s} />)}
        </div>
      </div>
    </section>
  );
}

// ─── FLOATING WHATSAPP ────────────────────────────────────────────────────────

function FloatingWhatsApp() {
  return (
    <a
      href={\`https://wa.me/\${WHATSAPP_NUMBER}\`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-2xl hover:scale-105 transition-transform"
    >
      <div className="w-8 h-8 rounded-full bg-[#25d366] flex items-center justify-center text-white">
        <FaWhatsapp size={18} />
      </div>
      <span className="font-bold text-gray-900 text-sm hidden sm:block">Atención personalizada</span>
    </a>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

function Home() {
  return (
    <div className="min-h-screen w-full font-sans selection:bg-primary/30 selection:text-white">
      <Header />
      <Hero />
      <Benefits />
      <Catalog />
      
      {/* Footer minimalista */}
      <footer className="py-12 bg-black text-center border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
          <p className="font-black text-2xl text-white tracking-tighter mb-4">
            W<span className="text-white/70">EASY</span>
          </p>
          <p className="text-sm text-white/50 font-medium">
            &copy; {new Date().getFullYear()} Todos los derechos reservados.
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
console.log('App.tsx updated successfully');
