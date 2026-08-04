const fs = require('fs');

const appTsxPath = 'src/App.tsx';
const content = fs.readFileSync(appTsxPath, 'utf8');
const lines = content.split('\n');

// Keep everything up to line 632 (0-indexed: 631) which is the end of data
const beforeCart = lines.slice(0, 632).join('\n');

const newUiCode = `

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
  const ls = items.map(i => \`• \${i.serviceName} — \${i.tierQty} x\${i.qty} = \${sym}\${(i.price*i.qty).toLocaleString("es-AR")} \${currency}\`);
  return encodeURIComponent(["¡Hola! Quiero confirmar mi pedido.","","📋 *DETALLE:*",...ls,"",\`💰 *Total: \${sym}\${total.toLocaleString("es-AR")} \${currency}*\`,"","Ya realicé la transferencia. ¡Gracias!"].join("\\n"));
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

function PaymentModal({ items, total, onBack, onConfirm, currency }: { items:CartItem[]; total:number; onBack:()=>void; onConfirm:()=>void; currency:Currency }) {
  const sym = CURRENCY_SYMBOLS[currency];
  const [tab, setTab] = useState<"ARS"|"USD">("ARS");
  const data = tab === "ARS" ? PAYMENT_ARS : PAYMENT_USD;
  return (
    <div style={{ position:'fixed', inset:0, zIndex:80, display:'flex', alignItems:'flex-end', justifyContent:'center', background:'rgba(18,0,61,.6)', backdropFilter:'blur(6px)' }}>
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
        <div style={{ padding:'16px 24px 12px' }}>
          <div style={{ display:'flex', gap:8 }}>
            {(['ARS','USD'] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{ flex:1, padding:10, borderRadius:14, border:'none', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, transition:'all 0.2s', background: tab===t ? 'linear-gradient(135deg,#7f1fff,#bf5bff)' : '#f6f2ff', color: tab===t ? '#fff' : '#7628f0' }}>
                {t==='ARS'?'🇦🇷 Pesos ARS':'🇺🇸 Dólares USD'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 24px', display:'flex', flexDirection:'column', gap:8 }}>
          {data.map(row=><CopyRow key={row.label} label={row.label} value={row.value}/>)}
        </div>
        <div style={{ padding:'20px 24px', borderTop:'1px solid #f3edfc', display:'flex', flexDirection:'column', gap:12 }}>
          <button onClick={onConfirm} style={{ width:'100%', padding:16, borderRadius:16, border:'none', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:15, color:'#fff', background:'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow:'0 6px 24px rgba(22,163,74,.35)', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            <CheckCircle2 size={20}/> YA TRANSFERÍ — CONFIRMAR PEDIDO
          </button>
          <p style={{ textAlign:'center', fontSize:11, color:'#9a92a8', margin:0 }}>Se abrirá WhatsApp para enviarnos el comprobante.</p>
        </div>
      </motion.div>
    </div>
  );
}

function CartDrawer() {
  const { items, remove, changeQty, total, open, setOpen, currency } = useCart();
  const sym = CURRENCY_SYMBOLS[currency];
  const [showPayment, setShowPayment] = useState(false);
  const handleConfirm = () => {
    window.open(\`https://wa.me/\${WHATSAPP_NUMBER}?text=\${buildWhatsAppMsg(items,total,currency)}\`,"_blank");
    setShowPayment(false); setOpen(false);
  };
  return (
    <>
      <div onClick={()=>{setOpen(false);setShowPayment(false);}} style={{ position:'fixed', inset:0, zIndex:60, background:'rgba(18,0,61,.4)', backdropFilter:'blur(4px)', opacity:open?1:0, pointerEvents:open?'auto':'none', transition:'opacity 0.3s' }}/>
      <aside style={{ position:'fixed', right:0, top:0, height:'100%', width:'100%', maxWidth:420, zIndex:70, display:'flex', flexDirection:'column', background:'#fff', boxShadow:'-12px 0 50px rgba(118,40,240,.12)', transform:open?'translateX(0)':'translateX(100%)', transition:'transform 0.3s ease-out' }}>
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
          <div style={{ flex:1, overflowY:'auto', padding:'16px 24px', display:'flex', flexDirection:'column', gap:12 }}>
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
        <div style={{ padding:'20px 24px', borderTop:'1px solid #f3edfc', display:'flex', flexDirection:'column', gap:16 }}>
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
      {showPayment && open && <PaymentModal items={items} total={total} onBack={()=>setShowPayment(false)} onConfirm={handleConfirm} currency={currency}/>}
    </>
  );
}

function CurrencySelector() {
  const { currency, setCurrency } = useCart();
  const currencies: Currency[] = ["ARS","USD","EUR","COP","MXN","UYU","BRL"];
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position:'relative' }}>
      <button onClick={()=>setOpen(!open)} style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 10px', borderRadius:20, background:'transparent', border:'none', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, color:'#121212' }}>
        {currency}<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity:.5 }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 6px)', right:0, background:'#fff', borderRadius:14, boxShadow:'0 8px 40px rgba(118,40,240,.15)', border:'1px solid rgba(141,44,255,.1)', padding:6, zIndex:50, minWidth:85 }}>
          {currencies.map(c=>(
            <button key={c} onClick={()=>{setCurrency(c);setOpen(false);}} style={{ display:'block', width:'100%', padding:'7px 12px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, textAlign:'left', background: currency===c ? 'linear-gradient(135deg,#7f1fff,#9c34ff)' : 'transparent', color: currency===c ? '#fff' : '#121212' }}>
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
  { label:'Seguidores', sub:'INSTAGRAM', icon:'👥' },
  { label:'Likes', sub:'INSTAGRAM', icon:'❤️' },
  { label:'Views', sub:'INSTAGRAM', icon:'👁️' },
  { label:'Compartidos', sub:'INSTAGRAM', icon:'📤' },
  { label:'Guardados', sub:'INSTAGRAM', icon:'🔖' },
  { label:'Repost', sub:'INSTAGRAM', icon:'🔁' },
  { label:'Views', sub:'TIKTOK', icon:'🎵' },
  { label:'Seguidores', sub:'TIKTOK', icon:'👥' },
];

function Header() {
  const { count, setOpen } = useCart();
  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:50 }}>
      {/* Announcement bar */}
      <div style={{ background:'linear-gradient(266deg,rgba(5,5,5,1),rgba(65,65,65,1) 100%)', color:'#fff', padding:'9px 24px', display:'flex', alignItems:'center', justifyContent:'center', gap:20 }}>
        <Instagram size={15} style={{ opacity:.8 }}/>
        <FaTiktok size={14} style={{ opacity:.8 }}/>
        <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>3 CUOTAS SIN INTERES</span>
      </div>

      {/* Main white header */}
      <header style={{ background:'#fff', borderBottom:'1px solid #ececec' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'10px 24px', display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:16 }}>
          {/* Left: empty placeholder for symmetry */}
          <div/>

          {/* Center: Logo */}
          <a href="#home" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', justifyContent:'center' }}>
            <div style={{ width:42, height:42, borderRadius:8, background:'#121212', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
              <span style={{ fontWeight:900, fontSize:16, color:'#fff', letterSpacing:'-1px' }}>W<span style={{ color:'#a855f7' }}>M</span></span>
            </div>
            <div style={{ lineHeight:1.1 }}>
              <div style={{ fontWeight:900, fontSize:22, color:'#121212', letterSpacing:'-1px' }}>EASY</div>
              <div style={{ fontWeight:600, fontSize:11, color:'#121212', letterSpacing:'0.08em', textTransform:'uppercase' }}>MARKETING</div>
            </div>
          </a>

          {/* Right: nav + icons */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:28 }}>
            <nav style={{ display:'flex', alignItems:'center', gap:24 }}>
              {['Inicio','¿Cómo funciona?','Preguntas Frecuentes','Saber Más','blog'].map(label=>(
                <a key={label} href="#" style={{ fontSize:13, fontWeight:500, color:'#121212', textDecoration:label==='Inicio'?'underline':'none', textUnderlineOffset:3 }}>{label}</a>
              ))}
            </nav>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <CurrencySelector/>
              <Search size={18} style={{ color:'#121212', cursor:'pointer' }}/>
              <User size={18} style={{ color:'#121212', cursor:'pointer' }}/>
              <button onClick={()=>setOpen(true)} style={{ position:'relative', background:'none', border:'none', cursor:'pointer', color:'#121212', display:'flex', padding:2 }}>
                <ShoppingCart size={20}/>
                {count>0 && <span style={{ position:'absolute', top:-5, right:-5, width:18, height:18, borderRadius:'50%', background:'linear-gradient(135deg,#7f1fff,#9c34ff)', color:'#fff', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff' }}>{count}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Purple sub-nav with service shortcuts */}
      <div style={{ background:'linear-gradient(135deg,#7628f0 0%,#9c34ff 100%)', overflowX:'auto', scrollbarWidth:'none' }}>
        <div style={{ display:'flex', gap:0, padding:'0 24px', maxWidth:1200, margin:'0 auto', width:'max-content' }}>
          {SERVICE_SHORTCUTS.map((s,i)=>(
            <a key={i} href="#catalogo" style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 18px', color:'rgba(255,255,255,.9)', textDecoration:'none', borderRight:'1px solid rgba(255,255,255,.12)', whiteSpace:'nowrap' }}>
              <span style={{ fontSize:14 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:'#fff' }}>{s.label}</div>
                <div style={{ fontSize:9, fontWeight:600, color:'rgba(255,255,255,.7)', letterSpacing:'0.08em' }}>{s.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="home" style={{
      paddingTop:130, paddingBottom:90, position:'relative', overflow:'hidden',
      background:\`radial-gradient(circle at 15% 18%, rgba(141,44,255,.18), transparent 32%), radial-gradient(circle at 85% 78%, rgba(176,82,255,.14), transparent 28%), linear-gradient(135deg, #18003d 0%, #2a0066 36%, #3a008c 72%, #4b0fb0 100%)\`
    }}>
      {/* Decorative subtle shapes */}
      {[
        { left:40, top:'30%', size:70, rotate:15 },
        { left:80, top:'60%', size:40, rotate:-10 },
        { right:120, top:'20%', size:55, rotate:20 },
      ].map((s,i)=>(
        <div key={i} style={{ position:'absolute', left:s.left, right:s.right, top:s.top, width:s.size, height:s.size, border:'4px solid rgba(255,255,255,0.06)', borderRadius:14, transform:\`rotate(\${s.rotate}deg)\`, pointerEvents:'none' }}/>
      ))}

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', gap:60, flexWrap:'wrap' }}>
        {/* Left */}
        <div style={{ flex:'1 1 460px', maxWidth:580 }}>
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:20, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', marginBottom:28 }}>
              <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.9)', letterSpacing:'0.06em', textTransform:'uppercase' }}>AR</span>
              <span style={{ fontWeight:700, fontSize:13, color:'rgba(255,255,255,.9)' }}>Sitio #1 en Argentina</span>
            </div>
            <h1 style={{ fontSize:'clamp(46px,5.5vw,80px)', fontWeight:900, color:'#ffffff', lineHeight:1.06, letterSpacing:'-2px', margin:'0 0 20px', fontFamily:'Poppins,sans-serif' }}>
              Marketing fácil<br/>para vender<br/>mejor.
            </h1>
            <p style={{ fontSize:18, fontWeight:700, color:'rgba(255,255,255,.85)', marginBottom:32, lineHeight:1.55 }}>
              Impulsá tu perfil en minutos, de forma<br/>automática y segura.
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
          </motion.div>
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
                <p style={{ fontWeight:900, fontSize:17, color:'#121212', margin:0 }}>EasyMarketing</p>
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
  return (
    <div style={{ background:'#fff', padding:'36px 24px', borderBottom:'1px solid #ececec' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', justifyContent:'center', gap:'clamp(40px,8vw,120px)', flexWrap:'wrap' }}>
        {[
          { num:'+248.731', label:'ÓRDENES COMPLETADAS' },
          { num:'+49.286', label:'CLIENTES SATISFECHOS' },
        ].map((s,i)=>(
          <div key={i} style={{ textAlign:'center' }}>
            <p style={{ fontWeight:900, fontSize:'clamp(28px,4vw,48px)', color:'#121212', margin:0, letterSpacing:'-1px' }}>{s.num}</p>
            <p style={{ fontWeight:600, fontSize:11, color:'#9a92a8', margin:'6px 0 0', letterSpacing:'0.1em', textTransform:'uppercase' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CATALOG (platform cards + service tiers) ─────────────────────────────────
const PLATFORM_CARDS = [
  { id:'instagram', label:'INSTAGRAM', icon:'📸', color:'#E1306C', available:true },
  { id:'tiktok',    label:'TIKTOK',    icon:'🎵', color:'#010101', available:true },
  { id:'facebook',  label:'FACEBOOK',  icon:'📘', color:'#1877F2', available:false },
  { id:'youtube',   label:'YOUTUBE',   icon:'▶️', color:'#FF0000', available:true },
  { id:'spotify',   label:'SPOTIFY',   icon:'🎧', color:'#1DB954', available:true },
];

function ServiceTierView({ service }: { service: ServiceGroup }) {
  const { add, currency } = useCart();
  const [addedTier, setAddedTier] = useState<string|null>(null);
  const handleAdd = (tier: ServiceTier, price: number) => {
    const name = service.subtitle ? \`\${service.name} — \${service.subtitle}\` : service.name;
    add({ id:\`\${service.id}-\${tier.tierQty}\`, serviceName:name, tierQty:tier.tierQty, price });
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
              <button onClick={()=>{ if(p.available) setActivePlatform(activePlatform===p.id?null:p.id); }}
                style={{ width:'100%', background:'#fff', borderRadius:20, padding:'32px 20px 24px', border: activePlatform===p.id?'2px solid #7628f0':'2px solid transparent', boxShadow: activePlatform===p.id?'0 8px 30px rgba(118,40,240,.2)':'0 4px 16px rgba(118,40,240,.07)', cursor:p.available?'pointer':'default', transition:'all 0.25s', display:'flex', flexDirection:'column', alignItems:'center', gap:14, textAlign:'center', fontFamily:'Poppins,sans-serif' }}>
                <span style={{ fontSize:52 }}>{p.icon}</span>
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
        <div style={{ background:'#fff', borderTop:'1px solid rgba(118,40,240,.08)' }}>
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
      background:\`radial-gradient(circle at 15% 18%, rgba(141,44,255,.18), transparent 32%), radial-gradient(circle at 85% 78%, rgba(176,82,255,.14), transparent 28%), linear-gradient(135deg, #18003d 0%, #2a0066 36%, #3a008c 72%, #4b0fb0 100%)\`
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

// ─── FAQ ─────────────────────────────────────────────────────────────────────
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
    <a href={\`https://wa.me/\${WHATSAPP_NUMBER}\`} target="_blank" rel="noreferrer"
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
        <FAQ/>
      </div>
      <footer style={{ background:'#121212', padding:'48px 24px', textAlign:'center' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <p style={{ fontWeight:900, fontSize:20, color:'#fff', margin:'0 0 8px', letterSpacing:'-0.5px' }}>EASY<span style={{ color:'#9c34ff' }}>MARKETING</span></p>
          <div style={{ display:'flex', justifyContent:'center', gap:16, marginBottom:20 }}>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" style={{ color:'#9a92a8' }}><Instagram size={20}/></a>
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
`;

fs.writeFileSync(appTsxPath, beforeCart + newUiCode);
console.log('Written successfully. Lines: ' + (beforeCart + newUiCode).split('\n').length);
