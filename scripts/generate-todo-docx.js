const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, Header, Footer, PageNumber, ExternalHyperlink
} = require('docx');
const fs = require('fs');

const BRAND_BLUE = "1A56DB";
const BRAND_DARK = "111827";
const BRAND_GRAY = "6B7280";
const LIGHT_BLUE = "EFF6FF";
const LIGHT_RED = "FEF2F2";
const LIGHT_YELLOW = "FFFBEB";
const LIGHT_GREEN = "F0FDF4";
const RED = "DC2626";
const ORANGE = "D97706";
const GREEN = "16A34A";
const WHITE = "FFFFFF";

const border = { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text, color = BRAND_BLUE) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: color, space: 8 } },
    children: [new TextRun({ text, font: "Arial", size: 36, bold: true, color })]
  });
}

function h2(text, color = BRAND_DARK) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 28, bold: true, color })]
  });
}

function h3(text, color = BRAND_DARK) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color })]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: BRAND_DARK, ...opts })]
  });
}

function bullet(text, indent = 720) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 40, after: 40 },
    indent: { left: indent, hanging: 360 },
    children: [new TextRun({ text, font: "Arial", size: 21, color: BRAND_DARK })]
  });
}

function checkbox(text, indent = 720) {
  return new Paragraph({
    numbering: { reference: "checkboxes", level: 0 },
    spacing: { before: 40, after: 40 },
    indent: { left: indent, hanging: 360 },
    children: [new TextRun({ text, font: "Arial", size: 21, color: BRAND_DARK })]
  });
}

function spacer(size = 160) {
  return new Paragraph({ spacing: { before: size, after: 0 }, children: [new TextRun("")] });
}

function badgePara(label, color, bgColor, text) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 8160],
    rows: [new TableRow({
      children: [
        new TableCell({
          borders: noBorders,
          width: { size: 1200, type: WidthType.DXA },
          shading: { fill: bgColor, type: ShadingType.CLEAR },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: label, font: "Arial", size: 18, bold: true, color: WHITE })]
          })]
        }),
        new TableCell({
          borders: noBorders,
          width: { size: 8160, type: WidthType.DXA },
          shading: { fill: "F9FAFB", type: ShadingType.CLEAR },
          margins: { top: 60, bottom: 60, left: 160, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({ text, font: "Arial", size: 20, color: BRAND_DARK })]
          })]
        })
      ]
    })]
  });
}

function scoreTable(rows) {
  const headerRow = new TableRow({
    children: [
      makeCell("KATEGORİ", 3960, "1F2937", true, WHITE),
      makeCell("PUAN", 1080, "1F2937", true, WHITE),
      makeCell("NOTLAR", 4320, "1F2937", true, WHITE),
    ]
  });
  const dataRows = rows.map(([cat, score, note, color]) => new TableRow({
    children: [
      makeCell(cat, 3960, BRAND_DARK, false, "F9FAFB"),
      makeCell(score, 1080, color || BRAND_DARK, true, "F9FAFB"),
      makeCell(note, 4320, BRAND_GRAY, false, "F9FAFB"),
    ]
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3960, 1080, 4320],
    rows: [headerRow, ...dataRows]
  });
}

function makeCell(text, width, color, bold, fill) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: fill || WHITE, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    children: [new Paragraph({
      children: [new TextRun({ text, font: "Arial", size: 20, color, bold: !!bold })]
    })]
  });
}

function priorityBlock(label, bgColor, textColor, items) {
  const rows = items.map(([code, file, desc, pri]) => new TableRow({
    children: [
      makeCell(code, 1800, BRAND_DARK, true, WHITE),
      makeCell(file, 3000, BRAND_BLUE, false, WHITE),
      makeCell(desc, 3000, BRAND_DARK, false, WHITE),
      makeCell(pri, 1560, textColor, true, bgColor),
    ]
  }));
  const header = new TableRow({
    children: [
      makeCell("KOD", 1800, WHITE, true, "374151"),
      makeCell("DOSYA", 3000, WHITE, true, "374151"),
      makeCell("SORUN", 3000, WHITE, true, "374151"),
      makeCell("ÖNCELİK", 1560, WHITE, true, "374151"),
    ]
  });
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1800, 3000, 3000, 1560],
    rows: [header, ...rows]
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "checkboxes",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "□", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: BRAND_BLUE },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: BRAND_DARK },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: BRAND_DARK },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND_BLUE, space: 4 } },
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "Proje Destek Takip", font: "Arial", size: 18, bold: true, color: BRAND_BLUE }),
            new TextRun({ text: "   |   Kapsamlı Değerlendirme & Todo Raporu", font: "Arial", size: 18, color: BRAND_GRAY }),
            new TextRun({ text: "\t4 Mayıs 2026", font: "Arial", size: 18, color: BRAND_GRAY }),
          ],
          tabStops: [{ type: "right", position: 9026 }]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB", space: 4 } },
          spacing: { before: 80 },
          children: [
            new TextRun({ text: "Gizli — Dahili Kullanım", font: "Arial", size: 16, color: BRAND_GRAY }),
            new TextRun({ text: "\tSayfa ", font: "Arial", size: 16, color: BRAND_GRAY }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: BRAND_GRAY }),
          ],
          tabStops: [{ type: "right", position: 9026 }]
        })]
      })
    },
    children: [
      // ─── KAPAK BÖLÜMÜ ───
      spacer(400),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "PROJE DESTEK TAKİP SİSTEMİ", font: "Arial", size: 52, bold: true, color: BRAND_BLUE })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 40 },
        children: [new TextRun({ text: "Kapsamlı Değerlendirme & Todo Raporu", font: "Arial", size: 32, color: BRAND_GRAY })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 400 },
        children: [new TextRun({ text: "Dışarıdan Bakış — 4 Mayıs 2026", font: "Arial", size: 22, color: BRAND_GRAY, italics: true })]
      }),

      // Genel durum kartı
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [2256, 2256, 2257, 2257],
        rows: [new TableRow({
          children: [
            new TableCell({
              borders: noBorders,
              width: { size: 2256, type: WidthType.DXA },
              shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR },
              margins: { top: 160, bottom: 160, left: 160, right: 160 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "53", font: "Arial", size: 56, bold: true, color: BRAND_BLUE })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "TypeScript Dosyası", font: "Arial", size: 18, color: BRAND_GRAY })] }),
              ]
            }),
            new TableCell({
              borders: noBorders,
              width: { size: 2256, type: WidthType.DXA },
              shading: { fill: LIGHT_GREEN, type: ShadingType.CLEAR },
              margins: { top: 160, bottom: 160, left: 160, right: 160 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "11", font: "Arial", size: 56, bold: true, color: GREEN })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tamamlanmış Sayfa", font: "Arial", size: 18, color: BRAND_GRAY })] }),
              ]
            }),
            new TableCell({
              borders: noBorders,
              width: { size: 2257, type: WidthType.DXA },
              shading: { fill: LIGHT_YELLOW, type: ShadingType.CLEAR },
              margins: { top: 160, bottom: 160, left: 160, right: 160 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "40+", font: "Arial", size: 56, bold: true, color: ORANGE })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Destek Programı", font: "Arial", size: 18, color: BRAND_GRAY })] }),
              ]
            }),
            new TableCell({
              borders: noBorders,
              width: { size: 2257, type: WidthType.DXA },
              shading: { fill: LIGHT_RED, type: ShadingType.CLEAR },
              margins: { top: 160, bottom: 160, left: 160, right: 160 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "6/10", font: "Arial", size: 56, bold: true, color: RED })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Production Hazırlığı", font: "Arial", size: 18, color: BRAND_GRAY })] }),
              ]
            }),
          ]
        })]
      }),

      spacer(300),

      // ─── BÖLÜM 1: GENEL DEĞERLENDİRME ───
      h1("1. Dışarıdan Genel Değerlendirme"),

      h2("1.1 Güçlü Yönler"),
      bullet("53 TypeScript/TSX dosyası, ~7.200+ satır — ciddi ve tutarlı bir kod tabanı"),
      bullet("11 sayfa tamamen oluşturulmuş ve stillendirilmiş (hero, auth, planlar, odeme dahil)"),
      bullet("40+ destek programı tam uygunluk kriterleriyle veri dosyalarına işlenmiş"),
      bullet("Firebase auth + Anthropic Claude AI + Kuveyt Türk ödeme entegrasyonları mevcut"),
      bullet("Tailwind tema, animasyonlar ve responsive tasarım profesyonel görünüm veriyor"),
      bullet("Kural tabanlı filtreleme motoru (filtrele.ts) bağımsız ve test edilebilir yapıda"),

      spacer(120),
      h2("1.2 Kritik Sorunlar (İlk İzlenime Etkisi)"),
      bullet("public/ klasörü yok — favicon, og:image, logo dosyası eksik; tarayıcı sekmesi boş"),
      bullet("Sosyal medya paylaşımında önizleme görsel ve açıklaması gelmiyor (OpenGraph yok)"),
      bullet("next.config.ts tamamen boş — güvenlik header’ları ve CSP tanımlı değil"),
      bullet("Auth implementasyonu CLAUDE.md’deki NextAuth belgesiyle örtüşmüyor (Firebase kullanıyor)"),
      bullet("Veritabanı bağlı değil — .env.local içinde placeholder anahtarlar var"),
      bullet("API route’larına auth/premium plan kontrolü yok — herkes AI endpoint’lerine erişebilir"),

      spacer(200),

      // ─── BÖLÜM 2: PUAN TABLOSU ───
      h1("2. Puan Tablosu"),
      para("Aşağıdaki skorlar bir dış gözlemci perspektifinden verilmiştir."),
      spacer(80),
      scoreTable([
        ["Kod Kalitesi & Mimari", "8/10", "TypeScript strict, iyi bileşen yapısı, tip sistemi tutarlı", GREEN],
        ["UI/UX Profesyonellik", "7/10", "Güzel tasarım ancak favicon/og-image eksik", ORANGE],
        ["İçerik Yeterliliği", "7/10", "40+ program var ama güncellik doğrulanmamış", ORANGE],
        ["Sistem Çalışırlığı", "5/10", "DB bağlı değil, env placeholder, auth tutarsız", RED],
        ["Güvenlik", "4/10", "API auth yok, CSP yok, rate limit yok", RED],
        ["SEO / Bulunabilirlik", "3/10", "Metadata eksik, public/ yok, sitemap yok", RED],
        ["Test Kapsamı", "0/10", "Hiç test yok — kritik iş mantığı doğrulanmamış", RED],
        ["Deployment Hazırlığı", "5/10", "Vercel config var ama env’ler eksik", ORANGE],
        ["GENEL", "6/10", "Çekirdek sağlam, production için henüz hazır değil", ORANGE],
      ]),

      spacer(200),

      // ─── BÖLÜM 3: KRİTİK — P0 ───
      h1("3. Kritik Görevler — Production Öncesi (P0)", RED),
      para("Bu maddeler yapılmadan sistem canlıya alınamaz."),

      spacer(100),
      h3("INFRA-01: PostgreSQL Veritabanı Bağlantısı"),
      checkbox(".env.local içinde gerçek DATABASE_URL tanımla"),
      checkbox("npx prisma db push ile şemayı uygula"),
      checkbox("npm run db:seed ile 40+ program verisini seed et"),
      checkbox("prisma/seed.ts dosyasının çalıştığını doğrula"),
      checkbox("Vercel üzerinde Postgres entegrasyonu kur (Vercel Postgres veya Neon)"),

      spacer(80),
      h3("INFRA-02: Firebase Gerçek Credentials"),
      checkbox(".env.local içindeki placeholder Firebase anahtarlarını gerçeklerle değiştir"),
      checkbox("Firebase Console’da Email/Password + Google provider’ı aktif et"),
      checkbox("Firebase Firestore güvenlik kurallarını yaz"),
      checkbox("Vercel’e Firebase env değişkenlerini ekle"),

      spacer(80),
      h3("INFRA-03: public/ Klasörü Oluştur"),
      checkbox("public/ klasörü oluştur"),
      checkbox("public/favicon.ico ekle (16x16, 32x32)"),
      checkbox("public/og-image.png oluştur (1200×630px, sosyal medya önizlemesi)"),
      checkbox("public/logo.svg / public/logo.png ekle"),
      checkbox("public/apple-touch-icon.png (180×180px) ekle"),
      checkbox("public/robots.txt ve sitemap ekle"),

      spacer(80),
      h3("INFRA-04: SEO Metadata"),
      checkbox("src/app/layout.tsx’e openGraph metadata ekle"),
      checkbox("twitter:card metadata ekle"),
      checkbox("Her sayfaya özgü generateMetadata() fonksiyonu ekle"),
      checkbox("canonical URL tanımla"),

      spacer(80),
      h3("SECURITY-01: next.config.ts Güvenlik Konfigürasyonu"),
      checkbox("Güvenlik HTTP header’larını ekle (X-Frame-Options, HSTS, X-Content-Type-Options)"),
      checkbox("Content Security Policy (CSP) tanımla"),
      checkbox("Image domain whitelist’i yapılandır"),

      spacer(80),
      h3("SECURITY-02: API Route Kimlik Doğrulama"),
      checkbox("/api/ai/filtrele route’una auth middleware ekle"),
      checkbox("/api/ai/proje route’una auth + premium plan kontrolü ekle"),
      checkbox("AI endpoint’lerine rate limiting ekle (maliyet koruma)"),
      checkbox("Kuveyt Türk webhook’larına imza doğrulama ekle"),

      spacer(200),

      // ─── BÖLÜM 4: YÜKSEK ÖNCELİK — P1 ───
      h1("4. Yüksek Öncelik — İlk Hafta (P1)", ORANGE),

      h3("CLAUDE_MD-01: Mimari Tutarsızlığı Gider"),
      checkbox("CLAUDE.md’yi güncelle: NextAuth → Firebase olarak düzelt"),
      checkbox("types/index.ts’deki Kullanici arayüzünü Firebase User ile uyumlu hale getir"),
      checkbox("Auth context’in tüm sayfalarda düzgün çalıştığını doğrula"),

      spacer(80),
      h3("UX-01: Firma Profil Formu — Veri Kalıcılığı"),
      checkbox("Oturum açıkken form verisini Firestore/DB’ye kaydet (sadece localStorage yetmiyor)"),
      checkbox("Form adım ilerlemesi sayfa yenilemede kaybolmamalı"),
      checkbox("Oturum açmadan doldurulan form’u giriş sonrası kaydet"),

      spacer(80),
      h3("UX-02: Yükleme ve Hata Durumları"),
      checkbox("Tüm API çağrıları için loading skeleton ekle"),
      checkbox("src/app/loading.tsx (Next.js loading UI) her route için oluştur"),
      checkbox("src/app/error.tsx (React error boundary) oluştur"),
      checkbox("AI streaming yanıtı için ‘düşünüyor...’ animasyonu"),

      spacer(80),
      h3("CONTENT-01: Destek Programı Güncellik Kontrolü"),
      checkbox("Her destek kartına ‘Son güncelleme: [tarih]’ bilgisi ekle"),
      checkbox("Süresi geçmiş programları otomatik gri yap"),
      checkbox("src/data/destekler/*.ts dosyalarındaki tarihlerini 2026 için doğrula"),
      checkbox("KOSGEB Dijital Dönüşüm bütçe limitlerini kontrol et"),
      checkbox("TKDK IPARD III 2026 çağrılarını ekle"),

      spacer(80),
      h3("PERF-01: Statik Oluşturma"),
      checkbox("destekler/[slug]/page.tsx için generateStaticParams ekle (ISR)"),
      checkbox("Destek listesi için revalidate değeri ayarla (24 saat)"),
      checkbox("Büyük bileşenleri lazy load et (ROI hesaplayıcı, testimonials)"),

      spacer(200),

      // ─── BÖLÜM 5: ORTA ÖNCELİK — P2 ───
      h1("5. Orta Öncelik — İlk Ay (P2)"),

      h3("FEATURE-01: Kullanıcı Paneli / Dashboard"),
      checkbox("/dashboard sayfası oluştur"),
      checkbox("Kullanıcının kaydettiği destekler listesi"),
      checkbox("Başvuru durumu takibi (başvuruldu / değerlendirmede / kabul/red)"),
      checkbox("Profil düzenleme sayfası"),

      spacer(80),
      h3("FEATURE-02: Bildirim Sistemi"),
      checkbox("Yeni destek programı açıldığında email bildirimi"),
      checkbox("Başvuru son tarihi yakılaşınca hatırlatma (7 gün, 3 gün, 1 gün)"),
      checkbox("Email gönderme: Resend veya SendGrid entegrasyonu"),

      spacer(80),
      h3("FEATURE-03: Admin Paneli"),
      checkbox("Destek programlarını kod yazmadan güncelleyebilmek için basit admin UI"),
      checkbox("Program aktif/pasif yapma"),
      checkbox("Başvuru tarihlerini düzenleme formu"),

      spacer(80),
      h3("TEST-01: Test Altyapısı"),
      checkbox("Jest + Testing Library kurulumu"),
      checkbox("filtrele.ts için unit testler yaz (en kritik iş mantığı)"),
      checkbox("anthropic.ts için mock testler"),
      checkbox("Playwright ile e2e test: form doldur → filtrele → detay gör"),

      spacer(80),
      h3("A11Y-01: Erişilebilirlik"),
      checkbox("Tüm formlarda aria-label, aria-describedby kontrol et"),
      checkbox("Klavye navigasyonu test et (Tab, Enter, Escape)"),
      checkbox("Renk kontrasını WCAG AA ile doğrula"),

      spacer(80),
      h3("ANALYTICS-01: Kullanım Takibi"),
      checkbox("Vercel Analytics ekle (@vercel/analytics)"),
      checkbox("Hangi destek programlarının en çok görüntülendigini takip et"),
      checkbox("Conversion funnel: kayıt → profil doldur → program bul → AI analiz"),

      spacer(200),

      // ─── BÖLÜM 6: DÜŞÜK ÖNCELİK — P3 ───
      h1("6. Düşük Öncelik — Sonraki Çeyrek (P3)", BRAND_GRAY),

      h3("FEATURE-04: Raporlama"),
      checkbox("Kullanıcıya PDF rapor: ‘Firmam için uygun 10 destek programı’"),
      checkbox("Excel export: program listesi + uygunluk skoru"),
      checkbox("Proje asistanı çıktısını PDF olarak indir"),

      spacer(60),
      h3("INFRA-05: Monitoring & Observability"),
      checkbox("Sentry hata takibi ekle (@sentry/nextjs)"),
      checkbox("Vercel Speed Insights ekle"),
      checkbox("Anthropic API token kullanımını dashboard’da göster (maliyet takibi)"),

      spacer(60),
      h3("INFRA-06: CI/CD Pipeline"),
      checkbox(".github/workflows/ci.yml oluştur (lint + type-check + test)"),
      checkbox("Preview deployment’ları aktif et (Vercel PR preview)"),

      spacer(60),
      h3("CONTENT-02: Blog / İçerik Pazarlama"),
      checkbox("/blog sayfası ve MDX tabanlı içerik"),
      checkbox("‘TÜBİTAK 1507’ye nasıl başvurulur?’ rehber yazıları"),
      checkbox("SEO için long-tail keyword’ler"),

      spacer(200),

      // ─── BÖLÜM 7: HIZLI KAZANIMLAR ───
      h1("7. Hızlı Kazanımlar (1-2 Saatte Yapılabilir)"),
      para("Bu 6 madde yapıldığında görsel profesyonellik anında artar:"),
      spacer(80),

      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [540, 3600, 4886],
        rows: [
          new TableRow({ children: [
            makeCell("#", 540, WHITE, true, BRAND_BLUE),
            makeCell("Görev", 3600, WHITE, true, BRAND_BLUE),
            makeCell("Etki", 4886, WHITE, true, BRAND_BLUE),
          ]}),
          new TableRow({ children: [
            makeCell("1", 540, BRAND_DARK, true, "F0FDF4"),
            makeCell("public/favicon.ico + og-image.png oluştur", 3600, BRAND_DARK, false, "F0FDF4"),
            makeCell("Tarayıcı sekmesi profesyonel görünür, sosyal medya paylaşımı çalışır", 4886, BRAND_GRAY, false, "F0FDF4"),
          ]}),
          new TableRow({ children: [
            makeCell("2", 540, BRAND_DARK, true, WHITE),
            makeCell("layout.tsx’e openGraph metadata ekle", 3600, BRAND_DARK, false, WHITE),
            makeCell("LinkedIn, Twitter, WhatsApp paylaşımında görsel + başlık gelir", 4886, BRAND_GRAY, false, WHITE),
          ]}),
          new TableRow({ children: [
            makeCell("3", 540, BRAND_DARK, true, "F0FDF4"),
            makeCell("next.config.ts’e güvenlik header’ları ekle", 3600, BRAND_DARK, false, "F0FDF4"),
            makeCell("Penetrasyon testi / güvenlik tarayıcısı uyarıları kalkar", 4886, BRAND_GRAY, false, "F0FDF4"),
          ]}),
          new TableRow({ children: [
            makeCell("4", 540, BRAND_DARK, true, WHITE),
            makeCell("src/app/loading.tsx skeleton oluştur", 3600, BRAND_DARK, false, WHITE),
            makeCell("Sayfa geçişleri profesyonel skeleton gösterir", 4886, BRAND_GRAY, false, WHITE),
          ]}),
          new TableRow({ children: [
            makeCell("5", 540, BRAND_DARK, true, "F0FDF4"),
            makeCell("src/app/error.tsx hata sayfası oluştur", 3600, BRAND_DARK, false, "F0FDF4"),
            makeCell("Runtime hataları kullanıcıya boş sayfa yerine anlamlı mesaj gösterir", 4886, BRAND_GRAY, false, "F0FDF4"),
          ]}),
          new TableRow({ children: [
            makeCell("6", 540, BRAND_DARK, true, WHITE),
            makeCell("CLAUDE.md’de NextAuth → Firebase düzeltmesi", 3600, BRAND_DARK, false, WHITE),
            makeCell("Dokuman ve kod tutarlılığı sağlanır, konfigürasyon kargaşası önlenir", 4886, BRAND_GRAY, false, WHITE),
          ]}),
        ]
      }),

      spacer(200),

      // ─── BÖLÜM 8: DOSYA REFERANSLARI ───
      h1("8. Kritik Dosya Referansları"),

      priorityBlock("P0", LIGHT_RED, RED, [
        ["next.config.ts", "next.config.ts", "Tamamen boş — güvenlik yok", "P0"],
        ["layout.tsx", "src/app/layout.tsx", "SEO metadata eksik", "P0"],
        [".env.local", ".env.local", "Placeholder anahtarlar var", "P0"],
        ["seed.ts", "prisma/seed.ts", "Test edilmedi, DB bağlı değil", "P0"],
        ["filtrele API", "src/app/api/ai/filtrele/route.ts", "Auth kontrolü yok", "P0"],
        ["proje API", "src/app/api/ai/proje/route.ts", "Auth + premium kontrolü yok", "P0"],
      ]),

      spacer(120),
      priorityBlock("P1", LIGHT_YELLOW, ORANGE, [
        ["destekler data", "src/data/destekler/*.ts", "2026 tarihleri doğrulanmadı", "P1"],
        ["FirmaForm", "src/components/firma/FirmaForm.tsx", "Veri DB’ye kaydedilmiyor", "P1"],
        ["CLAUDE.md", "CLAUDE.md", "NextAuth deniyor, Firebase kullanılıyor", "P1"],
        ["AuthContext", "src/contexts/AuthContext.tsx", "Firestore kuralları yazılmadı", "P1"],
      ]),

      spacer(300),

      // ─── SONUÇ ───
      h1("Sonuç"),
      para("Bu proje mimarisi ve kod kalitesi açısından sağlam bir temel üzerine kurulmuştur. Tüm ana sayfalar ve çekirdek özellikler çalışır durumda, AI entegrasyonu ve ödeme altyapısı mevcut."),
      spacer(80),
      para("Ancak production’a alınabilmesi için özellikle altyapı (veritabanı bağlantısı, gerçek env değişkenleri), güvenlik (API auth, rate limiting) ve görünürlük (favicon, SEO metadata) kategorilerindeki P0 maddelerin tamamlanması şarttır."),
      spacer(80),
      para("Hızlı kazanımlar bölümündeki 6 madde 1-2 saat içinde yapılarak dış gözlemcinin ilk izlenimi önemli ölçüde iyileştirilebilir.", { italics: true, color: BRAND_GRAY }),

      spacer(200),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("todo-degerlendirme-raporu.docx", buffer);
  console.log("Dosya olusturuldu: todo-degerlendirme-raporu.docx");
});
