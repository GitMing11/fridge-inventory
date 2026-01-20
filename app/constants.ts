// app/constants.ts

export const CATEGORY_COLORS = {
  // 1. 무채색/뉴트럴 (기본, 뿌리채소, 버섯)
  slate:   'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
  stone:   'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200',
  gray:    'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200', // 하위 호환용

  // 2. 붉은/난색 계열 (고기, 과일, 빵, 구운요리)
  red:     'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
  orange:  'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200',
  amber:   'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200',
  yellow:  'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200',
  
  // 3. 녹색 계열 (채소, 허브)
  lime:    'bg-lime-100 text-lime-700 border-lime-200 hover:bg-lime-200',
  green:   'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200',
  teal:    'bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200',
  
  // 4. 푸른/보라 계열 (물, 해산물, 냉동, 음료, 디저트)
  cyan:    'bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200',
  sky:     'bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-200',
  blue:    'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
  indigo:  'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200',
  violet:  'bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200',
  purple:  'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-200',
  pink:    'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200',
};

// 선택지 팔레트 (6열 그리드 기준 18개 색상)
export const COLOR_PALETTE = [
  // Row 1: 무채색 ~ 난색
  { key: 'slate',   class: 'bg-slate-400' },   // 기본/공산품
  { key: 'stone',   class: 'bg-stone-400' },   // 버섯/감자/뿌리
  { key: 'red',     class: 'bg-red-400' },     // 육류/사과/딸기
  { key: 'orange',  class: 'bg-orange-400' },  // 오렌지/당근
  { key: 'amber',   class: 'bg-amber-400' },   // 빵/곡물/치즈 [New]
  { key: 'yellow',  class: 'bg-yellow-400' },  // 바나나/옥수수

  // Row 2: 녹색 ~ 푸른색
  { key: 'lime',    class: 'bg-lime-400' },    // 라임/상큼한 과일
  { key: 'green',   class: 'bg-green-400' },   // 잎채소/대파
  { key: 'emerald', class: 'bg-emerald-400' }, // 짙은 녹색 채소 [New]
  { key: 'teal',    class: 'bg-teal-400' },    // 민트/독특한 허브
  { key: 'cyan',    class: 'bg-cyan-400' },    // 냉동식품/탄산
  { key: 'sky',     class: 'bg-sky-400' },     // 물/얼음 [New]

  // Row 3: 푸른색 ~ 보라색
  { key: 'blue',    class: 'bg-blue-400' },    // 생선/해산물
  { key: 'indigo',  class: 'bg-indigo-400' },  // 깊은 바다/음료
  { key: 'violet',  class: 'bg-violet-400' },  // 가지/포도 [New]
  { key: 'purple',  class: 'bg-purple-400' },  // 적양배추/고구마
  { key: 'fuchsia', class: 'bg-fuchsia-400' }, // 잼/소스/젤리 [New]
  { key: 'pink',    class: 'bg-pink-400' },    // 햄/소시지/디저트
];

export const DEFAULT_ICONS = [
  // 1. 신선 식품 (채소/과일)
  '🥬', '🥦', '🥕', '🧅', '🥔', '🌽', '🍄', // 채소류
  '🍎', '🍌', '🍇', '🍓', '🍋', '🍑', '🍅', // 과일류
  
  // 2. 단백질 (고기/해산물/알/유제품)
  '🥩', '🥓', '🍗', '🍖', // 육류
  '🐟', '🦐', '🦑',       // 해산물
  '🥚', '🥛', '🧀', '🧈', // 유제품 및 알
  
  // 3. 가공식품 및 식사
  '🍚', '🍞', '🥪', '🍜', '🍝', '🍕', '🥟', // 주식/간편식
  '🥫', '🌭', '🍱', // 캔/가공
  
  // 4. 간식 및 디저트
  '🍫', '🍪', '🍩', '🍦', '🍰', 
  
  // 5. 냉동 및 얼음
  '❄️', '🧊',
  
  // 6. 음료 및 주류
  '💧', '🥤', '☕', '🍺', '🍷', 
  
  // 7. 양념 및 기타
  '🧂', '🍯', '🥢', '📦', '💊'
];