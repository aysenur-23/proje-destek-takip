import { PrismaClient } from "@prisma/client";
import { tumDestekler } from "../src/data/destekler";

const prisma = new PrismaClient();

async function main() {
  console.log("Destek programları yükleniyor...");

  let eklenen = 0;
  let guncellenen = 0;

  for (const destek of tumDestekler) {
    const mevcut = await prisma.destekProgrami.findUnique({
      where: { slug: destek.slug },
    });

    const veri = {
      ad: destek.ad,
      kurum: destek.kurum,
      kategori: destek.kategori,
      tur: destek.tur,
      aciklama: destek.aciklama,
      amac: destek.amac,
      butceUstSinir: destek.butceUstSinir ?? null,
      hibeOrani: destek.hibeOrani ?? null,
      basvuruBaslangic: destek.basvuruBaslangic
        ? new Date(destek.basvuruBaslangic)
        : null,
      basvuruBitis: destek.basvuruBitis
        ? new Date(destek.basvuruBitis)
        : null,
      aktif: destek.aktif,
      mevzuatUrl: destek.mevzuatUrl,
      rehberUrl: destek.rehberUrl ?? null,
      kriterler: destek.kriterler as object,
      etiketler: destek.etiketler,
      oncelik: destek.oncelik,
    };

    if (mevcut) {
      // Sadece seed verisiyle güncellenmiş olmayanları güncelle
      // (admin tarafından değiştirilmişler korunur)
      if (!mevcut.sonGuncelleyenKullanici) {
        await prisma.destekProgrami.update({
          where: { slug: destek.slug },
          data: veri,
        });
        guncellenen++;
      }
    } else {
      await prisma.destekProgrami.create({
        data: { slug: destek.slug, ...veri },
      });
      eklenen++;
    }
  }

  console.log(`✓ ${eklenen} yeni destek eklendi, ${guncellenen} güncellendi.`);
  console.log(`Toplam: ${tumDestekler.length} destek programı`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
