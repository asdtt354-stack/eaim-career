# EAIM 진로 (eaim-career)

2022 개정 중학교 선택 교과 「진로와 직업」(교육부 고시 제2022-33호 [별책 18]) 성취기준 14개와
창의적 체험활동 진로 활동([별책 40])으로 만드는 EAIM 진로 플랫폼. v1.8 (2026-10-02)

## 앱 (모두 AI 없음 · 공개 연습 · 수업 QR이면 선생님께 내기)
| 앱 | 파일 | 성취기준 | 규모 |
|---|---|---|---|
| 🎙️ 직업인의 하루 | job-day.html | [9진로01-01] | 1차시 |
| 🔍 나의 진로 특성 찾기 | my-traits.html | [9진로01-02] | 1차시 |
| 🕵️ 진로 정보 탐정 | info-detective.html | [9진로02-03] | 1차시 |
| 🏫 고등학교 탐험 | high-school.html | [9진로02-05] | 1차시 (2026년 기준 정보) |
| 🎵 진로 주제가 작사실 | theme-song.html | [9진로01-02] + 음악 | 1차시 — 가사를 연주실 노래 작곡실로(#lyrics=) |
| 🎤 직업인 인터뷰 낭독극 | interview-play.html | [9진로01-01]·[9진로02-03] + 음악·연극 | 2차시 — 대본을 뮤지컬 메이커 음악낭독극으로(#reading=) |
| 🌏 다문화 성장 프로젝트 | multi-growth.html | [9진로01-02]·[01-01]·[02-06]·[03-02] | 4차시 |
| 🤝 함께 일하고 싶은 동료 | dream-team.html | [9진로01-03] | 1차시 |
| 🎢 일과 여가 시소 | work-play.html | [9진로01-04] | 1차시 |
| 🃏 직업 세계 변화 카드 게임 | job-change-cards.html | [9진로02-01]·[02-02] | 1차시 · 게임 |
| 🎲 진로 경로 보드게임 | path-board.html | [9진로02-02] | 1차시 · 게임(1~4명) |
| 🔗 경험 잇기 | exp-link.html | [9진로02-04] | 1차시 |
| 💡 창업가 정신 탐험대 | entre-explorer.html | [9진로02-06] | 1차시 |
| 🎪 축제 부스 창업 게임 | booth-startup.html | [9진로02-06] | 1차시 · 게임 |
| ⚖️ 진로 결정 저울 | decision-scale.html | [9진로03-01] | 1차시 |
| 🗺️ 나의 진로 경로 지도 | path-map.html | [9진로03-02] | 1차시 |
| 📚 진로 학습 계획표 | study-plan.html | [9진로03-03] | 1차시(+일주일 실천) |
| 🎓 졸업 뒤 첫걸음 | after-grad.html | [9진로03-04] | 1차시(+21일 습관) |

성취기준 14개 모두 앱이 있음(v1.4). 고등학교 탐험의 고교 유형·고교학점제 정보는 해마다 확인해 high-school-data.js 를 고친다.

## 🛂 나의 진로 여권 (passport.html)
앱마다 "🛂 여권에 도장" 단추(CU.stampButton) — 결과가 이 기기 localStorage `eaim_career_passport` 에 모임. 수업에서 선생님께 내면 저절로 도장(career-ui.js 가 CareerClass.submit 을 감쌈). 여권 화면: 영역별 도장·내용 보기·진로 선언문·인쇄·파일 저장/불러오기(합치기)·지우기·선생님께 여권 내기.

## 📄 A4 활동지 (worksheet/)
앱 18개마다 활동지. 공통 엔진 worksheet/ws.js·ws.css(에임 도덕 활동지 엔진을 옮김) — 화면에서 쓰기·인쇄(빈 칸은 줄 칸)·Word(.doc)·선생님용 풀이·빈 활동지로. 문장은 앱 자료 파일을 그대로 읽고, 머리의 탐구 질문·학습 목표·스스로 돌아보기는 curriculum-career.js·lessonplan-data.js 에서.

## 파일
- index.html 첫 화면(영역 → 성취기준 → 앱) · teacher.html 선생님 페이지(수업 방·QR·결과물·답장·CSV·게임 점수)
- guide.html 사용 가이드(공통규칙 9-1) · eaim-career-lessonplan.html 지도안
- curriculum-career.js 교육과정 원문 · lessonplan-data.js 앱 단계(지도안·가이드가 읽음) · activities.json 활동 목록
- career-apps.js 앱 표 · career-class.js 교실 연결(도덕 moral-class.js 를 옮김 + saveGame) · career-ui.js 화면 도우미(쉬운 말·읽어 주기) · career.css
- shared/ 공통 교실 모듈 v1.0 사본(기준본: 사회·역사) — 고치지 않음
- 앱마다 *-data.js 자료 파일

## 설치(아이콘)
career.webmanifest · career-sw.js(네트워크 먼저, teacher.html·수업 코드 주소는 저장 안 함) · career-icon-192/512.png · career-icon-maskable-512.png · apple-touch-icon.png · favicon.png

## 배포
배포 주소 https://eaim-career.vercel.app → Firebase 콘솔 Authentication 승인된 도메인에 배포 주소 추가.
Firestore 경로: teachers/{uid}/rooms/{roomId} (platform:'career') 아래 students · submissions · gameResults — 새 컬렉션 없음.

## 다른 EAIM 앱으로 넘기기 (주소 해시 — 서버를 거치지 않음)
- 진로 주제가 → 연주실 노래 작곡실 `song.html#lyrics=` base64url(JSON {v:1,t,l,from})
- 직업인 인터뷰 낭독극 → 뮤지컬 메이커 `maker.html#reading=` base64url(JSON {v:1,from,app,d:{음악낭독극 자료}}) — 메이커는 이 기기에 14일 맡겨 두고 학생 화면에서 "📥 불러오기". 선생님 학생 주소(?role=student&teacher=…)를 붙여 넣으면 그 수업으로 감
- 받는 쪽이 아직 못 읽으면: 복사한 내용을 붙여 넣기
