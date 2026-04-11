import type { Resume } from '@/types/resume'

export const sampleResume: Resume = {
  basics: {
    name: 'Ada Yıldız',
    label: 'Full-Stack Developer',
    email: 'ada.yildiz@example.com',
    phone: '+90 555 123 45 67',
    summary:
      '5+ yıllık deneyime sahip full-stack developer. React, Node.js ve PostgreSQL ile ölçeklenebilir web uygulamaları geliştiriyorum. Açık kaynak katkılar, takım liderliği ve performans optimizasyonu konularında tutkulu.',
    photo: '',
    profiles: [
      {
        network: 'LinkedIn',
        url: 'https://linkedin.com/in/ada-yildiz',
        username: 'ada-yildiz',
      },
      {
        network: 'GitHub',
        url: 'https://github.com/adayildiz',
        username: 'adayildiz',
      },
      {
        network: 'Website',
        url: 'https://adayildiz.dev',
        username: 'adayildiz',
      },
    ],
  },
  work: [
    {
      id: 'sample-work-1',
      company: 'ABC Teknoloji',
      position: 'Senior Full-Stack Developer',
      startDate: '2023-01',
      endDate: '',
      summary:
        'E-ticaret platformunun mikroservis mimarisine geçişinde teknik liderlik.',
      highlights: [
        'Checkout sayfasının performansını %40 artırarak dönüşüm oranını iyileştirdim',
        'React 18 + TypeScript ile yeni design system kurguladım (18 component)',
        '4 kişilik junior takımı mentörledim, kod review süreçlerini iyileştirdim',
      ],
    },
    {
      id: 'sample-work-2',
      company: 'XYZ Yazılım',
      position: 'Full-Stack Developer',
      startDate: '2020-06',
      endDate: '2022-12',
      summary:
        'B2B SaaS ürününde hem frontend hem backend tarafında aktif geliştirme.',
      highlights: [
        'Node.js ile REST API tasarladım ve Prisma ORM entegrasyonunu tamamladım',
        'PostgreSQL query optimizasyonu ile rapor sayfalarını 8sn\'den 1.2sn\'ye indirdim',
      ],
    },
  ],
  education: [
    {
      id: 'sample-edu-1',
      institution: 'İstanbul Teknik Üniversitesi',
      degree: 'Lisans',
      field: 'Bilgisayar Mühendisliği',
      startDate: '2015-09',
      endDate: '2019-06',
    },
  ],
  skills: [
    {
      id: 'sample-skill-1',
      name: 'Teknik Yetenekler',
      level: '',
      keywords: [
        'React',
        'TypeScript',
        'Node.js',
        'PostgreSQL',
        'Docker',
        'Git',
        'Tailwind CSS',
        'Prisma',
      ],
    },
  ],
  projects: [
    {
      id: 'sample-project-1',
      name: 'CV Builder',
      description:
        'Modern, açık kaynak CV oluşturma aracı. React, TypeScript ve Zustand ile geliştirildi. PDF export ve çoklu template desteği.',
      url: 'https://github.com/adayildiz/cv-builder',
      startDate: '2025-01',
      endDate: '',
    },
  ],
  languages: [
    {
      id: 'sample-lang-1',
      name: 'İngilizce',
      proficiency: 'c1',
    },
    {
      id: 'sample-lang-2',
      name: 'Almanca',
      proficiency: 'b1',
    },
  ],
  certificates: [
    {
      id: 'sample-cert-1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2024-03',
      url: 'https://credly.com/badges/sample',
    },
  ],
  volunteer: [],
  publications: [],
  customSections: [],
  templateId: 'classic',
  theme: {
    primaryColor: '#1f2937',
    textColor: '#111827',
    fontFamily: 'sans',
    spacing: 'normal',
  },
}
