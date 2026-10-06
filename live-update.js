(() => {
  'use strict';
  const CHECK_INTERVAL_MS=12_000, VERSION_URL='version.json', CACHE_BUST_PARAM='__v';
  if (new Set(['localhost','127.0.0.1','::1']).has(location.hostname)) return;
  const clean=new URL(location.href);
  if(clean.searchParams.has(CACHE_BUST_PARAM)){clean.searchParams.delete(CACHE_BUST_PARAM);history.replaceState(null,'',clean.pathname+clean.search+clean.hash);}
  let currentVersion=null, checking=false, reloading=false;
  async function fetchVersion(){const r=await fetch(VERSION_URL+'?_='+Date.now(),{cache:'no-store',credentials:'same-origin'});if(!r.ok)throw new Error('version-'+r.status);const j=await r.json();return String(j?.sha||j?.version||'').trim();}
  function notice(){let n=document.getElementById('live-update-notice');if(n)return n;n=document.createElement('div');n.id='live-update-notice';n.setAttribute('role','status');n.setAttribute('aria-live','polite');n.textContent='Nova versão publicada. Atualizando automaticamente…';Object.assign(n.style,{position:'fixed',left:'50%',bottom:'18px',transform:'translateX(-50%)',zIndex:'2147483647',maxWidth:'calc(100vw - 24px)',padding:'10px 14px',borderRadius:'999px',background:'#171717',color:'#fff',font:'600 12px/1.35 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',boxShadow:'0 10px 35px rgba(0,0,0,.25)',textAlign:'center'});document.body.appendChild(n);return n;}
  async function refreshCaches(){try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.allSettled(rs.map(r=>r.update()));}}catch{}try{if('caches'in window){const ks=await caches.keys();await Promise.allSettled(ks.map(k=>caches.delete(k)));}}catch{}}
  async function reloadFresh(v){if(reloading)return;reloading=true;notice();await refreshCaches();await new Promise(r=>setTimeout(r,650));const u=new URL(location.href);u.searchParams.set(CACHE_BUST_PARAM,v.slice(0,16)||Date.now().toString());location.replace(u.toString());}
  async function checkVersion(){if(checking||reloading)return;checking=true;try{const v=await fetchVersion();if(!v)return;if(currentVersion===null){currentVersion=v;return;}if(v!==currentVersion)await reloadFresh(v);}catch{}finally{checking=false;}}
  checkVersion();setInterval(checkVersion,CHECK_INTERVAL_MS);addEventListener('focus',checkVersion);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkVersion();});
})();
