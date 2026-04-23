import { tubitakDestekleri } from "./tubitak";
import { kosgebDestekleri } from "./kosgeb";
import { tkdkDestekleri } from "./tkdk";
import { abFonlariDestekleri } from "./ab-fonlari";
import { sgkDestekleri } from "./sgk";
import { teknokentDestekleri } from "./teknokent";
import { kalkinmaAjanslariDestekleri } from "./kalkinma-ajanslari";
import { ticaretBakanligiDestekleri } from "./ticaret-bakanligi";
import { sanayiBakanligiDestekleri } from "./sanayi-bakanligi";
import { tarimBakanligiDestekleri } from "./tarim-bakanligi";

// Tüm statik destek verileri — seed scripti ve fallback için kullanılır
// Gerçek veriler veritabanından çekilir; bu liste seed kaynağıdır
export const tumDestekler = [
  ...tubitakDestekleri,
  ...kosgebDestekleri,
  ...tkdkDestekleri,
  ...abFonlariDestekleri,
  ...sgkDestekleri,
  ...teknokentDestekleri,
  ...kalkinmaAjanslariDestekleri,
  ...ticaretBakanligiDestekleri,
  ...sanayiBakanligiDestekleri,
  ...tarimBakanligiDestekleri,
];

export {
  tubitakDestekleri,
  kosgebDestekleri,
  tkdkDestekleri,
  abFonlariDestekleri,
  sgkDestekleri,
  teknokentDestekleri,
  kalkinmaAjanslariDestekleri,
  ticaretBakanligiDestekleri,
  sanayiBakanligiDestekleri,
  tarimBakanligiDestekleri,
};
