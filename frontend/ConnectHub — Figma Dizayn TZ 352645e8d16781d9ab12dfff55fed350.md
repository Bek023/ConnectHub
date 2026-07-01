# ConnectHub — Figma Dizayn TZ

# 🎨 ConnectHub — Figma Dizayner uchun To'liq Texnik Zadaniya

> Bu hujjat Figma dizayner uchun ConnectHub ilovasini loyihalash bo'yicha to'liq qo'llanma. Web va Mobile (Flutter) uchun barcha ekranlar, dizayn tizimi, animatsiyalar, ranglar, ikonlar va komponentlar shu yerda.
> 

---

# 1. 🖼️ Loyiha Umumiy Ko'rinishi

**Platforma:** Web (Desktop/Tablet) + Mobile (iOS & Android — Flutter)

**Dizayn yo'nalishi:** Modern, Clean, Friendly — Discord + Telegram + Clubhouse aralashmasi

**Maqsad foydalanuvchi:** 18–35 yoshli, texnologiyaga oid, maqsadga yo'naltirilgan odamlar

**Figma fayl tuzilmasi:**

```jsx
📁 ConnectHub Design System
   ├── 🎨 Design Tokens (Colors, Typography, Spacing)
   ├── 🧩 Components Library
   ├── 🔐 Lock Screen (L1–L6 + all variants)
   ├── 📱 Mobile Screens (375×812)
   ├── 🖥️ Web Screens (1440×900)
   ├── 🎬 Animations & Micro-interactions
   └── 📐 Prototype Flows
```

---

# 2. 🎨 Rang Tizimi (Color System)

## Asosiy Ranglar (Brand Colors)

| Nomi | HEX | RGB | Ishlatilish |
| --- | --- | --- | --- |
| **Primary** | `#6C63FF` | rgb(108, 99, 255) | Tugmalar, active states, link |
| **Primary Dark** | `#4B44CC` | rgb(75, 68, 204) | Hover, pressed state |
| **Primary Light** | `#A59EFF` | rgb(165, 158, 255) | Subtle accent, icon tint |
| **Primary Pale** | `#EEF0FF` | rgb(238, 240, 255) | Background chip, badge |

## Ikkilamchi Ranglar (Secondary)

| Nomi | HEX | Ishlatilish |
| --- | --- | --- |
| **Accent Green** | `#22C55E` | Online status, success |
| **Accent Orange** | `#F97316` | Warning, notification badge |
| **Accent Pink** | `#EC4899` | Love reaction, highlight |
| **Accent Teal** | `#14B8A6` | Goals tag, verified badge |

## Neytral Ranglar (Neutral)

| Token nomi | HEX | Ishlatilish |
| --- | --- | --- |
| `neutral-950` | `#0A0A0F` | Eng qorong'u fon |
| `neutral-900` | `#111118` | Dark mode asosiy fon |
| `neutral-800` | `#1C1C28` | Card, sidebar dark |
| `neutral-700` | `#2D2D3F` | Input dark, border |
| `neutral-600` | `#4A4A65` | Placeholder, disabled |
| `neutral-400` | `#9494AD` | Secondary text |
| `neutral-200` | `#E2E2EE` | Divider, light border |
| `neutral-100` | `#F4F4FA` | Light mode bg |
| `neutral-50` | `#FAFAFF` | Page background light |
| `white` | `#FFFFFF` | Card, modal bg |

## Semantik Ranglar

| Token | HEX | Holat |
| --- | --- | --- |
| `success` | `#16A34A` | Muvaffaqiyat |
| `error` | `#DC2626` | Xato |
| `warning` | `#D97706` | Ogohlantirish |
| `info` | `#2563EB` | Ma'lumot |

## Tema Rejimi

**Light Mode:**

- Background: `#FAFAFF`
- Surface: `#FFFFFF`
- Text Primary: `#111118`
- Text Secondary: `#4A4A65`
- Border: `#E2E2EE`

**Dark Mode (Default):**

- Background: `#0A0A0F`
- Surface: `#1C1C28`
- Text Primary: `#FFFFFF`
- Text Secondary: `#9494AD`
- Border: `#2D2D3F`

> ⚠️ Dark mode **asosiy** tema, light mode ikkilamchi. Barcha ekranlar avval dark mode'da dizayn qilinadi.
> 

---

# 3. ✏️ Tipografiya (Typography)

## Fontlar

| Qo'llanilish | Font | Og'irlik |
| --- | --- | --- |
| **Sarlavhalar** | `Plus Jakarta Sans` | 700, 600 |
| **Asosiy matn** | `Inter` | 400, 500 |
| **Kod / Monospace** | `JetBrains Mono` | 400 |

## Type Scale

| Token | Size | Line Height | Weight | Ishlatilish |
| --- | --- | --- | --- | --- |
| `display-xl` | 48px | 56px | 700 | Hero sarlavha |
| `display-lg` | 36px | 44px | 700 | Page title |
| `heading-1` | 28px | 36px | 700 | Section title |
| `heading-2` | 22px | 30px | 600 | Card title |
| `heading-3` | 18px | 26px | 600 | Subsection |
| `body-lg` | 16px | 24px | 400 | Asosiy matn |
| `body-md` | 14px | 20px | 400 | Chat matn |
| `body-sm` | 12px | 18px | 400 | Caption, meta |
| `label-lg` | 14px | 20px | 500 | Tugma, label |
| `label-sm` | 12px | 16px | 500 | Badge, chip |
| `mono` | 13px | 20px | 400 | Kod |

---

# 4. 📐 Spacing va Grid Tizimi

## Spacing Scale (8px asosida)

| Token | Qiymat | Ishlatilish |
| --- | --- | --- |
| `space-1` | 4px | Micro gap |
| `space-2` | 8px | Element ichki padding |
| `space-3` | 12px | Komponent gap |
| `space-4` | 16px | Card padding |
| `space-5` | 20px | Section gap |
| `space-6` | 24px | Card gap |
| `space-8` | 32px | Section padding |
| `space-10` | 40px | Large padding |
| `space-12` | 48px | Page padding |
| `space-16` | 64px | Hero padding |

## Border Radius

| Token | Qiymat | Ishlatilish |
| --- | --- | --- |
| `radius-sm` | 6px | Input, small card |
| `radius-md` | 10px | Card, modal |
| `radius-lg` | 16px | Bottom sheet, large card |
| `radius-xl` | 24px | Floating panel |
| `radius-full` | 9999px | Avatar, badge, pill button |

## Mobile Grid

- Ustunlar: **4**
- Margin: **16px**
- Gutter: **12px**
- Frame: **375 × 812px** (iPhone 14)

## Web Grid

- Ustunlar: **12**
- Margin: **80px**
- Gutter: **24px**
- Frame: **1440 × 900px**

---

# 5. 🧩 Komponentlar Kutubxonasi

## Tugmalar (Buttons)

```
[Primary Button]    — bg: Primary, text: White
[Secondary Button]  — border: Primary, text: Primary
[Ghost Button]      — transparent, text: Primary
[Danger Button]     — bg: Error, text: White
[Icon Button]       — faqat icon, radius: full

Holatlari: Default → Hover → Active → Disabled → Loading
O'lchamlar: SM (32px) | MD (40px) | LG (48px)
```

## Input Maydonlar

```
[Text Input]       — label, placeholder, helper text, error state
[Search Input]     — search icon chap tomonda, clear button
[Textarea]         — auto-resize, char counter
[OTP Input]        — 6 ta alohida box
[File Upload]      — drag & drop zone

Holatlari: Empty → Focused → Filled → Error → Disabled
```

## Kartalar (Cards)

```
[Goal Card]         — icon, title, member count, join button
[Group Card]        — avatar, name, members, last activity
[Channel Card]      — cover, name, subscriber count, subscribe btn
[Post Card]         — author, time, content, media, reactions
[User Card]         — avatar, name, bio, goals badges
[Message Bubble]    — sent (right, purple) | received (left, dark)
```

## Navigatsiya

```
[Bottom Navigation]  — 5 tab: Feed, Goals, Chat, Explore, Profile
[Top App Bar]        — back button, title, action icons
[Sidebar (Web)]      — logo, nav items, user section
[Tab Bar]            — horizontal tabs with indicator
[Breadcrumb]         — web uchun
```

## Overlay Komponentlar

```
[Modal]             — centered, backdrop blur
[Bottom Sheet]      — swipeable, drag handle
[Toast/Snackbar]    — top yoki bottom, 4 tur (success/error/warning/info)
[Tooltip]           — hover'da ko'rinadigan
[Context Menu]      — long press'da chiqadigan
[Dropdown]          — select, filter
```

## Media Komponentlar

```
[Avatar]            — sizes: XS(24) SM(32) MD(40) LG(56) XL(80)
                    — with status dot (online/offline/busy)
[Avatar Group]      — stacked avatars (+N more)
[Image Preview]     — rounded corners, aspect ratio fixed
[Video Thumbnail]   — play button overlay, duration badge
[Audio Player]      — waveform visualization, play/pause, timer
[File Card]         — icon, name, size, download button
```

## Chat Komponentlar

```
[Message Bubble - Text]     — sender avatar, name, time, status
[Message Bubble - Image]    — preview thumbnail, open on tap
[Message Bubble - Video]    — thumbnail + duration
[Message Bubble - Voice]    — waveform, timer, play button
[Message Bubble - File]     — icon, name, size
[Message Bubble - Reply]    — quoted message above
[Reaction Bar]              — emoji picker row
[Typing Indicator]          — 3 animated dots
[Date Divider]              — centered date chip
[Unread Badge]              — floating pill
[Message Input Bar]         — attach, emoji, voice, send
```

## Qo'ng'iroq Komponentlar

```
[Incoming Call Screen]  — blur bg, avatar, accept/reject buttons
[Audio Call Screen]     — avatar, mute/speaker/end buttons
[Video Call Screen]     — full-screen video, controls overlay
[Video Tile]            — user video, name badge, mute indicator
[Call Controls Bar]     — mic, cam, speaker, participants, end
[Participants Grid]     — 2x2, 3x3 grid tiling
```

---

# 6. 🔐 Lock Screen — To'liq Dizayn Spesifikatsiyasi

> Lock Screen **faqat dark mode**da bo'ladi — light mode varianti yo'q. Bu xavfsizlik ekrani bo'lib, barcha hollarda bir xil ko'rinadi.
> 

---

## Komponentlar (Lock Screen uchun)

```
[PIN Dot]          — bo'sh: border 2px neutral-600, filled: primary #6C63FF, error: #DC2626
[PIN Dot Row]      — 4 ta dot, 24px oraliq, shake animatsiyali
[Keypad Button]    — 72×72px, radius-full, neutral-800 fon
[Biometric Button] — 52×52px, radius-full, neutral-700 fon, primary icon
[Lockout Timer]    — display-lg, primary rang, monospace font
[Pulse Ring]       — avatar atrofida animated concentric rings
```

---

## Screen L1 — PIN Kirish Ekrani (Asosiy Lock Screen)

**Frame:** 375×812px | Fon: `#0A0A0F`

**Tuzilma (yuqoridan pastga):**

- **Status Bar** — vaqt chap, signal+battery o'ng, oq rang
- **Yuqori zona (satr 1):**
    - Markazda: ConnectHub logo, 40px balandlik, opacity 80%
    - Tag: `body-sm` + `neutral-400` — "ConnectHub qulflangan"
- **Avatar zona:**
    - Foydalanuvchi avatari — 64px, `radius-full`
    - Border: 2px solid `#6C63FF` (primary)
    - Display name — `heading-3`, oq
    - `body-sm` `neutral-400` — "PIN kiriting"
- **PIN Dots qatori:**
    - 4 ta doira, 16px diameter
    - **Bo'sh holat:** border 2px `neutral-600`, shaffof ichki
    - **To'ldirilgan:** `primary` (#6C63FF) to'liq fill
    - **Xato holati:** `error` (#DC2626) fill + shake 500ms
    - Dots orasidagi masofa: 24px
- **Xato xabari** (faqat noto'g'ri bo'lganda ko'rinadi):
    - `body-sm` `error` rang
    - Phosphor `warning-circle` icon 14px + "Noto'g'ri PIN. N urinish qoldi"
- **Klaviatura (pastki 50% ekran):**
    - 3×4 grid layout, har bir katak teng
    - Raqam tugmalar (1–9, 0): 72×72px, `radius-full`, fon `neutral-800`
    - Matn: `heading-2` (22px, 600), oq
    - **Chap pastki:** Biometrik icon (Touch ID yoki Face ID, 28px, primary) — biometrik mavjud bo'lganda
    - **O'rta pastki:** `0` raqami
    - **O'ng pastki:** Phosphor `backspace` icon, 24px, `neutral-400`
    - **Press holati:** scale 0.92, fon `neutral-700`, 100ms ease-in

**Figma Variants (8 ta):**

| Variant nomi | Tavsif |
| --- | --- |
| `L1/Empty` | 0 ta dot to'ldirilgan |
| `L1/Digit-1` | 1 ta dot filled |
| `L1/Digit-2` | 2 ta dot filled |
| `L1/Digit-3` | 3 ta dot filled |
| `L1/Digit-4` | 4 ta dot filled, loading spinner |
| `L1/Error` | Barcha dotlar qizil, xato matn |
| `L1/No-Biometric` | Biometrik tugma yo'q |
| `L1/With-Biometric` | Biometrik tugma aktiv |

---

## Screen L2 — Biometrik Lock Screen

**Frame:** 375×812px | Screen L1 bazasida

**Qo'shimcha elementlar:**

- **Biometrik tugma** (klaviatura chap pastki):
    - Touch ID qurilmada: Phosphor `fingerprint`, 28px, `primary`
    - Face ID qurilmada: Phosphor `scan-face`, 28px, `primary`
    - Fon: `neutral-700`, `radius-full`, 52×52px
    - Label: `label-sm` `neutral-400` — "Touch ID" yoki "Face ID"
- **Biometrik scanning holati:**
    - Avatar atrofida 3 ta kontsentrik pulsing ring
    - Ring 1: `primary` 40% opacity, 80px radius, 600ms expand+fade
    - Ring 2: `primary` 25% opacity, 96px radius, 800ms delay
    - Ring 3: `primary` 15% opacity, 112px radius, 1000ms delay
    - Avatar ostida: `body-sm` `neutral-400` — "Biometrik tekshirilmoqda..."
- **Biometrik muvaffaqiyat holati:**
    - Ringlar yashil (`#22C55E`) rangga o'tadi — 200ms crossfade
    - Avatar ustida yashil checkmark overlay (Phosphor `check-circle`, 32px)
    - Ekran 300ms keyin slide-up bilan yo'qoladi
- **Biometrik rad etildi:**
    - Ringlar to'xtaydi
    - Avatar 1x shake (200ms)
    - `body-sm` `error` — "Biometrik rad etildi. PIN kiriting"
    - PIN input avtomatik faollashadi

**Figma Variants (5 ta):**

| Variant nomi | Tavsif |
| --- | --- |
| `L2/Default` | Biometrik tugma aktiv, skanerlash kutilmoqda |
| `L2/Scanning` | Pulse ring animatsiyasi aktiv |
| `L2/Success` | Yashil ring + checkmark |
| `L2/Failed` | Xato holati, PIN ga o'tish |
| `L2/Unavailable` | Biometrik ishlamaydi, faqat PIN |

---

## Screen L3 — Lockout Ekrani (Bloklangan)

**Holat:** 5 marta noto'g'ri PIN → 5 daqiqa blok

**Frame:** 375×812px | Fon: `#0A0A0F`

**Tuzilma:**

- **Yuqori:** Logo (L1 bilan bir xil)
- **Markazda:**
    - Phosphor `lock-key` icon — 64px, `error` (#DC2626)
    - Sarlavha: `heading-1` oq — "Kirish vaqtincha bloklandi"
    - Tavsif: `body-md` `neutral-400` — "Juda ko'p noto'g'ri urinish"
    - **Countdown timer:** `display-lg` (36px, 700) `primary` — `04:59` format, monospace
        - Timer real vaqtda kamayadi
        - 0 ga yetganda PIN kiritish qayta yonadi
    - Qo'shimcha matn: `body-sm` `neutral-600` — "5 marta noto'g'ri PIN kiritildi"
- **Klaviatura:** Ko'rinadi lekin disabled — barcha tugmalar `neutral-900` fon, `neutral-700` matn
- **Pastki:** `body-sm` `neutral-600` — "Parolni unutdingizmi? Akkauntdan chiqib qayta kiring"

**Animatsiya:** Lock icon sekin pulse — scale 1.0 → 1.06 → 1.0, 2s loop ease-in-out

**Figma Variants (2 ta):**

| Variant nomi | Tavsif |
| --- | --- |
| `L3/Counting` | Timer ketmoqda |
| `L3/Done` | Timer 0:00, PIN yonmoqda |

---

## Screen L4 — PIN O'rnatish (Sozlamalar ichida)

**Kirish:** Sozlamalar → Xavfsizlik → PIN o'rnatish

**Step 1 — Yangi PIN:**

- **Step indicator:** `1 / 2`, progress bar 50%, `primary`
- Sarlavha: `heading-2` — "Yangi PIN o'rnating"
- Tavsif: `body-sm` `neutral-400` — "4 raqamli xavfsiz PIN kiriting"
- PIN dots (bo'sh)
- Klaviatura (biometrik tugmasiz)

**Step 2 — Tasdiqlang:**

- **Step indicator:** `2 / 2`, progress bar 100%
- Sarlavha: "PIN ni qayta kiriting"
- **Mos bo'lsa:** dots yashil → success toast → sozlamalarga qaytish
- **Mos bo'lmasa:** error shake + "PINlar mos kelmadi", step 1 ga qaytish

**Figma Variants (5 ta):**

| Variant nomi | Tavsif |
| --- | --- |
| `L4/Step1-Empty` | Birinchi PIN, bo'sh |
| `L4/Step1-Filled` | Birinchi PIN, to'ldirilgan |
| `L4/Step2-Empty` | Tasdiqlash, bo'sh |
| `L4/Step2-Match` | Mos keldi — yashil dots |
| `L4/Step2-Mismatch` | Mos kelmadi — xato |

---

## Screen L5 — Biometrik Yoqish Ekrani

**Kirish:** Sozlamalar → Xavfsizlik → Biometrik

**Tuzilma:**

- Phosphor `fingerprint` yoki `scan-face` icon — 80px, `primary`, markazda
- Sarlavha: `heading-2` — "Touch ID / Face ID"
- Tavsif: `body-md` `neutral-400` — "Ilovaga tezroq kirish uchun biometrik autentifikatsiya"
- **Toggle row:** `body-lg` oq "Biometrikni yoqish" + Toggle switch (primary rang)
- Toggle ON bosilganda → tizim native biometrik dialog
- Muvaffaqiyatli → Toggle ON holati, success toast
- **Ogohlantirish box:** `neutral-800` fon, `radius-md`, border `neutral-700`
    - Phosphor `info` icon 16px `neutral-400` + `body-sm` `neutral-400`
    - "Biometrik autentifikatsiya qurilmangizning xavfsizlik tizimiga bog'liq"

**Figma Variants (3 ta):**

| Variant nomi | Tavsif |
| --- | --- |
| `L5/Off` | Toggle o'chirilgan |
| `L5/On` | Toggle yoqilgan |
| `L5/Unavailable` | Qurilmada biometrik yo'q, disabled |

---

## Screen L6 — Task Switcher Overlay

**Holat:** Foydalanuvchi uy tugmasini bosib ilova background'ga o'tganda

**Tuzilma:**

- To'liq ekran fon: `#0A0A0F`
- Markazda: ConnectHub logo, 56px, opacity 60%
- Logo ostida: `body-sm` `neutral-600` — "ConnectHub"
- Boshqa hech narsa ko'rinmaydi (kontent yashirilgan)

**Maqsad:** Task switcher preview'da ilovaning ichki kontenti ko'rinmasin.

---

## Lock Screen Animatsiyalar Jadvali

| Element | Animatsiya | Davomiyligi | Easing |
| --- | --- | --- | --- |
| Lock Screen kirishi | Fade in `0→1`  • scale `1.05→1.0` | 300ms | ease-out |
| Lock Screen chiqishi | Fade out + slide up | 280ms | ease-in |
| PIN dot to'ldirilishi | Scale `0.8→1.2→1.0`  • color fill | 150ms | spring |
| Noto'g'ri PIN shake | X: `0→-10→10→-8→8→0` | 500ms | ease |
| Biometrik pulse ring | Scale `1.0→1.6`, opacity `0.4→0` | 1200ms | ease-out, loop |
| Lockout icon pulse | Scale `1.0→1.06→1.0` | 2000ms | ease-in-out, loop |
| Success checkmark draw | SVG stroke-dashoffset `100→0` | 400ms | ease-out |
| Klaviatura tugma press | Scale `1.0→0.92→1.0` | 150ms | spring |
| Countdown flip | Number flip (translateY + opacity) | 200ms | ease-in-out |

---

## Lock Screen Prototype Flow (Figma)

```
[App Background'da]
       ↓
[L6: Task Switcher Overlay]
       ↓ (foreground'ga qaytish)
[L1: PIN Kirish] ←──────────────────────────┐
       │                                    │
  [Biometrik mavjud?]                       │
       │ Ha                                 │
       ↓                                   │
[L2: Biometrik Screen]                      │
       │                                    │
  [Natija?]                                 │
  ┌────┴────┐                               │
  ↓         ↓                              │
[Muvaffaqiyat] [Xato → PIN ga qaytish] ────┘
  ↓
[App Ochiladi]

[5x noto'g'ri PIN]
       ↓
[L3: Lockout → Countdown]
       ↓ (timer tugaganda)
[L1: PIN Kirish]
```

---

## Lock Screen Checklist (Dizayner uchun)

- [ ]  L1 — 8 ta variant to'liq
- [ ]  L2 — 5 ta variant to'liq, pulse ring animatsiyali
- [ ]  L3 — 2 ta variant, countdown ko'rsatilgan
- [ ]  L4 — 5 ta variant, step indicator bilan
- [ ]  L5 — 3 ta variant, toggle switch bilan
- [ ]  L6 — Task switcher overlay
- [ ]  Barcha variantlar Auto Layout bilan
- [ ]  PIN dots komponent alohida yaratilgan (reusable)
- [ ]  Klaviatura komponent alohida (reusable)
- [ ]  Prototype flow ishlaydi (L1→L2→unlock)
- [ ]  Animatsiya davomiyliklari Figma motion'da belgilangan
- [ ]  Dark mode only — light mode varianti kerak emas

---

# 7. 📱 Mobile Ekranlar (Flutter — 375×812)

## 🔐 Onboarding Flow

### Screen 1 — Splash Screen

- Fon: `#0A0A0F` to'liq qora
- Markazda logo animatsiyasi (scale + fade in)
- Tagida loading indicator (thin line progress)
- Davomiyligi: 2.5 soniya

### Screen 2 — Welcome Slider (3 ta slide)

**Slide 1:** 'Maqsadingni top'

- Yuqori 60%: Lottie animatsiya — odamlar bir nuqtaga yig'ilmoqda
- Sarlavha: display-lg, white
- Tavsif: body-md, neutral-400
- Pastda: dot indicator + 'Keyingi' tugma

**Slide 2:** 'Guruhingni qur'

- Yuqori 60%: Lottie animatsiya — guruh suhbati
- Sarlavha + tavsif

**Slide 3:** 'Birgalikda o's'

- Yuqori 60%: Lottie animatsiya — o'sish grafigi
- 'Boshlash' primary tugma + 'Kirish' ghost tugma

### Screen 3 — Register

- Header: 'Ro'yxatdan o'ting'
- Email input
- Parol input (ko'rish tugmasi)
- Parolni tasdiqlash input
- Primary tugma: 'Davom etish'
- Divider: 'yoki'
- Social buttons: Google | Apple (icon + text, outlined)
- Footer: 'Akkauntim bor → Kirish'

### Screen 4 — Login

- Email + Parol inputs
- 'Parolni unutdim?' link (right aligned)
- Primary tugma: 'Kirish'
- Social login
- Footer: 'Akkaunt yo'qmi → Ro'yxatdan o'ting'

### Screen 5 — OTP Tasdiqlash

- Sarlavha + email manzil (bold)
- 6 ta OTP box (auto-focus o'tishi)
- Countdown timer: '02:00'
- 'Qayta yuborish' disabled (timeout'dan keyin active)
- Taymer tugaganda: shake animatsiya xato bo'lsa

### Screen 6 — Profil Sozlash

- Avatar upload (kamera icon ustida, tap to upload)
- Display name input
- Username input (@ prefix bilan)
- Bio textarea (max 150 char, counter)
- 'Keyingi' tugma

### Screen 7 — Maqsad Tanlash

- Sarlavha: 'Qaysi maqsadlarga qiziqasiz?'
- Grid: 2 ustun Goal Cards
- Har bir card: emoji icon + nomi + a'zolar soni
- Tanlanganda: primary border + check overlay
- Search bar yuqorida
- Pastda: tanlangan soni '3 ta tanlandi' + 'Davom' tugma

## 🏠 Asosiy Ekranlar

### Screen 8 — Feed (Bosh Sahifa)

- Top bar: Logo + notification bell + search icon
- Stories row: horizonal scroll, avatar + ring
- Section: 'Sizga tavsiya' — horizontal group cards
- Infinite scroll post lenta
- Bottom Navigation (5 tab)

### Screen 9 — Maqsadlar Ekrani

- Search bar (yuqorida)
- Filter chips: horizontal scroll (Hammasi, Sport, Til, Biznes, San'at...)
- Trend section: 3 ta horizontal card
- Grid: 2 ustun Goal Cards
- FAB: '+' maqsad yaratish

### Screen 10 — Maqsad Tafsiloti

- Cover image (header, collapsible)
- Goal nomi + icon + member count
- 'Qo'shilish' CTA button
- TabBar: Guruhlar | Kanallar | A'zolar
- Har bir tab kontent

### Screen 11 — Guruh Ro'yxati

- Header: Maqsad nomi
- Search
- Group cards (avatar, name, members, last message preview, time)
- 'Guruh yaratish' FAB

### Screen 12 — Guruh Ichki Ekrani

- Top bar: Group avatar + name + members count + call icon + more
- TabBar: Chat | Postlar | Media | A'zolar
- **Chat tab:** Message list + Input bar
- **Postlar tab:** Post feed
- **Media tab:** Grid gallery (rasmlar, videolar, fayllar — 3 tab)
- **A'zolar tab:** List (admin, moderator, member)

### Screen 13 — Chat Ekrani (Guruh)

- Top: avatar + name + online count
- Pinned message banner (swipeable)
- Message list:
    - Sana dividerlar
    - Turli turdagi bubble'lar
    - Reaction bar (long press'da)
- Input bar:
    - Attach icon (clip)
    - Text field (auto-expand)
    - Voice record button (hold)
    - Emoji button
    - Send button (matn bo'lganda)
- Reply preview (message ustida)
- Typing indicator

### Screen 14 — Kanal Ekrani

- Header: cover + name + subscriber count + Subscribe button
- Post lenta (faqat admin post qila oladi)
- Har bir post: views count, reactions, share
- Izoh button → bottom sheet

### Screen 15 — Post Yaratish

- Header: 'Post yaratish' + 'Chop etish'
- Qayerga: Group/Channel selector
- Media attach area (tap yoki drag)
- Text area
- Formatting toolbar (bold, italic, link)
- Preview toggle

## 📞 Qo'ng'iroq Ekranlar

### Screen 16 — Kiruvchi Qo'ng'iroq

- To'liq ekran: blur background (guruh avatari)
- Tepada: 'Kiruvchi audio qo'ng'iroq'
- Markazda: guruh avatar (large) + nomi
- Pastda: Rad etish (qizil, chapga swipe) | Qabul qilish (yashil, o'ngga swipe)
- Haptic feedback + ringtone

### Screen 17 — Audio Qo'ng'iroq (Aktiv)

- Dark background gradient
- Markazda: guruh avatar + 'Guruh nomi' + davomiyligi
- Ishtirokchilar avatarlari (stacked)
- Kontrol bar (pastda):
    - Mute (mic off)
    - Speaker
    - Participants
    - End Call (qizil)

### Screen 18 — Video Qo'ng'iroq (Aktiv)

- To'liq ekran: o'z video (asosiy)
- Pip (picture-in-picture): boshqa ishtirokchi
- Grid view toggle (2+ kishi bo'lganda)
- Kontrol overlay (auto-hide 3 soniyada):
    - Mic toggle
    - Camera toggle
    - Camera flip
    - Screen share
    - Participants
    - End Call

### Screen 19 — Participants Grid (Video)

- 2×2 tile layout (4 kishigacha)
- 3×3 tile layout (9 kishigacha)
- Har bir tile: video/avatar + ism + mute indicator
- Faol so'zlashuvchi highlight (primary border)

## 👤 Profil va Sozlamalar

### Screen 20 — Profil

- Header: cover + avatar (overlap) + edit button
- Ism, username, bio
- Stats row: Guruhlar | Kanallar | A'zolar
- Maqsadlar: horizontal scroll chips
- Postlar grid

### Screen 21 — Sozlamalar

- Profile section: avatar + name + 'Profilni tahrirlash'
- Grouped list:
    - Bildirishnomalar
    - Maxfiylik
    - Qorong'u/Yorug' tema toggle
    - Til tanlash
    - Yordam
    - Akkauntdan chiqish (danger)
    - Akkauntni o'chirish (danger)

### Screen 22 — Bildirishnomalar

- Filter tabs: Hammasi | Xabar | Taklif | Tizim
- Notification items: avatar + matn + vaqt + unread dot
- Group by sana

---

# 7. 🖥️ Web Ekranlar (1440×900)

### Web 1 — Landing Page

- Full-width hero: animated gradient bg + mockup
- Features section: 3 ustun cards
- Goals showcase: horizontal scroll
- CTA section
- Footer

### Web 2 — Auth (Modal)

- Centered modal (480px width)
- Split: Register | Login tabs
- Xuddi mobile bilan bir xil form

### Web 3 — Main Layout (Authenticated)

```
┌───────────────────────────────────────────────────┐
│  Left Sidebar (72px)  │  Main Content  │  Right   │
│  ───────────────────  │  ────────────  │  Panel   │
│  Logo                 │                │ (280px)  │
│  Feed                 │   Dynamic      │          │
│  Goals                │   Content      │  Members │
│  Groups               │                │  or Info │
│  Explore              │                │          │
│  ─────────────────    │                │          │
│  Avatar + Settings    │                │          │
└───────────────────────────────────────────────────┘
```

### Web 4 — Chat (Web)

- 3 panel: Channel list | Message area | Members
- Kengaytirilgan input toolbar
- Drag & drop file upload
- Markdown preview

### Web 5 — Video Call (Web)

- To'liq browser window
- Grid layout: 3×3 max
- Sidebar: chat panel (collapsible)
- Top bar: meeting name + timer
- Bottom bar: controls

---

# 8. 🎬 Animatsiyalar va Micro-interactions

## Sahifa O'tishlari (Page Transitions)

| Holat | Animatsiya | Davomiyligi |
| --- | --- | --- |
| Screen push (mobile) | Slide left (x: 100% → 0) | 300ms ease-out |
| Screen pop (back) | Slide right (x: 0 → 100%) | 250ms ease-in |
| Modal open | Scale up + fade (0.92 → 1.0, opacity 0→1) | 280ms spring |
| Modal close | Scale down + fade | 220ms ease-in |
| Bottom sheet open | Slide up (y: 100% → 0) | 320ms spring |
| Tab switch | Crossfade | 200ms ease |

## Tugma Animatsiyalari

| Holat | Animatsiya | Easing |
| --- | --- | --- |
| Hover | Scale 1.02, slight glow | 150ms ease |
| Press | Scale 0.96 | 100ms ease-in |
| Release | Scale 1.0 | 150ms spring |
| Loading | Spinner rotate + text fade | loop |
| Success | Scale bounce + checkmark draw | 400ms spring |

## Chat Animatsiyalari

| Element | Animatsiya | Davomiyligi |
| --- | --- | --- |
| Yangi xabar (kiruvchi) | Slide in bottom + fade | 250ms spring |
| Yangi xabar (yuborilgan) | Slide in right + fade | 200ms ease-out |
| Yozmoqda indikator | 3 dot sequential bounce | loop 600ms |
| Reaction qo'shish | Scale bounce (0 → 1.2 → 1.0) | 350ms spring |
| Xabar o'chirish | Fade out + height collapse | 300ms ease |
| Reply preview | Slide down + fade | 200ms ease |
| Voice waveform | Real-time amplitude bars | 60fps |

## Onboarding Animatsiyalari

| Element | Animatsiya |
| --- | --- |
| Splash logo | Scale (0.5→1.0) + opacity (0→1), spring |
| Slider transition | Horizontal slide + parallax bg |
| Dot indicator | Width morph (8px → 24px aktiv) |
| OTP box focus | Border scale + glow pulse |
| Goal card tanlash | Scale bounce + check icon draw |

## Navigation Animatsiyalari

| Element | Animatsiya |
| --- | --- |
| Bottom tab switch | Icon scale bounce + label fade in |
| Active tab indicator | Slide underline (x transition) |
| FAB press | Scale + shadow intensify |
| Notification badge | Pop in (scale 0→1), shake on new |

## Qo'ng'iroq Animatsiyalari

| Element | Animatsiya |
| --- | --- |
| Incoming call screen | Pulse ring around avatar (3x expand + fade) |
| Accept swipe | Green fill expand from button |
| Reject swipe | Red fill expand from button |
| End call | Scale down + fade out overlay |
| Mic mute | Icon cross draw animation |
| Speaking indicator | Border pulse (primary glow) |

## Yuklash Animatsiyalari

| Element | Animatsiya |
| --- | --- |
| Skeleton loader | Shimmer (gradient sweep, 1.5s loop) |
| Pull to refresh | Spinner + elastic overscroll |
| Image load | Blur → sharp (blur filter animate) |
| Progress bar | Width ease-out |
| Lottie (Onboarding) | JSON animation, 60fps |

## Easing Qiymatlari (Flutter'da)

```dart
// Asosiy easing
const standardEase = Curves.easeInOut;        // Ko'p holatlarda
const enterEase = Curves.easeOut;             // Kiruvchi elementlar
const exitEase = Curves.easeIn;               // Chiquvchi elementlar
const springEase = Curves.elasticOut;         // Bounce effektlar

// Davomiyliklar
const Duration ultraFast = Duration(ms: 100); // Micro
const Duration fast = Duration(ms: 200);      // Tugma, badge
const Duration medium = Duration(ms: 300);    // Modal, sheet
const Duration slow = Duration(ms: 500);      // Page transitions
const Duration verySlow = Duration(ms: 800);  // Onboarding
```

---

# 9. 🔷 Ikonlar (Icons)

## Icon Kutubxonasi

**Asosiy:** [Phosphor Icons](https://phosphoricons.com/) — Flutter paketi mavjud

**Zaxira:** Material Symbols (Flutter built-in)

## Icon Stili

- Variant: **Regular** (asosiy) + **Fill** (aktiv holatlar)
- O'lchami: 20px (body), 24px (nav), 28px (header)
- Rang: kontekstga qarab (neutral-400, primary, white)

## Ilovaga Kerakli Ikonlar

### Navigatsiya

```
home / home-fill          — Feed
target / target-fill      — Goals
chat-circle / chat-fill   — Chat
compass / compass-fill    — Explore
user / user-fill          — Profile
```

### Harakatlar

```
plus               — Yaratish
pencil-simple      — Tahrirlash
trash              — O'chirish
check              — Tasdiqlash
x                  — Yopish / Bekor
arrowLeft          — Orqaga
arrowRight         — Oldinga
upload             — Yuklash
download           — Yuklab olish
copy               — Nusxa olish
share-network      — Ulashish
bookmark           — Saqlash
flag               — Shikoyat
```

### Chat

```
paper-plane-right  — Yuborish
microphone         — Voice record
paper-clip         — Fayl biriktirish
smiley             — Emoji
image              — Rasm
video-camera       — Video
file               — Fayl
reply              — Javob berish
heart              — Like / reaction
thumb-up           — Upvote
dots-three         — Ko'proq
pin                — Pin
```

### Qo'ng'iroq

```
phone              — Audio call
video-camera       — Video call
phone-slash        — Tugatish
microphone-slash   — Mute
speaker-high       — Ovoz
camera-slash       — Cam off
screen-share       — Ekran ulash
users-three        — Ishtirokchilar
```

### Guruh/Kanal

```
users              — Guruh
megaphone          — Kanal
crown              — Admin
shield-check       — Moderator
star               — Featured
lock               — Private
globe              — Public
qr-code            — Invite
link               — Invite link
```

### Tizim

```
bell               — Bildirishnoma
gear               — Sozlamalar
magnifying-glass   — Qidirish
sign-out           — Chiqish
moon               — Dark mode
sun                — Light mode
translate          — Til
shield             — Maxfiylik
info               — Yordam
```

---

# 10. 🌫️ Elevation va Shadow Tizimi

| Level | CSS Shadow | Ishlatilish |
| --- | --- | --- |
| `elevation-0` | none | Flat cards |
| `elevation-1` | `0 1px 4px rgba(0,0,0,0.12)` | Input, small card |
| `elevation-2` | `0 4px 12px rgba(0,0,0,0.16)` | Card, dropdown |
| `elevation-3` | `0 8px 24px rgba(0,0,0,0.20)` | Modal, sidebar |
| `elevation-4` | `0 16px 48px rgba(0,0,0,0.28)` | Bottom sheet, popup |

**Dark mode'da:** shadow opacity 2x oshiriladi + subtle glow qo'shiladi.

---

# 11. 📲 Prototype Oqimlari (Figma)

## Flow 0 — Lock Screen

```jsx
[App foreground'ga keladi]
→ L1: PIN Screen
→ [Biometrik mavjud] → L2: Biometric Screen → [Muvaffaqiyat] → App
→ [5x xato] → L3: Lockout → [Timer tugaydi] → L1

[Sozlamalar]
→ L4: PIN O'rnatish (Step 1 → Step 2)
→ L5: Biometrik yoqish
```

## Flow 1 — Onboarding

```
Splash → Welcome Slide 1 → 2 → 3 → Register
→ OTP → Profil Sozlash → Maqsad Tanlash → Feed
```

## Flow 2 — Chat

```
Feed → Guruhlar → Guruh Ichki → Chat Tab
→ [Xabar yozish] → [Fayl yuborish] → [Voice record]
→ [Long press: Reaction/Reply/Delete]
```

## Flow 3 — Qo'ng'iroq

```
Guruh → Call icon → Audio Call Screen
→ [Mute] → [Speaker] → [End Call]
Parallel: Incoming Call Overlay → Accept → Video Call
```

## Flow 4 — Maqsad va Guruh Yaratish

```
Maqsadlar → '+' FAB → Maqsad Yaratish Form
→ Guruh Yaratish → Invite Link Screen
```

---

# 12. ✅ Dizayner Uchun Checklist

## Topshirish Talablari

- [ ]  Barcha ekranlar Dark Mode + Light Mode variantida
- [ ]  Barcha komponentlar Auto Layout bilan qurilgan
- [ ]  Responsive: mobile (375 / 390 / 428px) + web (1440 / 1280px)
- [ ]  Component variants: Default / Hover / Active / Disabled / Loading / Error
- [ ]  Design Tokens Figma Variables'ga kiritilgan
- [ ]  Icon setlar Frame ichida tartibli
- [ ]  Lock Screen ekranlar to'liq (L1–L6, barcha variants)
- [ ]  Prototype flow'lar ishlaydi (kamida 4 ta asosiy flow — Lock Screen + 3 ta boshqa)
- [ ]  Lottie animatsiya fayllar (.json) eksport qilingan
- [ ]  Handoff uchun Inspect rejimi to'liq (spacing, font, color)
- [ ]  Asset export: @1x, @2x, @3x PNG + SVG
- [ ]  Accessibility: contrast ratio minimum AA (4.5:1)

## Naming Convention

```
Frame:       [Platform]/[Flow]/[ScreenName]  → Mobile/Auth/Login
Component:   [Category]/[Name]/[Variant]     → Button/Primary/Default
Icon:        Icon/[Name]/[Size]              → Icon/Send/24
Color:       [Category]/[Name]/[Shade]       → Brand/Primary/600
Text:        [Type]/[Size]/[Weight]          → Body/MD/Regular
```

---

> 📌 **Muhim:** Har bir screen va komponent uchun Figma'da haqiqiy ma'lumotlar (real content) ishlatilsin, lorem ipsum ishlatilmasin.
> 

---

*Hujjat: ConnectHub Figma TZ | Versiya 1.0 | 2026-yil Aprel*