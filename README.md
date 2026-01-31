# Fridge Inventory (냉장고 재료 관리)

Fridge Inventory는 냉장고 속 식재료의 **입고부터 소비, 폐기까지의 전 과정을 추적**하는 웹 애플리케이션입니다. 단순한 목록 관리를 넘어, 유통기한 임박 알림과 부분 소비(소분) 기능을 통해 식재료 낭비를 최소화하는 데 초점을 맞췄습니다.

## ✨ Key Features (주요 기능)

### 1. 📊 스마트한 재료 관리 (Inventory Management)

- **직관적인 대시보드:** 전체 재료 수, 유통기한 임박(3일 이내), 만료된 재료를 한눈에 파악할 수 있는 통계 카드를 제공합니다.
- **부분 소비 기능:** 재료를 한 번에 다 쓰지 않아도 괜찮습니다. 사용한 양만큼만 차감하고 남은 수량을 자동으로 계산합니다.
- **상태 시각화:** 유통기한 D-Day 배지를 통해 우선적으로 소비해야 할 재료를 강조합니다.

### 2. 📝 소비/폐기 히스토리 (History Tracking)

- **기록 관리:** 재료가 '먹어서(eaten)' 사라진 건지, '상해서 버린(discarded)' 건지 상태를 기록합니다.
- **데이터 축적:** 언제 어떤 재료를 구매하고 소비했는지 히스토리 페이지에서 모아볼 수 있어 소비 습관을 파악할 수 있습니다.

### 3. 🔐 사용자 및 그룹 관리 (Auth & Groups)

- **개인화된 냉장고:** 로그인 기반으로 나만의 냉장고 인벤토리를 관리할 수 있습니다.
- **그룹 공유 (준비 중):** 가족이나 룸메이트와 함께 냉장고를 공유하고 관리할 수 있는 그룹 기능을 지원합니다.

### 4. ⚡ 편의 기능 (Utilities)

- **카테고리 커스터마이징:** 아이콘과 색상을 포함하여 자유롭게 카테고리를 추가하고 시각적으로 관리할 수 있습니다.
- **일괄 처리:** 여러 재료를 선택해 한 번에 소비하거나 폐기 처리할 수 있습니다.
- **검색 및 필터:** 이름 검색, 카테고리별 필터링, 다양한 정렬 옵션(유통기한순, 구매일순 등)을 지원합니다.

---

## 🛠 Tech Stack

| 분류          | 기술 스택                                                                                                                                                                                                             |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js) (App Router)                                                                                                                 |
| **Language**  | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)                                                                                                       |
| **Database**  | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) + ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) |
| **Auth**      | ![NextAuth.js](<https://img.shields.io/badge/Auth.js(NextAuth)-black?style=flat-square&logo=auth0>)                                                                                                                   |
| **Styling**   | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)                                                                                              |
| **State**     | React Hooks & Server Actions                                                                                                                                                                                          |

## 🛠 Installation & Setup

## 💻 Getting Started

이 프로젝트를 로컬 환경에서 실행하기 위한 방법입니다.

### 1. Prerequisites

- Node.js (v18 이상 권장)
- MySQL Database

### 2. Installation

패키지를 설치합니다.

```bash
npm install
```

### 3. Environment Setup (.env)

프로젝트 루트 경로에 .env 파일을 생성하고 데이터베이스 연결 정보를 입력해야 합니다.

```Bash
# .env 파일 생성 예시
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

### 4. Database Setup

Prisma를 사용하여 DB 스키마를 동기화하고 클라이언트를 생성합니다.

```Bash
# Prisma Client 코드 생성
npx prisma generate

# DB 마이그레이션 (스키마 적용)
npx prisma db push

# (선택 사항) 데이터 확인을 위한 Prisma Studio 실행
npx prisma studio
```

### 5. Run Development Server

개발 서버를 실행합니다.

```Bash
npm run dev
```
