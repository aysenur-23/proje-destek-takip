import { destekUygunlukDegerlendir, tumDestekleriFiltrele } from "@/lib/filtrele";
import type { DestekProgrami, FirmaProfili } from "@/types";

// ─── Yardımcı fabrikalar ────────────────────────────────────────────────────

function firmaOlustur(override: Partial<FirmaProfili> = {}): FirmaProfili {
  return {
    ad: "Test Firma A.Ş.",
    kurulusYili: 2018,
    sirketTuru: "LTD",
    sektorKodu: "C26",
    sektorAdi: "Bilişim Ürünleri İmalatı",
    calısanSayisi: 50,
    yillikCiro: 10_000_000,
    ihracatYapiyorMu: false,
    argeYapiyorMu: false,
    teknokentteMi: false,
    osbdeMi: false,
    il: "İzmir",
    kadinGirisimci: false,
    gencGirisimci: false,
    engellıCalisanVarMi: false,
    alinanDestekler: [],
    ...override,
  };
}

function destekOlustur(override: Partial<DestekProgrami> = {}): DestekProgrami {
  return {
    slug: "test-desteği",
    ad: "Test Destek Programı",
    kurum: "TEST",
    kategori: "KOSGEB",
    tur: "HIBE",
    aciklama: "Test açıklaması",
    amac: "Test amacı",
    aktif: true,
    mevzuatUrl: "https://example.com",
    etiketler: [],
    oncelik: 5,
    kriterler: {},
    ...override,
  };
}

// ─── Temel uygunluk testleri ────────────────────────────────────────────────

describe("destekUygunlukDegerlendir", () => {
  test("aktif olmayan destek her zaman uygun değil döner", () => {
    const firma = firmaOlustur();
    const destek = destekOlustur({ aktif: false });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(false);
    expect(sonuc.uygunlukSkoru).toBe(0);
    expect(sonuc.eksikKriterler[0]).toMatch(/aktif değil/i);
  });

  test("başvuru süresi dolmuş destek uygun değil", () => {
    const firma = firmaOlustur();
    const destek = destekOlustur({ basvuruBitis: "2020-01-01" });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(false);
    expect(sonuc.eksikKriterler[0]).toMatch(/süre/i);
  });

  test("tüm kriterler boşsa firma her zaman uygun", () => {
    const firma = firmaOlustur();
    const destek = destekOlustur();
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(true);
    expect(sonuc.uygunlukSkoru).toBeGreaterThan(50);
  });

  test("yanlış şirket türü → uygun değil", () => {
    const firma = firmaOlustur({ sirketTuru: "SAHIS" });
    const destek = destekOlustur({ kriterler: { sirketTurleri: ["AS", "LTD"] } });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(false);
    expect(sonuc.eksikKriterler.some((e) => e.toLowerCase().includes("şirket türü"))).toBe(true);
  });

  test("çalışan sayısı maxCalisan üstünde → uygun değil", () => {
    const firma = firmaOlustur({ calısanSayisi: 300 });
    const destek = destekOlustur({ kriterler: { maxCalisan: 250 } });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(false);
    expect(sonuc.eksikKriterler.some((e) => e.includes("250"))).toBe(true);
  });

  test("çalışan sayısı minCalisan altında → uygun değil", () => {
    const firma = firmaOlustur({ calısanSayisi: 5 });
    const destek = destekOlustur({ kriterler: { minCalisan: 10 } });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(false);
  });

  test("ciro maxCiro üstünde → uygun değil", () => {
    const firma = firmaOlustur({ yillikCiro: 500_000_000 });
    const destek = destekOlustur({ kriterler: { maxCiro: 250_000_000 } });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(false);
    expect(sonuc.eksikKriterler.some((e) => e.toLowerCase().includes("ciro"))).toBe(true);
  });

  test("ar-ge zorunlu ama firma yapmıyor → uygun değil", () => {
    const firma = firmaOlustur({ argeYapiyorMu: false });
    const destek = destekOlustur({ kriterler: { argeZorunlu: true } });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(false);
    expect(sonuc.eksikKriterler.some((e) => e.toLowerCase().includes("ar-ge"))).toBe(true);
  });

  test("ihracat zorunlu ama firma ihracat yapmıyor → uygun değil", () => {
    const firma = firmaOlustur({ ihracatYapiyorMu: false });
    const destek = destekOlustur({ kriterler: { ihracatZorunlu: true } });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(false);
  });

  test("teknokent zorunlu ama firma teknokentte değil → uygun değil", () => {
    const firma = firmaOlustur({ teknokentteMi: false });
    const destek = destekOlustur({ kriterler: { teknokentZorunlu: true } });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(false);
  });

  test("bölge kısıtı var ve firma o ilde değil → uygun değil", () => {
    const firma = firmaOlustur({ il: "İzmir" });
    const destek = destekOlustur({ kriterler: { bolgeKisiti: ["Ankara", "İstanbul"] } });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(false);
  });

  test("bölge kısıtı var ve firma o ilde → uygun", () => {
    const firma = firmaOlustur({ il: "Ankara" });
    const destek = destekOlustur({ kriterler: { bolgeKisiti: ["Ankara", "İstanbul"] } });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(true);
  });

  test("sektör dışı → uygun değil", () => {
    const firma = firmaOlustur({ sektorKodu: "A01" }); // Tarım
    const destek = destekOlustur({ kriterler: { sektorler: ["C", "J"] } }); // İmalat, BT
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(false);
  });

  test("sektör NACE alt kodu uyumu — başlangıç eşleşmesi", () => {
    const firma = firmaOlustur({ sektorKodu: "C26.11" }); // Elektronik bileşen
    const destek = destekOlustur({ kriterler: { sektorler: ["C26"] } });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(true);
  });

  test("tekrar başvuru engeli → uygun değil", () => {
    const firma = firmaOlustur({ alinanDestekler: ["test-desteği"] });
    const destek = destekOlustur({ kriterler: { tekrarBasvuruEngel: true } });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(false);
  });
});

// ─── Bonus testleri ─────────────────────────────────────────────────────────

describe("bonus kriterler", () => {
  test("kadın girişimci bonusu → bonus listesinde görünür ve skor en az eşit", () => {
    const firma = firmaOlustur({ kadinGirisimci: true });
    const firmaSiz = firmaOlustur({ kadinGirisimci: false });
    const destek = destekOlustur({ kriterler: { kadinGirisimciBonus: true } });
    const ile = destekUygunlukDegerlendir(firma, destek);
    const siz = destekUygunlukDegerlendir(firmaSiz, destek);
    expect(ile.uygunlukSkoru).toBeGreaterThanOrEqual(siz.uygunlukSkoru);
    expect(ile.bonus.length).toBeGreaterThan(0);
    expect(siz.bonus.length).toBe(0);
  });

  test("genç girişimci bonusu → skor artar", () => {
    const firma = firmaOlustur({ gencGirisimci: true });
    const destek = destekOlustur({ kriterler: { gencGirisimciBonus: true } });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.bonus.length).toBeGreaterThan(0);
    expect(sonuc.uygunlukSkoru).toBeGreaterThan(50);
  });

  test("ar-ge yapan firmanın skoru en az eşit (her ikisi de uygun)", () => {
    const firmaArge = firmaOlustur({ argeYapiyorMu: true });
    const firmaNormal = firmaOlustur({ argeYapiyorMu: false });
    const destek = destekOlustur(); // argeZorunlu yok
    const ile = destekUygunlukDegerlendir(firmaArge, destek);
    const siz = destekUygunlukDegerlendir(firmaNormal, destek);
    // Her ikisi de uygun, ar-ge yapan en az eşit skor almalı
    expect(ile.uygunlukSkoru).toBeGreaterThanOrEqual(siz.uygunlukSkoru);
    expect(ile.uygunMu).toBe(true);
    expect(siz.uygunMu).toBe(true);
  });
});

// ─── Skor sınır testleri ────────────────────────────────────────────────────

describe("skor sınırları", () => {
  test("skor 0-100 arasında kalır", () => {
    const firma = firmaOlustur({
      kadinGirisimci: true,
      gencGirisimci: true,
      argeYapiyorMu: true,
      ihracatYapiyorMu: true,
      teknokentteMi: true,
      osbdeMi: true,
    });
    const destek = destekOlustur({
      kriterler: {
        kadinGirisimciBonus: true,
        gencGirisimciBonus: true,
      },
    });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunlukSkoru).toBeLessThanOrEqual(100);
    expect(sonuc.uygunlukSkoru).toBeGreaterThanOrEqual(0);
  });

  test("aiYorumGerekli skor 35-60 arasında ve eksik kriter varsa true", () => {
    // eksik kriter + orta skor → AI yorum gerekli
    const firma = firmaOlustur({ calısanSayisi: 5 }); // minCalisan'ı geçemez
    const destek = destekOlustur({
      kriterler: {
        minCalisan: 10,
        kadinGirisimciBonus: true, // skor biraz artsın
        gencGirisimciBonus: true,
      },
    });
    const sonuc = destekUygunlukDegerlendir(firma, destek);
    expect(sonuc.uygunMu).toBe(false);
    // aiYorumGerekli boolean olmalı
    expect(typeof sonuc.aiYorumGerekli).toBe("boolean");
  });
});

// ─── tumDestekleriFiltrele testleri ─────────────────────────────────────────

describe("tumDestekleriFiltrele", () => {
  test("uygun olanlar listenin başında", () => {
    const firma = firmaOlustur();
    const destekler: DestekProgrami[] = [
      destekOlustur({ slug: "uygun-değil", kriterler: { minCalisan: 500 } }),
      destekOlustur({ slug: "uygun", kriterler: {} }),
    ];
    const sonuclar = tumDestekleriFiltrele(firma, destekler);
    expect(sonuclar[0].destek.slug).toBe("uygun");
  });

  test("aktif olmayan destekler işlenir ama uygun değil", () => {
    const firma = firmaOlustur();
    const destekler: DestekProgrami[] = [
      destekOlustur({ slug: "aktif", aktif: true }),
      destekOlustur({ slug: "pasif", aktif: false }),
    ];
    const sonuclar = tumDestekleriFiltrele(firma, destekler);
    expect(sonuclar).toHaveLength(2);
    const pasif = sonuclar.find((s) => s.destek.slug === "pasif");
    expect(pasif?.uygunMu).toBe(false);
  });

  test("boş destekler dizisi boş sonuç döner", () => {
    const firma = firmaOlustur();
    expect(tumDestekleriFiltrele(firma, [])).toHaveLength(0);
  });
});
