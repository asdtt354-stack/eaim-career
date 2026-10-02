/* ══════════════════════════════════════════════════════════
   EAIM 진로 — 학생 교실 연결 (career-class.js)  v1.0 (2026-10-02)
   - 에임 도덕 moral-class.js v1.0 을 그대로 옮기고 이름만 바꿈 + 게임 점수 saveGame() 더함
   - 일반 스크립트입니다. career-apps.js 다음에 불러옵니다.
   - 주소에 ?code= 가 없으면 Firebase 를 불러오지 않습니다(공개 연습, 기록 없음).
   - ?code= 가 있으면 공통 교실 모듈(shared/eaim-classroom-core.js, 사회·역사 기준본 v1.0 그대로)을
     불러와 수업 방을 찾고, 반·번호 + 성 한 글자(선택)로 들어옵니다.
   - 기록은 submissions (세특 원료) + 선생님 답장(feedback). 학생 기기에서 AI 를 부르지 않습니다.

   경로 (공통규칙 4-4)
     teachers/{uid}/rooms/{roomId}                  수업 방 (platform:'career', app)
     teachers/{uid}/rooms/{roomId}/students/{익명uid} 반·번호·표시 이름(김**)
     teachers/{uid}/rooms/{roomId}/submissions/{id}  결과물 + 선생님 답장
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const PLATFORM = 'career';
  window.EAIM_PLATFORM = PLATFORM;
  const FS_URL = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
  const FONT = "'Pretendard','Apple SD Gothic Neo','Malgun Gothic',sans-serif";
  const APPS = () => window.CAREER_APPS || {};

  let core = null, fs = null, ROOM_OPEN = false, STUDENT = null;
  const roomListeners = [];

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function toast(msg, ok = true) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.setAttribute('role', 'status');
    t.style.cssText = `position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:99998;
      background:${ok ? '#1d2b4a' : '#b3343b'};color:#fff;padding:13px 22px;border-radius:999px;max-width:90vw;
      font-family:${FONT};font-weight:700;font-size:.95rem;word-break:keep-all;text-align:center;
      box-shadow:0 8px 22px rgba(0,0,0,.2)`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  }

  /** 성 한 글자 → '김**' (비우면 '') */
  function maskName(sur) {
    const s = String(sur || '').trim().slice(0, 1);
    return /^[가-힣]$/.test(s) ? s + '**' : '';
  }

  /* ── 안전 안내 (공통규칙 6-4, 10번) ──
     DANGER_COMMON 은 케어 care-class.js · 기술·가정 home-tech-class.js · 도덕 moral-class.js 와 같은 낱말입니다.
     바꿀 때는 네 곳을 함께 바꿉니다(공통규칙 12번 도덕). */
  const DANGER_COMMON = /(때리|때려|때렸|폭행|굶겨|굶었|밥을 안 주|쫓아냈|쫓겨났|나가라고|죽고 싶|죽어버리|죽어 버리|사라지고 싶|없어지고 싶|자해|멍이 들|술 마시고|협박|성추행|왕따|따돌림|학교폭력|학폭)/;
  function safetyCheck(text, extra = null) {
    const s = String(text || '');
    if (DANGER_COMMON.test(s) || (extra && extra.test(s))) return 'danger';
    return null;
  }

  function showNotice(kind = 'danger') {
    document.getElementById('career-notice')?.remove();
    const danger = kind === 'danger';
    const box = document.createElement('div');
    box.id = 'career-notice';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = `
      <div class="mn-card">
        <p class="mn-t">${danger ? '잠깐 멈출게요' : '마음이 많이 무거웠나 봐요'}</p>
        ${danger ? `
          <p>지금 쓴 이야기는 혼자 감당할 일이 아닐 수도 있어요.
          <b>담임 선생님이나 상담 선생님, 믿을 만한 어른에게 꼭 직접 이야기해 주세요.</b></p>
          <p>말하기 어려우면 청소년 상담전화 <b>1388</b>에 전화하거나 문자해도 돼요.</p>
          <p class="mn-s">이 글은 선생님께 보내지 않았어요. 다른 뜻으로 쓴 말이었다면, 말을 바꿔 쓰고 다시 보내도 돼요.</p>`
        : `
          <p>힘든 마음을 혼자 두지 말고 <b>선생님이나 주변의 믿을 만한 어른에게 이야기해 보세요.</b></p>
          <p class="mn-s">쓴 글은 그대로 보낼 수 있어요.</p>`}
        <button type="button">알겠어요</button>
      </div>
      <style>
        #career-notice{position:fixed;inset:0;z-index:100000;background:rgba(20,28,45,.5);display:flex;
          align-items:center;justify-content:center;padding:18px;font-family:${FONT};word-break:keep-all}
        #career-notice .mn-card{background:#fff;border-radius:18px;max-width:420px;width:100%;padding:24px 22px;
          color:#1d2b4a;line-height:1.65;box-shadow:0 18px 40px rgba(0,0,0,.25);border-top:6px solid ${danger ? '#b3343b' : '#c8912f'}}
        #career-notice .mn-t{font-weight:800;font-size:1.12rem;margin:0 0 10px}
        #career-notice p{margin:0 0 10px;font-size:.97rem}
        #career-notice .mn-s{color:#5d6b85;font-size:.88rem}
        #career-notice button{width:100%;margin-top:8px;padding:13px;border:0;border-radius:12px;background:#1d2b4a;
          color:#fff;font-weight:700;font-size:1rem;cursor:pointer;font-family:inherit}
      </style>`;
    document.body.appendChild(box);
    const btn = box.querySelector('button');
    btn.addEventListener('click', () => box.remove());
    btn.focus();
  }

  /* ── 입장 화면 ── */
  function gateShell() {
    document.getElementById('career-gate')?.remove();
    const wrap = document.createElement('div');
    wrap.id = 'career-gate';
    wrap.innerHTML = `
      <style>
        #career-gate{position:fixed;inset:0;z-index:99999;background:#1d2b4a;display:flex;align-items:center;
          justify-content:center;padding:18px;font-family:${FONT};color:#1d2b4a;word-break:keep-all;overflow:auto}
        #career-gate .card{background:#f6f8fb;border-radius:20px;padding:28px 22px;width:100%;max-width:390px;
          box-shadow:0 20px 50px rgba(0,0,0,.35)}
        #career-gate h2{margin:0 0 6px;font-size:1.3rem}
        #career-gate .room{color:#5d6b85;font-size:.92rem;margin:0 0 16px;line-height:1.55}
        #career-gate label{display:block;font-weight:700;font-size:.86rem;margin:12px 0 6px}
        #career-gate input,#career-gate select{width:100%;padding:12px;border:2px solid #d5dce8;border-radius:12px;
          font-size:1.05rem;box-sizing:border-box;background:#fff;font-family:inherit;color:#1d2b4a}
        #career-gate input:focus,#career-gate select:focus{outline:none;border-color:#c8912f}
        #career-gate .row{display:flex;gap:8px}
        #career-gate .row>div{flex:1;min-width:0}
        #career-gate .note{font-size:.82rem;color:#5d6b85;margin:8px 0 0;line-height:1.5}
        #career-gate button{width:100%;margin-top:20px;padding:15px;border:0;border-radius:12px;background:#1d2b4a;
          color:#fff;font-size:1.05rem;font-weight:700;cursor:pointer;font-family:inherit}
        #career-gate button:disabled{background:#9aa6bb;cursor:default}
        #career-gate a.btn2{display:block;text-align:center;margin-top:14px;color:#2f6fa8;font-weight:700;font-size:.92rem}
        #career-gate .err{color:#b3343b;font-size:.88rem;margin-top:12px;min-height:1.2em}
      </style>
      <div class="card"></div>`;
    document.body.appendChild(wrap);
    return wrap;
  }

  function lockScreen(title, text, extraHtml = '') {
    const wrap = gateShell();
    wrap.querySelector('.card').innerHTML = `<h2>${esc(title)}</h2><p class="room">${esc(text)}</p>${extraHtml}
      <a class="btn2" href="index.html">EAIM 진로 첫 화면으로</a>`;
    return wrap;
  }

  async function loadFirebase() {
    if (!core) core = await import('./shared/eaim-classroom-core.js');
    if (!fs) fs = await import(FS_URL);
  }

  async function findRoom(code, app) {
    const c = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    if (!c) return { error: 'none' };
    const cs = await fs.getDoc(fs.doc(core.db, 'roomCodes', c));
    if (!cs.exists()) return { error: 'none' };
    const { teacherUid, roomId } = cs.data();
    const rs = await fs.getDoc(fs.doc(core.db, `teachers/${teacherUid}/rooms/${roomId}`));
    if (!rs.exists()) return { error: 'none' };
    const room = rs.data();
    if (!room.platform) return { error: 'old' };
    if (room.platform !== PLATFORM) return { error: 'other' };
    if (!room.isOpen) return { error: 'closed' };
    if (room.app !== app) return { error: 'app', room: { ...room, code: c } };
    return { teacherUid, roomId, code: c, ...room };
  }

  function watchRoom(teacherUid, roomId) {
    fs.onSnapshot(fs.doc(core.db, `teachers/${teacherUid}/rooms/${roomId}`), (snap) => {
      const open = snap.exists() && snap.data().isOpen !== false;
      if (ROOM_OPEN && !open) toast('선생님이 수업을 닫았어요. 이제 내기는 할 수 없어요.', false);
      ROOM_OPEN = open;
      roomListeners.forEach(fn => { try { fn(open, snap.exists() ? snap.data() : null); } catch (e) { console.warn(e); } });
    }, () => {});
  }

  const SEAT_KEY = (code) => `eaim_career_seat_${code}`;

  /**
   * 앱 시작 때 부릅니다.  CareerClass.init({ app:'entre-explorer', onReady(student|null) })
   * 돌려주는 값: 수업에 들어왔으면 학생 정보, 공개 연습이면 null
   */
  async function init({ app, onReady } = {}) {
    window.EAIM_APP_TYPE = app;
    const meta = APPS()[app] || {};
    const code = new URLSearchParams(location.search).get('code');

    if (!code) {
      if (meta.open === false) {
        lockScreen('수업에서 하는 활동이에요', '선생님이 보여 주시는 수업 QR이나 링크로 들어와요.');
        return null;
      }
      onReady?.(null);
      return null;
    }

    let room;
    try { await loadFirebase(); room = await findRoom(code, app); }
    catch (e) { console.error(e); room = { error: 'net' }; }

    if (room.error) {
      const practice = meta.open !== false
        ? `<a class="btn2" href="${esc(location.pathname.split('/').pop() || 'index.html')}">수업 없이 연습하기</a>` : '';
      if (room.error === 'app') {
        const right = APPS()[room.room.app];
        const go = right ? `<a class="btn2" href="${esc(right.file)}?code=${esc(room.room.code)}">${esc(right.name)}(으)로 가기</a>` : '';
        lockScreen('다른 활동의 수업 방이에요', '이 수업 코드는 다른 활동에서 쓰는 코드예요.', go);
        return null;
      }
      const msg = {
        none:   ['수업 방을 찾지 못했어요', '코드가 맞는지 선생님께 확인해 주세요.'],
        old:    ['예전 수업 방이에요', '선생님께 새 수업 QR을 받아 주세요.'],
        other:  ['다른 과목의 수업 방이에요', 'EAIM 진로 수업 QR인지 선생님께 확인해 주세요.'],
        closed: ['아직 수업이 열리지 않았어요', '선생님이 수업을 열어 주시면 다시 들어와요.'],
        net:    ['연결하지 못했어요', '인터넷 연결을 확인하고 새로고침해 주세요.'],
      }[room.error];
      lockScreen(msg[0], msg[1], practice);
      return null;
    }

    const enter = async (seat) => {
      const classNo = `${seat.grade}-${seat.cls}`;
      const studentNo = Number(seat.no);
      const displayName = maskName(seat.sur);
      await core.joinRoom({ teacherUid: room.teacherUid, roomId: room.roomId, className: classNo, number: studentNo, name: displayName || null });
      await fs.setDoc(fs.doc(core.db, `teachers/${room.teacherUid}/rooms/${room.roomId}/students/${core.auth.currentUser.uid}`), {
        platform: PLATFORM, app, classNo, studentNo, displayName,
      }, { merge: true });
      try { sessionStorage.setItem(SEAT_KEY(room.code), JSON.stringify(seat)); } catch {}
      STUDENT = {
        teacherUid: room.teacherUid, roomId: room.roomId, code: room.code, app,
        classNo, studentNo, displayName, roomTitle: room.title || meta.name || '',
      };
      window.EAIM_STUDENT = STUDENT;
      ROOM_OPEN = true;
      watchRoom(room.teacherUid, room.roomId);
      return STUDENT;
    };

    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(SEAT_KEY(room.code)) || 'null'); } catch {}
    if (saved && saved.grade && saved.cls && saved.no) {
      try { const s = await enter(saved); onReady?.(s); return s; } catch (e) { console.error(e); }
    }

    const wrap = gateShell();
    wrap.querySelector('.card').innerHTML = `
      <h2>수업 들어가기</h2>
      <p class="room">${esc(room.title || meta.name || '수업')}</p>
      <div class="row">
        <div><label for="mg-grade">학년</label>
          <select id="mg-grade"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></div>
        <div><label for="mg-class">반</label><input id="mg-class" inputmode="numeric" maxlength="2" placeholder="3"></div>
        <div><label for="mg-num">번호</label><input id="mg-num" inputmode="numeric" maxlength="2" placeholder="7"></div>
      </div>
      <label for="mg-sur">성 한 글자 (쓰지 않아도 돼요)</label>
      <input id="mg-sur" maxlength="1" placeholder="예: 김" autocomplete="off">
      <p class="note">이름은 쓰지 않아도 돼요. 쓰면 성 한 글자만 남아요(김**).</p>
      <button id="mg-go" type="button">들어가기</button>
      <p class="err" id="mg-err" role="alert"></p>`;
    const $ = (id) => wrap.querySelector('#' + id);
    $('mg-class').focus();
    return new Promise((resolve) => {
      $('mg-go').addEventListener('click', async () => {
        const seat = {
          grade: $('mg-grade').value,
          cls: String($('mg-class').value).replace(/\D/g, ''),
          no: String($('mg-num').value).replace(/\D/g, ''),
          sur: $('mg-sur').value.trim(),
        };
        if (!seat.cls || !seat.no) { $('mg-err').textContent = '반과 번호를 써 주세요.'; return; }
        if (seat.sur && !/^[가-힣]$/.test(seat.sur)) { $('mg-err').textContent = '성은 한글 한 글자만 써요. 비워 둬도 돼요.'; return; }
        $('mg-go').disabled = true; $('mg-go').textContent = '들어가는 중...';
        try {
          const s = await enter(seat);
          wrap.remove();
          onReady?.(s);
          resolve(s);
        } catch (e) {
          console.error(e);
          $('mg-err').textContent = '들어가지 못했어요. 다시 눌러 주세요.';
          $('mg-go').disabled = false; $('mg-go').textContent = '들어가기';
        }
      });
    });
  }

  /**
   * 선생님께 내기 (공통규칙 5-2 모양, submissions).
   * 돌려주는 값 { ok, id, reason } — 화면은 ok 일 때만 "냈어요"를 띄웁니다.
   */
  async function submit({ kind, title = '', content = '', detail = {}, result = null }) {
    const s = STUDENT;
    if (!s) return { ok: false, reason: 'no-room' };
    if (!ROOM_OPEN) { toast('수업이 닫혀 있어서 내지 못했어요.', false); return { ok: false, reason: 'closed' }; }
    const meta = APPS()[s.app] || {};
    try {
      await core.studentEnter();
      const rec = {
        platform: PLATFORM, appId: `career/${s.app}`, app: s.app, unit: '',
        activityType: meta.activityType || 'writing',
        classNo: s.classNo, studentNo: s.studentNo, displayName: s.displayName || '',
        className: s.classNo, number: s.studentNo,
        studentId: core.auth.currentUser.uid,
        kind, title: String(title).slice(0, 120), content: String(content),
        detail, feedback: '', createdAt: fs.serverTimestamp(),
      };
      if (result) rec.result = result;
      const ref = await fs.addDoc(fs.collection(core.db, `teachers/${s.teacherUid}/rooms/${s.roomId}/submissions`), rec);
      return { ok: true, id: ref.id };
    } catch (e) {
      console.error(e);
      toast('내지 못했어요. 인터넷을 확인하고 다시 눌러 주세요.', false);
      return { ok: false, reason: 'error' };
    }
  }

  /**
   * 게임 점수 (gameResults — 세특과 무관, 공통규칙 5-1).
   * saveGame({ game, score, correct, total, wrongLog })
   */
  async function saveGame({ game, score = 0, correct = 0, total = 0, wrongLog = [] }) {
    const s = STUDENT;
    if (!s) return { ok: false, reason: 'no-room' };
    if (!ROOM_OPEN) return { ok: false, reason: 'closed' };
    try {
      await core.studentEnter();
      const ref = await fs.addDoc(fs.collection(core.db, `teachers/${s.teacherUid}/rooms/${s.roomId}/gameResults`), {
        platform: PLATFORM, appId: `career/${s.app}`, app: s.app,
        studentId: core.auth.currentUser.uid,
        classNo: s.classNo, studentNo: s.studentNo, displayName: s.displayName || '',
        className: s.classNo, number: s.studentNo,
        game, score: Number(score) || 0, correct: Number(correct) || 0, total: Number(total) || 0,
        wrongLog: (wrongLog || []).slice(0, 30), createdAt: fs.serverTimestamp(),
      });
      return { ok: true, id: ref.id };
    } catch (e) { console.error(e); return { ok: false, reason: 'error' }; }
  }

  /** 학생: 내가 낸 결과물과 선생님 답장을 실시간으로 (자기 studentId 만) */
  function listenMine(cb) {
    const s = STUDENT, uid = core?.auth?.currentUser?.uid;
    if (!s || !uid) return () => {};
    const q = fs.query(fs.collection(core.db, `teachers/${s.teacherUid}/rooms/${s.roomId}/submissions`), fs.where('studentId', '==', uid));
    return fs.onSnapshot(q, (snap) => {
      const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .filter(r => r.app === s.app)
        .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
      cb(rows);
    }, (e) => console.warn('답장을 받지 못했어요:', e));
  }

  window.CareerClass = {
    init, submit, saveGame, listenMine, safetyCheck, showNotice, toast, maskName, esc,
    get student() { return STUDENT; },
    get isOpen() { return ROOM_OPEN; },
    onRoomChange(fn) { roomListeners.push(fn); },
  };
})();
