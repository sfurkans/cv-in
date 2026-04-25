# CV Builder — Kod Temizliği Planı

> **Durum:** Planlama aşaması (henüz başlanmadı)
> **Son güncelleme:** 2026-04-24
> **Tahmini toplam kazanç:** ~30.000 satırın ~10.000'i (%33) silinebilir, aynı işlevsellikle

---

## 📌 Amaç

Proje Phase 11-12 sonrası hızla büyüdü. Özellikle **10 PDF template + 9 Preview template + 9 thumbnail SVG** eklenince her CV bölümü 19 farklı yerde duplicate olarak render edilmeye başladı. Store 1000 satırı geçti, generated Prisma dosyaları git'te duruyor.

Bu dokümanın amacı: **aynı işlevi koruyarak** kod hacmini düşürmek, tek kaynak (single source of truth) disiplini kurmak, yeni template/section eklemeyi ucuzlatmak.

---

## 📊 Genel tablo

| Alan | Mevcut satır | Hedef satır | Kazanç | Zorluk | Risk |
|---|---:|---:|---:|---|---|
| Generated Prisma (git'te) | 2.800 | 0 | **-2.800** | ⭐ | sıfır |
| PDF template'leri (10 dosya) | ~5.950 | ~2.000 | **-3.950** | ⭐⭐⭐ | orta |
| Preview template'leri (9 dosya) | ~4.250 | ~1.500 | **-2.750** | ⭐⭐⭐ | orta |
| TemplateThumbnail.tsx | 704 | ~150 | **-550** | ⭐⭐ | düşük |
| resumeStore.ts | 1.003 | ~400 | **-600** | ⭐⭐ | düşük (test var) |
| Zod ↔ TypeScript tip duplicate'i | ~300 | ~0 | **-300** | ⭐ | düşük |
| **TOPLAM** | **~15.000** | **~4.050** | **~-10.950** | | |

---

## 1️⃣ Generated Prisma dosyalarını git'ten çıkar

**Zorluk:** ⭐ (2 dakika) • **Risk:** sıfır • **Kazanç:** -2.800 satır

### Sorun

`server/src/generated/prisma/` klasörü git'te versiyonlanıyor ama bu dosyalar **`prisma generate` komutuyla otomatik üretilen** dosyalar:

```
server/src/generated/prisma/models/Resume.ts          1.477 satır
server/src/generated/prisma/models/User.ts            1.335 satır
server/src/generated/prisma/internal/prismaNamespace.ts 889 satır
```

Bunlar:
- `prisma/schema.prisma` değiştiğinde otomatik yeniden oluşur
- İnsan tarafından elle yazılmaz, edit edilmez
- Git diff'leri kirletir (şema değişince yüzlerce satır diff)
- Repo boyutunu şişirir

### Çözüm

```gitignore
# server/.gitignore'a ekle
/src/generated/
```

Sonra:
```bash
git rm -r --cached server/src/generated/
git commit -m "chore: remove generated Prisma files from git"
```

CI/prod ortamında `prisma generate` zaten `postinstall` veya build script'te çalışıyor olmalı — değilse eklenir:
```json
// server/package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Tahmini kazanç
- Silinen satır: **2.800**
- Gelecek commit'lerde Prisma şema değişikliğinin yarattığı diff gürültüsü ortadan kalkar

### Risk / dikkat
- `postinstall` script'in düzgün çalıştığını doğrula (fresh clone → `npm install` → `npm run build`)
- Deploy pipeline'ı incele, `prisma generate` adımı yoksa ekle

---

## 2️⃣ Template mimarisini "section renderer" pattern'e taşı

**Zorluk:** ⭐⭐⭐ (toplam 7-8 saat) • **Risk:** orta • **Kazanç:** -6.700 satır

### Sorun

Her CV bölümü (work, education, skills, projects, languages, certificates, volunteer, publications, customSections) her template için **ayrı JSX olarak** yeniden yazılmış. Yani:

- **10 PDF template** × 9 section = **90 kez** aynı iş (her PDF'de work bölümünü renderlayan JSX)
- **9 Preview template** × 9 section = **81 kez** aynı iş
- Toplam: **171 ayrı yerde** CV bölümü JSX'i duplicate ediliyor

Örnek kanıt (PDFClassicTemplate vs PDFModernTemplate, ilk 65 satır):

```ts
// İKİ DOSYADA DA AYNI (kelimesi kelimesine):
const FONT_MAP: Record<FontFamily, string> = {
  sans: 'Noto Sans',
  serif: 'Noto Serif',
  mono: 'Noto Sans Mono',
}

const SKILL_LEVEL_LABELS: Record<string, string> = {
  beginner: 'Başlangıç', basic: 'Temel', intermediate: 'Orta',
  advanced: 'İleri', expert: 'Uzman',
}

function formatMonth(value: string): string { /* ... */ }
function formatDateRange(start: string, end: string): string { /* ... */ }
```

Phase 12'de 6 template için `lib/resumeFormat.ts` + `lib/templateStyles.ts` eklenmiş ama **mevcut Classic/Modern/Creative hâlâ inline kopya kullanıyor** (TODO.md'de not edilmiş). Ayrıca helper'lar var ama section JSX'leri hâlâ her template'de tekrar yazılıyor.

### Çözüm

**Section-level render abstraction.** Her template artık sadece **tema config'i** olur, bölümleri ortak komponent render eder.

#### Önce: her template 500-700 satır
```tsx
// templates/ClassicTemplate.tsx (şu an 443 satır)
export function ClassicTemplate({ resume }: Props) {
  return (
    <div>
      <header>{/* name, label, contact inline JSX */}</header>
      {/* work bölümü inline JSX — 50 satır */}
      {/* education bölümü inline JSX — 35 satır */}
      {/* skills bölümü inline JSX — 40 satır */}
      {/* ... 6 bölüm daha */}
    </div>
  )
}
```

#### Sonra: template ~60 satırlık tema config + layout
```tsx
// templates/sections/WorkSection.tsx (YENİ — ortak komponent)
export function WorkSection({ items, theme, variant }: {
  items: Work[]
  theme: Theme
  variant: 'classic' | 'modern' | 'creative' | ...
}) {
  // variant'a göre küçük stil farkları, ortak yapı
}

// templates/ClassicTemplate.tsx (YENİ — ~60 satır)
export function ClassicTemplate({ resume }: Props) {
  const theme = resolveTheme(resume.theme, classicDefaults)
  return (
    <TemplateLayout theme={theme} variant="classic">
      <Header basics={resume.basics} theme={theme} variant="classic" />
      <SectionsRenderer
        sections={resume.sectionOrder}
        data={resume}
        theme={theme}
        variant="classic"
      />
    </TemplateLayout>
  )
}
```

`SectionsRenderer` section tipine göre doğru component'i seçer:
```tsx
const SECTION_COMPONENTS = {
  work: WorkSection,
  education: EducationSection,
  skills: SkillsSection,
  // ...
}

function SectionsRenderer({ sections, data, theme, variant }) {
  return sections.map(id => {
    const Comp = SECTION_COMPONENTS[id]
    return <Comp key={id} items={data[id]} theme={theme} variant={variant} />
  })
}
```

#### PDF tarafı için ayrı (ama simetrik) bir set

`@react-pdf/renderer` bambaşka bir API (HTML değil), bu yüzden preview section'larını direkt paylaşamayız. Ama yapı aynı olur:

```
templates/
  sections/                  # Preview (HTML/Tailwind)
    WorkSection.tsx
    EducationSection.tsx
    SkillsSection.tsx
    ...
  pdf-sections/              # PDF (@react-pdf/renderer)
    WorkSection.tsx
    EducationSection.tsx
    ...
```

19 template × 9 section = 171 kopya → 2 × 9 = **18 section component** + 19 tema config. Matematik: 171 → 18 = **%89 azalma section bazında**.

### Adım adım uygulama planı

1. **POC:** Tek bir template (örn. Classic) için section-based refactor'ı yap, görsel regresyon olmadığını doğrula
2. **Shared helpers doğrula:** `lib/resumeFormat.ts` tüm tarihlerin tek kaynağı olsun, template'lerdeki inline `formatMonth/formatDateRange` kopyaları sil
3. **Section component'larını yaz:** Preview için 9 section component
4. **Template config nesnesi:** Her template için `{ colors, fonts, spacing, variants }` şeklinde config
5. **Migration:** Template'leri tek tek config tabanlı hale getir (9 tane)
6. **PDF tarafı:** Aynı patern, `pdf-sections/` altında
7. **Görsel regresyon:** Her template için 1 örnek CV ile screenshot al, önce/sonra karşılaştır

### Tahmini kazanç

- PDF: ~5.950 → ~2.000 satır = **-3.950**
- Preview: ~4.250 → ~1.500 satır = **-2.750**
- Bonus: Yeni template eklemek artık 500 satır değil, **~40 satırlık bir config**

### Risk / dikkat

- **Görsel regresyon kritik:** Her template'in çıktısı birebir aynı olmalı. Playwright/Percy ile snapshot test ekle, veya manuel: her template için 1 dolu CV ile PDF üret, önce/sonra karşılaştır.
- **Terminal template istisna:** Tüm theme.fontFamily'i yok sayıp monospace zorluyor. Ats template de primaryColor'ı yok sayıp siyah kullanıyor. Config'te bu "override" desteklenmeli.
- **Infographic template istisna:** Skill bar, timeline, gradient header gibi özel komponentleri var — section pattern'e tam uymaz, **o template'i ayrık tutmak mantıklı olabilir**.
- **Incremental yap:** Hepsini bir seferde değil, tek template → doğrula → devam.

---

## 3️⃣ TemplateThumbnail.tsx refactor

**Zorluk:** ⭐⭐ (30 dakika) • **Risk:** düşük • **Kazanç:** -550 satır

### Sorun

`TemplateThumbnail.tsx` 704 satır, 9 template için **elle çizilmiş SVG** içeriyor. Her biri ~70 satır `<rect>` tag'i. Örnek:

```tsx
function EuropassThumb() {
  return (
    <svg viewBox="0 0 200 280">
      <rect width="200" height="280" fill="#fff" />
      <rect x="0" y="0" width="200" height="60" fill="#003399" />
      {/* ... 40 rect daha */}
    </svg>
  )
}
```

TODO.md'de zaten "placeholder SVG" olarak işaretli. Gerçek template render'ını temsil etmiyor, manuel bakım dert.

### Çözüm (iki alternatif)

#### Alternatif A: Gerçek template'i küçültülmüş render et (ÖNERİLEN)
```tsx
export function TemplateThumbnail({ templateId, className }) {
  const sampleResume = getDemoResume()  // sabit örnek CV verisi
  const Template = TEMPLATE_REGISTRY[templateId]

  return (
    <div
      className={cn('aspect-[210/297] overflow-hidden', className)}
      style={{ transform: 'scale(0.2)', transformOrigin: 'top left', width: '500%', height: '500%' }}
    >
      <Template resume={sampleResume} />
    </div>
  )
}
```

**Avantaj:** Template değişince thumbnail otomatik güncel, sıfır bakım, gerçek render.
**Dezavantaj:** İlk render biraz daha pahalı (ama lazy + memo ile kontrol edilir).

#### Alternatif B: Tek generic thumb + config
```tsx
const THUMB_CONFIGS: Record<TemplateId, ThumbConfig> = {
  classic: { headerColor: '#333', layout: 'single-column', accentPositions: [...] },
  modern: { headerColor: '#6366f1', layout: 'with-photo', accentPositions: [...] },
  // ...
}

function TemplateThumbnail({ templateId }) {
  return <GenericThumb config={THUMB_CONFIGS[templateId]} />
}
```

**Avantaj:** Performans iyi, SVG boyutu küçük.
**Dezavantaj:** Hâlâ elle bakım gerekli ama en azından tek merkezi config.

### Tahmini kazanç
- 704 → ~150 satır = **-550**
- Thumbnail'lar artık gerçek render'ı yansıtır (Alternatif A)

### Risk / dikkat
- Alternatif A'da performans: dashboard'da 9 thumbnail aynı anda renderlenecek → `React.memo` + lazy image olarak screenshot'a dönüştürme düşünülebilir (Phase 13'te iyileştirme)
- CSS `scale + transformOrigin` Safari'de bazen garip davranır, test et

---

## 4️⃣ resumeStore.ts CRUD factory

**Zorluk:** ⭐⭐ (1-2 saat) • **Risk:** düşük (mevcut test var) • **Kazanç:** -600 satır

### Sorun

`resumeStore.ts` 1.003 satır. Her CV bölümü (work, education, skill, project, language, certificate, volunteer, publication, profile, customSection) için **ayrı CRUD fonksiyonu** yazılmış:

```ts
addWork, updateWork, removeWork, reorderWork,
addEducation, updateEducation, removeEducation, reorderEducation,
addSkill, updateSkill, removeSkill, reorderSkill,
// ... 10 bölüm × 4 fonksiyon = 40+ fonksiyon
```

Hepsi aynı şeyi yapıyor: array'e ekle, update'te `id`'ye göre bul, sil, reorder et. Sadece tip farklı.

### Çözüm: Generic CRUD slice factory

```ts
// store/createListSlice.ts (YENİ)
import { nanoid } from 'nanoid'

export function createListSlice<T extends { id: string }>(
  getList: (state: Resume) => T[],
  setList: (state: Resume, list: T[]) => Resume,
) {
  return {
    add: (item: Omit<T, 'id'>) => (state: Resume) =>
      setList(state, [...getList(state), { ...item, id: nanoid() } as T]),
    update: (id: string, patch: Partial<T>) => (state: Resume) =>
      setList(state, getList(state).map(i => i.id === id ? { ...i, ...patch } : i)),
    remove: (id: string) => (state: Resume) =>
      setList(state, getList(state).filter(i => i.id !== id)),
    reorder: (from: number, to: number) => (state: Resume) => {
      const list = [...getList(state)]
      const [moved] = list.splice(from, 1)
      list.splice(to, 0, moved)
      return setList(state, list)
    },
  }
}

// resumeStore.ts içinde kullanım:
const workActions = createListSlice<Work>(
  s => s.work,
  (s, list) => ({ ...s, work: list })
)

// sonra:
addWork: workActions.add,
updateWork: workActions.update,
removeWork: workActions.remove,
reorderWork: workActions.reorder,
```

40 fonksiyon → 1 factory + 10 konfig. Yeni bir section tipi eklemek 4 satırlık factory call'u olur.

### Adım adım
1. `createListSlice` factory'sini yaz + test et
2. Tek bir section ile dene (örn. work)
3. Mevcut testler geçiyor mu doğrula (`resumeStore.test.ts` 801 satır — iyi coverage var)
4. Kalan 9 section'ı migrate et

### Tahmini kazanç
- 1.003 → ~400 satır = **-600**
- Yeni section tipi eklemek 30 satır değil, 4 satır

### Risk / dikkat
- `resumeStore.test.ts` 801 satır test içeriyor — bu refactor'ın en büyük güvencesi
- Persist middleware (zustand/middleware) etkilenmemeli; factory sadece state mutation üretir, middleware'e dokunmaz

---

## 5️⃣ Zod şema ↔ TypeScript tipi duplicate'i

**Zorluk:** ⭐ (1 saat) • **Risk:** düşük • **Kazanç:** -300 satır

### Sorun (tahmin — doğrulanması gerek)

Proje yapısında hem `client/src/types/resume.ts` hem `client/src/schemas/` klasörü var. Bu çoğu zaman "aynı veri yapısı hem Zod şema hem TS interface olarak elle yazılmış" anti-pattern'ini gösterir.

### Çözüm: `z.infer` ile tek kaynak

```ts
// schemas/resume.ts
export const workSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  summary: z.string(),
  highlights: z.array(z.string()),
})

// types/resume.ts (önceden elle yazılı)
export type Work = z.infer<typeof workSchema>  // ← otomatik türet
```

### Adım adım
1. `types/resume.ts` ile `schemas/*.ts` dosyalarını karşılaştır (Grep ile alan adlarını eşleştir)
2. Her tip için `z.infer` ile türet
3. Tip mismatch çıkarsa şemayı autoritative kabul et (runtime doğrulama merkezi olsun)

### Tahmini kazanç
- ~300 satır duplicate tip tanımı silinir
- Şema değişirse TS tipi otomatik güncellenir, unutulmaz

### Risk / dikkat
- Başlamadan önce ayrı bir araştırma commit'i: hangi tipler schema'dan türüyor, hangileri elle yazılmış, doğrula.

---

## 6️⃣ Form komponentleri (araştırma gerek)

**Zorluk:** belirsiz • **Risk:** belirsiz • **Kazanç:** tahmini -500 ila -1.500 satır

### Sorun (doğrulanacak)

`client/src/components/builder/` altında her section için ayrı form komponenti olması muhtemel (`WorkForm.tsx`, `EducationForm.tsx`, `SkillForm.tsx`…). Her biri ekle/sil/reorder + field input + validation — benzer yapı.

### Çözüm (adayı)

Generic `<SectionListEditor<T>>` pattern:

```tsx
<SectionListEditor
  items={work}
  onAdd={addWork}
  onUpdate={updateWork}
  onRemove={removeWork}
  fields={[
    { name: 'company', label: 'Şirket', type: 'text' },
    { name: 'position', label: 'Pozisyon', type: 'text' },
    { name: 'startDate', label: 'Başlangıç', type: 'month' },
    { name: 'endDate', label: 'Bitiş', type: 'month' },
    { name: 'summary', label: 'Özet', type: 'textarea' },
    { name: 'highlights', label: 'Öne çıkanlar', type: 'string-array' },
  ]}
/>
```

### Önce yapılacak
- `client/src/components/builder/` içeriğini oku, gerçek duplication oranını ölç
- Özel davranışlar var mı kontrol et (örn. Skill level slider, Profile URL validation)
- Ona göre `SectionListEditor` ne kadar generic olabilir karar ver

---

## 📋 Önerilen sıralama

| # | İş | Süre | Kazanç | Risk | Başlanabilir mi? |
|---|---|---|---|---|---|
| 1 | Prisma generated dosyalarını gitignore | 2 dk | -2.800 | sıfır | ✅ hemen |
| 2 | resumeStore CRUD factory | 1-2 saat | -600 | düşük | ✅ hemen |
| 3 | Zod → TS tipi (`z.infer`) | 1 saat | -300 | düşük | ✅ hemen |
| 4 | TemplateThumbnail refactor | 30 dk | -550 | düşük | ✅ hemen |
| 5 | Section renderer POC (1 template) | 3 saat | - | orta | ✅ hemen |
| 6 | Tüm template'leri migrate | 5 saat | -6.700 | orta | 5'ten sonra |
| 7 | Form komponent audit + refactor | 2 saat | ? | belirsiz | araştırma sonrası |

**Mantıklı sıra:** 1 → 4 → 2 → 3 → 5 (POC) → 6 → 7
Hızlı kazanç + düşük risk olanlardan başla, en riskli büyük refactor'ı (template mimarisi) sona bırak.

---

## ✅ İlerleme takibi

- [ ] 1. Generated Prisma dosyaları git'ten çıkarıldı
- [ ] 2. resumeStore CRUD factory yazıldı, test geçti
- [ ] 3. Zod → TS tipi migrate edildi
- [ ] 4. TemplateThumbnail refactor edildi
- [ ] 5. Section renderer POC (ilk template)
- [ ] 6. Tüm template'ler section pattern'e taşındı
- [ ] 7. Form komponent refactor (araştırma sonrası)

---

## 🚧 Yapılmayacaklar (şimdilik)

Bazı duplicate'lar bilinçli tercihle silinmemeli:

- **Preview ↔ PDF tam paylaşım:** İki farklı render tekniği (`@react-pdf` vs HTML). Section-level abstraction paylaşılabilir ama render katmanı ayrı kalmalı.
- **Infographic template özel komponentleri:** Skill bar, timeline, gradient header — diğerlerinden farklı yapı. Section pattern'e zorla sokmak `variant` explosion'a yol açar. Ayrık tutmak daha temiz olabilir.
- **Terminal/ATS template override davranışları:** Terminal fontFamily'yi monospace'e zorluyor, ATS primaryColor'ı siyaha zorluyor. Config'te bu "theme override" desteklenmeli, yoksa bu iki template'i dışarıda tutmak daha iyi.

---

## 📝 Notlar

- Bu plan TODO.md'deki **"Template kopya kodu"** maddesinin detaylı genişlemesi
- Her adım ayrı commit olmalı ki regresyon çıkarsa `git bisect` çalışsın
- Template refactor öncesi görsel regresyon testi ekle (Playwright screenshot veya manuel 1 örnek CV ile)
