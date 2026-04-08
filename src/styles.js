export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --white:#FFFFFF; --off:#F8FAF7; --surf:#F1F6F0; --border:#DDE8DB;
    --g50:#EBF4E9; --g200:#A8CFA1; --g500:#3D8B37; --g700:#265922;
    --g900:#152F12; --accent:#5BA55A; --text:#1A2E18; --muted:#6B7F69;
    --light:#9DB09B; --danger:#E05252;
  }
  html { scroll-behavior:smooth; }
  body { font-family:'DM Sans',sans-serif; background:#fff; color:var(--text); -webkit-font-smoothing:antialiased; }
  h1,h2,h3,h4 { font-family:'DM Serif Display',serif; font-weight:400; line-height:1.1; }
  button { font-family:'DM Sans',sans-serif; cursor:pointer; }
  input,select { font-family:'DM Sans',sans-serif; }
  
  /* HIDE SCROLLBARS */
  ::-webkit-scrollbar { width:0; height:0; }
  * { scrollbar-width:none; }

  /* NAV */
  .nav {
    position:sticky; top:0; z-index:200; height:64px;
    background:rgba(255,255,255,0.94); backdrop-filter:blur(16px);
    border-bottom:1px solid var(--border);
    padding:0 clamp(1rem,5vw,3.5rem);
    display:flex; align-items:center; justify-content:space-between;
  }
  .logo { font-family:'DM Serif Display',serif; font-size:1.35rem; color:var(--g700); background:none; border:none; display:flex; align-items:center; gap:8px; }
  .nav-links { display:flex; gap:2rem; align-items:center; }
  .nl { background:none; border:none; font-size:.875rem; color:var(--muted); font-weight:500; padding:4px 0; border-bottom:2px solid transparent; transition:color .2s,border-color .2s; }
  .nl:hover { color:var(--text); }
  .nl.on { color:var(--g700); border-bottom-color:var(--g500); }
  .nav-r { display:flex; align-items:center; gap:.75rem; }
  .cart-btn { background:var(--g700); color:#fff; border:none; border-radius:50px; padding:9px 18px; font-size:.875rem; font-weight:600; display:flex; align-items:center; gap:6px; transition:background .2s; }
  .cart-btn:hover { background:var(--g900); }
  .cbadge { background:var(--accent); color:#fff; border-radius:50%; width:18px; height:18px; display:inline-flex; align-items:center; justify-content:center; font-size:.68rem; font-weight:700; }
  .theme-toggle { background:transparent; border:1.5px solid var(--border); border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; font-size:1rem; transition:all .2s; }
  .theme-toggle:hover { background:var(--surf); }

  /* LOGIN & USER */
  .login-btn { background:var(--g700); color:#fff; border:none; border-radius:50px; padding:8px 18px; font-size:.875rem; font-weight:600; transition:background .2s; }
  .login-btn:hover { background:var(--g900); }
  .user-btn { background:var(--surf); border:1.5px solid var(--border); border-radius:50px; padding:6px 14px; display:flex; align-items:center; gap:8px; font-size:.875rem; font-weight:500; color:var(--text); transition:all .2s; }
  .user-btn:hover { background:var(--g50); border-color:var(--g200); }
  .user-avatar { font-size:1.2rem; }
  .user-name { max-width:80px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

  /* LOGIN MODAL */
  .login-overlay { position:fixed; inset:0; background:rgba(10,24,8,.45); z-index:500; display:flex; align-items:center; justify-content:center; padding:1rem; backdrop-filter:blur(5px); animation:fIn .2s; }
  .login-box { background:#fff; border-radius:20px; max-width:420px; width:100%; padding:2rem; position:relative; animation:scIn .25s ease; }
  .login-title { font-family:'DM Serif Display',serif; font-size:1.5rem; margin-bottom:1.5rem; text-align:center; }
  .login-field { margin-bottom:1.2rem; }
  .login-label { display:block; font-size:.8rem; font-weight:600; color:var(--muted); margin-bottom:.4rem; text-transform:uppercase; letter-spacing:.05em; }
  .login-input { width:100%; border:1.5px solid var(--border); border-radius:10px; padding:12px 14px; font-size:.95rem; color:var(--text); background:#fff; outline:none; transition:border-color .2s; }
  .login-input:focus { border-color:var(--g500); }
  .avatar-options { display:flex; gap:10px; flex-wrap:wrap; margin-top:.5rem; }
  .avatar-option { background:var(--surf); border:2px solid transparent; border-radius:50%; width:44px; height:44px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; cursor:pointer; transition:all .2s; }
  .avatar-option:hover { background:var(--g50); transform:scale(1.1); }
  .avatar-option.selected { border-color:var(--g500); background:var(--g50); }
  .login-actions { display:flex; gap:10px; margin-top:1.5rem; }
  .login-actions button { flex:1; }
  .logout-btn { background:var(--danger); color:#fff; border:none; border-radius:7px; padding:10px; font-size:.875rem; font-weight:600; width:100%; margin-top:1rem; }
  .logout-btn:hover { background:#c44444; }

  /* REVIEWS SECTION */
  .reviews-section { margin-top:1.5rem; padding-top:1.5rem; border-top:1.5px solid var(--border); }
  .reviews-title { font-family:'DM Serif Display',serif; font-size:1.1rem; margin-bottom:1rem; }
  .review-form { background:var(--surf); border-radius:12px; padding:1rem; margin-bottom:1rem; }
  .review-stars { display:flex; gap:5px; margin-bottom:.8rem; }
  .review-star { font-size:1.4rem; color:var(--border); cursor:pointer; transition:color .2s; }
  .review-star.filled { color:#F59E0B; }
  .review-star:hover { color:#F59E0B; }
  .review-textarea { width:100%; border:1.5px solid var(--border); border-radius:8px; padding:10px; font-size:.85rem; color:var(--text); background:#fff; outline:none; resize:none; min-height:60px; margin-bottom:.5rem; }
  .review-textarea:focus { border-color:var(--g500); }
  .review-submit { background:var(--g700); color:#fff; border:none; border-radius:6px; padding:8px 16px; font-size:.8rem; font-weight:600; cursor:pointer; transition:background .2s; }
  .review-submit:hover { background:var(--g900); }
  .review-item { background:var(--surf); border-radius:10px; padding:1rem; margin-bottom:.8rem; }
  .review-header { display:flex; align-items:center; gap:10px; margin-bottom:.5rem; }
  .review-avatar { width:36px; height:36px; border-radius:50%; background:var(--g700); display:flex; align-items:center; justify-content:center; font-size:1.2rem; }
  .review-meta { flex:1; }
  .review-username { font-weight:600; font-size:.85rem; }
  .review-date { font-size:.7rem; color:var(--light); }
  .review-rating { color:#F59E0B; font-size:.9rem; }
  .review-comment { font-size:.82rem; color:var(--muted); line-height:1.5; margin-top:.3rem; }
  .reviews-list { max-height:250px; overflow-y:auto; }

  /* HERO */
  .hero { display:grid; grid-template-columns:1fr 1fr; min-height:88vh; align-items:center; gap:3rem; padding:4rem clamp(1rem,5vw,3.5rem); max-width:1400px; margin:0 auto; }
  .hero-eye { font-size:.72rem; letter-spacing:.14em; text-transform:uppercase; color:var(--accent); font-weight:600; margin-bottom:1.2rem; }
  .hero-h1 { font-size:clamp(2.8rem,5.5vw,5.2rem); color:var(--g900); margin-bottom:1.5rem; }
  .hero-h1 em { color:var(--g500); font-style:italic; }
  .hero-sub { font-size:1.025rem; color:var(--muted); line-height:1.8; max-width:420px; margin-bottom:2.5rem; font-weight:300; }
  .hero-btns { display:flex; gap:.875rem; flex-wrap:wrap; }
  .hero-vis { display:flex; align-items:center; justify-content:center; }
  .hero-circle { width:clamp(260px,34vw,480px); height:clamp(260px,34vw,480px); background:linear-gradient(140deg,var(--g50) 0%,var(--surf) 55%,var(--g200) 100%); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:clamp(6rem,12vw,11rem); animation:bob 5s ease-in-out infinite; position:relative; }
  .hero-circle::after { content:''; position:absolute; inset:-10px; border-radius:50%; border:1.5px dashed var(--g200); animation:spin 28s linear infinite; }
  @keyframes bob { 0%,100%{transform:translateY(0) rotate(-1.5deg)} 50%{transform:translateY(-20px) rotate(1.5deg)} }
  @keyframes spin { to{transform:rotate(360deg)} }

  /* BUTTONS */
  .btn-p { background:var(--g700); color:#fff; border:none; border-radius:7px; padding:13px 26px; font-size:.925rem; font-weight:600; transition:background .2s,transform .15s; }
  .btn-p:hover { background:var(--g900); transform:translateY(-1px); }
  .btn-o { background:transparent; color:var(--g700); border:1.5px solid var(--g500); border-radius:7px; padding:13px 26px; font-size:.925rem; font-weight:600; transition:all .2s; }
  .btn-o:hover { background:var(--g50); }

  /* STATS */
  .stats { background:var(--g700); padding:2rem clamp(1rem,5vw,3.5rem); display:flex; justify-content:center; gap:clamp(2rem,7vw,7rem); flex-wrap:wrap; }
  .stat { text-align:center; color:#fff; }
  .stat-n { font-family:'DM Serif Display',serif; font-size:2rem; }
  .stat-l { font-size:.77rem; opacity:.65; margin-top:3px; letter-spacing:.06em; }

  /* SECTIONS */
  .sec { padding:5rem clamp(1rem,5vw,3.5rem); max-width:1300px; margin:0 auto; }
  .sec-eye { font-size:.7rem; letter-spacing:.14em; text-transform:uppercase; color:var(--accent); font-weight:600; margin-bottom:.5rem; }
  .sec-h { font-size:clamp(1.7rem,3.2vw,2.6rem); color:var(--g900); margin-bottom:.45rem; }
  .sec-sub { color:var(--muted); font-size:.925rem; font-weight:300; margin-bottom:2.5rem; }

  /* FILTER */
  .filter-row { display:flex; gap:.5rem; align-items:center; flex-wrap:wrap; margin-bottom:2rem; }
  .cat-btn { background:transparent; border:1.5px solid var(--border); border-radius:50px; padding:7px 16px; font-size:.8rem; color:var(--muted); font-weight:500; transition:all .2s; }
  .cat-btn:hover { border-color:var(--g500); color:var(--g700); }
  .cat-btn.on { background:var(--g700); border-color:var(--g700); color:#fff; }
  .sort-sel { margin-left:auto; border:1.5px solid var(--border); border-radius:7px; padding:7px 10px; font-size:.8rem; color:var(--text); background:#fff; outline:none; }
  .srch-wrap { position:relative; }
  .srch-ico { position:absolute; left:11px; top:50%; transform:translateY(-50%); font-size:.8rem; color:var(--light); }
  .srch { border:1.5px solid var(--border); border-radius:50px; padding:7px 14px 7px 30px; font-size:.8rem; color:var(--text); background:#fff; outline:none; width:190px; transition:border-color .2s; }
  .srch:focus { border-color:var(--g500); }

  /* GRID */
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(255px,1fr)); gap:1.4rem; }
  .home-grid { grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); }

  /* CARD */
  .card { background:#fff; border:1.5px solid var(--border); border-radius:16px; overflow:hidden; cursor:pointer; transition:transform .25s,box-shadow .25s,border-color .25s; position:relative; }
  .card:hover { transform:translateY(-5px); box-shadow:0 20px 48px rgba(20,60,16,.09); border-color:var(--g200); }
  .card-img { background:var(--surf); height:176px; display:flex; align-items:center; justify-content:center; font-size:4.8rem; position:relative; transition:background .3s; }
  .card:hover .card-img { background:var(--g50); }
  .card-badge { position:absolute; top:10px; left:10px; background:var(--g700); color:#fff; font-size:.63rem; font-weight:700; letter-spacing:.07em; border-radius:50px; padding:3px 10px; text-transform:uppercase; }
  .wl { position:absolute; top:10px; right:10px; background:#fff; border:1.5px solid var(--danger); border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; font-size:.85rem; transition:all .2s; color:var(--danger); }
  .wl:hover { border-color:var(--danger); }
  .wl.on { background:var(--danger); border-color:var(--danger); color:#fff; }
  .card-body { padding:1rem 1.15rem 1.2rem; }
  .card-name { font-family:'DM Serif Display',serif; font-size:1.025rem; margin-bottom:2px; }
  .card-cat { font-size:.7rem; text-transform:uppercase; letter-spacing:.09em; color:var(--light); margin-bottom:8px; }
  .rr { display:flex; align-items:center; gap:5px; margin-bottom:8px; }
  .stars { color:#F59E0B; font-size:.72rem; letter-spacing:1px; }
  .rc { font-size:.7rem; color:var(--light); }
  .card-desc { font-size:.8rem; color:var(--muted); line-height:1.55; margin-bottom:.9rem; font-weight:300; }
  .card-foot { display:flex; align-items:center; justify-content:space-between; }
  .card-price { font-family:'DM Serif Display',serif; font-size:1.2rem; color:var(--g700); }
  .add-btn { background:var(--g50); color:var(--g700); border:1.5px solid var(--g200); border-radius:6px; padding:7px 13px; font-size:.78rem; font-weight:600; transition:all .2s; }
  .add-btn:hover { background:var(--g700); color:#fff; border-color:var(--g700); }

  /* WHY */
  .why-bg { background:var(--surf); padding:5rem clamp(1rem,5vw,3.5rem); }
  .why-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1.2rem; margin-top:1.8rem; }
  .why-card { background:#fff; border:1.5px solid var(--border); border-radius:14px; padding:1.6rem 1.3rem; }
  .why-ico { font-size:1.7rem; margin-bottom:.7rem; }
  .why-t { font-family:'DM Serif Display',serif; font-size:1rem; margin-bottom:.35rem; }
  .why-d { font-size:.8rem; color:var(--muted); line-height:1.6; font-weight:300; }

  /* CARE */
  .care-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:1.2rem; }
  .care-card { background:var(--surf); border:1.5px solid var(--border); border-radius:14px; padding:1.5rem; transition:border-color .2s; }
  .care-card:hover { border-color:var(--g200); }
  .care-ico { font-size:1.7rem; margin-bottom:.7rem; }
  .care-t { font-family:'DM Serif Display',serif; font-size:1.05rem; margin-bottom:.45rem; }
  .care-b { font-size:.82rem; color:var(--muted); line-height:1.65; font-weight:300; }

  /* REVIEWS */
  .rev-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(255px,1fr)); gap:1.2rem; }
  .rev-card { background:var(--surf); border:1.5px solid var(--border); border-radius:14px; padding:1.35rem; }
  .rev-top { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
  .rev-av { width:36px; height:36px; border-radius:50%; background:var(--g700); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.875rem; flex-shrink:0; }
  .rev-name { font-weight:600; font-size:.875rem; }
  .rev-plant { font-size:.72rem; color:var(--light); }
  .rev-text { font-size:.82rem; color:var(--muted); line-height:1.65; font-style:italic; font-weight:300; }

  /* MODAL */
  .overlay { position:fixed; inset:0; background:rgba(10,24,8,.45); z-index:400; display:flex; align-items:center; justify-content:center; padding:1rem; backdrop-filter:blur(5px); animation:fIn .2s; }
  .mbox { background:#fff; border-radius:20px; max-width:530px; width:100%; padding:1.8rem; position:relative; max-height:90vh; overflow-y:auto; animation:scIn .25s ease; }
  @keyframes fIn { from{opacity:0} to{opacity:1} }
  @keyframes scIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
  .m-emoji { font-size:5rem; background:var(--surf); border-radius:14px; display:flex; align-items:center; justify-content:center; padding:1.2rem; margin-bottom:1.1rem; }
  .m-close { position:absolute; top:14px; right:14px; background:var(--surf); border:none; border-radius:50%; width:31px; height:31px; font-size:.95rem; color:var(--muted); display:flex; align-items:center; justify-content:center; transition:background .2s; }
  .m-close:hover { background:var(--border); }
  .tag { display:inline-block; border-radius:50px; padding:3px 11px; font-size:.7rem; font-weight:600; margin-right:5px; margin-bottom:5px; }
  .te { background:#DCEFD9; color:#265922; }
  .tm { background:#FEF3C7; color:#92400E; }
  .ta { background:#FEE2E2; color:#991B1B; }
  .ti { background:var(--g50); color:var(--g700); }
  .m-foot { display:flex; align-items:center; justify-content:space-between; margin-top:1.4rem; padding-top:1rem; border-top:1.5px solid var(--border); }
  .m-price { font-family:'DM Serif Display',serif; font-size:1.9rem; color:var(--g700); }

  /* CART */
  .c-overlay { position:fixed; inset:0; background:rgba(10,24,8,.4); z-index:300; display:flex; justify-content:flex-end; backdrop-filter:blur(3px); }
  .c-panel { background:#fff; width:min(580px,100vw); height:100vh; overflow-y:auto; display:flex; flex-direction:column; border-left:1.5px solid var(--border); animation:slL .28s ease; }
  @keyframes slL { from{transform:translateX(100%)} to{transform:translateX(0)} }
  .c-head { padding:1.3rem 1.5rem; border-bottom:1.5px solid var(--border); display:flex; justify-content:space-between; align-items:center; }
  .c-title { font-family:'DM Serif Display',serif; font-size:1.35rem; }
  .c-close { background:var(--surf); border:none; border-radius:50%; width:31px; height:31px; font-size:.95rem; color:var(--muted); display:flex; align-items:center; justify-content:center; }
  .c-body { flex:1; padding:1.1rem 1.5rem; overflow-y:auto; }
  .c-empty { text-align:center; padding:4rem 1rem; color:var(--muted); }
  .c-item { display:flex; gap:11px; padding:.9rem 0; border-bottom:1px solid var(--border); align-items:flex-start; }
  .ci-em { font-size:2rem; flex-shrink:0; background:var(--surf); border-radius:10px; width:50px; height:50px; display:flex; align-items:center; justify-content:center; animation:bob 5s ease-in-out infinite; position:relative; }
  .ci-em::after { content:''; position:absolute; inset:-3px; border-radius:10px; border:1px dashed var(--g50); animation:spin 28s linear infinite; }
  .ci-n { font-weight:600; font-size:.875rem; margin-bottom:2px; }
  .ci-p { font-size:.77rem; color:var(--muted); }
  .qty-r { display:flex; align-items:center; gap:7px; margin-top:5px; }
  .qty-b { background:var(--surf); border:1.5px solid var(--border); border-radius:5px; padding:6px 8px; font-size:.8rem; font-weight:700; color:var(--text); display:flex; align-items:center; justify-content:center; transition:border-color .2s; white-space:nowrap; }
  .qty-b:hover { border-color:var(--g500); }
  .ci-rm { background:none; border:none; font-size:.72rem; color:var(--light); margin-left:auto; }
  .ci-rm:hover { color:var(--danger); }
  .ci-tot { font-weight:700; font-size:.875rem; flex-shrink:0; color:var(--g700); align-self:center; }
  .c-foot { padding:1.1rem 1.5rem; border-top:1.5px solid var(--border); }
  .c-row { display:flex; justify-content:space-between; font-size:.85rem; margin-bottom:5px; color:var(--muted); }
  .c-row.tot { font-family:'DM Serif Display',serif; font-size:1.15rem; color:var(--text); margin-top:7px; padding-top:7px; border-top:1.5px solid var(--border); }
  .free { color:var(--accent); font-weight:600; }
  .co-btn { width:100%; background:var(--g700); color:#fff; border:none; border-radius:8px; padding:13px; font-size:.95rem; font-weight:600; margin-top:11px; transition:background .2s; }
  .co-btn:hover { background:var(--g900); }
  .free-note { text-align:center; font-size:.72rem; color:var(--light); margin-top:7px; }

  /* ADDRESS FORM */
  .addr-sec { padding:1.1rem 1.5rem; border-top:1.5px solid var(--border); background:var(--g50); }
  .addr-title { font-family:'DM Serif Display',serif; font-size:.95rem; margin-bottom:1rem; color:var(--text); }
  .addr-input, .addr-select { width:100%; border:1.5px solid var(--border); border-radius:6px; padding:10px 12px; font-size:.85rem; margin-bottom:10px; font-family:'DM Sans',sans-serif; }
  .addr-input:focus, .addr-select:focus { outline:none; border-color:var(--g500); }
  .addr-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px; }
  .addr-full { grid-column:1/-1; }
  .addr-btns { display:flex; gap:8px; margin-top:10px; }
  .addr-btn { flex:1; background:var(--g700); color:#fff; border:none; border-radius:6px; padding:9px; font-size:.8rem; font-weight:600; cursor:pointer; transition:background .2s; }
  .addr-btn:hover { background:var(--g900); }
  .addr-cancel { background:var(--border); color:var(--text); }
  .addr-cancel:hover { background:var(--light); }
  .addr-display { padding:1rem; background:#fff; border:1.5px solid var(--g200); border-radius:8px; margin-bottom:1rem; }
  .addr-display-text { font-size:.85rem; color:var(--text); line-height:1.6; }
  .addr-display-text strong { display:block; margin-bottom:5px; }
  .addr-edit-btn { margin-top:8px; padding:6px 12px; background:transparent; border:1.5px solid var(--g500); color:var(--g700); border-radius:5px; font-size:.75rem; cursor:pointer; }
  .addr-edit-btn:hover { background:var(--g50); }

  /* TOAST */
  .toast { position:fixed; bottom:22px; left:50%; transform:translateX(-50%); background:var(--g900); color:#fff; padding:10px 22px; border-radius:50px; font-size:.85rem; font-weight:500; z-index:999; white-space:nowrap; box-shadow:0 8px 24px rgba(0,0,0,.18); animation:tUp .3s ease; }
  @keyframes tUp { from{opacity:0;transform:translate(-50%,10px)} to{opacity:1;transform:translate(-50%,0)} }

  /* ADDRESS MODAL */
  .addr-modal-overlay { position:fixed; inset:0; background:rgba(10,24,8,.5); z-index:400; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); animation:fadeIn .25s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .addr-modal { background:#fff; border-radius:12px; box-shadow:0 20px 60px rgba(0,0,0,.25); max-width:480px; width:90vw; max-height:90vh; overflow-y:auto; animation:popIn .35s cubic-bezier(.34,.1,.65,.99); }
  @keyframes popIn { from {opacity:0; transform:scale(.92) translateY(20px)} to {opacity:1; transform:scale(1) translateY(0)} }
  .am-header { padding:1.5rem 1.8rem; border-bottom:1.5px solid var(--border); display:flex; justify-content:space-between; align-items:center; }
  .am-title { font-family:'DM Serif Display',serif; font-size:1.25rem; color:var(--g700); }
  .am-close { background:var(--surf); border:none; border-radius:50%; width:32px; height:32px; font-size:1rem; color:var(--muted); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background .2s; }
  .am-close:hover { background:var(--g50); }
  .am-body { padding:1.8rem; }
  .addr-section { margin-bottom:1.5rem; }
  .addr-label { font-family:'DM Serif Display',serif; font-size:.95rem; color:var(--text); margin-bottom:.8rem; display:block; font-weight:500; }
  .addr-input, .addr-select { width:100%; border:1.5px solid var(--border); border-radius:6px; padding:11px 13px; font-size:.85rem; margin-bottom:12px; font-family:'DM Sans',sans-serif; background:#fff; color:var(--g700); font-weight:500; }
  .addr-input:focus, .addr-select:focus { outline:none; border-color:var(--g500); background:var(--g50); }
  .addr-display-modal { padding:1rem; background:var(--g50); border:1.5px solid var(--g200); border-radius:8px; margin-bottom:1rem; }
  .addr-display-text { font-size:.85rem; color:var(--text); line-height:1.6; }
  .addr-display-text strong { display:block; margin-bottom:6px; font-weight:600; }
  .am-buttons { display:flex; gap:10px; margin-top:1.2rem; }
  .am-btn-primary { flex:1; background:var(--g700); color:#fff; border:none; border-radius:6px; padding:11px; font-size:.85rem; font-weight:600; cursor:pointer; transition:background .2s; }
  .am-btn-primary:hover { background:var(--g900); }
  .am-btn-secondary { flex:1; background:var(--border); color:var(--text); border:none; border-radius:6px; padding:11px; font-size:.85rem; font-weight:600; cursor:pointer; transition:background .2s; }
  .am-btn-secondary:hover { background:var(--light); }
  .am-edit-btn { width:100%; padding:8px; background:transparent; border:1.5px solid var(--g500); color:var(--g700); border-radius:5px; font-size:.8rem; cursor:pointer; margin-top:8px; transition:background .2s; }
  .am-edit-btn:hover { background:var(--g50); }
  .am-btn-remove { width:100%; padding:8px; background:transparent; border:1.5px solid var(--danger); color:var(--danger); border-radius:5px; font-size:.8rem; cursor:pointer; margin-top:8px; transition:background .2s; }
  .am-btn-remove:hover { background:rgba(224,82,82,.1); }


  /* FOOTER */
  .footer { background:var(--g900); color:rgba(255,255,255,.65); padding:4rem clamp(1rem,5vw,3.5rem) 2rem; }
  .f-grid { max-width:1300px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:2.5rem; }
  .f-logo { font-family:'DM Serif Display',serif; font-size:1.3rem; color:#fff; margin-bottom:.55rem; display:flex; align-items:center; gap:8px; }
  .f-desc { font-size:.8rem; line-height:1.75; }
  .f-head { font-size:.7rem; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-bottom:.85rem; }
  .f-lnk { display:block; background:none; border:none; font-family:'DM Sans',sans-serif; font-size:.83rem; color:rgba(255,255,255,.55); margin-bottom:.45rem; text-align:left; padding:0; transition:color .2s; }
  .f-lnk:hover { color:#fff; }
  .f-btm { max-width:1300px; margin:2rem auto 0; border-top:1px solid rgba(255,255,255,.1); padding-top:1.1rem; font-size:.72rem; opacity:.35; }

  /* CTA STRIP */
  .cta-strip { background:var(--g50); border-top:1.5px solid var(--border); border-bottom:1.5px solid var(--border); padding:4rem clamp(1rem,5vw,3.5rem); text-align:center; }

  /* ABOUT */
  .about-wrap { max-width:680px; }
  .about-body { font-size:.95rem; color:var(--muted); line-height:1.85; font-weight:300; }
  .about-body p { margin-bottom:1.15rem; }
  .about-body strong { color:var(--text); font-weight:600; }
  .about-quote { background:var(--surf); border-left:4px solid var(--g500); border-radius:0 12px 12px 0; padding:1.3rem 1.5rem; margin-top:2rem; }
  .about-quote blockquote { font-family:'DM Serif Display',serif; font-size:1.075rem; color:var(--g700); font-style:italic; }
  .about-quote cite { font-size:.76rem; color:var(--light); display:block; margin-top:5px; }

  /* EMPTY */
  .empty { text-align:center; padding:5rem 2rem; color:var(--muted); }
  .empty-ico { font-size:2.8rem; margin-bottom:.9rem; }
  .empty-h { font-family:'DM Serif Display',serif; font-size:1.2rem; color:var(--text); margin-bottom:.4rem; }

  @media(max-width:768px){
    .hero { grid-template-columns:1fr; min-height:auto; padding:3rem 1.2rem; }
    .hero-vis { display:none; }
    .nav-links { display:none; }
    .nav-links.open { display:flex; flex-direction:column; position:fixed; top:64px; left:0; right:0; background:#fff; border-bottom:1px solid var(--border); padding:1.4rem; gap:.9rem; z-index:199; }
    .hmb { display:flex; flex-direction:column; gap:5px; background:none; border:none; }
    .hb { width:21px; height:2px; background:var(--text); border-radius:2px; }
  }
  @media(min-width:769px){ .hmb { display:none; } }

  /* DARK MODE */
  .dark body { background:#0A1411; color:#FFFFFF; }
  .dark .nav { background:rgba(15,26,21,0.94); border-bottom-color:#2A3A32; }
  .dark .logo { color:#A8C5A8; }
  .dark .nl { color:#7A9A7A; }
  .dark .nl:hover { color:#FFFFFF; }
  .dark .nl.on { color:#A8C5A8; border-bottom-color:#3D8B37; }
  .dark .hero { background:none; }
  .dark .hero-h1 { color:#FFFFFF; }
  .dark .hero-sub { color:#A8C5A8; }
  .dark .stats { background:#1A2921; }
  .dark .sec-h { color:#FFFFFF; }
  .dark .sec-sub { color:#A8C5A8; }
  .dark .cat-btn { background:transparent; border-color:#2A3A32; color:#7A9A7A; }
  .dark .cat-btn:hover { border-color:#3D8B37; color:#A8C5A8; }
  .dark .cat-btn.on { background:#265922; border-color:#265922; color:#FFFFFF; }
  .dark .sort-sel { background:#1A2921; border-color:#2A3A32; color:#FFFFFF; }
  .dark .srch { background:#1A2921; border-color:#2A3A32; color:#FFFFFF; }
  .dark .srch:focus { border-color:#3D8B37; }
  .dark .card { background:#1A2921; border-color:#2A3A32; }
  .dark .card:hover { box-shadow:0 20px 48px rgba(168,197,168,0.09); border-color:#3D8B37; }
  .dark .card-img { background:#141F1A; }
  .dark .card:hover .card-img { background:#1A2921; }
  .dark .card-badge { background:#265922; color:#FFFFFF; }
  .dark .wl { background:#1A2921; border-color:#E05252; color:#E05252; }
  .dark .wl:hover { border-color:#E05252; }
  .dark .wl.on { background:#E05252; border-color:#E05252; color:#FFFFFF; }
  .dark .card-name { color:#FFFFFF; }
  .dark .card-cat { color:#7A9A7A; }
  .dark .card-desc { color:#A8C5A8; }
  .dark .card-price { color:#A8C5A8; }
  .dark .add-btn { background:#141F1A; color:#A8C5A8; border-color:#2A3A32; }
  .dark .add-btn:hover { background:#265922; color:#FFFFFF; border-color:#265922; }
  .dark .why-bg { background:#141F1A; }
  .dark .why-card { background:#1A2921; border-color:#2A3A32; }
  .dark .why-card:hover { border-color:#3D8B37; }
  .dark .why-d { color:#A8C5A8; }
  .dark .care-card { background:#141F1A; border-color:#2A3A32; }
  .dark .care-card:hover { border-color:#3D8B37; }
  .dark .care-b { color:#A8C5A8; }
  .dark .rev-card { background:#141F1A; border-color:#2A3A32; }
  .dark .rev-plant { color:#7A9A7A; }
  .dark .rev-text { color:#A8C5A8; }
  .dark .overlay { background:rgba(10,20,16,0.85); }
  .dark .mbox { background:#1A2921; }
  .dark .m-close { background:#141F1A; color:#A8C5A8; }
  .dark .m-close:hover { background:#2A3A32; }
  .dark .c-overlay { background:rgba(10,20,16,0.9); }
  .dark .c-panel { background:#1A2921; border-left-color:#2A3A32; }
  .dark .c-head { border-bottom-color:#2A3A32; }
  .dark .c-close { background:#141F1A; color:#A8C5A8; }
  .dark .c-empty { color:#A8C5A8; }
  .dark .ci-em { background:#141F1A; }
  .dark .ci-em::after { border-color:#3D8B37; }
  .dark .ci-p { color:#A8C5A8; }
  .dark .qty-b { background:#141F1A; border-color:#2A3A32; color:#FFFFFF; }
  .dark .qty-b:hover { border-color:#3D8B37; }
  .dark .c-total { border-top-color:#2A3A32; }
  .dark .c-total-l { color:#A8C5A8; }
  .dark .c-foot { border-top-color:#2A3A32; background:#141F1A; }
  .dark .checkout-btn { background:#265922; }
  .dark .checkout-btn:hover { background:#152F12; }
  .dark .addr-modal-overlay { background:rgba(10,20,16,0.85); }
  .dark .addr-modal { background:#1A2921; }
  .dark .am-header { border-bottom-color:#2A3A32; }
  .dark .am-close { background:#141F1A; color:#A8C5A8; }
  .dark .am-close:hover { background:#2A3A32; }
  .dark .addr-display-modal { background:#141F1A; border-color:#2A3A32; }
  .dark .addr-input { background:#141F1A; border-color:#2A3A32; color:#FFFFFF; }
  .dark .addr-input:focus { border-color:#3D8B37; }
  .dark .addr-select { background:#141F1A; border-color:#2A3A32; color:#FFFFFF; }
  .dark .am-btn-primary { background:#265922; }
  .dark .am-btn-primary:hover { background:#152F12; }
  .dark .am-btn-secondary { background:#141F1A; border-color:#2A3A32; color:#A8C5A8; }
  .dark .am-btn-secondary:hover { background:#2A3A32; }
  .dark .am-edit-btn { background:#141F1A; border-color:#2A3A32; color:#A8C5A8; }
  .dark .am-edit-btn:hover { background:#2A3A32; }
  .dark .am-btn-remove { background:#E05252; }
  .dark .toast { background:#1A2921; color:#FFFFFF; border:1px solid #2A3A32; }
  .dark .login-box { background:#1A2921; }
  .dark .login-title { color:#FFFFFF; }
  .dark .login-input { background:#141F1A; border-color:#2A3A32; color:#FFFFFF; }
  .dark .login-input:focus { border-color:#3D8B37; }
  .dark .avatar-option { background:#141F1A; }
  .dark .avatar-option:hover { background:#2A3A32; }
  .dark .avatar-option.selected { border-color:#3D8B37; background:#265922; }
  .dark .user-btn { background:#141F1A; border-color:#2A3A32; color:#FFFFFF; }
  .dark .reviews-section { border-top-color:#2A3A32; }
  .dark .reviews-title { color:#FFFFFF; }
  .dark .review-form { background:#141F1A; }
  .dark .review-textarea { background:#0A1411; border-color:#2A3A32; color:#FFFFFF; }
  .dark .review-item { background:#141F1A; }
  .dark .review-username { color:#FFFFFF; }
  .dark .login-label { color:#A8C5A8; }
  
  /* Review Edit/Delete */
  .review-actions { position:relative; }
  .review-menu { position:absolute; top:0; right:0; background:#fff; border:1.5px solid var(--border); border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); z-index:10; min-width:120px; }
  .review-menu-item { padding:8px 12px; font-size:.8rem; color:var(--text); cursor:pointer; transition:background .2s; border:none; background:none; width:100%; text-align:left; }
  .review-menu-item:hover { background:var(--surf); }
  .review-menu-item.delete { color:var(--danger); }
  .review-menu-item.delete:hover { background:#fef2f2; }
  .review-edit-form { background:var(--surf); border-radius:8px; padding:1rem; margin-top:.5rem; }
  .edit-stars { display:flex; gap:5px; margin-bottom:.8rem; }
  .edit-star { font-size:1.2rem; color:var(--border); cursor:pointer; transition:color .2s; }
  .edit-star.filled { color:#F59E0B; }
  .edit-star:hover { color:#F59E0B; }
  .edit-textarea { width:100%; border:1.5px solid var(--border); border-radius:6px; padding:8px; font-size:.8rem; color:var(--text); background:#fff; outline:none; resize:none; min-height:50px; margin-bottom:.5rem; }
  .edit-textarea:focus { border-color:var(--g500); }
  .edit-actions { display:flex; gap:8px; }
  .edit-btn { background:var(--g700); color:#fff; border:none; border-radius:4px; padding:6px 12px; font-size:.75rem; font-weight:600; cursor:pointer; transition:background .2s; }
  .edit-btn:hover { background:var(--g900); }
  .edit-btn.cancel { background:var(--surf); color:var(--text); border:1px solid var(--border); }
  .edit-btn.cancel:hover { background:var(--g50); }
  .dark .review-menu { background:#1A2921; border-color:#2A3A32; }
  .dark .review-menu-item { color:#FFFFFF; }
  .dark .review-menu-item:hover { background:#2A3A32; }
  .dark .review-menu-item.delete:hover { background:#2a1a1a; }
  .dark .review-edit-form { background:#141F1A; }
  .dark .edit-textarea { background:#0A1411; border-color:#2A3A32; color:#FFFFFF; }
  .dark .edit-textarea:focus { border-color:#3D8B37; }
  .dark .edit-btn.cancel { background:#141F1A; border-color:#2A3A32; color:#FFFFFF; }
  .dark .edit-btn.cancel:hover { background:#2A3A32; }
  
  /* Cart Tabs & Wishlist */
  .cart-tabs { display:flex; border-bottom:1.5px solid var(--border); margin-bottom:1rem; }
  .cart-tab { flex:1; padding:12px; background:none; border:none; font-size:.875rem; font-weight:500; color:var(--muted); cursor:pointer; transition:all .2s; border-bottom:2px solid transparent; }
  .cart-tab.active { color:var(--text); border-bottom-color:var(--g500); }
  .cart-tab:hover { color:var(--text); }
  .wishlist-empty { text-align:center; padding:2rem; color:var(--muted); }
  .wishlist-empty-icon { font-size:2.5rem; margin-bottom:1rem; }
  .wishlist-empty-text { fontFamily:"'DM Serif Display',serif"; fontSize:"1.05rem"; marginBottom:".4rem"; }
  .wishlist-empty-sub { fontSize:".82rem"; marginBottom:"1.4rem"; }
  .wishlist-item { display:flex; align-items:center; padding:1rem; border-bottom:1px solid var(--border); }
  .wishlist-item-img { width:60px; height:60px; border-radius:8px; object-fit:cover; margin-right:1rem; }
  .wishlist-item-details { flex:1; }
  .wishlist-item-name { font-weight:600; margin-bottom:.25rem; }
  .wishlist-item-price { color:var(--muted); font-size:.875rem; }
  .wishlist-item-actions { display:flex; gap:8px; }
  .wishlist-add-btn { background:var(--g500); color:#fff; border:none; border-radius:6px; padding:6px 12px; font-size:.75rem; font-weight:600; cursor:pointer; transition:background .2s; }
  .wishlist-add-btn:hover { background:var(--g700); }
  .wishlist-remove-btn { background:transparent; border:1px solid var(--border); border-radius:6px; padding:6px 12px; font-size:.75rem; color:var(--muted); cursor:pointer; transition:all .2s; }
  .wishlist-remove-btn:hover { background:var(--surf); border-color:var(--g200); color:var(--text); }
  .dark .cart-tabs { border-bottom-color:#2A3A32; }
  .dark .cart-tab { color:#A8C5A8; border-bottom-color:transparent; }
  .dark .cart-tab.active { color:#FFFFFF; border-bottom-color:#3D8B37; }
  .dark .cart-tab:hover { color:#FFFFFF; }
  .dark .wishlist-item { border-bottom-color:#2A3A32; }
  .dark .wishlist-item-price { color:#A8C5A8; }
  .dark .wishlist-add-btn { background:#3D8B37; }
  .dark .wishlist-add-btn:hover { background:#265922; }
  .dark .wishlist-remove-btn { border-color:#2A3A32; color:#A8C5A8; }
  .dark .wishlist-remove-btn:hover { background:#141F1A; border-color:#3D8B37; color:#FFFFFF; }
`;
