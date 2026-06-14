const CACHE='super-app-shell-v2';
const SHELL=['/','/today','/gym','/food','/body','/coach','/manifest.webmanifest'];
function isPrivate(req){const url=new URL(req.url);return url.pathname.startsWith('/api/')||url.hostname.includes('supabase.co')||req.headers.has('authorization');}
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||isPrivate(e.request))return;const url=new URL(e.request.url);if(url.origin!==location.origin)return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r.ok&&(url.pathname.startsWith('/_next/static/')||SHELL.includes(url.pathname))){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r;}).catch(()=>caches.match('/today'))));});
