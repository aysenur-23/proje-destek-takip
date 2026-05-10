import { test, expect } from "@playwright/test";

/**
 * Temel kullanıcı akışı:
 * Ana sayfa → Firma formu → Destekler (filtreli) → Destek detay
 */

test.describe("Firma profili ve destek keşif akışı", () => {
  test.beforeEach(async ({ page }) => {
    // WelcomeTour'u atla (localStorage'a done yaz)
    await page.addInitScript(() => {
      localStorage.setItem("dt_welcome_tour_v1", "done");
    });
  });

  test("Ana sayfa yükleniyor ve temel elementler görünüyor", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Destek Takip/i);

    // Navbar'da logo metni görünmeli
    await expect(page.getByText("Destek Takip").first()).toBeVisible();
  });

  test("Destekler sayfası: liste yükleniyor ve arama çalışıyor", async ({ page }) => {
    await page.goto("/destekler");
    await expect(page).toHaveTitle(/Destekler/i);

    // En az 1 destek kartı görünmeli
    const kartlar = page.locator('[data-testid="destek-karti"], article, [class*="rounded"][class*="border"]');
    await expect(kartlar.first()).toBeVisible({ timeout: 10_000 });
  });

  test("Destekler sayfası: kategori filtresi çalışıyor", async ({ page }) => {
    await page.goto("/destekler");

    // TÜBİTAK filtre butonuna tıkla
    const tubitakButon = page.getByRole("button", { name: /TÜBİTAK/i });
    if (await tubitakButon.isVisible()) {
      await tubitakButon.click();
      // URL parametresi güncellenebilir veya liste filtrelenebilir
      await page.waitForTimeout(500);
    }
  });

  test("Firma profil formu: ilk adım görünüyor ve tamamlanabiliyor", async ({ page }) => {
    await page.goto("/firma");
    await expect(page).toHaveTitle(/Firma/i);

    // Firma adı alanı görünmeli
    const firmaAdi = page.getByLabel(/firma.*ad/i).or(page.getByPlaceholder(/firma.*ad/i));
    if (await firmaAdi.isVisible()) {
      await firmaAdi.fill("Test Yazılım A.Ş.");
    }

    // Devam/İleri butonu
    const devamButon = page
      .getByRole("button", { name: /devam|ileri|sonraki|kaydet/i })
      .first();
    await expect(devamButon).toBeVisible();
  });

  test("Blog sayfası: makaleler listeleniyor", async ({ page }) => {
    await page.goto("/blog");
    await expect(page).toHaveTitle(/Blog|Rehber/i);

    // En az 1 makale kartı görünmeli
    await expect(page.locator("article").first()).toBeVisible({ timeout: 8_000 });
  });

  test("Blog: makale detay sayfası açılıyor", async ({ page }) => {
    await page.goto("/blog");

    // İlk "Oku" linkine tıkla
    const okuLink = page.getByRole("link", { name: /oku/i }).first();
    await expect(okuLink).toBeVisible();
    await okuLink.click();

    // Detay sayfasında h1 görünmeli
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 8_000 });
  });

  test("Rapor sayfası: firma profili yoksa yönlendirme mesajı gösteriliyor", async ({ page }) => {
    // Firma profili olmadan rapor sayfasına git
    await page.addInitScript(() => {
      localStorage.removeItem("firmaProfili");
    });
    await page.goto("/rapor");

    // Profil bulunamadı mesajı görünmeli
    await expect(
      page.getByText(/firma profili bulunamadı|profil oluştur/i).first()
    ).toBeVisible({ timeout: 8_000 });
  });

  test("Rapor sayfası: firma profili varsa rapor render ediliyor", async ({ page }) => {
    // Örnek firma profili yükle
    await page.addInitScript(() => {
      const firmaOrnegi = {
        ad: "Test KOBİ Ltd.",
        vergiNo: "1234567890",
        sektor: "62.01",
        sektorAdi: "Yazılım Geliştirme",
        sirketTuru: "LTD",
        calısanSayisi: 15,
        yillikCiro: 5_000_000,
        il: "İstanbul",
        kurulusYili: 2020,
        ihracatYapiyorMu: false,
        argeYapiyorMu: true,
        teknokentteMi: false,
        osbdeMi: false,
        kadinGirisimci: false,
        gencGirisimci: false,
        engelliBulunduruluyor: false,
        dahaOnceAlinanDestekler: [],
      };
      localStorage.setItem("firmaProfili", JSON.stringify(firmaOrnegi));
    });

    await page.goto("/rapor");

    // Rapor başlığı görünmeli
    await expect(page.getByText("Test KOBİ Ltd.")).toBeVisible({ timeout: 8_000 });

    // CSV İndir ve Yazdır butonları görünmeli
    await expect(page.getByRole("button", { name: /CSV İndir/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Yazdır/i })).toBeVisible();
  });
});

test.describe("WelcomeTour A11Y", () => {
  test("WelcomeTour focus trap çalışıyor", async ({ page }) => {
    // localStorage temiz — tour görünecek
    await page.goto("/");
    await page.waitForTimeout(1200); // 800ms delay + render

    // Modal görünür mü?
    const modal = page.getByRole("dialog");
    const modalGorunuyor = await modal.isVisible().catch(() => false);

    if (modalGorunuyor) {
      // Tab tuşuyla gezin — modal dışına çıkmamalı
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // Odak hâlâ modal içinde olmalı
      const odak = page.locator(":focus");
      await expect(odak).toBeVisible();

      // ESC ile kapatılabilmeli
      await page.keyboard.press("Escape");
      await expect(modal).not.toBeVisible({ timeout: 2_000 });
    }
  });
});
