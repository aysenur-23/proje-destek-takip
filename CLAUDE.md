# Proje Destek Takip Sistemi — CLAUDE.md

## Proje Özeti

Şirkete özel Türk ve AB hibe/teşvik programlarını (TÜBİTAK, KOSGEB, TKDK, SGK, Teknokent, AB fonları vb.) filtreleyen, önceliklendiren ve proje başvurularını yapay zeka destekli geliştiren profesyonel bir web uygulaması.

---

## Tech Stack

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 15 (App Router) |
| Dil | TypeScript 5 |
| Stil | Tailwind CSS 4 + shadcn/ui |
| Veritabanı | PostgreSQL (Prisma ORM) |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| Auth | Firebase Authentication + firebase-admin (server) |
| Deployment | Vercel |

---

## Klasör Yapısı

```
proje-destek-takip/
├── CLAUDE.md
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
├── prisma/
│   └── schema.prisma          # Tüm DB şemaları
├── public/
│   └── logo.svg
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout (nav, footer)
│   │   ├── page.tsx           # Ana sayfa / dashboard
│   │   ├── firma/
│   │   │   └── page.tsx       # Firma profil formu
│   │   ├── destekler/
│   │   │   ├── page.tsx       # Destek keşif & filtre sayfası
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Tek destek detay sayfası
│   │   ├── proje-asistani/
│   │   │   └── page.tsx       # Modül 1: AI proje yazım asistanı
│   │   └── api/
│   │       ├── firma/
│   │       │   └── route.ts   # GET/POST firma profili
│   │       ├── destekler/
│   │       │   └── route.ts   # Filtrelenmiş destekler
│   │       └── ai/
│   │           ├── filtrele/
│   │           │   └── route.ts  # AI ek filtreleme
│   │           └── proje/
│   │               └── route.ts  # AI proje iyileştirme
│   ├── components/
│   │   ├── ui/                # shadcn temel bileşenler
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── firma/
│   │   │   ├── FirmaForm.tsx       # Firma bilgi formu
│   │   │   └── FirmaOzeti.tsx      # Profil özet kartı
│   │   ├── destekler/
│   │   │   ├── DestekKarti.tsx     # Tek destek kartı
│   │   │   ├── FiltrePaneli.tsx    # Sol filtre paneli
│   │   │   ├── DestekListesi.tsx   # Filtrelenmiş liste
│   │   │   └── AIFiltrele.tsx      # AI ek filtreleme widget
│   │   └── proje/
│   │       ├── RaporYukle.tsx      # PDF/DOCX upload
│   │       ├── MevzuatSecici.tsx   # Hedef destek seçimi
│   │       └── OnerilerPaneli.tsx  # AI öneriler
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── anthropic.ts       # Claude API client + helpers
│   │   ├── filtrele.ts        # Kural tabanlı filtreleme motoru
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts           # Tüm TypeScript tipleri
│   └── data/
│       └── destekler/         # Statik destek programı verileri
│           ├── index.ts       # Tüm destekleri export eden barrel
│           ├── tubitak.ts
│           ├── kosgeb.ts
│           ├── tkdk.ts
│           ├── ab-fonlari.ts
│           ├── sgk.ts
│           ├── teknokent.ts
│           ├── kalkinma-ajanslari.ts
│           ├── ticaret-bakanligi.ts
│           ├── sanayi-bakanligi.ts
│           └── tarim-bakanligi.ts
```

---

## Veri Modeli (Prisma)

### FirmaProfili
```
id, createdAt, updatedAt
ad, vergiNo, kurulusYili
sektor (NACE kodu + açıklama)
sirketTuru: enum (AS, LTD, SAHIS, KOOPERATIF, DERNEKvakif, DIGER)
calısanSayisi: number
yillikCiro: number (TL)
ihracatYapiyorMu: boolean
argeYapiyorMu: boolean
teknokentteMi: boolean
bolge: string (il + ilçe)
organize_sanayi_bolgesi: boolean
kadin_girisimci: boolean
genc_girisimci: boolean (≤35 yaş)
engelli_calisan_var_mi: boolean
daha_once_alinan_destekler: string[] (destek slug listesi)
notlar: string (serbest metin)
```

### DestekProgrami (statik seed verisi)
```
id, slug, ad, kurum
kategori: enum (TUBITAK, KOSGEB, TKDK, AB, SGK, TEKNOKENT, KALKINMA, TICARET, SANAYI, TARIM, DIGER)
aciklama, amac
butce_ust_sinir: number | null
hibe_orani: number (0-100)
kredi_mi: boolean
basvuru_baslangic: date | null
basvuru_bitis: date | null
aktif: boolean
mevzuat_url: string
rehber_url: string
kriterler: JSON  # EligibilityCriteria tipi
etiketler: string[]
```

### ProjeRaporu
```
id, createdAt
firmaId
hedef_destek_slug: string
orijinal_icerik: text
ai_onerileri: JSON
```

---

## Tip Sistemi (src/types/index.ts)

```typescript
// Firma profili (form + DB)
interface FirmaProfili { ... }

// Destek programı
interface DestekProgrami {
  slug: string
  ad: string
  kurum: string
  kategori: DestekKategori
  aciklama: string
  amac: string
  butceUstSinir?: number
  hibeOrani: number   // yüzde
  krediMi: boolean
  basvuruBaslangic?: Date
  basvuruBitis?: Date
  aktif: boolean
  mevzuatUrl: string
  rehberUrl?: string
  kriterler: EligibilityCriteria
  etiketler: string[]
}

// Uygunluk kriterleri (filtreleme motoru bunu kullanır)
interface EligibilityCriteria {
  sirketTurleri?: SirketTuru[]        // boşsa hepsi
  minCalisan?: number
  maxCalisan?: number
  minCiro?: number
  maxCiro?: number
  minKurulusYili?: number             // en eski yıl
  maxKurulusYili?: number             // en yeni yıl (yeni firma)
  sektorler?: string[]                // NACE kodları, boşsa hepsi
  sektorHaric?: string[]             // bu sektörler hariç
  bolgeKisiti?: string[]             // boşsa tüm TR
  teknokentZorunlu?: boolean
  argeZorunlu?: boolean
  ihracatZorunlu?: boolean
  kadinGirisimciBonus?: boolean       // ek puan/öncelik
  gencGirisimciBonus?: boolean
  tekrarBasvuruEngel?: boolean        // daha önce bu desteği aldıysa başvuramaz
  notlar?: string                     # insan okunabilir kural açıklaması
}

// Filtreleme sonucu
interface FiltreSonucu {
  destek: DestekProgrami
  uygunlukSkoru: number               // 0-100
  uygunMu: boolean
  eksikKriterler: string[]
  bonus: string[]
}
```

---

## Filtreleme Motoru (src/lib/filtrele.ts)

Kural tabanlı motor `firmaProfilini` ve `tümDestekleri` alır, her destek için `FiltreSonucu` döner.

Skor hesaplama:
- Temel uygunluk (boolean): tüm zorunlu kriterler geçilmeli
- Bonus kriterler: skor artışı (+10 her biri)
- Başvuru süresi dolmuşsa: `uygunMu=false`
- `aktif=false` olanlar listelenmez

---

## AI Entegrasyonu

### 1. AI Ek Filtreleme (`/api/ai/filtrele`)
- Girdi: firma profili + kural motoru uygun bulmadığı ama "sınırda" destekler
- Prompt: firma notları + destek mevzuat metni → Claude yorumlar
- Çıktı: `{ slug, tavsiye: boolean, gerekce: string, adimlar: string[] }`

### 2. AI Proje Asistanı (`/api/ai/proje`)
- Girdi: proje raporu metni + hedef destek slug
- Prompt stratejisi:
  1. Sistem mesajı: hedef desteğin değerlendirme kriterleri + genel proje yazım standartları
  2. Kullanıcı mesajı: mevcut rapor
  3. Claude çıktısı: bölüm bazlı öneriler JSON formatında
- Çıktı: `{ bolumler: { baslik, mevcut_metin, sorunlar, onerigelen_degisiklikler, puan }[] }`

### Claude API Kullanımı
- Model: `claude-sonnet-4-6`
- Prompt caching: sistem mesajları cache_control ile işaretlenmeli
- Streaming: proje asistanı yanıtı stream edilmeli (uzun içerik)
- Maks token: filtre=1000, proje=4000

---

## Destek Programları Kapsamı

### TÜBİTAK
- 1507 KOBİ Ar-Ge Başlangıç (hibe %75, max 750K TL)
- 1511 Öncelikli Alanlar Ar-Ge (hibe %60-75)
- 1512 Teknogirişim (BİGG)
- 1601 Yenilik Girişimcilik (kuluçka)
- 2209 Üniversite Öğrenci Projeleri
- 2244 Sanayi Doktora

### KOSGEB
- Girişimcilik Destek Programı (yeni kurulan)
- KOBİ Teknolojik Ürün Yatırım Destek Programı (TEP)
- Ar-Ge, İnovasyon ve Endüstriyel Uygulama
- İşletme Geliştirme ve Büyüme
- İhracat Pazarları Geliştirme
- Dijital Dönüşüm Destek Programı
- Stratejik Ürün Destek Programı (SÜR-GE)
- Kümelenme Destek Programı
- Nitelikli Eleman Destek Programı

### TKDK (IPARD III - 2021-2027)
- Tedbir 4.1 Tarımsal İşletmelerin Fiziki Varlıklarına Yönelik Yatırımlar
- Tedbir 4.2 Tarım Ürünlerinin İşlenmesi ve Pazarlanması
- Tedbir 7.1 Kırsal Altyapı
- Tedbir 7.4 Kırsal Turizm
- Tedbir 7.6 Köy Yenileme

### Sanayi Bakanlığı
- Teknoloji Odaklı Sanayi Hamlesi (TOSH)
- OSB Destek Programı
- Çevre İzinli Endüstriyel Simbiyoz
- Kümelenme Destekleri
- Yerli Malı Belgesi teşviki

### AB Fonları
- Horizon Europe (KOBİ aracı / EIC Accelerator)
- COSME / Avrupa Yatırım Fonu
- LIFE (çevre + iklim)
- Erasmus+ (KOBİ eğitim)
- Digital Europe Programme
- Creative Europe

### SGK Teşvikleri
- 4447 İşsizlik sigortası kanunu teşvikleri
- 5746 Ar-Ge personeli sigorta prim desteği
- 7252 Dijital dönüşüm istihdamı
- Engelli ve eski hükümlü istihdamı desteği
- Kısa çalışma ödeneği

### Teknokent (TGB)
- Kurumlar vergisi muafiyeti
- Gelir vergisi stopaj desteği
- KDV istisnası
- SGK prim desteği (Ar-Ge personeli)
- Patent tescil desteği

### Kalkınma Ajansları (BEBKA, İZKA, İSTKA, DOKA vb.)
- Doğrudan faaliyet desteği
- Teknik destek programı
- Küçük ölçekli altyapı
- Proje teklif çağrıları (yıllık)

### Ticaret Bakanlığı
- TURQUALITY (markalaşma)
- Yurt dışı birim/marka/tanıtım desteği
- E-ihracat desteği
- Tasarım desteği
- Pazar araştırma desteği
- İstihdam desteği (ihracat)
- Sektörel ticaret heyeti

### Tarım ve Orman Bakanlığı
- Kırsal kalkınma yatırım desteği
- Genç çiftçi desteği
- Tarımsal yayım destekleri
- Organik tarım desteği
- İyi tarım uygulamaları desteği

---

## UI/UX Prensipleri

1. **Sadelik**: Firma profili formu maksimum 20 soru, adım adım (wizard)
2. **Hız**: Filtreleme anlık (client-side kural motoru), AI ek filtreleme opsiyonel
3. **Şeffaflık**: Her destek için "neden uygun/uygun değil" açıklaması
4. **Güncellik**: Her destek kartında son güncelleme tarihi ve başvuru sayacı
5. **Renk kodu**: Yeşil=aktif+uygun, Sarı=uygun ama başvuru süresi belirsiz, Kırmızı=uygun değil, Gri=pasif
6. **Responsive**: Mobil öncelikli tasarım

---

## Environment Değişkenleri

```
# Veritabanı
DATABASE_URL=postgresql://...

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Firebase (client — NEXT_PUBLIC_ ile tarayıcıya açık)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin (server — gizli, asla NEXT_PUBLIC_ olmaz)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Ödeme
KT_MERCHANT_ID=...
KT_MERCHANT_PASSWORD=...
KT_MERCHANT_KEY=...

# Uygulama
NEXT_PUBLIC_APP_URL=https://www.destektakip.com
```

---

## Geliştirme Komutları

```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run db:push      # Prisma şemasını DB'ye uygula
npm run db:studio    # Prisma Studio (veritabanı UI)
npm run db:seed      # Destek programlarını seed et
npm run lint         # ESLint
npm run type-check   # TypeScript derleme kontrolü
```

---

## Geliştirme Sırası

1. [x] CLAUDE.md + proje yapısı
2. [ ] package.json + yapılandırma dosyaları
3. [ ] Prisma şeması
4. [ ] TypeScript tipleri
5. [ ] Statik destek verisi (tüm kategoriler)
6. [ ] Kural tabanlı filtreleme motoru
7. [ ] Next.js app layout + Navbar
8. [ ] Firma profil formu (wizard)
9. [ ] Destek listeleme + filtre paneli
10. [ ] Destek detay sayfası
11. [ ] AI ek filtreleme API + widget
12. [ ] Proje asistanı sayfası (Modül 1)
13. [ ] Seed scripti + veritabanı bağlantısı
14. [ ] Responsive polish + son test
