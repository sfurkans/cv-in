import type { Resume } from '@/types/resume'

interface ClassicTemplateProps {
  resume: Resume
}

function formatMonth(value: string): string {
  if (!value) return ''
  const [year, month] = value.split('-')
  if (!year) return value
  if (!month) return year
  return `${month}/${year}`
}

function formatDateRange(start: string, end: string): string {
  const s = formatMonth(start)
  const e = formatMonth(end)
  if (!s && !e) return ''
  if (s && !e) return `${s} - Devam ediyor`
  if (!s && e) return e
  return `${s} - ${e}`
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 border-b border-gray-300 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-800">
      {children}
    </h2>
  )
}

export default function ClassicTemplate({ resume }: ClassicTemplateProps) {
  const {
    basics,
    work,
    education,
    skills,
    projects,
    languages,
    certificates,
    volunteer,
    publications,
  } = resume

  const skillKeywords = skills[0]?.keywords ?? []

  return (
    <div className="aspect-[210/297] w-full overflow-hidden bg-white p-8 font-sans text-[10px] leading-snug text-gray-900 shadow-sm">
      {/* Header */}
      <header className="mb-5 flex items-start gap-4 border-b border-gray-300 pb-4">
        {basics.photo && (
          <img
            src={basics.photo}
            alt={basics.name}
            className="h-20 w-20 shrink-0 rounded-full border border-gray-200 object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            {basics.name || 'Adınız Soyadınız'}
          </h1>
          {basics.label && (
            <p className="mt-0.5 text-sm text-gray-600">{basics.label}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-gray-600">
            {basics.email && <span>{basics.email}</span>}
            {basics.phone && <span>{basics.phone}</span>}
            {basics.profiles.map((profile, i) => (
              <span key={`${profile.network}-${i}`}>
                {profile.network}:{' '}
                <span className="text-gray-700">{profile.url}</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Summary */}
      {basics.summary && (
        <section className="mb-4">
          <SectionHeading>Özet</SectionHeading>
          <p className="text-gray-700">{basics.summary}</p>
        </section>
      )}

      {/* Experience */}
      {work.length > 0 && (
        <section className="mb-4">
          <SectionHeading>Deneyim</SectionHeading>
          <div className="space-y-3">
            {work.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {item.position || 'Pozisyon'}
                    {item.company && (
                      <span className="font-normal text-gray-600">
                        {' — '}
                        {item.company}
                      </span>
                    )}
                  </h3>
                  <span className="shrink-0 text-[9px] text-gray-500">
                    {formatDateRange(item.startDate, item.endDate)}
                  </span>
                </div>
                {item.summary && (
                  <p className="mt-0.5 text-gray-700">{item.summary}</p>
                )}
                {item.highlights.some((h) => h.trim()) && (
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-gray-700">
                    {item.highlights
                      .filter((h) => h.trim())
                      .map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4">
          <SectionHeading>Eğitim</SectionHeading>
          <div className="space-y-2">
            {education.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {item.institution || 'Okul'}
                  </h3>
                  <span className="shrink-0 text-[9px] text-gray-500">
                    {formatDateRange(item.startDate, item.endDate)}
                  </span>
                </div>
                {(item.degree || item.field) && (
                  <p className="text-gray-700">
                    {[item.degree, item.field].filter(Boolean).join(' — ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillKeywords.length > 0 && (
        <section className="mb-4">
          <SectionHeading>Yetenekler</SectionHeading>
          <div className="flex flex-wrap gap-1.5">
            {skillKeywords.map((keyword, i) => (
              <span
                key={`${keyword}-${i}`}
                className="rounded-sm border border-gray-300 bg-gray-50 px-1.5 py-0.5 text-[9px] text-gray-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-4">
          <SectionHeading>Projeler</SectionHeading>
          <div className="space-y-2">
            {projects.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {item.name || 'Proje'}
                  </h3>
                  <span className="shrink-0 text-[9px] text-gray-500">
                    {formatDateRange(item.startDate, item.endDate)}
                  </span>
                </div>
                {item.description && (
                  <p className="mt-0.5 text-gray-700">{item.description}</p>
                )}
                {item.url && (
                  <p className="mt-0.5 text-[9px] text-gray-500">{item.url}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-4">
          <SectionHeading>Diller</SectionHeading>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {languages.map((item) => (
              <div key={item.id} className="text-gray-700">
                <span className="font-medium text-gray-900">{item.name}</span>
                {item.proficiency && (
                  <span className="ml-1 text-gray-500">
                    — {item.proficiency.toUpperCase()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <section className="mb-4">
          <SectionHeading>Sertifikalar</SectionHeading>
          <div className="space-y-1.5">
            {certificates.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {item.name}
                    {item.issuer && (
                      <span className="font-normal text-gray-600">
                        {' — '}
                        {item.issuer}
                      </span>
                    )}
                  </h3>
                  <span className="shrink-0 text-[9px] text-gray-500">
                    {formatMonth(item.date)}
                  </span>
                </div>
                {item.url && (
                  <p className="text-[9px] text-gray-500">{item.url}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteer */}
      {volunteer.length > 0 && (
        <section className="mb-4">
          <SectionHeading>Gönüllülük</SectionHeading>
          <div className="space-y-2">
            {volunteer.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {item.role || 'Rol'}
                    {item.organization && (
                      <span className="font-normal text-gray-600">
                        {' — '}
                        {item.organization}
                      </span>
                    )}
                  </h3>
                  <span className="shrink-0 text-[9px] text-gray-500">
                    {formatDateRange(item.startDate, item.endDate)}
                  </span>
                </div>
                {item.summary && (
                  <p className="mt-0.5 text-gray-700">{item.summary}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {publications.length > 0 && (
        <section className="mb-4">
          <SectionHeading>Yayınlar</SectionHeading>
          <div className="space-y-1.5">
            {publications.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {item.name}
                    {item.publisher && (
                      <span className="font-normal text-gray-600">
                        {' — '}
                        {item.publisher}
                      </span>
                    )}
                  </h3>
                  <span className="shrink-0 text-[9px] text-gray-500">
                    {formatMonth(item.date)}
                  </span>
                </div>
                {item.url && (
                  <p className="text-[9px] text-gray-500">{item.url}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
