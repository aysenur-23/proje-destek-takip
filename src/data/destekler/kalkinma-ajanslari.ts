import type { DestekProgrami } from "@/types";

export const kalkinmaAjanslariDestekleri: DestekProgrami[] = [
  {
    slug: "kalkinma-dogrudan-faaliyet",
    ad: "Kalkınma Ajansı Doğrudan Faaliyet Desteği",
    kurum: "Kalkınma Ajansları (26 Ajans)",
    kategori: "KALKINMA",
    tur: "HIBE",
    aciklama:
      "Bölgesel kalkınmaya katkı sağlayan acil ve küçük ölçekli faaliyetlere hızlı hibe desteği.",
    amac: "Bölgesel kalkınma önceliklerine uygun küçük ölçekli faaliyetleri desteklemek.",
    butceUstSinir: 300000,
    hibeOrani: 100,
    aktif: true,
    mevzuatUrl: "https://www.kalkinma.gov.tr",
    etiketler: ["kalkınma ajansı", "bölgesel", "hızlı destek", "küçük ölçek"],
    oncelik: 2,
    kriterler: {
      notlar: "İl bazında ilgili kalkınma ajansına (İSTKA, İZKA, BEBKA vb.) başvurulmalı. Kâr amacı olmayan kuruluşlara öncelik.",
    },
  },
  {
    slug: "kalkinma-mali-destek",
    ad: "Kalkınma Ajansı Mali Destek Programı (Teklif Çağrısı)",
    kurum: "Kalkınma Ajansları",
    kategori: "KALKINMA",
    tur: "HIBE",
    aciklama:
      "Her ajansın yıllık bölge planına uygun proje teklif çağrıları; KOBİ, STK ve kamu kurumları başvurabilir.",
    amac: "Bölgesel önceliklere uygun projeleri finanse etmek.",
    butceUstSinir: 2000000,
    hibeOrani: 75,
    aktif: true,
    mevzuatUrl: "https://www.kalkinma.gov.tr/destekler",
    etiketler: ["kalkınma ajansı", "mali destek", "teklif çağrısı", "bölgesel", "yıllık"],
    oncelik: 2,
    kriterler: {
      notlar: "Her ajans yılda 1-3 çağrı açar; öncelikler ajana ve yıla göre değişir. Eş finansman (%25-50) gereklidir.",
    },
  },
  {
    slug: "kalkinma-teknik-destek",
    ad: "Kalkınma Ajansı Teknik Destek Programı",
    kurum: "Kalkınma Ajansları",
    kategori: "KALKINMA",
    tur: "HIBE",
    aciklama:
      "Eğitim, danışmanlık, araştırma ve tanıtım faaliyetleri için uzman desteği ve hibe.",
    amac: "Kurumsal kapasite ve bilgi birikimini artırmak.",
    butceUstSinir: 150000,
    hibeOrani: 100,
    aktif: true,
    mevzuatUrl: "https://www.kalkinma.gov.tr/destekler",
    etiketler: ["teknik destek", "eğitim", "danışmanlık", "kalkınma ajansı"],
    oncelik: 3,
    kriterler: {
      notlar: "Para yardımı değil; ajans uzmanları veya uzman firmaları aracılığıyla hizmet sağlanır.",
    },
  },
];
