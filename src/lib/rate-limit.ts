interface Pencere {
  sayac: number;
  sifirlanacak: number;
}

// Edge/serverless ortamda global Map instance'lar restart'ta sıfırlanır;
// bu in-memory yaklaşım tek instance için yeterli, production'da Upstash Redis tercih edilmeli.
const kayitlar = new Map<string, Pencere>();

interface RateLimitSonucu {
  basarili: boolean;
  kalanHak: number;
  sifirlanmaMs: number;
}

/**
 * uid başına pencere içinde maksimum istek sayısını kontrol eder.
 * @param uid      Kullanıcı kimliği (rate limit anahtarı)
 * @param limit    Pencere başına max istek (varsayılan 10)
 * @param pencereMs Pencere süresi ms cinsinden (varsayılan 60_000 = 1 dk)
 */
export function rateLimitKontrol(
  uid: string,
  limit = 10,
  pencereMs = 60_000,
): RateLimitSonucu {
  const simdi = Date.now();
  const mevcut = kayitlar.get(uid);

  if (!mevcut || simdi > mevcut.sifirlanacak) {
    kayitlar.set(uid, { sayac: 1, sifirlanacak: simdi + pencereMs });
    return { basarili: true, kalanHak: limit - 1, sifirlanmaMs: simdi + pencereMs };
  }

  if (mevcut.sayac >= limit) {
    return { basarili: false, kalanHak: 0, sifirlanmaMs: mevcut.sifirlanacak };
  }

  mevcut.sayac += 1;
  return { basarili: true, kalanHak: limit - mevcut.sayac, sifirlanmaMs: mevcut.sifirlanacak };
}

// Bellek sızıntısını önle: 5 dakikada bir süresi dolmuş kayıtları temizle
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const simdi = Date.now();
    for (const [key, val] of kayitlar.entries()) {
      if (simdi > val.sifirlanacak) kayitlar.delete(key);
    }
  }, 5 * 60_000);
}
