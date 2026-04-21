# CV Builder — Yapılacaklar

Son güncelleme: 2026-04-21 (Phase 11 tamam)

## 🔴 Kritik (güvenlik + veri kaybı)

- [x] ~~**UUID brute-force açığı**~~ — Phase 11'de email+şifre auth + JWT eklendi, `ownerUuid` sistemi kaldırıldı.
- [ ] **Backend içerik validation gevşek** — `server/src/schemas/resume.ts:3` `z.unknown()` kullanıyor. Frontend Zod şemasını backend'e port et (strict şema).
- [ ] **Multer upload kota + temizlik yok** — `server/src/middleware/upload.ts`. Kullanıcı başına foto sayısı/boyut limiti, eski dosya cleanup cron'u.
- [ ] **CSRF koruması yok** — `server/src/app.ts`. Bearer JWT localStorage'da → CSRF vektörü sınırlı ama hâlâ XSS ile token çalınabilir. httpOnly cookie + CSRF düşünülebilir.
- [ ] **Rate limiting + helmet yok** — `express-rate-limit` + `helmet` middleware. Auth endpoint'leri için özellikle önemli (brute-force).
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
- [ ] **"Şifremi unuttum" akışı** — Phase 11'de scope dışı bırakıldı. Gerekirse Resend/SendGrid ile magic reset link.
- [ ] **E-posta doğrulama** — Phase 11'de scope dışı. Hesap aktivasyon akışı (SMTP gerekir).

## 🟡 Kod kalitesi / teknik borç

- [ ] **Template kopya kodu** — 3 preview + 3 PDF template = 6 dosyada aynı yapı. Factory pattern veya shared component'lere refactor.
- [ ] **Magic constant tekrarı** — `SKILL_LEVEL_LABELS`, `formatMonth`, `formatDateRange` 6 dosyada duplikate. `lib/formatting.ts` + `lib/constants.ts` çıkar.
- [ ] **Backend test coverage** — photo upload endpoint için ek test (yetki — başka kullanıcı foto yüklemeye çalışırsa).
- [ ] **Frontend integration test** — form → store → preview akışı test edilmemiş.
- [ ] **README + API dokümantasyonu** — root'ta .md yok, Swagger/OpenAPI yok.

## 🔵 Tip / veri modeli

- [ ] **Prisma ↔ Frontend tip uyuşmazlığı** — `content: Json` vs strict `Resume` tipi.
- [ ] **`theme` alanı** — Prisma'da nullable, frontend'de zorunlu.

## 🟢 UX detayları

- [ ] **Loading skeleton** — Dashboard'da flash yerine shimmer (Phase 11'de kısmen yapıldı: GuestGate + SkeletonGrid).
- [ ] **Türkçe hata mesajları** — Zod şemalarına `{ message: 'Email formatı hatalı' }` gibi custom mesajlar.
- [ ] **Placeholder tutarsızlığı** — `example.com` → Türkçe örneklerle değiştir.
- [ ] **Custom section hazır şablonları** — "Hobiler", "Ödüller", "Referanslar" dropdown önerileri.

---

## ✅ Phase 11 — tamamlandı (2026-04-21)

Email + şifre auth. Commit'ler:
- `7a1e5a7` Phase 11a: backend auth (User+JWT+bcrypt)
- `6433b4a` Phase 11b: frontend auth altyapısı
- `8be6a72` Phase 11c: AuthModal + Login/Register + Header
- `e9f5ee3` Phase 11d: kaydetme ve dashboard auth guard
- `f49f4b1` Phase 11e: anasayfa 3 seçenek + örnek CV

Kararlar:
- Guest mode: localStorage + PDF download, backend çağrısı yok
- Kaydet → AuthModal zorunlu (başarılı auth sonrası otomatik save)
- Dashboard → login yoksa GuestGate ekranı
- JWT 1 gün, localStorage, Bearer header, 401 → global logout event
- "Şifremi unuttum" + email verification bu sürümde yok

## Önerilen sıralama (Phase 12+)

1. Backend content şema validasyonu (kritik — `z.unknown()` daralt)
2. Rate limit + helmet (özellikle `/auth/login` brute-force)
3. Share link'i tamamla (yarım feature)
4. Template'leri DRY yap (her bug fix 6 dosyayı dolaşıyor)
5. Print + ATS template (gerçek kullanım)
