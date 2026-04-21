# CV Builder — Yapılacaklar

Son güncelleme: 2026-04-21 (Phase 12 — 6 yeni template eklendi)

## 🔴 Kritik (güvenlik + veri kaybı)

- [x] ~~**UUID brute-force açığı**~~ — Phase 11'de email+şifre auth + JWT eklendi, `ownerUuid` sistemi kaldırıldı.
- [ ] **Backend içerik validation gevşek** — `server/src/schemas/resume.ts:3` `z.unknown()` kullanıyor. Frontend Zod şemasını backend'e port et (strict şema).
- [ ] **Multer upload kota + temizlik yok** — `server/src/middleware/upload.ts`. Kullanıcı başına foto sayısı/boyut limiti, eski dosya cleanup cron'u.
- [ ] **CSRF koruması yok** — `server/src/app.ts`. Bearer JWT localStorage'da → CSRF vektörü sınırlı ama hâlâ XSS ile token çalınabilir. httpOnly cookie + CSRF düşünülebilir.
- [ ] **Rate limiting + helmet yok** — `express-rate-limit` + `helmet` middleware. Auth endpoint'leri için özellikle önemli (brute-force).
- [ ] **Offline sync race condition** — `client/src/lib/sync.ts:35` global flag'ler thread-safe değil, `once: true` listener tekrar tekrar bağlantı kesilmelerinde tetiklenmez. Promise-based lock veya store'da queue.

## 🟠 Önemli (fonksiyonel eksik + bug)

- [ ] **Share link yarım** — `shareSlug` Prisma schema'da var, controller/route yok. POST /api/resumes/:id/share + GET /api/share/:slug + frontend SharedResume page.
- [ ] **Dark mode** — TANITIM.html'de söz verilmiş, uygulanmamış. Tailwind dark mode + toggle.
- [x] ~~**ATS-uyumlu PDF template**~~ — Phase 12'de eklendi (`ats` template, renksiz pure text).
- [ ] **Print desteği** — `@media print` CSS, builder sayfasında preview'i print'e optimize et.
- [ ] **Pagination** — `GET /api/resumes` limit/offset yok.
- [ ] **Foto saklama tutarsızlığı** — `basics.photo` (Base64) vs `photoUrl` (backend). Her zaman backend-only yap, Base64 fallback'i kaldır.
- [ ] **Template selector thumbnail** — 9 template'in thumbnail'i var (Phase 12'de eklendi) ama sadece placeholder SVG. Gerçek render screenshot'ları alınabilir.
- [ ] **Mobile UX** — `Builder.tsx:20`, lucide-react icon kullan (☰ emoji yerine), tablet için 2-column breakpoint.
- [ ] **"Şifremi unuttum" akışı** — Phase 11'de scope dışı bırakıldı. Gerekirse Resend/SendGrid ile magic reset link.
- [ ] **E-posta doğrulama** — Phase 11'de scope dışı. Hesap aktivasyon akışı (SMTP gerekir).

## 🟡 Kod kalitesi / teknik borç

- [ ] **Template kopya kodu (mevcut 3 template)** — Classic/Modern/Creative hâlâ inline `formatMonth`/`formatDateRange`/`SKILL_LEVEL_LABELS` kopyalarını kullanıyor. Phase 12'deki yeni 6 template `lib/resumeFormat.ts`'i kullanıyor — mevcut 3'ü de geçirince 6 dosyadan duplicate kod silinir.
- [x] ~~**Magic constant tekrarı (yeni template'ler)**~~ — Phase 12'de `lib/resumeFormat.ts` + `lib/templateStyles.ts` eklendi.
- [ ] **Yeni template'ler için unit test** — Phase 12'de typecheck + smoke yapıldı ama render testleri yok.
- [ ] **Backend test coverage** — photo upload endpoint için ek test (yetki — başka kullanıcı foto yüklemeye çalışırsa).
- [ ] **Frontend integration test** — form → store → preview akışı test edilmemiş.
- [ ] **README + API dokümantasyonu** — root'ta .md yok, Swagger/OpenAPI yok.

## 🔵 Tip / veri modeli

- [ ] **Prisma ↔ Frontend tip uyuşmazlığı** — `content: Json` vs strict `Resume` tipi.
- [ ] **`theme` alanı** — Prisma'da nullable, frontend'de zorunlu.

## 🟢 UX detayları

- [ ] **Loading skeleton** — Dashboard'da flash yerine shimmer (Phase 11'de kısmen yapıldı).
- [ ] **Türkçe hata mesajları** — Zod şemalarına `{ message: 'Email formatı hatalı' }` gibi custom mesajlar.
- [ ] **Placeholder tutarsızlığı** — `example.com` → Türkçe örneklerle değiştir.
- [ ] **Custom section hazır şablonları** — "Hobiler", "Ödüller", "Referanslar" dropdown önerileri.

---

## ✅ Phase 12 — tamamlandı (2026-04-21)

6 yeni template eklendi. Toplam 9 template: classic, modern, creative + **sidebar-left, ats, color-accent, modern-clean, terminal, infographic**.

Commit'ler:
- `(12a+b)` Phase 12a+b: shared helpers (resumeFormat, templateStyles) + registry stub
- `e02270e` Phase 12c: Sidebar Left (iki kolon sol, sabit 72mm sidebar)
- `0479efb` Phase 12d: ATS (renksiz, grafiksiz, pure text, ATS dostu)
- `b2ce0d8` Phase 12e: Color Accent (üst renk bandı + accent çizgiler)
- `8b75c2c` Phase 12f: Modern Clean (ferah whitespace, büyük tipografi)
- `9c9f134` Phase 12g: Terminal (dark + monospace + shell prompt)
- `157009a` Phase 12h: Infographic (skill bar + timeline + gradient header)

Kararlar:
- Mevcut 3 template (Classic/Modern/Creative) dosyalarına DOKUNULMADI — geri uyumluluk tam
- Yeni 6'sı `lib/resumeFormat.ts` + `lib/templateStyles.ts` ortak helper'larını kullanır
- Her template: preview (Tailwind) + PDF (React-PDF) + SVG thumbnail üçlüsü
- İçerik taşma koruması: `min-w-0` + `break-words` + `break-all` (URL) + `flex-wrap`
- Terminal template theme.fontFamily'i yok sayar (her zaman monospace), BG sabit dark
- ATS template theme.primaryColor'ı yok sayar (sadece siyah), photo/grafik render etmez
- Registry stub pattern: Faz 2'de 6 slot Classic'e delege, Faz 3-8'de her biri gerçek component'le swap

## Önerilen sıralama (Phase 13+)

1. Backend content şema validasyonu (kritik — `z.unknown()` daralt)
2. Rate limit + helmet (özellikle `/auth/login` brute-force)
3. Share link'i tamamla (yarım feature)
4. Mevcut 3 template'i de shared helper'lara geçir (DRY tamamla)
5. Print desteği (@media print)
