/**
 * Kuveyt Türk ödeme entegrasyonu testleri
 *
 * verifyKTCallback — HMAC/SHA-1 imza doğrulaması
 * buildKTFormData — form alanlarının doğru oluşturulması
 */

import crypto from "crypto";

// ─── Env ayarları ─────────────────────────────────────────────────────────────

const TEST_ENV = {
  KT_MERCHANT_ID: "1000000",
  KT_CUSTOMER_ID: "400000",
  KT_USERNAME: "apitest",
  KT_PASSWORD: "apitest123",
  NEXT_PUBLIC_APP_URL: "https://test.destektakip.com",
};

beforeAll(() => {
  Object.assign(process.env, TEST_ENV);
});

// ─── Yardımcılar ──────────────────────────────────────────────────────────────

function sha1Base64(text: string): string {
  return crypto.createHash("sha1").update(text, "utf8").digest("base64");
}

function gecerliHashOlustur(
  merchantId: string,
  orderId: string,
  amount: string,
  okUrl: string,
  failUrl: string,
  userName: string,
  password: string,
): string {
  const hashedPassword = sha1Base64(password);
  return sha1Base64(`${merchantId}${orderId}${amount}${okUrl}${failUrl}${userName}${hashedPassword}`);
}

// ─── Testler ──────────────────────────────────────────────────────────────────

describe("verifyKTCallback", () => {
  let verifyKTCallback: (p: Record<string, string>) => boolean;

  beforeAll(async () => {
    // Jest modül önbelleğini temizle — env değişiklikleri için
    jest.resetModules();
    const mod = await import("@/lib/kuveytturk");
    verifyKTCallback = mod.verifyKTCallback;
  });

  describe("parametre doğrulama", () => {
    it("boş parametre objesiyle false döner", () => {
      expect(verifyKTCallback({})).toBe(false);
    });

    it("sadece MerchantId ile false döner", () => {
      expect(verifyKTCallback({ MerchantId: TEST_ENV.KT_MERCHANT_ID })).toBe(false);
    });

    it("tüm zorunlu alanlar varsa ama hash yanlışsa false döner", () => {
      expect(
        verifyKTCallback({
          MerchantId: TEST_ENV.KT_MERCHANT_ID,
          MerchantOrderId: "order-001",
          Amount: "29900",
          ResponseCode: "00",
          HashData: "yanlisHash==",
        }),
      ).toBe(false);
    });
  });

  describe("MerchantId kontrolü", () => {
    it("farklı MerchantId ile false döner", () => {
      expect(
        verifyKTCallback({
          MerchantId: "9999999",
          MerchantOrderId: "order-001",
          Amount: "29900",
          ResponseCode: "00",
          HashData: "herhangi",
        }),
      ).toBe(false);
    });
  });

  describe("ResponseCode kontrolü", () => {
    const HATA_KODLARI = ["01", "05", "51", "57", "61", "65", "91", "96"];

    it.each(HATA_KODLARI)("ResponseCode '%s' ile false döner", (kod) => {
      expect(
        verifyKTCallback({
          MerchantId: TEST_ENV.KT_MERCHANT_ID,
          MerchantOrderId: "order-001",
          Amount: "29900",
          ResponseCode: kod,
          HashData: "herhangi",
        }),
      ).toBe(false);
    });
  });

  describe("geçerli imza ile onay", () => {
    it("doğru hash ve ResponseCode '00' ile true döner", () => {
      const okUrl = `${TEST_ENV.NEXT_PUBLIC_APP_URL}/api/odeme/basarili`;
      const failUrl = `${TEST_ENV.NEXT_PUBLIC_APP_URL}/api/odeme/basarisiz`;
      const orderId = "uid12345-1716900000000";
      const amount = "29900";

      const hash = gecerliHashOlustur(
        TEST_ENV.KT_MERCHANT_ID,
        orderId,
        amount,
        okUrl,
        failUrl,
        TEST_ENV.KT_USERNAME,
        TEST_ENV.KT_PASSWORD,
      );

      expect(
        verifyKTCallback({
          MerchantId: TEST_ENV.KT_MERCHANT_ID,
          MerchantOrderId: orderId,
          Amount: amount,
          ResponseCode: "00",
          HashData: hash,
        }),
      ).toBe(true);
    });

    it("hash büyük/küçük harf değişikliğiyle false döner (timing-safe)", () => {
      const okUrl = `${TEST_ENV.NEXT_PUBLIC_APP_URL}/api/odeme/basarili`;
      const failUrl = `${TEST_ENV.NEXT_PUBLIC_APP_URL}/api/odeme/basarisiz`;
      const orderId = "uid12345-1716900000000";
      const amount = "29900";

      const dogruHash = gecerliHashOlustur(
        TEST_ENV.KT_MERCHANT_ID,
        orderId,
        amount,
        okUrl,
        failUrl,
        TEST_ENV.KT_USERNAME,
        TEST_ENV.KT_PASSWORD,
      );
      // Base64 sonunda = yerine farklı karakter
      const bozukHash = dogruHash.slice(0, -1) + (dogruHash.endsWith("=") ? "A" : "=");

      expect(
        verifyKTCallback({
          MerchantId: TEST_ENV.KT_MERCHANT_ID,
          MerchantOrderId: orderId,
          Amount: amount,
          ResponseCode: "00",
          HashData: bozukHash,
        }),
      ).toBe(false);
    });
  });
});

describe("buildKTFormData", () => {
  let buildKTFormData: (p: import("@/lib/kuveytturk").KTOdemeParams) => Record<string, string | number>;

  beforeAll(async () => {
    jest.resetModules();
    const mod = await import("@/lib/kuveytturk");
    buildKTFormData = mod.buildKTFormData as typeof buildKTFormData;
  });

  const ornekParams = {
    orderId: "test-order-001",
    amount: 29900,
    email: "test@example.com",
    cardHolderName: "TEST KART",
    cardNumber: "4111 1111 1111 1111",
    cardExpireMonth: "12",
    cardExpireYear: "2027",
    cardCVV2: "123",
  };

  it("gerekli alanları içerir", () => {
    const form = buildKTFormData(ornekParams);
    expect(form).toHaveProperty("MerchantId");
    expect(form).toHaveProperty("HashData");
    expect(form).toHaveProperty("Amount");
    expect(form).toHaveProperty("OkUrl");
    expect(form).toHaveProperty("FailUrl");
    expect(form).toHaveProperty("TransactionSecurity", "3");
    expect(form).toHaveProperty("CurrencyCode", "0949"); // TRY
  });

  it("kart numarasındaki boşlukları temizler", () => {
    const form = buildKTFormData(ornekParams);
    expect(form.Pan).toBe("4111111111111111");
  });

  it("Amount string olarak gelir", () => {
    const form = buildKTFormData(ornekParams);
    expect(typeof form.Amount).toBe("string");
    expect(form.Amount).toBe("29900");
  });

  it("HashData boş değildir ve Base64 formatındadır", () => {
    const form = buildKTFormData(ornekParams);
    expect(typeof form.HashData).toBe("string");
    expect(form.HashData as string).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });

  it("OkUrl ve FailUrl doğru app URL'ini kullanır", () => {
    const form = buildKTFormData(ornekParams);
    expect(form.OkUrl).toContain(TEST_ENV.NEXT_PUBLIC_APP_URL);
    expect(form.FailUrl).toContain(TEST_ENV.NEXT_PUBLIC_APP_URL);
  });
});
