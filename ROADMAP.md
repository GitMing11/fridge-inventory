# 🗺️ Roadmap

## Phase 1: 사용자 기반 및 데이터 구조 강화 (User & Data)

- [ ] **사용자 인증 (Authentication)**
  - [ ] NextAuth.js 도입 (Google, Kakao 소셜 로그인)
  - [ ] `User` 모델 추가 및 `Ingredient`와 1:N 관계 설정
- [ ] **그룹(가족) 공유 기능**
  - [ ] 하나의 냉장고를 여러 계정이 공유하는 기능

## Phase 2: 입력 편의성 개선 (Smart Input)

- [ ] **음성 입력 (STT)**
  - [ ] "계란 10개 2주 뒤 만료" 음성 명령으로 재료 추가

## Phase 3: 지능형 알림 및 활용 (Intelligence)

- [ ] **유통기한 임박 알림**
  - [ ] D-3, D-1 시점에 이메일 또는 웹 푸시(Web Push) 알림 발송
- [ ] **쇼핑 리스트 자동 생성**
  - [ ] 자주 사용하는 재료가 떨어지거나 폐기될 때 '장보기 목록'에 자동 추가

---

# 🗺️ UI/UX Improvement Roadmap

## 1. 시각적 계층 구조 및 피드백 (Visual Hierarchy)

- [ ] **신선도 게이지 (Freshness Bar)**
  - [ ] 기존 D-Day Badge를 보완하는 직관적인 Progress Bar 추가.
  - [ ] 리스트 아이템 배경 또는 하단에 상태별 그라데이션(초록 → 노랑 → 빨강) 적용.
- [ ] **카테고리 시각화 (Icons & Colors)**

  - [ ] `Category` 모델에 `icon` 및 `color` 필드 추가.
  - [ ] 리스트에서 텍스트 대신 이모지(🥬, 🥩, 🥛 등)를 크게 배치하여 가독성 향상.

  ## 2. 모바일 친화적 인터랙션 (Mobile-First UX)

- [ ] **스와이프 액션 (Swipe Gestures)**
  - [ ] 재료 리스트 아이템에 스와이프 인터랙션 적용 (`react-swipeable-list` 활용).
  - [ ] 왼쪽 스와이프: **소비(Eaten)** / 오른쪽 스와이프: **폐기(Discarded)** 또는 **수정**.
- [ ] **빠른 수량 조절 (Quick Quantity Controls)**
  - [ ] `ConsumeModal` 내 타이핑 입력을 대체하는 원터치 버튼 구현.
  - [ ] 증감 버튼(`-1`, `+1`) 및 비율 칩(`25%`, `50%`, `전부`) 추가.
