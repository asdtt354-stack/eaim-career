# EAIM 진로 (eaim-career)

2022 개정 중학교 선택 교과 「진로와 직업」(교육부 고시 제2022-33호 [별책 18]) 성취기준 14개와
창의적 체험활동 진로 활동([별책 40])으로 만드는 EAIM 진로 플랫폼. v1.0 (2026-10-02)

## 앱 (모두 AI 없음 · 공개 연습 · 수업 QR이면 선생님께 내기)
| 앱 | 파일 | 성취기준 | 규모 |
|---|---|---|---|
| 💡 창업가 정신 탐험대 | entre-explorer.html | [9진로02-06] | 1차시 |
| 🎪 축제 부스 창업 게임 | booth-startup.html | [9진로02-06] | 1차시 · 게임 |
| 🃏 직업 세계 변화 카드 게임 | job-change-cards.html | [9진로02-01]·[02-02] | 1차시 · 게임 |
| 🎲 진로 경로 보드게임 | path-board.html | [9진로02-02] | 1차시 · 게임(1~4명) |
| 🌏 다문화 성장 프로젝트 | multi-growth.html | [9진로01-02]·[01-01]·[02-06]·[03-02] | 4차시 |

나머지 성취기준 앱은 career-apps.js 에 ready:false 로 자리만 있음(첫 화면 "준비 중").

## 파일
- index.html 첫 화면(영역 → 성취기준 → 앱) · teacher.html 선생님 페이지(수업 방·QR·결과물·답장·CSV·게임 점수)
- guide.html 사용 가이드(공통규칙 9-1) · eaim-career-lessonplan.html 지도안
- curriculum-career.js 교육과정 원문 · lessonplan-data.js 앱 단계(지도안·가이드가 읽음) · activities.json 활동 목록
- career-apps.js 앱 표 · career-class.js 교실 연결(도덕 moral-class.js 를 옮김 + saveGame) · career-ui.js 화면 도우미(쉬운 말·읽어 주기) · career.css
- shared/ 공통 교실 모듈 v1.0 사본(기준본: 사회·역사) — 고치지 않음
- 앱마다 *-data.js 자료 파일

## 배포
Vercel 새 프로젝트 → Firebase 콘솔 Authentication 승인된 도메인에 배포 주소 추가.
Firestore 경로: teachers/{uid}/rooms/{roomId} (platform:'career') 아래 students · submissions · gameResults — 새 컬렉션 없음.
