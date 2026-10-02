/* EAIM 진로 — 화면 도우미 (career-ui.js) v1.0 (2026-10-02)
   career-apps.js · career-class.js 다음에 불러옵니다.
   - 쉬운 말 보기: <span class="n">보통 말</span><span class="e">쉬운 말</span> 두 벌을 두고 body.easy 로 바꿔 보여 줌
   - 🔊 읽어 주기: 브라우저 목소리만 씀(외부 음성 서비스 없음 — 공통규칙 12번 케어)
   - 복사·내려받기·수업 모드 표시·선생님 한마디 */
(function () {
  'use strict';
  const LS = 'eaim_career_easy';
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* 쉬운 말 */
  function setEasy(on) {
    document.body.classList.toggle('easy', !!on);
    document.querySelectorAll('.easy-btn').forEach(b => { b.classList.toggle('on', !!on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    try { localStorage.setItem(LS, on ? '1' : '0'); } catch {}
  }
  function initEasy() {
    let on = false; try { on = localStorage.getItem(LS) === '1'; } catch {}
    /* 주소에 ?easy=1 이 있으면 쉬운 말로 시작 (에임 케어 한국어 트랙 등에서 들어올 때, v1.8) */
    try { const q = new URLSearchParams(location.search).get('easy'); if (q === '1') on = true; else if (q === '0') on = false; } catch {}
    setEasy(on);
    document.addEventListener('click', (e) => { if (e.target.closest('.easy-btn')) setEasy(!document.body.classList.contains('easy')); });
  }
  /** {t:'보통 말', e:'쉬운 말'} 또는 글자 → html */
  function tx(v) {
    if (v == null) return '';
    if (typeof v === 'string') return esc(v);
    return v.e ? `<span class="n">${esc(v.t)}</span><span class="e">${esc(v.e)}</span>` : esc(v.t);
  }
  /** 지금 보이는 쪽 글자 */
  function plain(v) { if (v == null) return ''; if (typeof v === 'string') return v; return (document.body.classList.contains('easy') && v.e) ? v.e : v.t; }

  /* 🔊 읽어 주기 */
  function speak(text) {
    try {
      if (!('speechSynthesis' in window)) return toast('이 기기는 읽어 주기를 지원하지 않아요.');
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text).replace(/[🌏💡🎪🃏🌱🧭🔊✨]/gu, ''));
      u.lang = 'ko-KR'; u.rate = document.body.classList.contains('easy') ? 0.85 : 1;
      speechSynthesis.speak(u);
    } catch (e) { console.warn(e); }
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-say]'); if (!b) return;
    const box = b.dataset.say ? document.getElementById(b.dataset.say) : b.parentElement;
    if (!box) return;
    const clone = box.cloneNode(true);
    clone.querySelectorAll(document.body.classList.contains('easy') ? '.n,[data-say]' : '.e,[data-say]').forEach(x => x.remove());
    speak(clone.textContent.replace(/\s+/g, ' ').trim());
  });

  /* 알림 */
  function toast(msg) {
    if (window.CareerClass) return window.CareerClass.toast(msg);
    let t = document.getElementById('cu-toast');
    if (!t) { t = document.createElement('div'); t.id = 'cu-toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2400);
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast('복사했어요.'); }
    catch { prompt('이 글을 복사해 주세요', text); }
  }
  function download(name, text) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/plain;charset=utf-8' }));
    a.download = String(name).replace(/[\\/:*?"<>|]/g, '_') + '.txt';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  /**
   * 수업 연결. CU.classroom({ app, modeEl, sendEl, replyEl, onReady })
   * - 수업 QR로 들어오면 모드 글자·내기 단추를 보이고 선생님 한마디를 받는다.
   */
  function classroom({ app, modeEl, sendEl, replyEl, onReady } = {}) {
    const CC = window.CareerClass; if (!CC) return;
    CC.init({
      app,
      onReady(st) {
        if (!st) { onReady?.(null); return; }
        const [g, c] = String(st.classNo).split('-');
        if (modeEl) { modeEl.textContent = `🏫 ${g}학년 ${c}반 ${st.studentNo}번${st.displayName ? ' ' + st.displayName : ''} · ${st.roomTitle}`; modeEl.classList.remove('hidden'); }
        (Array.isArray(sendEl) ? sendEl : [sendEl]).forEach(el => el && el.classList.remove('hidden'));
        if (replyEl) CC.listenMine((rows) => {
          const last = [...rows].reverse().find(r => r.feedback); if (!last) return;
          replyEl.innerHTML = `<b>💌 선생님 한마디</b><p style="margin:6px 0 0;white-space:pre-wrap">${esc(last.feedback)}</p>`;
          replyEl.classList.remove('hidden');
        });
        onReady?.(st);
      },
    });
  }

  /* 기기 저장 (화면 진행 상태만 — 공통규칙 10-1, 앞머리 eaim_career_) */
  function store(key) {
    const K = 'eaim_career_' + key;
    return {
      load(def) { try { const v = JSON.parse(localStorage.getItem(K) || 'null'); return v ? Object.assign({}, def, v) : def; } catch { return def; } },
      save(v) { try { localStorage.setItem(K, JSON.stringify(v)); } catch {} },
      clear() { try { localStorage.removeItem(K); } catch {} },
    };
  }
  /* 세션 저장 (탭을 닫으면 사라짐) */
  function sstore(key) {
    const K = 'eaim_career_' + key;
    return {
      load(def) { try { const v = JSON.parse(sessionStorage.getItem(K) || 'null'); return v ? Object.assign({}, def, v) : def; } catch { return def; } },
      save(v) { try { sessionStorage.setItem(K, JSON.stringify(v)); } catch {} },
      clear() { try { sessionStorage.removeItem(K); } catch {} },
    };
  }

  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const won = (n) => (Math.round(n)).toLocaleString('ko-KR') + '원';

  /* 설치(홈 화면·바탕화면 아이콘) — 서비스 워커 등록. 보안 주소(https)에서만 */
  if ('serviceWorker' in navigator && location.protocol === 'https:') { try { navigator.serviceWorker.register('career-sw.js'); } catch {} }


  /* 🛂 진로 여권 도장 (v1.4) — 앱 결과를 이 기기의 여권에 모은다(eaim_career_passport).
     기기에만 남는 개인 포트폴리오. 공식 기록은 선생님께 낸 것(submissions). 여권 화면에서 파일 저장·지우기. */
  const PK = 'eaim_career_passport';
  function passport() { try { return JSON.parse(localStorage.getItem(PK) || 'null') || { v: 1, nick: '', stamps: {} }; } catch { return { v: 1, nick: '', stamps: {} }; } }
  function stamp(app, text) {
    if (!app || app === 'passport' || !String(text || '').trim()) return false;
    const P = passport(), old = P.stamps[app];
    P.stamps[app] = { text: String(text).slice(0, 4000), at: new Date().toISOString(), n: (old ? old.n : 0) + 1, first: old ? old.first : new Date().toISOString() };
    try { localStorage.setItem(PK, JSON.stringify(P)); } catch { return false; }
    return true;
  }
  function stampButton(app, getText) {
    const b = document.getElementById('btnStamp'); if (!b) return;
    b.addEventListener('click', () => {
      const t = getText();
      if (!String(t || '').replace(/\[[^\]]*\]/g, '').replace(/[\s\-/·,:|]/g, '').trim()) return toast('먼저 활동을 채워 주세요.');
      if (stamp(app, t)) { toast('🛂 진로 여권에 도장을 찍었어요!'); b.textContent = '🛂 도장 찍음 ✓'; setTimeout(() => { b.textContent = '🛂 여권에 도장'; }, 2200); }
      else toast('이 기기에서는 여권에 저장할 수 없어요. 복사해서 보관해요.');
    });
  }
  /* 수업에서 선생님께 내면 저절로 도장 */
  function hookSubmit() {
    const CC = window.CareerClass; if (!CC || CC._stampHooked) return;
    const orig = CC.submit; CC._stampHooked = true;
    CC.submit = async function (rec) { const r = await orig.call(CC, rec); if (r && r.ok && CC.student) stamp(CC.student.app, rec.content); return r; };
  }

  window.CU = { esc, tx, plain, initEasy, setEasy, speak, toast, copy, download, classroom, store, sstore, shuffle, won, passport, stamp, stampButton };
  hookSubmit();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initEasy); else initEasy();
})();
