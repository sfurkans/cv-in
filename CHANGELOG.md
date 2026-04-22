# Changelog

Bu projedeki önemli değişiklikleri takip eder. Format
[Keep a Changelog](https://keepachangelog.com/) baz alınmıştır; bu proje
versiyon numarası yerine **phase** numaralandırması kullanır.

## [Unreleased]

### Added
- Sentry error tracking altyapısı (client + server). `SENTRY_DSN` /
  `VITE_SENTRY_DSN` env variable'ları ile opsiyonel; boş ise no-op.
- Root `README.md` — proje özeti, stack, kurulum, env tablosu, komutlar.
- Bu `CHANGELOG.md`.

## Phase 10c — 2026-04-22

### Added
- SEO meta tag'leri: Open Graph (Facebook/LinkedIn), Twitter Card,
  `theme-color`, Türkçe `description` ve `keywords` (`client/index.html`).
- `ErrorBoundary` component (`client/src/components/ErrorBoundary.tsx`) —
  tüm uygulamayı sarar, hata fallback UI + "Tekrar Dene" / "Ana Sayfa".
- Profesyonel 404 sayfası (`client/src/pages/NotFound.tsx`) —
  brand-gradient + `FileQuestion` icon + CTA'lar.

### Note
- Phase 10a (backend share API) ve Phase 10b (frontend share UI)
  kullanıcı tercihi ile geri alındı. Paylaş özelliği kaldırıldı.

## Phase 11 — 2026-04-20

### Added
- Email + şifre authentication: User tablosu, bcrypt (10 rounds),
  JWT (1 gün).
- `/api/auth/register`, `/api/auth/login`, `/api/auth/me` endpoint'leri.
- Frontend: `authStore` (Zustand), `AuthModal` (tablı login/register),
  `useAuthBootstrap` (session restore), Bearer interceptor.
- Kaydetme, Dashboard ve builder fotoğraf upload'u artık auth gerektirir;
  guest mode localStorage + PDF export ile çalışır.
- Home sayfasında 3 seçenek (Boş CV / Örnek CV / Kayıt Ol).

### Removed
- Anonymous UUID + `X-Owner-Uuid` header sistemi. `Resume.ownerUuid`
  alanı drop edildi, yerine `userId` FK geldi.

## Phase 12 — 2026-04-21

### Added
- 6 yeni şablon: Sidebar Left (iki kolon sol), ATS Dostu (renksiz/düz),
  Renk Vurgusu (marka rengi dominant), Modern Temiz (ferah tipografi),
  Terminal (dark monospace), İnfografik (skill bar + timeline).
- Toplam şablon sayısı 3 → 9.
- Shared helper'lar: `lib/resumeFormat.ts` (`formatMonth`, `formatDateRange`,
  `SKILL_LEVEL_LABELS`, `SKILL_LEVEL_PERCENT` vs.), `lib/templateStyles.ts`
  (`FONT_CLASS`, `PDF_FONT_MAP`, `WEB_SPACING`, `PDF_SPACING`).
- Her şablon için preview (Tailwind) + PDF (React-PDF) + SVG thumbnail.

### Changed
- Eski 3 şablon (Classic/Modern/Creative) inline helper kopyalarını
  kullanmaya devam ediyor — refactor backlog'da (TODO.md).

## Phase 10 (parts) + polish — 2026-04-21

### Added
- Cv-İn rebrand: yeni logo, brand-gradient tokens, Header sticky glass,
  Home sayfası yeniden tasarım.
- Kapsamlı mobil responsive (Builder mobil tabs, Dashboard yatay kartlar).
- Dashboard profesyonel tasarım: mini preview thumbnail, stat chip'leri,
  Düzenle + Sil butonları.
- Production'da `tsx` kullanımı (tsc ESM resolution sorunu fix).

## Phase 9 — 2026-04-16

### Added
- **9a:** Frontend ↔ backend sync: Axios, `lib/api/resumes.ts`,
  `useAutosave` hook (2s debounced), `SyncStatusIndicator`, offline
  fallback, sync queue.
- **9b:** `/dashboard` sayfası (CV listesi, yarat/sil/düzenle),
  `/builder/:id` route, photo upload UI, toast sistemi,
  Zod API response validation.

## Phase 8 — 2026-04-14

### Added
- Express + TypeScript + Prisma 7 + PostgreSQL kurulumu.
- Resume CRUD endpoint'leri, Multer photo upload,
  CORS + Zod validation + error handler middleware.
- Supertest + Vitest ile 18 integration testi.

## Phase 7 — 2026-04-12

### Added
- `@react-pdf/renderer` ile PDF export, 3 şablon için PDF versiyonu,
  TTF fontlar (Noto Sans, Türkçe karakter desteği).
- JSON import / export.
- Her şablon için PDFExportButton.

### Known issues
- PDF'de Türkçe diakritiklerin yanlış render edilmesi
  (`@react-pdf/renderer` v4 bidi regression). v4.5.1 + TTF fontlarla
  kısmen çözüldü.

## Phase 0-6 — 2026-04-07 → 2026-04-11

### Added
- **Phase 0:** Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui.
- **Phase 1:** Types, React Router, sayfalar, Layout (Header/Footer/Sidebar).
- **Phase 2:** Form bileşenleri (PersonalInfo, Experience, Education,
  Skills, Projects, Languages, Certificates, Volunteer, Publications).
- **Phase 3:** Zustand `resumeStore` + persist, canlı önizleme, ilk şablon
  (Classic), Vitest setup, örnek CV.
- **Phase 4:** react-hook-form + Zod validation, her section için schema.
- **Phase 5:** Dinamik liste CRUD (`useFieldArray` yerine custom action'lar),
  @dnd-kit ile bölüm sıralama, `CustomSection` (kullanıcı tanımlı bölümler).
- **Phase 6:** Modern + Creative şablonlar, TemplateSelector, ThemePicker
  (renk/font/spacing), CSS variables ile dinamik tema.
