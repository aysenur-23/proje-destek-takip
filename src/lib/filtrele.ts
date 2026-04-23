import type { DestekProgrami, EligibilityCriteria, FiltreSonucu, FirmaProfili } from "@/types";

const BUGUN = new Date();

function firmaYasiHesapla(kurulusYili: number): number {
  return BUGUN.getFullYear() - kurulusYili;
}

function sektorUyumu(firmaSektoru: string, kriterSektorler?: string[], kriterHaric?: string[]): boolean {
  if (kriterHaric?.length && kriterHaric.some((k) => firmaSektoru.startsWith(k))) return false;
  if (!kriterSektorler?.length) return true;
  return kriterSektorler.some((k) => firmaSektoru.startsWith(k));
}

function bolgeUyumu(firmaIl: string, kriterBolge?: string[]): boolean {
  if (!kriterBolge?.length) return true;
  return kriterBolge.includes(firmaIl);
}

function basvuruAcikMi(bitis?: string): boolean {
  if (!bitis) return true;
  return new Date(bitis) >= BUGUN;
}

export function destekUygunlukDegerlendir(
  firma: FirmaProfili,
  destek: DestekProgrami,
): FiltreSonucu {
  if (!destek.aktif) {
    return { destek, uygunlukSkoru: 0, uygunMu: false, eksikKriterler: ["Destek programı aktif değil"], bonus: [] };
  }

  if (!basvuruAcikMi(destek.basvuruBitis)) {
    return { destek, uygunlukSkoru: 0, uygunMu: false, eksikKriterler: ["Başvuru süresi dolmuş"], bonus: [] };
  }

  const k: EligibilityCriteria = destek.kriterler;
  const eksikKriterler: string[] = [];
  const bonus: string[] = [];
  let skor = 50;

  // Tekrar başvuru engeli
  if (k.tekrarBasvuruEngel && firma.alinanDestekler.includes(destek.slug)) {
    eksikKriterler.push("Bu destekten daha önce yararlandınız");
  }

  // Şirket türü
  if (k.sirketTurleri?.length && !k.sirketTurleri.includes(firma.sirketTuru)) {
    eksikKriterler.push(`Şirket türü uygun değil (gerekli: ${k.sirketTurleri.join(", ")})`);
  } else {
    skor += 10;
  }

  // Çalışan sayısı
  if (k.minCalisan !== undefined && firma.calısanSayisi < k.minCalisan) {
    eksikKriterler.push(`Minimum ${k.minCalisan} çalışan gerekli (mevcut: ${firma.calısanSayisi})`);
  } else if (k.maxCalisan !== undefined && firma.calısanSayisi > k.maxCalisan) {
    eksikKriterler.push(`KOBİ sınırı aşılıyor (max ${k.maxCalisan} çalışan)`);
  } else {
    skor += 10;
  }

  // Ciro
  if (k.minCiro !== undefined && firma.yillikCiro < k.minCiro) {
    eksikKriterler.push(`Minimum ${(k.minCiro / 1_000_000).toFixed(0)} milyon TL ciro gerekli`);
  } else if (k.maxCiro !== undefined && firma.yillikCiro > k.maxCiro) {
    eksikKriterler.push(`Maksimum ciro sınırı aşılıyor (KOBİ eşiği)`);
  } else {
    skor += 10;
  }

  // Kuruluş yılı
  const firmaYasi = firmaYasiHesapla(firma.kurulusYili);
  if (k.minKurulusYili !== undefined && firma.kurulusYili < k.minKurulusYili) {
    eksikKriterler.push(`Firma en fazla ${BUGUN.getFullYear() - k.minKurulusYili} yaşında olmalı`);
  } else if (k.maxKurulusYili !== undefined && firma.kurulusYili > k.maxKurulusYili) {
    eksikKriterler.push(`Firma en az ${BUGUN.getFullYear() - k.maxKurulusYili} yıllık olmalı`);
  } else {
    skor += 5;
  }

  // Sektör
  if (!sektorUyumu(firma.sektorKodu, k.sektorler, k.sektorHaric)) {
    eksikKriterler.push("Sektörünüz bu program kapsamı dışında");
  } else {
    skor += 10;
  }

  // Bölge
  if (!bolgeUyumu(firma.il, k.bolgeKisiti)) {
    eksikKriterler.push(`Bu destek yalnızca şu illerde geçerli: ${k.bolgeKisiti?.join(", ")}`);
  } else {
    skor += 5;
  }

  // Teknokent
  if (k.teknokentZorunlu && !firma.teknokentteMi) {
    eksikKriterler.push("Teknokent üyeliği zorunlu");
  } else if (firma.teknokentteMi) {
    skor += 5;
  }

  // Ar-Ge
  if (k.argeZorunlu && !firma.argeYapiyorMu) {
    eksikKriterler.push("Ar-Ge faaliyeti zorunlu");
  } else if (firma.argeYapiyorMu) {
    skor += 5;
  }

  // İhracat
  if (k.ihracatZorunlu && !firma.ihracatYapiyorMu) {
    eksikKriterler.push("İhracat yapıyor olmak zorunlu");
  } else if (firma.ihracatYapiyorMu) {
    skor += 5;
  }

  // OSB
  if (k.osbZorunlu && !firma.osbdeMi) {
    eksikKriterler.push("OSB'de faaliyet zorunlu");
  }

  // Bonus kriterler
  if (k.kadinGirisimciBonus && firma.kadinGirisimci) {
    bonus.push("Kadın girişimci önceliğinden yararlanabilirsiniz (+öncelik)");
    skor += 10;
  }
  if (k.gencGirisimciBonus && firma.gencGirisimci) {
    bonus.push("Genç girişimci önceliğinden yararlanabilirsiniz (+öncelik)");
    skor += 10;
  }
  if (firma.osbdeMi && !k.osbZorunlu) {
    bonus.push("OSB üyeliği başvuruda avantaj sağlayabilir");
    skor += 5;
  }

  // Sınır skoru
  skor = Math.min(100, Math.max(0, skor));

  // AI yorum gerekli mi? (skor 40-60 arası = sınırda durum)
  const aiYorumGerekli = eksikKriterler.length === 0 ? false : skor >= 35 && skor < 60;

  const uygunMu = eksikKriterler.length === 0;

  return { destek, uygunlukSkoru: skor, uygunMu, eksikKriterler, bonus, aiYorumGerekli };
}

export function tumDestekleriFiltrele(
  firma: FirmaProfili,
  destekler: DestekProgrami[],
): FiltreSonucu[] {
  return destekler
    .map((d) => destekUygunlukDegerlendir(firma, d))
    .sort((a, b) => {
      // Uygun olanlar önce, sonra skor, sonra öncelik
      if (a.uygunMu !== b.uygunMu) return a.uygunMu ? -1 : 1;
      if (b.uygunlukSkoru !== a.uygunlukSkoru) return b.uygunlukSkoru - a.uygunlukSkoru;
      return a.destek.oncelik - b.destek.oncelik;
    });
}
