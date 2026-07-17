import { useState, useEffect, useCallback } from "react";
import { authAPI, productsAPI, reviewsAPI, ordersAPI, adminAPI } from "./api.js";
import { CSS } from "./styles";

const CARE_GUIDES = [
  { icon:"W", title:"Watering Right",     body:"Most plants die from too much water, not too little. Feel the top inch of soil — dry means water, moist means wait. Always use pots with drainage holes and empty saucers after 30 minutes." },
  { icon:"S", title:"Reading the Light",  body:"'Bright indirect' means near a window but out of direct rays. A sheer curtain is your best friend. Rotate plants quarterly so all sides receive even light for upright, balanced growth." },
  { icon:"P", title:"Soil & Repotting",   body:"Repot every 1–2 springs into a pot just 2 inches larger. Use a mix matched to your plant — cacti need grit, tropicals need richness. Roots peeking from the drainage hole? Time to upgrade." },
  { icon:"H", title:"Humidity & Seasons", body:"Tropical plants thrive with humidity. Group plants together, use a pebble tray, or mist occasionally. Ease off watering in winter when growth naturally slows — plants rest too." },
];

const HOME_REVIEWS = [
  { name:"Priya S.",  plant:"Monstera Deliciosa",  rating:5, text:"Arrived with new growth already showing. Packaged so well — not a single leaf damaged. Looks unreal in my living room.", avatar:"P" },
  { name:"James L.",  plant:"Bird of Paradise",    rating:5, text:"Much larger than expected. Customer service helped me pick the right spot. It's already unfurling a new leaf!", avatar:"J" },
  { name:"Meera K.",  plant:"Philodendron Brasil", rating:5, text:"So lush and bushy — I've bought three now as gifts. Everyone asks where I got it. Will always shop here.", avatar:"M" },
  { name:"Arjun T.",  plant:"Aloe Vera",           rating:4, text:"Sturdy, healthy, exactly as described. Delivery was prompt. Very happy with the packaging too.", avatar:"A" },
];

const CATS = ["All","Indoor","Succulent","Outdoor","Rare"];
const COUNTRIES = {
  "IN": { name: "India", code: "+91", pattern: /^[6-9]\d{9}$/ },
  "US": { name: "United States", code: "+1", pattern: /^\d{10}$/ },
  "UK": { name: "United Kingdom", code: "+44", pattern: /^[0-9]{10,11}$/ },
  "CA": { name: "Canada", code: "+1", pattern: /^\d{10}$/ },
  "AU": { name: "Australia", code: "+61", pattern: /^[2-9]\d{8}$/ },
  "SG": { name: "Singapore", code: "+65", pattern: /^[6-9]\d{7}$/ },
};
const fmt  = (n) => `₹${n.toLocaleString("en-IN")}`;
const stars= (r) => "★".repeat(Math.round(r)) + "☆".repeat(5-Math.round(r));

export default function App() {
  const [plants,   setPlants]  = useState([]);
  const [loading,  setLoading] = useState(true);
  const [page,     setPage]    = useState("home");
  const [cart,     setCart]    = useState([]);
  const [wl,       setWl]      = useState([]);
  const [cat,      setCat]     = useState("All");
  const [search,   setSearch]  = useState("");
  const [sort,     setSort]    = useState("default");
  const [cartOpen, setCartOpen]= useState(false);
  const [modal,    setModal]   = useState(null);
  const [toast,    setToast]   = useState("");
  const [mOpen,    setMOpen]   = useState(false);
  const [address,  setAddress] = useState("");
  const [phone,    setPhone]   = useState("");
  const [country,  setCountry] = useState("IN");
  const [editAddr, setEditAddr]= useState(false);
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', email: '', password: '', avatar: '👤' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [plantReviews, setPlantReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewForm, setEditReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMenuOpen, setReviewMenuOpen] = useState(null);
  const [activeCartTab, setActiveCartTab] = useState('cart');

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [adminOrders, setAdminOrders] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [adminTab, setAdminTab] = useState('orders');

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""), 2600); };
  const nav = (p) => { setPage(p); setMOpen(false); window.scrollTo(0,0); };

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', next);
  };

  useEffect(() => {
    if (!token) { setUser(null); return; }
    authAPI.me().then(res => setUser(res.data)).catch(() => {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    });
  }, [token]);

  useEffect(() => {
    setLoading(true);
    productsAPI.getAll({ category: cat !== 'All' ? cat : undefined, search: search || undefined })
      .then(res => setPlants(res.data))
      .catch(() => setPlants([]))
      .finally(() => setLoading(false));
  }, [cat, search]);

  const handleLogin = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await authAPI.login({ email: loginForm.email, password: loginForm.password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setLoginModalOpen(false);
      setLoginForm({ username: '', email: '', password: '', avatar: '👤' });
      showToast("Welcome back, " + res.data.user.username + "!");
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await authAPI.register({
        username: loginForm.username,
        email: loginForm.email,
        password: loginForm.password,
        avatar: loginForm.avatar
      });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setLoginModalOpen(false);
      setLoginForm({ username: '', email: '', password: '', avatar: '👤' });
      showToast("Welcome, " + res.data.user.username + "!");
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Registration failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    showToast("Logged out successfully");
  };

  const loadReviews = useCallback(async (productId) => {
    if (!productId) return;
    setReviewsLoading(true);
    try {
      const res = await reviewsAPI.getByProduct(productId);
      setPlantReviews(res.data);
    } catch { setPlantReviews([]); }
    finally { setReviewsLoading(false); }
  }, []);

  useEffect(() => {
    if (modal) { loadReviews(modal.id); setNewReview({ rating: 5, comment: '' }); setEditingReview(null); }
  }, [modal, loadReviews]);

  const submitReview = async (plantId) => {
    if (!user) { showToast("Please login to write a review"); setLoginModalOpen(true); return; }
    if (!newReview.comment.trim()) { showToast("Please write a comment"); return; }
    try {
      await reviewsAPI.create(plantId, { rating: newReview.rating, comment: newReview.comment.trim() });
      setNewReview({ rating: 5, comment: '' });
      loadReviews(plantId);
      showToast("Review submitted!");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to submit review");
    }
  };

  const saveEditReview = async (plantId) => {
    if (!editReviewForm.comment.trim()) { showToast("Please write a comment"); return; }
    try {
      await reviewsAPI.update(editingReview, { rating: editReviewForm.rating, comment: editReviewForm.comment.trim() });
      setEditingReview(null);
      loadReviews(plantId);
      showToast("Review updated!");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update review");
    }
  };

  const deleteReview = async (plantId, reviewId) => {
    try {
      await reviewsAPI.delete(reviewId);
      loadReviews(plantId);
      showToast("Review deleted!");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to delete review");
    }
  };

  const placeOrder = async () => {
    if (!user) { showToast("Please login to place an order"); setLoginModalOpen(true); return; }
    if (!address.trim() || !phone.trim()) { showToast("Please add address first"); return; }
    if (!COUNTRIES[country].pattern.test(phone)) { showToast("Invalid phone number"); return; }
    try {
      await ordersAPI.create({
        items: cart.map(i => ({ id: i.id, qty: i.qty })),
        address, phone, country
      });
      setCart([]);
      setCartOpen(false);
      setAddress(""); setPhone(""); setCountry("IN");
      showToast("Order placed! Your plants are on their way!");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to place order");
    }
  };

  useEffect(() => {
    if (page === 'orders' && user) {
      setOrdersLoading(true);
      ordersAPI.getMyOrders().then(res => setOrders(res.data)).catch(() => setOrders([])).finally(() => setOrdersLoading(false));
    }
  }, [page, user]);

  useEffect(() => {
    if (page === 'admin' && user?.role === 'admin') {
      Promise.all([adminAPI.getOrders(), adminAPI.getUsers(), adminAPI.getStats()])
        .then(([o, u, s]) => { setAdminOrders(o.data); setAdminUsers(u.data); setAdminStats(s.data); })
        .catch(() => {});
    }
  }, [page, user]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await adminAPI.updateOrderStatus(orderId, status);
      setAdminOrders(prev => prev.map(o => o.id === orderId ? res.data : o));
      showToast("Order status updated");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update");
    }
  };

  const addToCart = (p, e) => {
    e?.stopPropagation();
    setCart(prev => {
      const ex = prev.find(i=>i.id===p.id);
      return ex ? prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i) : [...prev,{...p,qty:1}];
    });
    showToast("Added to cart");
  };

  const rm    = (id) => setCart(p=>p.filter(i=>i.id!==id));
  const updQ  = (id,d) => setCart(p=>p.map(i=>i.id===id?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0));
  const togWL = (id,e) => { e?.stopPropagation(); setWl(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); };

  const cCount = cart.length;
  const cSub   = cart.reduce((s,i)=>s+i.price*i.qty, 0);
  const cDel   = cSub >= 999 ? 0 : 99;
  const cTot   = cSub + cDel;

  const filtered = plants
    .sort((a,b)=>sort==="price-asc"?a.price-b.price:sort==="price-desc"?b.price-a.price:sort==="rating"?b.rating-a.rating:0);

  const saveAddress = () => {
    if (!address.trim()) { showToast("Please enter your address"); return false; }
    if (!phone.trim()) { showToast("Please enter your phone number"); return false; }
    if (!COUNTRIES[country].pattern.test(phone)) { showToast("Invalid phone number for " + COUNTRIES[country].name); return false; }
    setEditAddr(false);
    showToast("Address saved!");
    return true;
  };

  const Card = ({ p }) => {
    const inWL = wl.includes(p.id);
    return (
      <div className="card" onClick={()=>setModal(p)}>
        <div className="card-img">
          {p.badge && <span className="card-badge">{p.badge}</span>}
          <button className={`wl ${inWL?"on":""}`} onClick={(e) => togWL(p.id, e)} title="Wishlist">{inWL?"♥":"♡"}</button>
          <img src={p.image} alt={p.name} style={{width:"100%", height:"100%", objectFit:"cover"}} />
        </div>
        <div className="card-body">
          <div className="card-name">{p.name}</div>
          <div className="card-cat">{p.category}</div>
          <div className="rr">
            <span className="stars">{stars(p.rating)}</span>
            <span className="rc">({p.reviews_count})</span>
          </div>
          <div className="card-desc">{p.description}</div>
          <div className="card-foot">
            <span className="card-price">{fmt(p.price)}</span>
            <button className="add-btn" onClick={e=>addToCart(p,e)}>+ Add</button>
          </div>
        </div>
      </div>
    );
  };

  const loginModal = loginModalOpen && (
    <div className="login-overlay" onClick={()=>setLoginModalOpen(false)}>
      <div className="login-box" onClick={e=>e.stopPropagation()}>
        <button className="m-close" onClick={()=>setLoginModalOpen(false)}>X</button>
        <div className="login-title">{user ? 'Profile' : authMode === 'login' ? 'Login' : 'Create Account'}</div>

        {user ? (
          <div style={{textAlign:"center", padding:"1rem"}}>
            <div style={{fontSize:"3rem", marginBottom:".5rem"}}>{user.avatar}</div>
            <div style={{fontSize:"1.2rem", fontWeight:600, marginBottom:".3rem"}}>{user.username}</div>
            <div style={{fontSize:".75rem", color:"var(--muted)"}}>{user.email}</div>
            {user.role === 'admin' && <div style={{fontSize:".7rem", color:"var(--accent)", marginTop:".3rem", fontWeight:600}}>Admin</div>}
            <div style={{display:"flex",gap:".5rem",marginTop:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
              {user.role !== 'admin' && <button className="btn-p" style={{padding:"8px 16px",fontSize:".8rem"}} onClick={()=>nav("orders")}>My Orders</button>}
              {user.role === 'admin' && <button className="btn-p" style={{padding:"8px 16px",fontSize:".8rem"}} onClick={()=>{nav("admin");setLoginModalOpen(false);}}>Admin Dashboard</button>}
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <>
            {authError && <div style={{fontSize:".8rem",color:"var(--danger)",textAlign:"center",marginBottom:".8rem",padding:".5rem",background:"rgba(224,82,82,.1)",borderRadius:8}}>{authError}</div>}

            {authMode === 'register' && (
              <div className="login-field">
                <label className="login-label">Username</label>
                <input className="login-input" type="text" placeholder="Choose a username"
                  value={loginForm.username} onChange={(e)=>setLoginForm({...loginForm, username: e.target.value})} />
              </div>
            )}

            <div className="login-field">
              <label className="login-label">Email</label>
              <input className="login-input" type="email" placeholder="you@example.com"
                value={loginForm.email} onChange={(e)=>setLoginForm({...loginForm, email: e.target.value})} />
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <input className="login-input" type="password" placeholder={authMode==='register'?"Min 6 characters":"Enter password"}
                value={loginForm.password} onChange={(e)=>setLoginForm({...loginForm, password: e.target.value})} />
            </div>

            {authMode === 'register' && (
              <div className="login-field">
                <label className="login-label">Choose Avatar</label>
                <div className="avatar-options">
                  {['👤', '🌿', '🌵', '🌺', '🌻', '🌲', '🌱', '🪴'].map(emoji => (
                    <button key={emoji} className={`avatar-option ${loginForm.avatar === emoji ? 'selected' : ''}`}
                      onClick={() => setLoginForm({...loginForm, avatar: emoji})}>{emoji}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="login-actions">
              <button className="btn-p" disabled={authLoading} onClick={authMode==='login'?handleLogin:handleRegister}>
                {authLoading ? 'Please wait...' : authMode==='login' ? 'Login' : 'Create Account'}
              </button>
              <button className="btn-o" onClick={()=>setLoginModalOpen(false)}>Cancel</button>
            </div>

            <div style={{textAlign:"center",marginTop:".8rem",fontSize:".8rem",color:"var(--muted)"}}>
              {authMode==='login' ? (
                <>New here? <button style={{background:"none",border:"none",color:"var(--accent)",cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setAuthMode('register');setAuthError('');}}>Create account</button></>
              ) : (
                <>Already have an account? <button style={{background:"none",border:"none",color:"var(--accent)",cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setAuthMode('login');setAuthError('');}}>Login</button></>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="nav">
        <button className="logo" onClick={()=>nav("home")}>Verdura</button>
        <div className={`nav-links ${mOpen?"open":""}`}>
          {["home","shop","care","about"].map(p=>(
            <button key={p} className={`nl ${page===p?"on":""}`} onClick={()=>nav(p)}>
              {p[0].toUpperCase()+p.slice(1)}
            </button>
          ))}
          {user && <button className={`nl ${page==="orders"?"on":""}`} onClick={()=>nav("orders")}>My Orders</button>}
          {user?.role === 'admin' && <button className={`nl ${page==="admin"?"on":""}`} onClick={()=>nav("admin")}>Admin</button>}
        </div>
        <div className="nav-r">
          {user ? (
            <button className="user-btn" onClick={() => setLoginModalOpen(true)} title="View profile">
              <span className="user-avatar">{user.avatar}</span>
              <span className="user-name">{user.username}</span>
            </button>
          ) : (
            <button className="login-btn" onClick={() => { setAuthMode('login'); setLoginModalOpen(true); }}>Login</button>
          )}
          <button className="theme-toggle" onClick={toggleDarkMode} title="Toggle dark mode">
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button className="cart-btn" onClick={()=>setCartOpen(true)}>
            Cart {cCount>0&&<span className="cbadge">{cCount}</span>}
          </button>
          <button className="hmb" onClick={()=>setMOpen(m=>!m)}>
            <span className="hb"/><span className="hb"/><span className="hb"/>
          </button>
        </div>
      </nav>

      {/* HOME */}
      {page==="home"&&(loading ? (
        <div className="sec" style={{textAlign:"center",padding:"6rem 2rem"}}>
          <div style={{fontSize:"1.1rem",color:"var(--muted)"}}>Loading plants...</div>
        </div>
      ) : (
        <>
        <div className="hero">
          <div>
            <div className="hero-eye">Premium Plant Boutique - Chennai</div>
            <h1 className="hero-h1">Plants that<br/><em>breathe life</em><br/>into your space.</h1>
            <p className="hero-sub">Ethically sourced, expertly curated, and delivered healthy to your door. From beginner-friendly to rare collectors' gems.</p>
            <div className="hero-btns">
              <button className="btn-p" onClick={()=>nav("shop")}>Shop All Plants →</button>
              <button className="btn-o" onClick={()=>nav("care")}>Care Guides</button>
            </div>
          </div>
          <div className="hero-vis"><div className="hero-circle"><img src="./images/hero-plant.png" alt="Featured Plant" style={{width:"100%", height:"100%", objectFit:"contain"}} /></div></div>
        </div>

        <div className="stats">
          {[["500+","Varieties"],["12,000+","Happy Customers"],["4.9","Avg Rating"],["Free","Delivery ≥ ₹999"]].map(([n,l])=>(
            <div key={l} className="stat"><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
          ))}
        </div>

        <div className="sec">
          <div className="sec-eye">✦ Curated Selection</div>
          <h2 className="sec-h">Staff Picks</h2>
          <p className="sec-sub">Hand-selected by our botanists this season</p>
          <div className="grid home-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>{plants.filter(p=>p.badge).slice(0,6).map(p=><Card key={p.id} p={p}/>)}</div>
          <div style={{textAlign:"center",marginTop:"2.5rem"}}>
            <button className="btn-p" onClick={()=>nav("shop")}>View All {plants.length} Plants →</button>
          </div>
        </div>

        <div className="why-bg">
          <div className="sec" style={{paddingTop:0,paddingBottom:0}}>
            <div className="sec-eye">✦ Our Promise</div>
            <h2 className="sec-h">Why Verdura?</h2>
            <p className="sec-sub">We're not just selling plants — we're sharing a way of living.</p>
            <div className="why-grid">
              {[["🌱","Ethically Grown","Sourced from certified sustainable nurseries with verified practices."],
                ["📦","Safe Packaging","Custom boxes protect every leaf, stem and root during transit."],
                ["🔬","Expert Curation","Every plant inspected by our in-house botanist before shipping."],
                ["💚","Alive Guarantee","Plant doesn't arrive healthy? We replace it, no questions asked."]].map(([i,t,d])=>(
                <div key={t} className="why-card">
                  <div className="why-ico">{i}</div>
                  <div className="why-t">{t}</div>
                  <div className="why-d">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sec">
          <div className="sec-eye">✦ Real People, Real Plants</div>
          <h2 className="sec-h">What Customers Say</h2>
          <p className="sec-sub">Over 12,000 happy plant parents across India</p>
          <div className="rev-grid">
            {HOME_REVIEWS.map(r=>(
              <div key={r.name} className="rev-card">
                <div className="rev-top">
                  <div className="rev-av">{r.avatar}</div>
                  <div>
                    <div className="rev-name">{r.name}</div>
                    <div className="rev-plant">Bought: {r.plant}</div>
                  </div>
                  <span className="stars" style={{marginLeft:"auto"}}>{"★".repeat(r.rating)}</span>
                </div>
                <div className="rev-text">"{r.text}"</div>
              </div>
            ))}
          </div>
        </div>

        <div className="cta-strip">
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(1.7rem,3.2vw,2.4rem)",color:"var(--g900)",marginBottom:".7rem"}}>Ready to go green?</h2>
          <p style={{color:"var(--muted)",marginBottom:"1.8rem",fontWeight:300}}>Free delivery on orders over ₹999. Alive arrival guaranteed.</p>
          <button className="btn-p" onClick={()=>nav("shop")}>Browse the Collection →</button>
        </div>
        </>
      ))}

      {/* SHOP */}
      {page==="shop"&&(loading ? (
        <div className="sec" style={{textAlign:"center",padding:"6rem 2rem"}}>
          <div style={{fontSize:"1.1rem",color:"var(--muted)"}}>Loading plants...</div>
        </div>
      ) : (
        <div className="sec">
          <div className="sec-eye">✦ All Plants</div>
          <h2 className="sec-h">Our Collection</h2>
          <p className="sec-sub">Every plant is healthy, happy, and ready for its new home</p>
          <div className="filter-row">
            {CATS.map(c=><button key={c} className={`cat-btn ${cat===c?"on":""}`} onClick={()=>setCat(c)}>{c}</button>)}
            <select className="sort-sel" value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <div className="srch-wrap">
              <span className="srch-ico">🔍</span>
              <input className="srch" placeholder="Search plants…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
          </div>
          {filtered.length===0 ? (
            <div className="empty">
              <div className="empty-ico">🌵</div>
              <div className="empty-h">No plants found</div>
              <p style={{fontSize:".875rem"}}>Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid">{filtered.map(p=><Card key={p.id} p={p}/>)}</div>
          )}
        </div>
      ))}

      {/* CARE */}
      {page==="care"&&(
        <div className="sec">
          <div className="sec-eye">✦ Plant Parenthood</div>
          <h2 className="sec-h">Care Guides</h2>
          <p className="sec-sub">Everything you need to keep your plants thriving long-term</p>
          <div className="care-grid">
            {CARE_GUIDES.map(g=>(
              <div key={g.title} className="care-card">
                <div className="care-ico">{g.icon}</div>
                <div className="care-t">{g.title}</div>
                <div className="care-b">{g.body}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:"2.5rem",background:"var(--surf)",borderRadius:16,padding:"2rem",border:"1.5px solid var(--border)"}}>
            <div className="sec-eye">✦ By Difficulty</div>
            <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.25rem",marginBottom:"1.2rem"}}>Find Your Level</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"1rem"}}>
              {[["🟢","Easy","Pothos, Succulents, ZZ Plant, Aloe — nearly indestructible."],
                ["🟡","Moderate","Monstera, Fiddle Leaf, Peace Lily — rewarding with some attention."],
                ["🔴","Advanced","Orchids, Rare aroids, Carnivorous plants — for dedicated lovers."]].map(([d,l,ex])=>(
                <div key={l} style={{background:"#fff",borderRadius:12,padding:"1.1rem",border:"1.5px solid var(--border)"}}>
                  <div style={{fontSize:"1.3rem",marginBottom:".45rem"}}>{d}</div>
                  <div style={{fontFamily:"'DM Serif Display',serif",fontSize:".975rem",marginBottom:".3rem"}}>{l}</div>
                  <div style={{fontSize:".78rem",color:"var(--muted)",lineHeight:1.55,fontWeight:300}}>{ex}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{textAlign:"center",marginTop:"2rem"}}>
            <button className="btn-p" onClick={()=>nav("shop")}>Shop All Plants →</button>
          </div>
        </div>
      )}

      {/* ABOUT */}
      {page==="about"&&(
        <div className="sec">
          <div className="about-wrap">
            <div className="sec-eye">✦ Our Story</div>
            <h2 className="sec-h">Born from a Balcony Garden</h2>
            <div style={{marginTop:"1.8rem"}} className="about-body">
              <p>Verdura started with a cramped Chennai apartment balcony, three succulents, and a stubborn belief that <strong>everyone deserves a little green in their life.</strong></p>
              <p>What began in 2019 as a small passion project quietly grew into a full plant boutique. We now work directly with ethical nurseries and small-scale growers across South India to bring you plants that are beautiful and responsibly raised.</p>
              <p>Our team of plant lovers, part-time botanists, and full-time enthusiasts personally selects every variety. If it's here, we've grown it, tested it, and loved it first.</p>
              <p>Our mission hasn't changed: make plant parenthood joyful, accessible, and a little bit magical — whether you're buying your very first succulent or hunting for a rare collectors' specimen.</p>
              <div className="about-quote">
                <blockquote>"Plants are not decorations. They are living relationships."</blockquote>
                <cite>— The Verdura Team, Chennai</cite>
              </div>
            </div>
            <div style={{display:"flex",gap:".875rem",marginTop:"2.5rem",flexWrap:"wrap"}}>
              <button className="btn-p" onClick={()=>nav("shop")}>Shop Now →</button>
              <button className="btn-o" onClick={()=>nav("care")}>Care Guides</button>
            </div>
          </div>
        </div>
      )}

      {/* MY ORDERS */}
      {page==="orders"&&(
        <div className="sec">
          <div className="sec-eye">✦ Order History</div>
          <h2 className="sec-h">My Orders</h2>
          <p className="sec-sub">Track your plant deliveries</p>
          {!user ? (
            <div style={{textAlign:"center",padding:"3rem"}}>
              <p style={{color:"var(--muted)",marginBottom:"1rem"}}>Please login to view your orders.</p>
              <button className="btn-p" onClick={()=>setLoginModalOpen(true)}>Login</button>
            </div>
          ) : ordersLoading ? (
            <div style={{textAlign:"center",padding:"3rem",color:"var(--muted)"}}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div style={{textAlign:"center",padding:"3rem"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>📦</div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.1rem",marginBottom:".5rem"}}>No orders yet</div>
              <p style={{fontSize:".85rem",color:"var(--muted)",marginBottom:"1.5rem"}}>Start shopping to see your orders here.</p>
              <button className="btn-p" onClick={()=>nav("shop")}>Shop Now →</button>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:700,margin:"0 auto"}}>
              {orders.map(order=>(
                <div key={order.id} style={{background:"var(--surf)",border:"1.5px solid var(--border)",borderRadius:12,padding:"1.2rem"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".8rem"}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:".9rem"}}>Order #{order.id}</div>
                      <div style={{fontSize:".75rem",color:"var(--muted)"}}>{new Date(order.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
                    </div>
                    <span style={{padding:"4px 10px",borderRadius:20,fontSize:".7rem",fontWeight:600,textTransform:"uppercase",
                      background:order.status==='delivered'?"#d4edda":order.status==='shipped'?"#cce5ff":order.status==='confirmed'?"#fff3cd":"#f8d7da",
                      color:order.status==='delivered'?"#155724":order.status==='shipped'?"#004085":order.status==='confirmed'?"#856404":"#721c24"
                    }}>{order.status}</span>
                  </div>
                  {order.items.map(item=>(
                    <div key={item.id} style={{display:"flex",justifyContent:"space-between",fontSize:".82rem",padding:"4px 0",borderTop:"1px solid var(--border)"}}>
                      <span>{item.product_name} × {item.quantity}</span>
                      <span style={{fontWeight:500}}>{fmt(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:".6rem",paddingTop:".5rem",borderTop:"1.5px solid var(--border)",fontWeight:600,fontSize:".9rem"}}>
                    <span>Total</span><span>{fmt(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADMIN DASHBOARD */}
      {page==="admin"&&(
        <div className="sec">
          <div className="sec-eye">✦ Owner Dashboard</div>
          <h2 className="sec-h">Admin Dashboard</h2>
          {user?.role !== 'admin' ? (
            <div style={{textAlign:"center",padding:"3rem"}}>
              <p style={{color:"var(--muted)"}}>Admin access required.</p>
              <p style={{fontSize:".8rem",color:"var(--light)",marginTop:".5rem"}}>Login with admin@verdura.in / verdura2024</p>
            </div>
          ) : (
            <>
              {adminStats && (
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"1rem",marginBottom:"2rem",maxWidth:700}}>
                  {[["📦","Orders",adminStats.totalOrders],["💰","Revenue",fmt(adminStats.totalRevenue)],["👥","Users",adminStats.totalUsers],["⏳","Pending",adminStats.pendingOrders]].map(([icon,label,val])=>(
                    <div key={label} style={{background:"var(--surf)",border:"1.5px solid var(--border)",borderRadius:12,padding:"1rem",textAlign:"center"}}>
                      <div style={{fontSize:"1.5rem",marginBottom:".3rem"}}>{icon}</div>
                      <div style={{fontSize:"1.3rem",fontWeight:700}}>{val}</div>
                      <div style={{fontSize:".75rem",color:"var(--muted)"}}>{label}</div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{display:"flex",gap:".5rem",marginBottom:"1.5rem"}}>
                <button className={`cat-btn ${adminTab==='orders'?"on":""}`} onClick={()=>setAdminTab('orders')}>Orders</button>
                <button className={`cat-btn ${adminTab==='users'?"on":""}`} onClick={()=>setAdminTab('users')}>Users</button>
              </div>

              {adminTab==='orders' && (
                <div style={{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:700}}>
                  {adminOrders.length===0 ? <p style={{color:"var(--muted)"}}>No orders yet.</p> : adminOrders.map(order=>(
                    <div key={order.id} style={{background:"var(--surf)",border:"1.5px solid var(--border)",borderRadius:12,padding:"1.2rem"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".5rem",flexWrap:"wrap",gap:".5rem"}}>
                        <div>
                          <span style={{fontWeight:600,fontSize:".9rem"}}>Order #{order.id}</span>
                          <span style={{fontSize:".75rem",color:"var(--muted)",marginLeft:8}}>{order.username} ({order.email})</span>
                        </div>
                        <select value={order.status} onChange={(e)=>updateOrderStatus(order.id,e.target.value)}
                          style={{padding:"4px 8px",borderRadius:8,border:"1px solid var(--border)",fontSize:".75rem",background:"#fff"}}>
                          {['pending','confirmed','shipped','delivered'].map(s=><option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div style={{fontSize:".78rem",color:"var(--muted)",marginBottom:".5rem"}}>
                        📍 {order.address} • {order.phone} ({order.country})
                      </div>
                      {order.items.map(item=>(
                        <div key={item.id} style={{display:"flex",justifyContent:"space-between",fontSize:".8rem",padding:"3px 0"}}>
                          <span>{item.product_name} × {item.quantity}</span><span>{fmt(item.price*item.quantity)}</span>
                        </div>
                      ))}
                      <div style={{display:"flex",justifyContent:"space-between",marginTop:".5rem",paddingTop:".4rem",borderTop:"1px solid var(--border)",fontWeight:600}}>
                        <span>{fmt(order.total)}</span>
                        <span style={{fontSize:".7rem",color:"var(--muted)"}}>{new Date(order.created_at).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {adminTab==='users' && (
                <div style={{maxWidth:700}}>
                  {adminUsers.length===0 ? <p style={{color:"var(--muted)"}}>No users yet.</p> : (
                    <div style={{overflowX:"auto"}}>
                      <table style={{width:"100%",borderCollapse:"collapse",fontSize:".82rem"}}>
                        <thead>
                          <tr style={{borderBottom:"2px solid var(--border)",textAlign:"left"}}>
                            <th style={{padding:"8px"}}>User</th><th style={{padding:"8px"}}>Email</th><th style={{padding:"8px"}}>Role</th><th style={{padding:"8px"}}>Orders</th><th style={{padding:"8px"}}>Spent</th><th style={{padding:"8px"}}>Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminUsers.map(u=>(
                            <tr key={u.id} style={{borderBottom:"1px solid var(--border)"}}>
                              <td style={{padding:"8px"}}><span style={{marginRight:6}}>{u.avatar}</span>{u.username}</td>
                              <td style={{padding:"8px",color:"var(--muted)"}}>{u.email}</td>
                              <td style={{padding:"8px"}}><span style={{fontWeight:600,color:u.role==='admin'?"var(--accent)":"var(--text)"}}>{u.role}</span></td>
                              <td style={{padding:"8px"}}>{u.order_count}</td>
                              <td style={{padding:"8px"}}>{fmt(u.total_spent)}</td>
                              <td style={{padding:"8px",color:"var(--muted)"}}>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="f-grid">
          <div>
            <div className="f-logo">🌿 Verdura</div>
            <div className="f-desc">Premium plant boutique.<br/>Bringing nature home, one leaf at a time.</div>
          </div>
          <div>
            <div className="f-head">Shop</div>
            {[["Indoor Plants","Indoor"],["Succulents","Succulent"],["Rare & Exotic","Rare"],["Outdoor Plants","Outdoor"]].map(([l,c])=>(
              <button key={l} className="f-lnk" onClick={()=>{setCat(c);nav("shop");}}>{l}</button>
            ))}
          </div>
          <div>
            <div className="f-head">Info</div>
            {[["Care Guides","care"],["About Us","about"],["Shop All","shop"]].map(([l,p])=>(
              <button key={l} className="f-lnk" onClick={()=>nav(p)}>{l}</button>
            ))}
          </div>
          <div>
            <div className="f-head">Contact</div>
            <div style={{fontSize:".8rem",lineHeight:2.1}}>📧 hello@verdura.in<br/>📞 +91 98765 43210<br/>📍 Chennai, Tamil Nadu</div>
          </div>
        </div>
        <div className="f-btm">© 2026 Verdura Plant Co. All rights reserved.</div>
      </footer>

      {/* CART */}
      {cartOpen&&(
        <div className="c-overlay" onClick={()=>setCartOpen(false)}>
          <div className="c-panel" onClick={e=>e.stopPropagation()}>
            <div className="c-head">
              <div className="cart-tabs">
                <button className={`cart-tab ${activeCartTab === 'cart' ? 'active' : ''}`} onClick={() => setActiveCartTab('cart')}>
                  Cart {cCount>0&&`(${cCount})`}
                </button>
                <button className={`cart-tab ${activeCartTab === 'wishlist' ? 'active' : ''}`} onClick={() => setActiveCartTab('wishlist')}>
                  Wishlist {wl.length>0&&`(${wl.length})`}
                </button>
              </div>
              <button className="c-close" onClick={()=>setCartOpen(false)}>X</button>
            </div>
            <div className="c-body">
              {activeCartTab === 'cart' ? (
                cart.length===0 ? (
                  <div className="c-empty">
                    <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>🪴</div>
                    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.05rem",marginBottom:".4rem"}}>Your cart is empty</div>
                    <div style={{fontSize:".82rem",marginBottom:"1.4rem"}}>Browse our collection and find your perfect plant.</div>
                    <button className="btn-p" onClick={()=>{setCartOpen(false);nav("shop");}}>Shop Now →</button>
                  </div>
                ) : cart.map(item=>(
                  <div key={item.id} className="c-item">
                    <div className="ci-em"><img src={item.image} alt={item.name} style={{width:"100%", height:"100%", objectFit:"cover", borderRadius:"10px", position:"relative", zIndex:1}} /></div>
                    <div style={{flex:1}}>
                      <div className="ci-n">{item.name}</div>
                      <div className="ci-p">{fmt(item.price)} each</div>
                      <div className="qty-r">
                        <button className="qty-b" onClick={()=>updQ(item.id,-10)}>−10</button>
                        <button className="qty-b" onClick={()=>updQ(item.id,-1)}>−</button>
                        <span style={{fontWeight:700,minWidth:25,textAlign:"center"}}>{item.qty}</span>
                        <button className="qty-b" onClick={()=>updQ(item.id,1)}>+</button>
                        <button className="qty-b" onClick={()=>updQ(item.id,10)}>+10</button>
                        <button className="ci-rm" onClick={()=>rm(item.id)}>Remove</button>
                      </div>
                    </div>
                    <div className="ci-tot">{fmt(item.price*item.qty)}</div>
                  </div>
                ))
              ) : (
                wl.length===0 ? (
                  <div className="wishlist-empty">
                    <div className="wishlist-empty-icon">♡</div>
                    <div className="wishlist-empty-text">Your wishlist is empty</div>
                    <div className="wishlist-empty-sub">Browse our collection and add plants you love!</div>
                    <button className="btn-p" onClick={()=>{setCartOpen(false);nav("shop");}}>Browse Plants →</button>
                  </div>
                ) : wl.map(plantId => {
                  const plant = plants.find(p => p.id === plantId);
                  if (!plant) return null;
                  return (
                    <div key={plantId} className="wishlist-item">
                      <img src={plant.image} alt={plant.name} className="wishlist-item-img" />
                      <div className="wishlist-item-details">
                        <div className="wishlist-item-name">{plant.name}</div>
                        <div className="wishlist-item-price">{fmt(plant.price)}</div>
                      </div>
                      <div className="wishlist-item-actions">
                        <button className="wishlist-add-btn" onClick={() => addToCart(plant)}>Add to Cart</button>
                        <button className="wishlist-remove-btn" onClick={() => togWL(plantId)}>Remove</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {cart.length>0&&(
              <div className="c-foot">
                <button className="co-btn" onClick={()=>{ if(!user){showToast("Please login first");setLoginModalOpen(true);return;} setAddrModalOpen(true); }} style={{marginTop:"0"}}>
                  {address ? `📍 ${address.substring(0,30)}...` : "📍 Add Address"}
                </button>
                <div style={{fontSize:".75rem",color:"var(--light)",textAlign:"center",margin:"8px 0"}}>
                  {address && phone ? "OK Delivery address set" : "Add delivery address before checkout"}
                </div>
                <div className="c-row"><span>Subtotal</span><span>{fmt(cSub)}</span></div>
                <div className="c-row"><span>Delivery</span><span className={cDel===0?"free":""}>{cDel===0?"Free!":fmt(cDel)}</span></div>
                <div className="c-row tot"><span>Total</span><span>{fmt(cTot)}</span></div>
                <button className="co-btn" onClick={placeOrder}
                  disabled={!address||!phone||!COUNTRIES[country].pattern.test(phone)}
                  style={{opacity:!address||!phone||!COUNTRIES[country].pattern.test(phone)?0.5:1,cursor:!address||!phone||!COUNTRIES[country].pattern.test(phone)?"not-allowed":"pointer"}}>
                  Place Order →
                </button>
                {cDel>0&&<div className="free-note">Add {fmt(999-cSub)} more for free delivery</div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PLANT MODAL */}
      {modal&&(
        <div className="overlay" onClick={()=>setModal(null)}>
          <div className="mbox" onClick={e=>e.stopPropagation()}>
            <button className="m-close" onClick={()=>setModal(null)}>X</button>
            <div className="m-emoji"><img src={modal.image} alt={modal.name} style={{width:"100%", height:"100%", objectFit:"contain"}} /></div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.6rem",marginBottom:2}}>{modal.name}</div>
            <div style={{fontSize:".7rem",letterSpacing:".09em",textTransform:"uppercase",color:"var(--light)",marginBottom:10}}>{modal.category}</div>
            <div className="rr" style={{marginBottom:12}}>
              <span className="stars">{stars(modal.rating)}</span>
              <span className="rc">{modal.rating} ({modal.reviews_count} reviews)</span>
            </div>
            <p style={{fontSize:".9rem",color:"var(--muted)",lineHeight:1.75,marginBottom:"1rem",fontWeight:300}}>{modal.description}</p>
            <div>
              <span className={`tag ${modal.care==="Easy"?"te":modal.care==="Moderate"?"tm":"ta"}`}>{modal.care} care</span>
              <span className="tag ti">💧 {modal.water}</span>
              <span className="tag ti">☀️ {modal.light}</span>
            </div>
            <div className="m-foot">
              <div className="m-price">{fmt(modal.price)}</div>
              <div style={{display:"flex",gap:8}}>
                <button className={`wl ${wl.includes(modal.id)?"on":""}`} style={{position:"static",width:40,height:40,fontSize:"1rem"}} onClick={(e) => togWL(modal.id, e)}>
                  {wl.includes(modal.id)?"♥":"♡"}
                </button>
                <button className="btn-p" style={{padding:"10px 20px",fontSize:".875rem"}} onClick={()=>{addToCart(modal);setModal(null);}}>
                  Add to Cart
                </button>
              </div>
            </div>

            <div className="reviews-section">
              <div className="reviews-title">Customer Reviews</div>

              {user ? (
                <div className="review-form">
                  <div className="review-stars">
                    {[1,2,3,4,5].map(star => (
                      <span key={star} className={`review-star ${star <= newReview.rating ? 'filled' : ''}`}
                        onClick={() => setNewReview({...newReview, rating: star})}>★</span>
                    ))}
                  </div>
                  <textarea className="review-textarea" placeholder="Share your experience with this plant..."
                    value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} />
                  <button className="review-submit" onClick={() => submitReview(modal.id)}>Submit Review</button>
                </div>
              ) : (
                <div className="review-form" style={{textAlign:"center", padding:"1.5rem"}}>
                  <div style={{fontSize:".85rem", color:"var(--muted)", marginBottom:".8rem"}}>Login to write a review</div>
                  <button className="btn-p" style={{padding:"8px 16px", fontSize:".8rem"}} onClick={() => setLoginModalOpen(true)}>Login to Review</button>
                </div>
              )}

              <div className="reviews-list">
                {reviewsLoading ? (
                  <div style={{textAlign:"center", padding:"1rem", color:"var(--light)", fontSize:".8rem"}}>Loading reviews...</div>
                ) : plantReviews.length === 0 ? (
                  <div style={{textAlign:"center", padding:"1rem", color:"var(--light)", fontSize:".8rem"}}>No reviews yet. Be the first to review!</div>
                ) : (
                  plantReviews.map(review => (
                    <div key={review.id} className="review-item">
                      {editingReview === review.id ? (
                        <div className="review-edit-form">
                          <div className="edit-stars">
                            {[1,2,3,4,5].map(star => (
                              <span key={star} className={`edit-star ${star <= editReviewForm.rating ? 'filled' : ''}`}
                                onClick={() => setEditReviewForm({...editReviewForm, rating: star})}>★</span>
                            ))}
                          </div>
                          <textarea className="edit-textarea" value={editReviewForm.comment}
                            onChange={(e) => setEditReviewForm({...editReviewForm, comment: e.target.value})} />
                          <div className="edit-actions">
                            <button className="edit-btn" onClick={() => saveEditReview(modal.id)}>Save</button>
                            <button className="edit-btn cancel" onClick={() => setEditingReview(null)}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="review-header">
                            <div className="review-avatar">{review.avatar}</div>
                            <div className="review-meta">
                              <div className="review-username">{review.username}</div>
                              <div className="review-date">{new Date(review.created_at).toLocaleDateString()}</div>
                            </div>
                            <div className="review-rating">{"★".repeat(review.rating)}</div>
                            {user && user.username === review.username && (
                              <div className="review-actions">
                                <button onClick={() => setReviewMenuOpen(reviewMenuOpen === review.id ? null : review.id)}
                                  style={{background:"none", border:"none", cursor:"pointer", padding:"4px", fontSize:"1.2rem"}}>⋯</button>
                                {reviewMenuOpen === review.id && (
                                  <div className="review-menu">
                                    <button className="review-menu-item" onClick={() => { setEditingReview(review.id); setEditReviewForm({ rating: review.rating, comment: review.comment }); setReviewMenuOpen(null); }}>Edit</button>
                                    <button className="review-menu-item delete" onClick={() => { deleteReview(modal.id, review.id); setReviewMenuOpen(null); }}>Delete</button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="review-comment">{review.comment}</div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADDRESS MODAL */}
      {addrModalOpen&&(
        <div className="addr-modal-overlay" onClick={()=>setAddrModalOpen(false)}>
          <div className="addr-modal" onClick={e=>e.stopPropagation()}>
            <div className="am-header">
              <div className="am-title">📍 Delivery Address</div>
              <button className="am-close" onClick={()=>setAddrModalOpen(false)}>X</button>
            </div>
            <div className="am-body">
              {address && !editAddr ? (
                <div>
                  <div className="addr-display-modal">
                    <div className="addr-display-text">
                      <strong>{address}</strong>
                      <div style={{marginTop:"8px",fontSize:".8rem",color:"var(--light)"}}>
                        {COUNTRIES[country].name} • {COUNTRIES[country].code} {phone}
                      </div>
                    </div>
                  </div>
                  <button className="am-edit-btn" onClick={()=>setEditAddr(true)}>✏️ Edit This Address</button>
                  <button className="am-btn-secondary" style={{marginTop:"10px"}} onClick={()=>{setAddress("");setPhone("");setEditAddr(true);}}>+ Add Different Address</button>
                  <button className="am-btn-remove" onClick={()=>{setAddress("");setPhone("");setCountry("IN");showToast("Address removed");setAddrModalOpen(false);}}>🗑️ Remove Address</button>
                </div>
              ) : (
                <div>
                  <div className="addr-section">
                    <label className="addr-label">Country</label>
                    <select className="addr-select" value={country} onChange={(e)=>setCountry(e.target.value)}>
                      {Object.entries(COUNTRIES).map(([code, info])=><option key={code} value={code}>{info.name} ({info.code})</option>)}
                    </select>
                  </div>
                  <div className="addr-section">
                    <label className="addr-label">Full Address</label>
                    <textarea className="addr-input" placeholder="Street address, building, apartment..." value={address} onChange={(e)=>setAddress(e.target.value)} style={{minHeight:"80px",resize:"none"}} />
                  </div>
                  <div className="addr-section">
                    <label className="addr-label">Phone Number</label>
                    <input type="tel" className="addr-input" placeholder={`Enter phone (${COUNTRIES[country].code} format)`} value={phone} onChange={(e)=>setPhone(e.target.value.replace(/[^0-9]/g,'').slice(0,15))} />
                    {phone && !COUNTRIES[country].pattern.test(phone) && <div style={{fontSize:".75rem",color:"var(--danger)",marginTop:"4px"}}>❌ Invalid format for {COUNTRIES[country].name}</div>}
                  </div>
                  <div className="am-buttons">
                    <button className="am-btn-primary" onClick={saveAddress}>Save Address</button>
                    <button className="am-btn-secondary" onClick={()=>{setAddrModalOpen(false);setEditAddr(false);}}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {loginModal}
      {toast&&<div className="toast">{toast}</div>}
    </>
  );
}
