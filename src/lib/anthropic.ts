import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL = "claude-sonnet-4-6";

// Sabit sistem mesajları — prompt caching için cache_control işaretli
export const FILTRE_SISTEM_MESAJI = `Sen Türkiye'deki hibe, teşvik ve destek programları konusunda uzman bir danışmansın.
Firmaya ait bilgiler ve destek programı kriterleri verildiğinde, firmanın bu desteğe uygunluğunu değerlendirirsin.
Yanıtlarını daima JSON formatında ver.
Kural tabanlı filtrenin kesin olarak uygun veya uygunsuz bulduğu programları değil,
sınırda kalan ya da özel durumlar gerektiren programları değerlendirirsin.`;

export const PROJE_ASISTANI_SISTEM_MESAJI = `Sen Türk hibe/destek programları için proje raporu yazımında uzman bir danışmansın.
Başvurulan desteğin değerlendirme kriterleri, mevzuatı ve yaygın başarı faktörleri hakkında derin bilgiye sahipsin.
Proje raporunu inceleyerek bölüm bazlı somut düzeltme önerileri sunarsın.
Her öneri pratik, uygulanabilir ve desteğin özel gerekliliklerine uygun olmalıdır.
Yanıtlarını daima belirtilen JSON formatında ver.`;

export async function aiFiltrele(
  firmaMetni: string,
  destekMetni: string,
): Promise<{
  tavsiye: boolean;
  gerekce: string;
  adimlar: string[];
  uygunlukOrani: number;
}> {
  const mesaj = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: FILTRE_SISTEM_MESAJI,
        cache_control: { type: "ephemeral" } as { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Firma bilgileri:\n${firmaMetni}\n\nDestek programı:\n${destekMetni}\n\nBu firmanın bu desteğe uygun olup olmadığını değerlendir. JSON formatında yanıt ver:\n{"tavsiye": boolean, "gerekce": "string", "adimlar": ["string"], "uygunlukOrani": 0-100}`,
      },
    ],
  });

  const icerik = mesaj.content[0];
  if (icerik.type !== "text") throw new Error("Beklenmeyen AI yanıt tipi");

  const jsonMetni = icerik.text.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonMetni) throw new Error("AI yanıtında JSON bulunamadı");

  return JSON.parse(jsonMetni);
}
