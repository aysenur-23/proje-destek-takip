// ─── Enums ────────────────────────────────────────────────────────────────────

export type SirketTuru =
  | "AS"
  | "LTD"
  | "SAHIS"
  | "KOOPERATIF"
  | "DERNEK_VAKIF"
  | "DIGER";

export type DestekKategori =
  | "TUBITAK"
  | "KOSGEB"
  | "TKDK"
  | "AB"
  | "SGK"
  | "TEKNOKENT"
  | "KALKINMA"
  | "TICARET"
  | "SANAYI"
  | "TARIM"
  | "DIGER";

export type DestekTuru = "HIBE" | "KREDI" | "VERGI_MUAFIYETI" | "PRIM_DESTEGI" | "KARMA";

// ─── Firma ────────────────────────────────────────────────────────────────────

export interface FirmaProfili {
  id?: string;
  ad: string;
  vergiNo?: string;
  kurulusYili: number;
  sirketTuru: SirketTuru;
  sektorKodu: string;
  sektorAdi: string;
  calısanSayisi: number;
  yillikCiro: number;
  ihracatYapiyorMu: boolean;
  argeYapiyorMu: boolean;
  teknokentteMi: boolean;
  osbdeMi: boolean;
  il: string;
  ilce?: string;
  kadinGirisimci: boolean;
  gencGirisimci: boolean;
  engellıCalisanVarMi: boolean;
  alinanDestekler: string[];
  notlar?: string;
}

// ─── Destek Programı ──────────────────────────────────────────────────────────

export interface EligibilityCriteria {
  sirketTurleri?: SirketTuru[];
  minCalisan?: number;
  maxCalisan?: number;
  minCiro?: number;
  maxCiro?: number;
  minKurulusYili?: number;
  maxKurulusYili?: number;
  sektorler?: string[];
  sektorHaric?: string[];
  bolgeKisiti?: string[];
  teknokentZorunlu?: boolean;
  argeZorunlu?: boolean;
  ihracatZorunlu?: boolean;
  osbZorunlu?: boolean;
  kadinGirisimciBonus?: boolean;
  gencGirisimciBonus?: boolean;
  tekrarBasvuruEngel?: boolean;
  notlar?: string;
}

export interface DestekProgrami {
  slug: string;
  ad: string;
  kurum: string;
  kategori: DestekKategori;
  tur: DestekTuru;
  aciklama: string;
  amac: string;
  butceUstSinir?: number;
  hibeOrani?: number;
  basvuruBaslangic?: string;
  basvuruBitis?: string;
  aktif: boolean;
  mevzuatUrl: string;
  rehberUrl?: string;
  kriterler: EligibilityCriteria;
  etiketler: string[];
  oncelik: number;
}

// ─── Filtreleme ───────────────────────────────────────────────────────────────

export interface FiltreSonucu {
  destek: DestekProgrami;
  uygunlukSkoru: number;
  uygunMu: boolean;
  eksikKriterler: string[];
  bonus: string[];
  aiYorumGerekli?: boolean;
}

export interface FiltreSecenekleri {
  kategoriler: DestekKategori[];
  sadecAktif: boolean;
  sadecUygun: boolean;
  minHibe?: number;
  aramaMetni: string;
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export interface AIFiltreSonucu {
  slug: string;
  tavsiye: boolean;
  gerekce: string;
  adimlar: string[];
}

export interface ProjeOnerisiBolumu {
  baslik: string;
  mevcutMetin: string;
  sorunlar: string[];
  onerilenDegisiklikler: string;
  puan: number;
}

export interface ProjeOnerisi {
  genelPuan: number;
  genelYorum: string;
  bolumler: ProjeOnerisiBolumu[];
  oncelikliDuzeltmeler: string[];
}

// ─── Kullanıcı & Auth ────────────────────────────────────────────────────────

export type Plan = "ucretsiz" | "premium";

export interface Kullanici {
  uid: string;
  email: string;
  ad: string;
  plan: Plan;
  olusturmaTarihi: string;
  premiumBitisTarihi?: string;
}

// ─── API Request/Response ────────────────────────────────────────────────────

export interface AIFiltreRequest {
  firma: FirmaProfili;
  destekSluglar: string[];
}

export interface ProjeAsistaniRequest {
  firmaId?: string;
  hedefDestekSlug: string;
  raporMetni: string;
}
