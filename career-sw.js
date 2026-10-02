/* EAIM 진로 서비스 워커 v1.0 (2026-10-02) — 설치(홈 화면·바탕화면 아이콘)용.
   네트워크 먼저: 늘 새 파일을 받고, 인터넷이 끊겼을 때만 이 기기에 남은 화면을 보여 준다.
   같은 주소의 화면·그림·스크립트만 남긴다. Firebase·구글 로그인 등 다른 주소 요청과 선생님 페이지는 건드리지 않는다. */
const CACHE = 'eaim-career-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('eaim-career-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.endsWith('teacher.html') || url.search.includes('code=')) return;
  e.respondWith(
    fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
