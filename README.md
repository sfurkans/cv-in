# Cv-İn — Modern CV Oluşturucu

Dakikalar içinde modern, ATS uyumlu bir CV oluşturmanı sağlayan Türkçe web uygulaması.
9 farklı şablon, canlı A4 önizleme, tek tıkla PDF export.

## Özellikler

- **9 şablon** — Klasik, Modern, Yaratıcı, Sidebar, ATS Dostu, Renk Vurgulu, Temiz Modern, Terminal, Infografik
- **Canlı A4 önizleme** — yazdığın her şey sağ panelde anında görünür
- **PDF export** — Türkçe karakter destekli, çok sayfalı baskı kalitesinde PDF
- **Kayıtsız başlama** — hesap açmadan deneyebilir, istersen sonra kaydedebilirsin
- **Otomatik kayıt** — her değişiklik 2 saniye içinde arka planda kaydedilir
- **Offline destek** — internet yoksa yerel olarak çalışır, bağlantı dönünce otomatik senkronlanır
- **Sürükle-bırak bölüm sıralama** — CV bölümlerinin sırasını değiştirebilirsin
- **Fotoğraf yükleme** — profil fotoğrafı ekle (JPG/PNG/WebP, max 2MB)
- **JSON import/export** — CV verisini yedekle ve geri yükle
- **Tema özelleştirme** — renk paleti, font, boşluk ayarları
- **Özel bölümler** — hazır bölümlerin dışında kendi bölümlerini ekle

## Stack

**Frontend**
- React 19 + Vite + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Zustand (state), React Router (routing), React Hook Form + Zod (forms)
- @react-pdf/renderer (PDF), @dnd-kit (drag & drop)

**Backend**
- Node.js + Express + TypeScript (tsx)
- Prisma 7 ORM + PostgreSQL
- bcrypt + JWT (auth), Multer (upload)

**Test**
- Vitest + React Testing Library (frontend, 215 test)
- Vitest + Supertest (backend, 30 test)

**Observability**
- Sentry (opsiyonel, env DSN koyunca aktif)

## Hızlı başlangıç

### Gereksinimler

- Node.js ≥ 22
- PostgreSQL ≥ 14
- npm

### 1. Depoyu klonla

```bash
git clone <repo-url>
cd cv-builder
```

### 2. Veritabanı hazırla

```sql
CREATE DATABASE cv_builder;
CREATE DATABASE cv_builder_test;  -- sadece test için gerekli
```

### 3. Backend

```bash
cd server
npm install

# .env oluştur
cp .env.example .env
# DATABASE_URL ve JWT_SECRET değerlerini doldur

# Migration çalıştır
npx prisma migrate deploy
npm run prisma:generate

# Dev server
npm run dev    # http://localhost:4000
```

### 4. Frontend

```bash
cd client
npm install

# .env oluştur (opsiyonel, default değerler çalışır)
cp .env.example .env

# Dev server
npm run dev    # http://localhost:5173
```

## Proje yapısı

```
cv-builder/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/        # UI, auth, builder, preview, layout
│   │   ├── pages/             # Home, Builder, Dashboard, Templates, NotFound
│   │   ├── store/             # Zustand (resume, auth, authModal)
│   │   ├── lib/               # api client, sync, validation helpers
│   │   ├── schemas/           # Zod form şemaları
│   │   └── hooks/             # useAutosave, useAuthBootstrap vs.
│   └── public/                # statik asset'ler
├── server/                    # Express + Prisma backend
│   ├── src/
│   │   ├── controllers/       # request handlers
│   │   ├── services/          # business logic
│   │   ├── routes/            # Express router'ları
│   │   ├── middleware/        # auth, upload, error, validation
│   │   ├── schemas/           # Zod body validation
│   │   └── lib/               # prisma client, auth helpers
│   ├── prisma/                # schema.prisma + migrations
│   ├── test/                  # integration testleri
│   └── uploads/               # yüklenen fotoğraflar (git ignored)
├── TODO.md                    # backlog
├── PLAN.html                  # proje yapım aşamaları
└── TANITIM.html               # proje tanıtım sayfası
```

## Komutlar

### Frontend

```bash
npm run dev        # dev server
npm run build      # production build
npm run preview    # build sonrası preview
npm test           # test izleme
npm run test:run   # test tek sefer
npm run lint       # ESLint
```

### Backend

```bash
npm run dev                # tsx watch
npm run build              # tsc
npm start                  # production (tsx)
npm test                   # Vitest
npm run prisma:generate    # client üret
npm run prisma:migrate     # dev migration
npm run prisma:studio      # DB GUI
```

## Environment variables

### Backend (`server/.env`)

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL bağlantı string'i |
| `PORT` | | default `4000` |
| `NODE_ENV` | | `development` / `production` / `test` |
| `CORS_ORIGIN` | | virgülle ayrılmış izinli origin'ler |
| `JWT_SECRET` | ✅ | min 32 karakter; production'da mutlaka değiştir |
| `SENTRY_DSN` | | opsiyonel, boşsa Sentry kapalı |

### Frontend (`client/.env`)

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `VITE_API_URL` | | default `http://localhost:4000/api` |
| `VITE_SENTRY_DSN` | | opsiyonel, boşsa Sentry kapalı |

## Roadmap

Büyük resim için [CHANGELOG.md](CHANGELOG.md) ve granular backlog için [TODO.md](TODO.md).

## Lisans

Bu proje eğitim amaçlı oluşturuldu.
