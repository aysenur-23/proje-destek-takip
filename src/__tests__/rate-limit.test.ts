/**
 * Rate limit modülü birim testleri
 *
 * In-memory token bucket implementasyonunu test eder.
 */

// Her testin temiz bir modül ile başlaması için jest.isolateModules kullanılır
describe("rateLimitKontrol", () => {
  // Her test için modülü yeniden yükle (kayıtlar Map'i sıfırlanır)
  let rateLimitKontrol: (uid: string, limit?: number, pencereMs?: number) => {
    basarili: boolean;
    kalanHak: number;
    sifirlanmaMs: number;
  };

  beforeEach(() => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    rateLimitKontrol = require("@/lib/rate-limit").rateLimitKontrol;
  });

  describe("temel akış", () => {
    it("ilk istek her zaman başarılı olur", () => {
      const sonuc = rateLimitKontrol("kullanici-1", 5);
      expect(sonuc.basarili).toBe(true);
      expect(sonuc.kalanHak).toBe(4);
    });

    it("limit dahilindeki tüm istekler başarılı olur", () => {
      for (let i = 0; i < 5; i++) {
        const sonuc = rateLimitKontrol("kullanici-2", 5);
        expect(sonuc.basarili).toBe(true);
      }
    });

    it("limiti aşan istek başarısız olur", () => {
      // 5 başarılı istek yap
      for (let i = 0; i < 5; i++) {
        rateLimitKontrol("kullanici-3", 5);
      }
      // 6. istek başarısız olmalı
      const sonuc = rateLimitKontrol("kullanici-3", 5);
      expect(sonuc.basarili).toBe(false);
      expect(sonuc.kalanHak).toBe(0);
    });
  });

  describe("kalanHak hesabı", () => {
    it("her istekten sonra kalanHak azalır", () => {
      const uid = "kullanici-4";
      const limit = 10;

      const ilk = rateLimitKontrol(uid, limit);
      expect(ilk.kalanHak).toBe(limit - 1);

      const ikinci = rateLimitKontrol(uid, limit);
      expect(ikinci.kalanHak).toBe(limit - 2);

      const ucuncu = rateLimitKontrol(uid, limit);
      expect(ucuncu.kalanHak).toBe(limit - 3);
    });

    it("limitin tam üzerinde kalanHak 0 olur", () => {
      const uid = "kullanici-5";
      for (let i = 0; i < 3; i++) rateLimitKontrol(uid, 3);
      const sonuc = rateLimitKontrol(uid, 3);
      expect(sonuc.basarili).toBe(false);
      expect(sonuc.kalanHak).toBe(0);
    });
  });

  describe("sifirlanmaMs", () => {
    it("sifirlanmaMs gelecekteki bir zaman damgasıdır", () => {
      const onceki = Date.now();
      const sonuc = rateLimitKontrol("kullanici-6", 5, 60_000);
      expect(sonuc.sifirlanmaMs).toBeGreaterThanOrEqual(onceki + 60_000 - 50);
      expect(sonuc.sifirlanmaMs).toBeLessThanOrEqual(onceki + 60_000 + 50);
    });

    it("aynı penceredeki tüm isteklerde sifirlanmaMs aynıdır", () => {
      const uid = "kullanici-7";
      const ilk = rateLimitKontrol(uid, 5, 60_000);
      const ikinci = rateLimitKontrol(uid, 5, 60_000);
      expect(ilk.sifirlanmaMs).toBe(ikinci.sifirlanmaMs);
    });
  });

  describe("farklı kullanıcılar bağımsız pencere tutar", () => {
    it("bir kullanıcının limiti diğerini etkilemez", () => {
      const limit = 3;
      // kullanici-a limitini tüket
      for (let i = 0; i < limit; i++) rateLimitKontrol("kullanici-a", limit);
      expect(rateLimitKontrol("kullanici-a", limit).basarili).toBe(false);

      // kullanici-b hâlâ isteklerini yapabilmeli
      expect(rateLimitKontrol("kullanici-b", limit).basarili).toBe(true);
    });
  });

  describe("pencere süresi dolunca yenileme", () => {
    it("pencere süresi geçtikten sonra sayaç sıfırlanır", () => {
      const uid = "kullanici-8";
      const limit = 2;

      // Kısa pencere — 10ms
      rateLimitKontrol(uid, limit, 10);
      rateLimitKontrol(uid, limit, 10);
      expect(rateLimitKontrol(uid, limit, 10).basarili).toBe(false);

      // Jest fake timers yerine gerçek Date.now() kullan
      const gecmisZaman = Date.now() - 100;
      jest.spyOn(Date, "now").mockReturnValue(gecmisZaman + 200);

      // Pencere doldu → yeni pencere başlamalı
      const yeniPencere = rateLimitKontrol(uid, limit, 10);
      expect(yeniPencere.basarili).toBe(true);

      jest.restoreAllMocks();
    });
  });

  describe("varsayılan parametreler", () => {
    it("limit ve pencereMs için varsayılan değerler çalışır", () => {
      const sonuc = rateLimitKontrol("kullanici-9");
      expect(sonuc.basarili).toBe(true);
      // Varsayılan limit=10, pencere 60 saniye
      expect(sonuc.kalanHak).toBe(9);
      expect(sonuc.sifirlanmaMs).toBeGreaterThan(Date.now());
    });
  });

  describe("analytics prefix desteği", () => {
    it("analytics: prefix ile normal kullanıcıdan bağımsız pencere açar", () => {
      const limit = 5;
      rateLimitKontrol("analytics:192.168.1.1", limit);
      rateLimitKontrol("192.168.1.1", limit);

      // Birinin tüketimi diğerini etkilemez
      for (let i = 0; i < limit - 1; i++) {
        rateLimitKontrol("analytics:192.168.1.1", limit);
      }
      expect(rateLimitKontrol("192.168.1.1", limit).basarili).toBe(true);
    });
  });
});
