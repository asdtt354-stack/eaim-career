/* ══════════════════════════════════════════════════════════
   EAIM 진로 — 앱 표 (career-apps.js)  v1.4 (2026-10-02)
   첫 화면(index.html), 교사 페이지(teacher.html), 교실 연결(career-class.js),
   지도안·가이드가 모두 이 표 하나를 읽습니다. 앱을 새로 만들면 ready:true 로 바꿉니다.

   area  : '01' 진로와 나의 이해 / '02' 직업 세계와 진로 탐색 / '03' 진로 설계와 실천
   std   : 대표 성취기준 (별책 18 「진로와 직업」으로 확인), stds: 함께 닿는 성취기준
   open  : true = 로그인 없이 연습(저장 없음), false = 수업 전용
   game  : true = 점수는 gameResults 에도 남김(세특과 무관), 글은 submissions
   ready : 만들어진 앱만 true
   ══════════════════════════════════════════════════════════ */
window.CAREER_AREAS = {
  '01': { name: '진로와 나의 이해',     icon: '🌱', color: '#2a9d8f' },
  '02': { name: '직업 세계와 진로 탐색', icon: '🗺️', color: '#e2703a' },
  '03': { name: '진로 설계와 실천',     icon: '🧭', color: '#3d6fd1' },
};

window.CAREER_APPS = {
  /* ── 만든 앱 (창업 묶음 + 게임) ── */
  'entre-explorer':   { area: '02', order: 6, std: '[9진로02-06]', stds: ['[9진로02-06]'], icon: '💡', name: '창업가 정신 탐험대', file: 'entre-explorer.html', open: true, ready: true, activityType: 'writing',
                        desc: '창업가 이야기 속 창업가 정신을 찾고, 우리 주변 문제로 1분 피칭 카드를 만들어요' },
  'booth-startup':    { area: '02', order: 7, std: '[9진로02-06]', stds: ['[9진로02-06]'], icon: '🎪', name: '축제 부스 창업 게임', file: 'booth-startup.html', open: true, ready: true, activityType: 'game', game: true,
                        desc: '학교 축제 부스를 세 번 운영하며 실패하고, 바꾸고, 다시 도전해요' },
  'job-change-cards': { area: '02', order: 1, std: '[9진로02-01]', stds: ['[9진로02-01]', '[9진로02-02]'], icon: '🃏', name: '직업 세계 변화 카드 게임', file: 'job-change-cards.html', open: true, ready: true, activityType: 'game', game: true,
                        desc: '고령화·기후 변화·AI·다문화 카드로 바뀌는 직업을 맞히고 새 직업을 발명해요' },
  'multi-growth':     { area: '01', order: 5, std: '[9진로01-02]', stds: ['[9진로01-02]', '[9진로02-06]', '[9진로03-02]'], icon: '🌏', name: '다문화 성장 프로젝트', file: 'multi-growth.html', open: true, ready: true, activityType: 'project',
                        desc: '나의 강점 보물지도에서 직업, 창업 아이디어, 진로 경로까지 네 차시 동안 키워요' },

  'path-board':       { area: '02', order: 2, std: '[9진로02-02]', stds: ['[9진로02-02]'], icon: '🎲', name: '진로 경로 보드게임', file: 'path-board.html', open: true, ready: true, activityType: 'game', game: true,
                        desc: '주사위로 학교·일 경험·도전 세 갈래 길을 오가며 꿈에 닿는 여러 길을 겪어요 (1~4명)' },

  'dream-team':       { area: '01', order: 3, std: '[9진로01-03]', stds: ['[9진로01-03]'], icon: '🤝', name: '함께 일하고 싶은 동료', file: 'dream-team.html', open: true, ready: true, activityType: 'writing',
                        desc: '드림팀을 꾸려 위기를 넘으며 함께 일하고 싶은 직업인의 태도를 찾고, 나의 동료 명함을 만들어요' },
  'decision-scale':   { area: '03', order: 1, std: '[9진로03-01]', stds: ['[9진로03-01]'], icon: '⚖️', name: '진로 결정 저울', file: 'decision-scale.html', open: true, ready: true, activityType: 'writing',
                        desc: '나의 결정 방식을 알고, 따질 것을 저울에 달아 잠정적으로 진로를 정해요' },

  'work-play':        { area: '01', order: 4, std: '[9진로01-04]', stds: ['[9진로01-04]'], icon: '🎢', name: '일과 여가 시소', file: 'work-play.html', open: true, ready: true, activityType: 'writing',
                        desc: '일과 여가를 나눠 보고, 여가가 주는 것을 찾고, 나의 일·여가 시소를 맞춰요' },
  'exp-link':         { area: '02', order: 4, std: '[9진로02-04]', stds: ['[9진로02-04]'], icon: '🔗', name: '경험 잇기', file: 'exp-link.html', open: true, ready: true, activityType: 'writing',
                        desc: '나의 경험을 마인드맵으로 모으고, 경험에서 찾은 것을 진로와 이어요' },

  'path-map':         { area: '03', order: 2, std: '[9진로03-02]', stds: ['[9진로03-02]'], icon: '🗺️', name: '나의 진로 경로 지도', file: 'path-map.html', open: true, ready: true, activityType: 'writing',
                        desc: '관심 분야에서 우선 경로와 대안 경로를 함께 그리고, 갈아탈 때를 정해요' },
  'study-plan':       { area: '03', order: 3, std: '[9진로03-03]', stds: ['[9진로03-03]'], icon: '📚', name: '진로 학습 계획표', file: 'study-plan.html', open: true, ready: true, activityType: 'writing',
                        desc: '진로와 과목을 잇고, 효과 있는 학습 방법으로 일주일 계획을 세워 실천해요' },
  'after-grad':       { area: '03', order: 4, std: '[9진로03-04]', stds: ['[9진로03-04]'], icon: '🎓', name: '졸업 뒤 첫걸음', file: 'after-grad.html', open: true, ready: true, activityType: 'writing',
                        desc: '졸업 뒤 시기별 목표를 그리고, 자기 관리 미션과 21일 습관 챌린지를 해요' },

  'job-day':          { area: '01', order: 1, std: '[9진로01-01]', stds: ['[9진로01-01]'], icon: '🎙️', name: '직업인의 하루', file: 'job-day.html', open: true, ready: true, activityType: 'writing',
                        desc: '여러 직업인의 하루를 따라가며 흥미·적성·가치관을 찾고, 만나 보고 싶은 직업인 인터뷰를 준비해요' },
  'my-traits':        { area: '01', order: 2, std: '[9진로01-02]', stds: ['[9진로01-02]'], icon: '🔍', name: '나의 진로 특성 찾기', file: 'my-traits.html', open: true, ready: true, activityType: 'writing',
                        desc: '경험 거울·능력 거울(친구의 눈)·가치 경매로 나의 진로 특성 카드를 만들어요' },
  'info-detective':   { area: '02', order: 3, std: '[9진로02-03]', stds: ['[9진로02-03]'], icon: '🕵️', name: '진로 정보 탐정', file: 'info-detective.html', open: true, ready: true, activityType: 'writing',
                        desc: '정보 찾는 방법을 익히고, 믿을 만한 정보와 광고·과장을 가려낸 뒤 조사 노트를 써요' },
  'high-school':      { area: '02', order: 5, std: '[9진로02-05]', stds: ['[9진로02-05]'], icon: '🏫', name: '고등학교 탐험', file: 'high-school.html', open: true, ready: true, activityType: 'writing',
                        desc: '고등학교 유형을 살펴보고, 고교학점제 모의 시간표를 짜고, 나에게 맞는 학교를 찾아요 (2026년 기준)' },

  /* ── 모으는 도구 ── */
  'passport':         { area: '', tool: true, order: 99, std: '', stds: [], icon: '🛂', name: '나의 진로 여권', file: 'passport.html', open: true, ready: true, activityType: 'project',
                        desc: '활동마다 받은 도장이 한 권에 모이는 나의 진로 포트폴리오' },

  /* ── 준비 중 (성취기준마다 하나씩) ── */
};

// 공통 교실 모듈 studentLink() 가 읽는 앱 파일 표 (만든 앱만)
window.EAIM_PLATFORM = 'career';
window.EAIM_APP_FILES = Object.fromEntries(Object.entries(window.CAREER_APPS).filter(([, v]) => v.ready).map(([k, v]) => [k, v.file]));
