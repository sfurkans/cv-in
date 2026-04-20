# CV Builder — Yapılacaklar

Kaydedilme tarihi: 2026-04-20

## 🔴 Kritik (güvenlik + veri kaybı)

- [ ] **UUID brute-force açığı** — `server/src/middleware/ownerUuid.ts:12` sadece format kontrolü. Auth katmanı ekle (UUID + session token, IP rate-limit, DB'de registered UUID).
- [ ] **Backend içerik validation gevşek** — `server/src/schemas/resume.ts:3` `z.unknown()` kullanıyor. Frontend Zod şemasını backend'e port et (strict şema).
- [ ] **Multer upload kota + temizlik yok** — `server/src/middleware/upload.ts`. Kullanıcı başına foto sayısı/boyut limiti, eski dosya cleanup cron'u.
- [ ] **CSRF koruması yok** — `server/src/app.ts`. `express-csurf` veya origin/referer validation ekle.
- [ ] **Rate limiting + helmet yok** — `express-rate-limit` + `helmet` middleware.
- [ ] **Offline sync race condition** — `client/src/lib/sync.ts:35` global flag'ler thread-safe değil, `once: true` listener tekrar tekrar bağlantı kesilmelerinde tetiklenmez. Promise-based lock veya store'da queue.

## 🟠 Önemli (fonksiyonel eksik + bug)

- [ ] **Share link yarım** — `shareSlug` Prisma schema'da var, controller/route yok (`server/prisma/schema.prisma:14`). POST /api/resumes/:id/share + GET /api/share/:slug + frontend SharedResume page.
- [ ] **Dark mode** — TANITIM.html'de söz verilmiş, uygulanmamış. Tailwind dark mode + toggle.
- [ ] **ATS-uyumlu PDF template** — Planda var, yok. Minimal styling 4. template (tablo/fancy layout'suz).
- [ ] **Print desteği** — `@media print` CSS, builder sayfasında preview'i print'e optimize et.
- [ ] **Pagination** — `GET /api/resumes` limit/offset yok (`server/src/services/resumeService.ts:10`).
- [ ] **Foto saklama tutarsızlığı** — `basics.photo` (Base64) vs `photoUrl` (backend). Her zaman backend-only yap, Base64 fallback'i kaldır.
- [ ] **Template selector thumbnail** — `TemplateSelector.tsx`, 200x300px preview thumbnail'ları.
- [ ] **Mobile UX** — `Builder.tsx:20`, lucide-react icon kullan (☰ emoji yerine), tablet için 2-column breakpoint.

## 🟡 Kod kalitesi / teknik borç

- [ ] **Template kopya kodu** — 3 preview + 3 PDF template = 6 dosyada aynı yapı. Factory pattern veya shared component'lere refactor.
- [ ] **Magic constant tekrarı** — `SKILL_LEVEL_LABELS`, `formatMonth`, `formatDateRange` 6 dosyada duplikate. `lib/formatting.ts` + `lib/constants.ts` çıkar.
- [ ] **Backend test coverage** — photo upload endpoint için test yok.
- [ ] **Frontend integration test** — form → store → preview akışı test edilmemiş.
- [ ] **README + API dokümantasyonu** — root'ta .md yok, Swagger/OpenAPI yok.

## 🔵 Tip / veri modeli

- [ ] **Prisma ↔ Frontend tip uyuşmazlığı** — `content: Json` vs strict `Resume` tipi.
- [ ] **`theme` alanı** — Prisma'da nullable, frontend'de zorunlu.

## 🟢 UX detayları

- [ ] **Loading skeleton** — Dashboard/Builder'da flash yerine shimmer.
- [ ] **Türkçe hata mesajları** — Zod şemalarına `{ message: 'Email formatı hatalı' }` gibi custom mesajlar.
- [ ] **Placeholder tutarsızlığı** — `example.com` → Türkçe örneklerle değiştir.
- [ ] **Custom section hazır şablonları** — "Hobiler", "Ödüller", "Referanslar" dropdown önerileri.

---

## Önerilen sıralama

1. Backend content şema validasyonu (kritik)
2. Share link'i tamamla (yarım feature)
3. Template'leri DRY yap (her bug fix 6 dosyayı dolaşıyor)
4. Print + ATS template (gerçek kullanım)
5. Rate limit + helmet (minimum prod-ready)
