import { useState, useEffect } from "react";
import plantsAPI from "./services/plantsAPI";
import { CSS } from "./styles";

/*  DESIGN TOKENS ─────────────────────────────────────────── */
const T = {
  white:   "#FFFFFF",
  offWhite:"#F8FAF7",
  surface: "#F1F6F0",
  border:  "#DDE8DB",
  green50: "#EBF4E9",
  green200:"#A8CFA1",
  green500:"#3D8B37",
  green700:"#265922",
  green900:"#152F12",
  accent:  "#5BA55A",
  text:    "#1A2E18",
  muted:   "#6B7F69",
  light:   "#9DB09B",
  danger:  "#E05252",
  // Dark mode tokens
  dark: {
    bg:      "#0A1411",
    surface: "#141F1A",
    card:    "#1A2921",
    border:  "#2A3A32",
    text:    "#E8F5E8",
    muted:   "#A8C5A8",
    light:   "#7A9A7A",
    nav:     "#0F1A15",
  }
};

/* ─── DATA ───────────────────────────────────────────────────── */
// Plants data now fetched from plantsAPI service

const CARE_GUIDES = [
  { icon:"W", title:"Watering Right",     body:"Most plants die from too much water, not too little. Feel the top inch of soil — dry means water, moist means wait. Always use pots with drainage holes and empty saucers after 30 minutes." },
  { icon:"S", title:"Reading the Light",  body:"'Bright indirect' means near a window but out of direct rays. A sheer curtain is your best friend. Rotate plants quarterly so all sides receive even light for upright, balanced growth." },
  { icon:"P", title:"Soil & Repotting",   body:"Repot every 1–2 springs into a pot just 2 inches larger. Use a mix matched to your plant — cacti need grit, tropicals need richness. Roots peeking from the drainage hole? Time to upgrade." },
  { icon:"H", title:"Humidity & Seasons", body:"Tropical plants thrive with humidity. Group plants together, use a pebble tray, or mist occasionally. Ease off watering in winter when growth naturally slows — plants rest too." },
];

const REVIEWS = [
  { name:"Priya S.",  plant:"Monstera Deliciosa",  rating:5, text:"Arrived with new growth already showing. Packaged so well — not a single leaf damaged. Looks unreal in my living room.", avatar:"P" },
  { name:"James L.",  plant:"Bird of Paradise",    rating:5, text:"Much larger than expected. Customer service helped me pick the right spot. It's already unfurling a new leaf!", avatar:"J" },
  { name:"Meera K.",  plant:"Philodendron Brasil", rating:5, text:"So lush and bushy — I've bought three now as gifts. Everyone asks where I got it. Will always shop here.", avatar:"M" },
  { name:"Arjun T.",  plant:"Aloe Vera",           rating:4, text:"Sturdy, healthy, exactly as described. Delivery was prompt. Very happy with the packaging too.", avatar:"A" },
];

const CATS = ["All","Indoor","Succulent","Outdoor","Rare"];
const fmt  = (n) => `₹${n.toLocaleString("en-IN")}`;
const stars= (r) => "★".repeat(Math.round(r)) + "☆".repeat(5-Math.round(r));

/* ─── CSS ────────────────────────────────────────────────────── */

/* ─── APP ────────────────────────────────────────────────────── */
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
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // User authentication state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', avatar: '' });

  // Reviews state
  const [reviews, setReviews] = useState(() => {
    const savedReviews = localStorage.getItem('plantReviews');
    return savedReviews ? JSON.parse(savedReviews) : {};
  });
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewForm, setEditReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMenuOpen, setReviewMenuOpen] = useState(null);
  const [activeCartTab, setActiveCartTab] = useState('cart');

  const COUNTRIES = {
    "IN": { name: "India", code: "+91", pattern: /^[6-9]\d{9}$/ },
    "US": { name: "United States", code: "+1", pattern: /^\d{10}$/ },
    "UK": { name: "United Kingdom", code: "+44", pattern: /^[0-9]{10,11}$/ },
    "CA": { name: "Canada", code: "+1", pattern: /^\d{10}$/ },
    "AU": { name: "Australia", code: "+61", pattern: /^[2-9]\d{8}$/ },
    "SG": { name: "Singapore", code: "+65", pattern: /^[6-9]\d{7}$/ },
  };

  // User authentication functions
  const handleLogin = () => {
    if (!loginForm.username.trim()) {
      showToast("Please enter a username");
      return;
    }
    const userData = {
      username: loginForm.username.trim(),
      avatar: loginForm.avatar.trim() || 'U',
      joinedAt: new Date().toISOString()
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setLoginModalOpen(false);
    setLoginForm({ username: '', avatar: '' });
    showToast("Welcome, " + userData.username + "!");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    showToast("Logged out successfully");
  };

  // Review functions
  const submitReview = (plantId) => {
    if (!user) {
    showToast("Please login to write a review");
      setLoginModalOpen(true);
      return;
    }
    if (!newReview.comment.trim()) {
      showToast("Please write a comment");
      return;
    }
    
    const review = {
      id: Date.now(),
      userId: user.username,
      username: user.username,
      avatar: user.avatar,
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      date: new Date().toISOString(),
      plantId: plantId
    };

    const updatedReviews = {
      ...reviews,
      [plantId]: [...(reviews[plantId] || []), review]
    };
    
    setReviews(updatedReviews);
    localStorage.setItem('plantReviews', JSON.stringify(updatedReviews));
    setNewReview({ rating: 5, comment: '' });
    showToast("Review submitted!");
  };

  const getPlantReviews = (plantId) => {
    return reviews[plantId] || [];
  };

  const startEditReview = (review) => {
    setEditingReview(review.id);
    setEditReviewForm({ rating: review.rating, comment: review.comment });
  };

  const cancelEditReview = () => {
    setEditingReview(null);
    setEditReviewForm({ rating: 5, comment: '' });
  };

  const saveEditReview = (plantId) => {
    if (!editReviewForm.comment.trim()) {
      showToast("Please write a comment");
      return;
    }

    const updatedReviews = {
      ...reviews,
      [plantId]: reviews[plantId].map(review => 
        review.id === editingReview 
          ? { ...review, rating: editReviewForm.rating, comment: editReviewForm.comment.trim(), date: new Date().toISOString() }
          : review
      )
    };

    setReviews(updatedReviews);
    localStorage.setItem('plantReviews', JSON.stringify(updatedReviews));
    cancelEditReview();
    showToast("Review updated!");
  };

  const deleteReview = (plantId, reviewId) => {
    const updatedReviews = {
      ...reviews,
      [plantId]: reviews[plantId].filter(review => review.id !== reviewId)
    };

    setReviews(updatedReviews);
    localStorage.setItem('plantReviews', JSON.stringify(updatedReviews));
    showToast("Review deleted!");
  };
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Apply dark mode class on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch plants on component mount
  useEffect(() => {
    (async () => {
      try {
        const data = await plantsAPI.getAllPlants();
        setPlants(data);
      } catch (err) {
        console.error("Failed to fetch plants:", err);
        setPlants([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    })();    // Load address from localStorage
    const savedAddr = localStorage.getItem("userAddress");
    const savedPhone = localStorage.getItem("userPhone");
    const savedCountry = localStorage.getItem("userCountry");
    if (savedAddr) setAddress(savedAddr);
    if (savedPhone) setPhone(savedPhone);
    if (savedCountry) setCountry(savedCountry);  }, []);

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""), 2600); };
  const nav = (p) => { setPage(p); setMOpen(false); window.scrollTo(0,0); };

  const isValidPhone = (phoneNum, countryCode) => {
    return COUNTRIES[countryCode].pattern.test(phoneNum);
  };

  const saveAddress = () => {
    if (!address.trim()) { showToast("Please enter your address"); return false; }
    if (!phone.trim()) { showToast("Please enter your phone number"); return false; }
    if (!isValidPhone(phone, country)) { showToast("Invalid phone number for " + COUNTRIES[country].name); return false; }
    localStorage.setItem("userAddress", address);
    localStorage.setItem("userPhone", phone);
    localStorage.setItem("userCountry", country);
    setEditAddr(false);
    showToast("Address saved!");
    return true;
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
    .filter(p=>(cat==="All"||p.cat===cat)&&(p.name.toLowerCase().includes(search.toLowerCase())||p.cat.toLowerCase().includes(search.toLowerCase())))
    .sort((a,b)=>sort==="price-asc"?a.price-b.price:sort==="price-desc"?b.price-a.price:sort==="rating"?b.rating-a.rating:0);

  /* CARD */
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
          <div className="card-cat">{p.cat}</div>
          <div className="rr">
            <span className="stars">{stars(p.rating)}</span>
            <span className="rc">({p.reviews})</span>
          </div>
          <div className="card-desc">{p.desc}</div>
          <div className="card-foot">
            <span className="card-price">{fmt(p.price)}</span>
            <button className="add-btn" onClick={e=>addToCart(p,e)}>+ Add</button>
          </div>
        </div>
      </div>
    );
  };

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
        </div>
        <div className="nav-r">
          {user ? (
            <button className="user-btn" onClick={() => setLoginModalOpen(true)} title="View profile">
              <span className="user-avatar">{user.avatar}</span>
              <span className="user-name">{user.username}</span>
            </button>
          ) : (
            <button className="login-btn" onClick={() => setLoginModalOpen(true)}>
              Login
            </button>
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
            {REVIEWS.map(r=>(
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
                        <button className="qty-b" onClick={()=>updQ(item.id,-100)}>−100</button>
                        <button className="qty-b" onClick={()=>updQ(item.id,-10)}>−10</button>
                        <button className="qty-b" onClick={()=>updQ(item.id,-1)}>−</button>
                        <span style={{fontWeight:700,minWidth:25,textAlign:"center"}}>{item.qty}</span>
                        <button className="qty-b" onClick={()=>updQ(item.id,1)}>+</button>
                        <button className="qty-b" onClick={()=>updQ(item.id,10)}>+10</button>
                        <button className="qty-b" onClick={()=>updQ(item.id,100)}>+100</button>
                        <button className="ci-rm" onClick={()=>rm(item.id)}>Remove</button>
                      </div>
                    </div>
                    <div className="ci-tot">{fmt(item.price*item.qty)}</div>
                  </div>
                ))
              ) : (
                // Wishlist Tab
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
                        <button className="wishlist-add-btn" onClick={() => addToCart(plant)}>
                          Add to Cart
                        </button>
                        <button className="wishlist-remove-btn" onClick={() => togWL(plantId)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {cart.length>0&&(
              <div className="c-foot">
                <button className="co-btn" onClick={()=>setAddrModalOpen(true)} style={{marginTop:"0"}}>
                  {address ? `📍 ${address.substring(0,30)}...` : "📍 Add Address"}
                </button>
                <div style={{fontSize:".75rem",color:"var(--light)",textAlign:"center",margin:"8px 0"}}>
                  {address && phone ? "OK Delivery address set" : "Add delivery address before checkout"}
                </div>
                <div className="c-row"><span>Subtotal</span><span>{fmt(cSub)}</span></div>
                <div className="c-row"><span>Delivery</span><span className={cDel===0?"free":""}>{cDel===0?"Free!":fmt(cDel)}</span></div>
                <div className="c-row tot"><span>Total</span><span>{fmt(cTot)}</span></div>
                <button className="co-btn" onClick={()=>{if(address&&phone&&COUNTRIES[country].pattern.test(phone)){setCart([]);setCartOpen(false);showToast("Order placed! Your plants are on their way!");}else showToast("Please add address first");}} disabled={!address||!phone||!COUNTRIES[country].pattern.test(phone)} style={{opacity:!address||!phone||!COUNTRIES[country].pattern.test(phone)?0.5:1,cursor:!address||!phone||!COUNTRIES[country].pattern.test(phone)?"not-allowed":"pointer"}}>
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
            <div style={{fontSize:".7rem",letterSpacing:".09em",textTransform:"uppercase",color:"var(--light)",marginBottom:10}}>{modal.cat}</div>
            <div className="rr" style={{marginBottom:12}}>
              <span className="stars">{stars(modal.rating)}</span>
              <span className="rc">{modal.rating} ({modal.reviews} reviews)</span>
            </div>
            <p style={{fontSize:".9rem",color:"var(--muted)",lineHeight:1.75,marginBottom:"1rem",fontWeight:300}}>{modal.desc}</p>
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

            {/* REVIEWS SECTION */}
            <div className="reviews-section">
              <div className="reviews-title">Customer Reviews</div>
              
              {/* REVIEW FORM */}
              {user ? (
                <div className="review-form">
                  <div className="review-stars">
                    {[1,2,3,4,5].map(star => (
                      <span 
                        key={star} 
                        className={`review-star ${star <= newReview.rating ? 'filled' : ''}`}
                        onClick={() => setNewReview({...newReview, rating: star})}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea 
                    className="review-textarea"
                    placeholder="Share your experience with this plant..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  />
                  <button className="review-submit" onClick={() => submitReview(modal.id)}>
                    Submit Review
                  </button>
                </div>
              ) : (
                <div className="review-form" style={{textAlign:"center", padding:"1.5rem"}}>
                  <div style={{fontSize:".85rem", color:"var(--muted)", marginBottom:".8rem"}}>
                    Login to write a review
                  </div>
                  <button className="btn-p" style={{padding:"8px 16px", fontSize:".8rem"}} onClick={() => setLoginModalOpen(true)}>
                    Login to Review
                  </button>
                </div>
              )}

              {/* REVIEWS LIST */}
              <div className="reviews-list">
                {getPlantReviews(modal.id).length === 0 ? (
                  <div style={{textAlign:"center", padding:"1rem", color:"var(--light)", fontSize:".8rem"}}>
                    No reviews yet. Be the first to review!
                  </div>
                ) : (
                  getPlantReviews(modal.id).map(review => (
                    <div key={review.id} className="review-item">
                      {editingReview === review.id ? (
                        <div className="review-edit-form">
                          <div className="edit-stars">
                            {[1,2,3,4,5].map(star => (
                              <span 
                                key={star} 
                                className={`edit-star ${star <= editReviewForm.rating ? 'filled' : ''}`}
                                onClick={() => setEditReviewForm({...editReviewForm, rating: star})}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <textarea 
                            className="edit-textarea"
                            value={editReviewForm.comment}
                            onChange={(e) => setEditReviewForm({...editReviewForm, comment: e.target.value})}
                          />
                          <div className="edit-actions">
                            <button className="edit-btn" onClick={() => saveEditReview(modal.id)}>Save</button>
                            <button className="edit-btn cancel" onClick={cancelEditReview}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="review-header">
                            <div className="review-avatar">{review.avatar}</div>
                            <div className="review-meta">
                              <div className="review-username">{review.username}</div>
                              <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                            </div>
                            <div className="review-rating">{"★".repeat(review.rating)}</div>
                            {user && user.username === review.username && (
                              <div className="review-actions">
                                <button 
                                  onClick={() => setReviewMenuOpen(reviewMenuOpen === review.id ? null : review.id)}
                                  style={{background:"none", border:"none", cursor:"pointer", padding:"4px", fontSize:"1.2rem"}}
                                >
                                  ⋯
                                </button>
                                {reviewMenuOpen === review.id && (
                                  <div className="review-menu">
                                    <button className="review-menu-item" onClick={() => { startEditReview(review); setReviewMenuOpen(null); }}>
                                      Edit
                                    </button>
                                    <button className="review-menu-item delete" onClick={() => { deleteReview(modal.id, review.id); setReviewMenuOpen(null); }}>
                                      Delete
                                    </button>
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
                  <button className="am-btn-remove" onClick={()=>{setAddress("");setPhone("");localStorage.removeItem("userAddress");localStorage.removeItem("userPhone");localStorage.removeItem("userCountry");showToast("❌ Address removed");setAddrModalOpen(false);}}>🗑️ Remove Address</button>
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
                    <button className="am-btn-secondary" onClick={()=>{if(!address||address===localStorage.getItem("userAddress")){setAddrModalOpen(false);setEditAddr(false);}else{setAddress("");setPhone("");setEditAddr(false);}}}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {loginModalOpen&&(
        <div className="login-overlay" onClick={()=>setLoginModalOpen(false)}>
          <div className="login-box" onClick={e=>e.stopPropagation()}>
            <button className="m-close" onClick={()=>setLoginModalOpen(false)}>X</button>
            <div className="login-title">{user ? 'Profile' : 'Login'}</div>
            
            {user ? (
              <div style={{textAlign:"center", padding:"1rem"}}>
                <div style={{fontSize:"3rem", marginBottom:".5rem"}}>{user.avatar}</div>
                <div style={{fontSize:"1.2rem", fontWeight:600, marginBottom:".3rem"}}>{user.username}</div>
                <div style={{fontSize:".75rem", color:"var(--muted)"}}>Member since {new Date(user.joinedAt).toLocaleDateString()}</div>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <>
                <div className="login-field">
                  <label className="login-label">Username</label>
                  <input 
                    className="login-input" 
                    type="text" 
                    placeholder="Enter your username" 
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  />
                </div>
                
                <div className="login-field">
                  <label className="login-label">Choose Avatar (emoji)</label>
                  <div className="avatar-options">
                    {['👤', '🌿', '🌵', '🌺', '🌻', '🌲', '🌱', '🪴'].map(emoji => (
                      <button
                        key={emoji}
                        className={`avatar-option ${loginForm.avatar === emoji ? 'selected' : ''}`}
                        onClick={() => setLoginForm({...loginForm, avatar: emoji})}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <input 
                    className="login-input" 
                    style={{marginTop:".5rem"}}
                    type="text" 
                    placeholder="Or type your own emoji" 
                    value={loginForm.avatar}
                    onChange={(e) => setLoginForm({...loginForm, avatar: e.target.value})}
                  />
                </div>

                <div className="login-actions">
                  <button className="btn-p" onClick={handleLogin}>Login</button>
                  <button className="btn-o" onClick={()=>setLoginModalOpen(false)}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {toast&&<div className="toast">{toast}</div>}
    </>
  );
}