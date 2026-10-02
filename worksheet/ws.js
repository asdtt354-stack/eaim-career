/* ══════════════════════════════════════════════════════════
   EAIM 진로 활동지 공통 엔진 · ws.js  v1.0 (2026-10-02) — 에임 도덕 ws.js v1.0 을 옮김
   - 머리의 탐구 질문·학습 목표·스스로 돌아보기는 curriculum-career.js + lessonplan-data.js(지도안과 같은 자료)에서 만든다.
   (아래는 도덕 원본 설명)
   - 견본(우정 온도계 활동지)의 기능을 모든 활동지가 함께 쓰도록 옮김.
     화면에서 쓰기 · 이 기기(sessionStorage)에만 잠시 저장 · 인쇄/PDF(빈 글 칸은 줄 칸) · Word(.doc: ■□)
     · 선생님용 풀이(정답 칸 초록) · 빈 활동지로 · 위험 낱말 검사(moral-class.js) · 민감 단원 도움 안내.
   - 머리의 탐구 질문·학습 목표·스스로 돌아보기 문장은 curriculum-moral.js(교육과정)에서 자동으로 만든다.
   - 쓰는 법: 활동지 파일에서 WS.start('앱id', { help }) → WS.add(WS.h2(...) + WS.table(...) ...) → WS.done()
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const APPS = window.CAREER_APPS || {}, AREAS = window.CAREER_AREAS || {}, CURR = window.EAIM_CAREER_CURRICULUM || {}, LES = window.CAREER_LESSONS || [];
  const MC = window.CareerClass || {};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const jong = (w) => { const t = String(w).trim(); const c = t.charCodeAt(t.length - 1) - 0xAC00; return c >= 0 && c <= 11171 ? c % 28 : -1; };
  const eul = (w) => jong(w) > 0 ? '을' : (jong(w) === 0 ? '를' : '을(를)');
  const toGoal = (t) => { for (const [re, to] of [[/함양한다\.$/, '함양할 수 있다.'], [/갖는다\.$/, '가질 수 있다.'], [/생각한다\.$/, '생각할 수 있다.'], [/이해한다\.$/, '이해할 수 있다.'], [/인식한다\.$/, '인식할 수 있다.'], [/결정한다\.$/, '결정할 수 있다.'], [/설정한다\.$/, '설정할 수 있다.'], [/실천한다\.$/, '실천할 수 있다.'], [/탐색한다\.$/, '탐색할 수 있다.'], [/활용한다\.$/, '활용할 수 있다.'], [/한다\.$/, '할 수 있다.']]) if (re.test(t)) return t.replace(re, to); return t; };
  let appId = '', app = {}, opts = {}, body = '', uid = 0;
  const nid = () => 'w' + (++uid);

  const WS = {
    esc,
    start(id, o = {}) { appId = id; app = APPS[id] || {}; opts = o; body = ''; },
    add(html) { body += html; },
    h2: (t) => `<h2>${esc(t)}</h2>`,
    guide: (t) => `<p class="guide">${t}</p>`,
    note: (t) => `<p class="note">${esc(t)}</p>`,
    q: (t) => `<p class="qtext">${esc(t)}</p>`,
    bullets: (arr) => `<ul class="bullets">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`,
    /* 개념 카드: [{icon,name,text,color,sub}] */
    cards(arr) {
      return `<div class="kinds">${arr.map(x => `<div style="border-top-color:${x.color || '#e2703a'}"><b>${x.icon ? x.icon + ' ' : ''}${esc(x.name)}</b>${x.sub ? `<span class="card-note">${esc(x.sub)}</span><br>` : ''}${esc(x.text || '')}</div>`).join('')}</div>`;
    },
    /* 한 줄에 하나 고르는 표: rows [{text, ans}], cols [{v,label}] */
    table(prefix, rows, cols, o = {}) {
      const head = `<tr><th>${esc(o.head || '문장')}</th>${cols.map(c => `<th>${c.label}</th>`).join('')}</tr>`;
      const many = cols.length >= 3;
      return `<table class="${many ? 'many' : ''}" style="--n:${cols.length}">${head}${rows.map((r, i) => `<tr><td>${i + 1}. ${esc(r.text)}${r.ansText ? ` <span class="ans">— ${esc(r.ansText)}</span>` : ''}</td>${cols.map(c => {
        const good = r.ans != null && String(r.ans) === String(c.v);
        return `<td class="c ${good ? 'good' : ''}"><label class="box round"><input type="radio" name="${prefix}-${i}" value="${esc(c.v)}" aria-label="${i + 1}번 ${esc(String(c.label).replace(/<[^>]+>/g, ' '))}"><span></span></label>${many ? `<small class="m-label">${String(c.label).replace(/<br>/g, ' ')}</small>` : ''}</td>`;
      }).join('')}</tr>`).join('')}</table>`;
    },
    /* 여러 개 고르기: items [string | {t, ok}] */
    checks(name, items, o = {}) {
      return `<div class="${o.cols === false ? '' : 'cols'}" data-max="${o.max || ''}" data-name="${name}">${items.map((x, i) => {
        const t = typeof x === 'string' ? x : x.t, ok = typeof x === 'object' && 'ok' in x ? x.ok : null;
        return `<label class="chk"><span class="box"><input type="checkbox" name="${name}" value="${i}"><span></span></span>${esc(t)}${o.suffix || ''}${ok === true ? ' <span class="ans">✔</span>' : ok === false ? ' <span class="ans" style="color:#d8434b">✖</span>' : ''}</label>`;
      }).join('')}</div>`;
    },
    /* 하나 고르기: items [string | {t, ok}] */
    radios(name, items, o = {}) {
      return `<div class="${o.cols ? 'cols' : ''}">${items.map((x, i) => {
        const t = typeof x === 'string' ? x : x.t, ok = typeof x === 'object' && x.ok === true;
        return `<label class="chk"><span class="box round"><input type="radio" name="${name}" value="${i}"><span></span></span>${esc(t)}${ok ? ' <span class="ans">✔</span>' : ''}</label>`;
      }).join('')}</div>`;
    },
    /* 글 칸 */
    write(label, rows = 2, o = {}) {
      const id = nid();
      return `<div class="write"><label for="${id}">${esc(label)}</label><textarea id="${id}" rows="${rows}" placeholder="${esc(o.ph || '')}"></textarea>${o.ans ? `<span class="ans">풀이: ${esc(o.ans)}</span>` : ''}</div>`;
    },
    /* 짧은 칸 여러 줄: rows [{label, ans, hint}] */
    lines(rows, o = {}) {
      return `<table>${o.head ? `<tr><th>${esc(o.head[0])}</th><th>${esc(o.head[1])}</th></tr>` : ''}${rows.map(r => {
        const id = nid();
        return `<tr><td style="width:${o.w || '38%'}"><label for="${id}">${esc(r.label)}</label>${r.hint ? `<br><span class="card-note">${esc(r.hint)}</span>` : ''}</td><td><div class="row-in"><input id="${id}" class="${o.narrow ? '' : 'wide'}">${o.unit ? esc(o.unit) : ''}</div>${r.ans != null ? `<span class="ans">풀이: ${esc(r.ans)}</span>` : ''}</td></tr>`;
      }).join('')}</table>`;
    },
    /* 딜레마: 보기 고르기 + 까닭 */
    dilemma(no, text, choices, hint) {
      const n = nid();
      return `<div class="dil"><p>${no ? esc(no) + '. ' : ''}${esc(text)}</p><div class="ab">${choices.map((c, i) => `<label class="chk"><span class="box round"><input type="radio" name="${n}" value="${i}"><span></span></span>${String.fromCharCode(65 + i)}. ${esc(c)}</label>`).join('')}</div>${hint ? `<p class="hint">생각해 볼 점: ${esc(hint)}</p>` : ''}${WS.write('이렇게 고른 까닭은', 2)}</div>`;
    },

    done() {
      const code = opts.code || app.std;
      const std = CURR.find ? CURR.find(code) : null;
      const L = LES.find(l => l.id === (opts.lesson || appId)) || LES.find(l => l.app === appId) || {};
      const A = CURR.areas ? CURR.areas.find(a => a.id === (L.area || app.area)) : null;
      const area = A ? A.name : '';
      const q = L.q || '', goal = std ? toGoal(std.text) : '';
      const p = A && L.p ? A.skills[L.p[0]] : '', v = A && L.v ? A.values[L.v[0]] : '';
      const pn = p ? p.replace(/하기$/, '') : '';
      const self = [pn ? `${pn}${eul(pn)} 할 수 있다.` : '', v ? `'${v}'의 태도를 기르려고 노력했다.` : '', '오늘 배운 것을 나의 진로와 이어 생각했다.'].filter(Boolean);
      const book = '진로와 직업';
      document.title = `${app.name || '활동지'} 활동지 · EAIM 진로`;
      document.body.innerHTML = `
<div class="bar">
  <a href="../${esc(app.file || 'index.html')}">${app.icon || ''} 앱으로</a>
  <a href="../guide.html#student">📘 사용 가이드</a>
  <button class="btn" type="button" id="b-print">🖨️ 인쇄·PDF</button>
  <button class="btn ghost" type="button" id="b-doc">⬇️ Word 파일(.doc)</button>
  <button class="btn ghost" type="button" id="b-clear">↺ 빈 활동지로</button>
  <button class="btn ghost" type="button" id="b-ans" aria-pressed="false">👩‍🏫 선생님용 풀이</button>
  <p id="msg" role="status">화면에서 바로 써도 되고, 빈 활동지로 인쇄해 손으로 써도 돼요. 쓴 내용은 이 기기에만 잠시 남고, 탭을 닫으면 사라져요.</p>
</div>
<article class="sheet" id="sheet">
  <div class="head"><div class="icon" aria-hidden="true">${app.icon || '📄'}</div><div>
    <p class="kicker">EAIM 진로 활동지 · ${esc(book)} · ${esc(area)} · ${esc(code || '')}</p><h1>${esc(app.name || '')}</h1></div></div>
  <div class="who"><label>학년 <input data-k="grade" aria-label="학년"></label><label>반 <input data-k="cls" aria-label="반"></label><label>번호 <input data-k="no" aria-label="번호"></label><label>이름 <input data-k="name" aria-label="이름"></label></div>
  <div class="q"><p><b>탐구 질문</b> ${esc(q)}</p><p><b>학습 목표</b> ${esc(goal)}</p></div>
  ${body}
  <h2>스스로 돌아보기</h2>
  ${WS.table('self', self.map(t => ({ text: t })), [{ v: '잘함', label: '잘함' }, { v: '보통', label: '보통' }, { v: '노력', label: '노력' }], { head: '나는' })}
  <div class="sign">선생님 확인 <span>&nbsp;</span></div>
  ${opts.help ? `<p class="helpbox">💙 ${esc(opts.help)}</p>` : ''}
  <p class="foot">EAIM 진로 · eaim-career.vercel.app · 장면과 인물은 지어낸 것이에요. 다른 사람을 알아볼 수 있는 이야기는 쓰지 않아요. © 2026 박성애 · EAIM</p>
</article>`;
      wire();
    },
  };

  function wire() {
    const $ = (id) => document.getElementById(id);
    const KEY = 'eaim_career_ws_' + (opts.lesson || appId).replace(/-/g, '_');
    const sheet = $('sheet');
    const fields = () => [...sheet.querySelectorAll('input, textarea')];
    const keyOf = (el, i) => el.type === 'radio' ? 'r:' + el.name : el.type === 'checkbox' ? 'c:' + el.name : (el.dataset.k ? 'k:' + el.dataset.k : 't:' + i);
    const msg = (t) => { $('msg').textContent = t; };
    function save() {
      const o = {};
      fields().forEach((el, i) => {
        const k = keyOf(el, i);
        if (el.type === 'radio') { if (el.checked) o[k] = el.value; }
        else if (el.type === 'checkbox') { if (el.checked) (o[k] = o[k] || []).push(el.value); }
        else if (el.value) o[k] = el.value;
      });
      try { sessionStorage.setItem(KEY, JSON.stringify(o)); } catch {}
    }
    (function load() {
      let o = null; try { o = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch {}
      if (!o) return;
      fields().forEach((el, i) => {
        const k = keyOf(el, i);
        if (el.type === 'radio') el.checked = o[k] === el.value;
        else if (el.type === 'checkbox') el.checked = (o[k] || []).includes(el.value);
        else if (o[k] != null) el.value = o[k];
      });
    })();
    sheet.addEventListener('input', save);
    sheet.addEventListener('change', (e) => {
      const wrap = e.target.closest('[data-max]');
      const max = wrap ? +wrap.dataset.max : 0;
      if (e.target.type === 'checkbox' && max && wrap.querySelectorAll('input:checked').length > max) { e.target.checked = false; msg(`${max}개까지 고를 수 있어요.`); }
      save();
    });
    function syncPrint() {
      sheet.querySelectorAll('textarea').forEach(t => {
        let p = t.nextElementSibling;
        if (!p || !p.classList.contains('ptext')) { p = document.createElement('div'); p.className = 'ptext'; t.after(p); }
        const rows = +t.getAttribute('rows') || 2;
        p.textContent = t.value; p.classList.toggle('empty', !t.value.trim()); p.style.minHeight = (rows * 28 + 10) + 'px';
      });
    }
    const risky = () => MC.safetyCheck && fields().some(el => (el.tagName === 'TEXTAREA' || (el.type === 'text' || !el.type)) && MC.safetyCheck(el.value, opts.danger || null));
    window.addEventListener('beforeprint', syncPrint);
    $('b-print').addEventListener('click', () => { if (risky()) { MC.showNotice('danger'); return; } syncPrint(); window.print(); });
    $('b-doc').addEventListener('click', () => {
      if (risky()) { MC.showNotice('danger'); return; }
      const d = sheet.cloneNode(true);
      const src = fields(), dst = [...d.querySelectorAll('input, textarea')];
      dst.forEach((el, i) => {
        const o = src[i];
        if (o.type === 'radio' || o.type === 'checkbox') el.closest('.box').replaceWith(document.createTextNode(o.checked ? '■ ' : '□ '));
        else if (o.tagName === 'TEXTAREA') { const p = document.createElement('p'); p.style.border = '1px solid #999'; p.style.padding = '4pt'; p.style.minHeight = '40pt'; p.textContent = o.value || ' '; el.replaceWith(p); }
        else el.replaceWith(document.createTextNode(o.value ? ' ' + o.value + ' ' : ' ________ '));
      });
      d.querySelectorAll('.ptext').forEach(x => x.remove());
      if (!document.body.classList.contains('show-ans')) d.querySelectorAll('.ans').forEach(x => x.remove());
      const css = 'body{font-family:"맑은 고딕","Malgun Gothic",sans-serif;font-size:10.5pt} h1{font-size:18pt;margin:0} h2{font-size:13pt;border-left:5pt solid #e2703a;padding-left:6pt} table{border-collapse:collapse;width:100%} th,td{border:1px solid #666;padding:3pt 5pt} th{background:#eef1f6} .q{background:#fff3f1;padding:6pt} .kinds div,.dil,.note,.helpbox{border:1px solid #bbb;padding:4pt;margin:3pt 0} .kicker{color:#555;font-size:9pt} .icon{font-size:22pt}';
      const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${esc(app.name)} 활동지</title><style>${css}</style></head><body>${d.innerHTML}</body></html>`;
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff', html], { type: 'application/msword' }));
      a.download = `활동지_${String(app.name || appId).replace(/\s+/g, '')}.doc`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      msg('⬇️ 내려받았어요. 워드나 한글에서 열어 고쳐 쓸 수 있어요.');
    });
    $('b-clear').addEventListener('click', () => {
      if (!confirm('쓴 내용을 모두 지우고 빈 활동지로 돌아갈까요?')) return;
      try { sessionStorage.removeItem(KEY); } catch {}
      fields().forEach(el => { if (el.type === 'radio' || el.type === 'checkbox') el.checked = false; else el.value = ''; });
      msg('빈 활동지가 되었어요.');
    });
    $('b-ans').addEventListener('click', (e) => {
      const on = document.body.classList.toggle('show-ans');
      e.currentTarget.setAttribute('aria-pressed', String(on));
      msg(on ? '선생님용 풀이를 켰어요. 이 상태로 인쇄하면 풀이지가 돼요. (까닭을 쓰는 문항과 고르기 활동은 정답이 없어요)' : '선생님용 풀이를 껐어요.');
    });
  }

  window.WS = WS;
})();
