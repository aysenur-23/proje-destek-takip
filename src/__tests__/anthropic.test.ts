/**
 * Anthropic API entegrasyon testleri — mock ile
 *
 * Gerçek API çağrısı yapılmaz; @anthropic-ai/sdk mock'lanır.
 */

import type { ProjeOnerisi } from "@/types";

// ─── Mock kurulumu ────────────────────────────────────────────────────────────

const mockCreate = jest.fn();

jest.mock("@anthropic-ai/sdk", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
  Anthropic: jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}));

// ─── Test verisi ──────────────────────────────────────────────────────────────

const MOCK_PROJE_ONERISI: ProjeOnerisi = {
  genelPuan: 72,
  genelYorum: "Proje raporu temel kriterleri karşılamaktadır.",
  bolumler: [
    {
      baslik: "Proje Özeti",
      mevcutMetin: "Bu proje, yazılım geliştirmeyi kapsamaktadır.",
      sorunlar: ["Teknolojik yenilik boyutu yetersiz"],
      onerilenDegisiklikler: "Özgün teknoloji katkısını ve Ar-Ge unsurunu öne çıkarın.",
      puan: 60,
    },
    {
      baslik: "Hedefler",
      mevcutMetin: "Proje hedefleri belirsiz tanımlanmıştır.",
      sorunlar: ["SMART kriterlerine uygun değil"],
      onerilenDegisiklikler: "Ölçülebilir KPI'lar ekleyin.",
      puan: 55,
    },
  ],
  oncelikliDuzeltmeler: [
    "Ar-Ge bütçe dağılımını detaylandırın",
    "Piyasa büyüklüğü verisi ekleyin",
  ],
};

// ─── Yardımcı: başarılı stream mock'u ─────────────────────────────────────────

function mockStreamYanit(icerik: string) {
  return {
    body: {
      getReader: () => {
        let okundu = false;
        return {
          read: async () => {
            if (okundu) return { done: true, value: undefined };
            okundu = true;
            return {
              done: false,
              value: new TextEncoder().encode(icerik),
            };
          },
        };
      },
    },
    ok: true,
  };
}

// ─── Testler ──────────────────────────────────────────────────────────────────

describe("Anthropic API — /api/ai/proje entegrasyon", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("verifyKTCallback — Kuveyt Türk imza doğrulama", () => {
    // Önce kuveytturk modülünü import et
    let verifyKTCallback: (p: Record<string, string>) => boolean;

    beforeAll(async () => {
      // crypto kullanımı için env'i ayarla
      process.env.KT_MERCHANT_ID = "TEST_MERCHANT";
      process.env.KT_CUSTOMER_ID = "TEST_CUSTOMER";
      process.env.KT_USERNAME = "TEST_USER";
      process.env.KT_PASSWORD = "TEST_PASS";
      process.env.NEXT_PUBLIC_APP_URL = "https://test.destektakip.com";

      const mod = await import("@/lib/kuveytturk");
      verifyKTCallback = mod.verifyKTCallback;
    });

    it("eksik parametrelerle false döner", () => {
      expect(verifyKTCallback({})).toBe(false);
      expect(verifyKTCallback({ MerchantId: "X" })).toBe(false);
    });

    it("yanlış MerchantId ile false döner", () => {
      expect(
        verifyKTCallback({
          MerchantId: "YANLIS",
          MerchantOrderId: "order123",
          Amount: "29900",
          ResponseCode: "00",
          HashData: "invalidddd",
        }),
      ).toBe(false);
    });

    it("ResponseCode '00' değilse false döner", () => {
      expect(
        verifyKTCallback({
          MerchantId: "TEST_MERCHANT",
          MerchantOrderId: "order123",
          Amount: "29900",
          ResponseCode: "51",  // Insufficient funds
          HashData: "herhangi",
        }),
      ).toBe(false);
    });
  });

  describe("fetch mock ile /api/ai/proje akış testi", () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it("başarılı stream → ProjeOnerisi parse edilir", async () => {
      const jsonMetni = JSON.stringify(MOCK_PROJE_ONERISI);
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockStreamYanit(jsonMetni));

      const yanit = await fetch("/api/ai/proje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hedefDestekSlug: "tubitak-1507", raporMetni: "test rapor" }),
      });

      expect(yanit.ok).toBe(true);

      const reader = yanit.body!.getReader();
      const { value } = await reader.read();
      const metin = new TextDecoder().decode(value);
      const esleme = metin.match(/\{[\s\S]*\}/);

      expect(esleme).not.toBeNull();
      const sonuc = JSON.parse(esleme![0]) as ProjeOnerisi;
      expect(sonuc.genelPuan).toBe(72);
      expect(sonuc.bolumler).toHaveLength(2);
      expect(sonuc.oncelikliDuzeltmeler).toHaveLength(2);
    });

    it("API hatası → hata durumu doğru işlenir", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 429 });

      const yanit = await fetch("/api/ai/proje", { method: "POST" });
      expect(yanit.ok).toBe(false);
    });
  });

  describe("ProjeOnerisi tip doğrulama", () => {
    it("genelPuan 0-100 arasında olmalı", () => {
      expect(MOCK_PROJE_ONERISI.genelPuan).toBeGreaterThanOrEqual(0);
      expect(MOCK_PROJE_ONERISI.genelPuan).toBeLessThanOrEqual(100);
    });

    it("bolumler dizisi boş olmamalı", () => {
      expect(MOCK_PROJE_ONERISI.bolumler.length).toBeGreaterThan(0);
    });

    it("her bölümün puanı 0-100 arasında olmalı", () => {
      for (const bolum of MOCK_PROJE_ONERISI.bolumler) {
        expect(bolum.puan).toBeGreaterThanOrEqual(0);
        expect(bolum.puan).toBeLessThanOrEqual(100);
      }
    });

    it("oncelikliDuzeltmeler string dizisi olmalı", () => {
      for (const d of MOCK_PROJE_ONERISI.oncelikliDuzeltmeler) {
        expect(typeof d).toBe("string");
      }
    });
  });
});
