export interface BlogYazisi {
  slug: string;
  baslik: string;
  ozet: string;
  kategori: string;
  etiketler: string[];
  yayinTarihi: string;
  okumaSuresi: number; // dakika
  resimUrl?: string;
  icerik: string; // HTML
}

export const blogYazilari: BlogYazisi[] = [
  {
    slug: "tubitak-1507-basvuru-rehberi",
    baslik: "TÜBİTAK 1507 KOBİ Ar-Ge Başlangıç Programı'na Nasıl Başvurulur?",
    ozet:
      "TÜBİTAK 1507 programı, KOBİ'lerin Ar-Ge projelerine %75'e kadar hibe sunuyor. Başvuru sürecinin adım adım rehberi, dikkat edilmesi gereken noktalar ve sık yapılan hatalar.",
    kategori: "TÜBİTAK",
    etiketler: ["tubitak", "1507", "ar-ge", "hibe", "kobi", "başvuru rehberi"],
    yayinTarihi: "2026-04-15",
    okumaSuresi: 8,
    icerik: `
<h2>TÜBİTAK 1507 Nedir?</h2>
<p>TÜBİTAK 1507 KOBİ Ar-Ge Başlangıç Destek Programı, Türkiye'deki küçük ve orta büyüklükteki işletmelerin (KOBİ) teknolojik ürün geliştirme kapasitelerini artırmak amacıyla tasarlanmış ulusal bir hibe programıdır. Program, 250'den az çalışanı ve 250 milyon TL'nin altında yıllık cirosu olan firmalar için açıktır.</p>

<h2>Temel Özellikler</h2>
<ul>
  <li><strong>Hibe Oranı:</strong> %75 (öncelikli teknoloji alanlarında %80'e çıkabilir)</li>
  <li><strong>Maksimum Destek:</strong> 1.500.000 TL</li>
  <li><strong>Proje Süresi:</strong> 12–24 ay</li>
  <li><strong>Başvuru Yöntemi:</strong> TÜBİTAK ARDEB-OYS sistemi üzerinden çevrimiçi</li>
</ul>

<h2>Kimler Başvurabilir?</h2>
<p>Türkiye'de faaliyet gösteren, aşağıdaki kriterleri karşılayan firmalar başvurabilir:</p>
<ul>
  <li>Çalışan sayısı 250'nin altında</li>
  <li>Yıllık ciro 250 milyon TL veya altında</li>
  <li>Türk Ticaret Kanunu kapsamında tescil edilmiş A.Ş. veya Ltd. Şti.</li>
  <li>Vergi borcu bulunmayan (SGK ve vergi dairesi yazıları gerekli)</li>
</ul>

<h2>Başvuru Süreci Adım Adım</h2>
<h3>1. Proje Fikrini Netleştirin</h3>
<p>Başvurmadan önce projenizin teknolojik yenilik içerdiğinden emin olun. TÜBİTAK, salt yazılım geliştirme veya tasarım projelerini değil; Ar-Ge faaliyeti gerektiren, bilinmeyenlik içeren projeleri destekler. <em>"Bilinmeyenlik testi"</em>: Projenin başında sonucun kesin bilinmeyip bilinmediğini kendinize sorun.</p>

<h3>2. TÜBİTAK OYS Hesabı Açın</h3>
<p>tubitak.gov.tr üzerinden firma adına OYS (Online Yönetim Sistemi) hesabı oluşturun. Bu süreç birkaç günden birkaç haftaya kadar sürebilir; erken başlayın.</p>

<h3>3. Proje Önerisini Yazın</h3>
<p>Öneride şu bölümlere dikkat edin:</p>
<ul>
  <li><strong>Teknik Özgünlük:</strong> Mevcut teknoloji/ürünlerden farkı net ifade edilmeli</li>
  <li><strong>İş Paketi ve Takvim:</strong> Gerçekçi, ay ay planlanmış çalışma paketi</li>
  <li><strong>Bütçe Gerekçesi:</strong> Her kalem ayrıntılı açıklanmalı</li>
  <li><strong>Ar-Ge Personeli:</strong> CV ve zaman planları eksiksiz olmalı</li>
  <li><strong>Ar-Ge Altyapısı:</strong> Mevcut ekipman veya kiralanacak ekipman belgelenmeli</li>
</ul>

<h3>4. Hakem Değerlendirmesi</h3>
<p>Başvuru sonrası TÜBİTAK sahaya hakem atar. Hakem, firma ziyareti gerçekleştirebilir. Bu aşamada:</p>
<ul>
  <li>Teknik detaylar için Ar-Ge ekibinizin hazır olmasını sağlayın</li>
  <li>Proje için ayrılan fiziksel alan var mı? Gösterebilir misiniz?</li>
  <li>Önceki prototip veya patent belgeleriniz varsa sunun</li>
</ul>

<h2>Sık Yapılan Hatalar</h2>
<ol>
  <li><strong>Ar-Ge ile üretimi karıştırmak:</strong> "Ürünümüzü geliştiriyoruz" yeterli değil; "Bu geliştirme bilinmeyen teknik sorunları çözmeyi gerektiriyor" deyin.</li>
  <li><strong>Bütçe şişirme:</strong> Hakem gerçekçi olmayan kalemleri fark eder, güvenilirlik zedelenir.</li>
  <li><strong>Proje süresini kısa tutmak:</strong> 12 ay sıkışık proje daha yüksek risk; 18–24 ay genellikle daha güvenli.</li>
  <li><strong>Geç başvuru:</strong> OYS sistemi son dakika yoğunluğunda sorun çıkarabilir. En az 2 hafta önceden hazır olun.</li>
</ol>

<h2>Sonuç</h2>
<p>TÜBİTAK 1507, orta büyüklükte Ar-Ge yatırımları için Türkiye'nin en erişilebilir hibe programlarından biridir. Doğru hazırlanmış bir proje dosyası ve sektörünüzle örtüşen teknik bir özgünlük ile kabul oranını önemli ölçüde artırabilirsiniz.</p>
    `,
  },
  {
    slug: "kosgeb-programlari-karsilastirma-2026",
    baslik: "KOSGEB Destek Programları Karşılaştırması 2026 — Hangi Program Size Uygun?",
    ozet:
      "KOSGEB'in 2026 yılında aktif olan 13 farklı destek programını karşılaştırdık. Girişimcilik, Ar-Ge, Dijital Dönüşüm ve Yeşil Dönüşüm programları arasındaki farkları ve başvuru koşullarını inceleyin.",
    kategori: "KOSGEB",
    etiketler: ["kosgeb", "destek programları", "2026", "hibe", "karşılaştırma"],
    yayinTarihi: "2026-04-28",
    okumaSuresi: 6,
    icerik: `
<h2>KOSGEB Programlarına Genel Bakış</h2>
<p>KOSGEB (Küçük ve Orta Ölçekli İşletmeleri Geliştirme ve Destekleme İdaresi), 2026 yılı itibarıyla 13 farklı aktif destek programı yürütmektedir. Programlar arasındaki en kritik ayrım; firmanın yaşı, Ar-Ge kapasitesi ve hedeflediği büyüme alanıdır.</p>

<h2>Hangi Program Size Uygun?</h2>
<h3>Yeni Kurulmuş Firmaysanız → Girişimcilik Destek Programı</h3>
<p>Son 3 yıl içinde kurulan işletmeler için tasarlanmış bu program, işletme giderleri, makine-ekipman ve danışmanlık kalemlerinde <strong>%100 hibe, 260.000 TL'ye kadar</strong> destek sunar. KOSGEB Uygulamalı Girişimcilik Eğitimi sertifikası gereklidir.</p>

<h3>Ar-Ge ve Yenilikçi Ürün Geliştiriyorsanız → Ar-Ge, İnovasyon ve Endüstriyel Uygulama</h3>
<p>Proje bazlı değerlendirme yapılır. %75 hibe oranı ve 1.000.000 TL'ye kadar destek. Önceki TÜBİTAK/KOSGEB desteği olanlar için TEP programı daha avantajlı olabilir.</p>

<h3>Dijitalleşme Yatırımı Yapacaksanız → Dijital Dönüşüm</h3>
<p>ERP, CRM, MES, e-ticaret altyapısı gibi yazılım ve dijital danışmanlık giderlerine <strong>%70 hibe, 500.000 TL'ye kadar</strong>. Dijital olgunluk değerlendirmesi sonucuna göre destek miktarı değişiyor.</p>

<h3>İhracat Hedefliyorsanız → İhracat Pazarları Geliştirme</h3>
<p>Yurt dışı fuar, pazar araştırması ve e-ihracat giderleri için <strong>%75 hibe, 300.000 TL'ye kadar</strong>. İhracat geçmişi olmayan firmalar da başvurabilir.</p>

<h3>AB Uyum Sürecindeyseniz → Yeşil Dönüşüm (2026 Yeni Çağrısı)</h3>
<p>Enerji verimliliği, yenilenebilir enerji ve çevre uyumu yatırımları için <strong>%60 hibe + faizsiz kredi, 2.000.000 TL'ye kadar</strong>. AB Yeşil Mutabakat kapsamında stratejik öneme sahip; 2026 sonu başvuru kesim tarihi.</p>

<h2>Program Seçim Matrisi</h2>
<table>
  <thead><tr><th>Durum</th><th>Önerilen Program</th><th>Max. Destek</th></tr></thead>
  <tbody>
    <tr><td>≤3 yaşında firma</td><td>Girişimcilik</td><td>260.000 TL</td></tr>
    <tr><td>Ar-Ge yapıyor</td><td>Ar-Ge & İnovasyon</td><td>1.000.000 TL</td></tr>
    <tr><td>Dijital dönüşüm</td><td>Dijital Dönüşüm</td><td>500.000 TL</td></tr>
    <tr><td>İhracat hedefi</td><td>İhracat Pazarları</td><td>300.000 TL</td></tr>
    <tr><td>Büyüme yatırımı</td><td>İşletme Geliştirme</td><td>3.000.000 TL</td></tr>
    <tr><td>Yeşil dönüşüm</td><td>Yeşil Dönüşüm 2026</td><td>2.000.000 TL</td></tr>
  </tbody>
</table>

<h2>KOSGEB'e Başvuru İçin Temel Adımlar</h2>
<ol>
  <li>KOSGEB'in resmi web sitesinden üye kaydı oluşturun</li>
  <li>İlgili program sayfasını inceleyin, başvuru kılavuzunu indirin</li>
  <li>Gerekli belgeleri (vergi levhası, imza sirküleri, bilanço vb.) hazırlayın</li>
  <li>KOSGEB'in online başvuru sistemi üzerinden formu doldurun</li>
  <li>Değerlendirme sürecinde proje danışmanı ile görüşün</li>
</ol>
    `,
  },
  {
    slug: "arge-tesvik-rehberi-2026",
    baslik: "Ar-Ge Teşvikleri Rehberi 2026 — 5746, Teknokent ve SGK Desteklerini Doğru Kullanın",
    ozet:
      "5746 sayılı Ar-Ge Kanunu, Teknokent vergi muafiyetleri ve SGK prim desteklerini birlikte kullanan firmalar yılda milyonlarca TL tasarruf sağlıyor. Kapsamlı karşılaştırma ve uygulama rehberi.",
    kategori: "Sanayi Bakanlığı",
    etiketler: ["ar-ge", "5746", "teknokent", "sgk", "vergi teşviki", "prim desteği"],
    yayinTarihi: "2026-05-01",
    okumaSuresi: 10,
    icerik: `
<h2>Ar-Ge Teşviki Ekosistemi</h2>
<p>Türkiye'de Ar-Ge yapan firmaların yararlanabileceği üç ana teşvik mekanizması bulunmaktadır: <strong>5746 sayılı Ar-Ge Merkezi Kanunu</strong>, <strong>4691 sayılı Teknokent Kanunu</strong> ve <strong>SGK prim destekleri</strong>. Bu üçünü bir arada kullanan firmalar ciddi maliyet avantajı elde edebilir.</p>

<h2>5746 Sayılı Kanun — Ar-Ge Merkezi Teşvikleri</h2>
<p>Sanayi ve Teknoloji Bakanlığı onaylı Ar-Ge merkezi belgesine sahip firmalar şu teşviklerden yararlanır:</p>
<ul>
  <li><strong>%100 Kurumlar Vergisi İndirimi:</strong> Ar-Ge harcamaları vergi matrahından indirilebilir</li>
  <li><strong>Gelir Vergisi Stopajı Desteği:</strong> Ar-Ge personelinin gelir vergisinin %80–95'i istisna</li>
  <li><strong>SGK İşveren Payı Desteği:</strong> %50'si devlet tarafından karşılanır</li>
  <li><strong>Patent İndirimi:</strong> Patent tescil giderleri %100 indirilir</li>
</ul>
<p><em>Koşul: Ar-Ge merkezinde tam zamanlı en az 15 Ar-Ge personeli çalıştırılmalı.</em></p>

<h2>4691 — Teknokent Teşvikleri (2028'e Kadar Uzatıldı)</h2>
<p>Teknoloji Geliştirme Bölgesi kiracısı firmalar:</p>
<ul>
  <li><strong>Kurumlar Vergisi Muafiyeti:</strong> Yazılım ve Ar-Ge gelirlerinin tamamı muaf</li>
  <li><strong>KDV İstisnası:</strong> Üretilen yazılım satışları KDV'den istisna</li>
  <li><strong>Gelir Vergisi Stopaj İstisnası:</strong> Ar-Ge personelinin ücretlerinde %100 muafiyet</li>
  <li><strong>SGK İşveren Payı:</strong> Teknokent Ar-Ge personeli için devlet tamamını karşılar</li>
</ul>
<p><em>Avantaj: 5746'nın aksine minimum personel sayısı yok; tek çalışanlı firmalar bile yararlanabilir.</em></p>

<h2>Kümülatif Teşvik Hesabı</h2>
<p>10 Ar-Ge çalışanı olan bir Teknokent firması için tahmini yıllık tasarruf:</p>
<ul>
  <li>SGK işveren payı (10 kişi × ort. 35.000 TL/ay × 12 ay): ~4.200.000 TL</li>
  <li>Gelir vergisi stopajı (aynı baz): ~1.800.000 TL</li>
  <li>Kurumlar vergisi indirimi (2M TL Ar-Ge harcaması × %25): ~500.000 TL</li>
  <li><strong>Toplam tahmini tasarruf: ~6.500.000 TL/yıl</strong></li>
</ul>

<h2>Ar-Ge Merkezi mi, Teknokent mi?</h2>
<table>
  <thead><tr><th>Kriter</th><th>Ar-Ge Merkezi (5746)</th><th>Teknokent (4691)</th></tr></thead>
  <tbody>
    <tr><td>Min. personel</td><td>15 Ar-Ge çalışanı</td><td>Yok</td></tr>
    <tr><td>Fiziksel konum</td><td>Firmanın kendi binası</td><td>Teknokent içinde ofis</td></tr>
    <tr><td>KVK muafiyeti</td><td>%100 indirim</td><td>%100 muafiyet</td></tr>
    <tr><td>Uygun olan</td><td>Büyük ölçekli Ar-Ge firmaları</td><td>Startup ve KOBİ'ler</td></tr>
  </tbody>
</table>

<h2>Başvuru İçin Kritik Adımlar</h2>
<ol>
  <li>Ar-Ge faaliyetlerinizin belgelenmesi için muhasebeci/YMM ile çalışın</li>
  <li>Teknokent için ilgili teknokent yönetici şirketine başvurun</li>
  <li>5746 için Sanayi Bakanlığı online başvuru portalına kayıt olun</li>
  <li>Ar-Ge personelinin iş tanımlarını ve zaman cetvellerini güncel tutun</li>
</ol>
    `,
  },
  {
    slug: "ab-fonlari-kobiler-icin-rehber",
    baslik: "AB Fonlarından KOBİ'ler Nasıl Yararlanır? Horizon, LIFE ve Erasmus+ Rehberi",
    ozet:
      "Türk KOBİ'leri AB fonlarına nasıl başvurabilir? Horizon Europe EIC Accelerator, LIFE çevre programı ve Erasmus+ personel eğitimi için pratik rehber ve başvuru ipuçları.",
    kategori: "AB Fonları",
    etiketler: ["ab fonları", "horizon europe", "eic", "life", "erasmus", "uluslararası"],
    yayinTarihi: "2026-05-05",
    okumaSuresi: 7,
    icerik: `
<h2>Türkiye'nin AB Programlarındaki Durumu</h2>
<p>Türkiye, 2021 yılı itibarıyla <strong>Horizon Europe</strong>'a ortak ülke statüsüyle dahil olmuştur. Bu sayede Türk araştırmacı ve KOBİ'leri, AB üyesi ülkelerle eşdeğer koşullarda çoğu programa başvurabilmektedir. Ancak bazı programlarda katkı payı ve fayda hesaplamaları farklılık gösterebilir.</p>

<h2>1. Horizon Europe — EIC Accelerator</h2>
<p>Yüksek teknolojili KOBİ ve girişimler için AB'nin amiral gemisi programı:</p>
<ul>
  <li><strong>Hibe bileşeni:</strong> 2,5 milyon €'ya kadar (%70 hibe oranı)</li>
  <li><strong>Öz sermaye yatırımı:</strong> 15 milyon €'ya kadar EIC fonu yatırımı</li>
  <li><strong>Kabul oranı:</strong> ~%5 — yüksek rekabetli</li>
</ul>
<p><strong>Başarı için ipuçları:</strong> İngilizce pitch video hazırlayın (1 dakika). "Problem Statement" → "Solution" → "Market Size" → "Team" akışını net kurun. Avrupa pazarına yönelik ölçeklenebilirliği vurgulayın.</p>

<h2>2. LIFE Programı — Çevre ve İklim</h2>
<p>Çevre yönetimi ve iklim değişikliğiyle mücadele projelerine odaklanan LIFE, KOBİ'lere %60 hibe sunar:</p>
<ul>
  <li>Enerji verimliliği ve yenilenebilir enerji projeleri</li>
  <li>Biyoçeşitlilik ve doğa koruma</li>
  <li>Döngüsel ekonomi ve atık yönetimi</li>
</ul>
<p><em>Önemli:</em> En az 1 AB ülkesinden konsorsiyum ortağı zorunlu. Türk sivil toplum kuruluşları veya üniversitelerle ortak başvuru avantaj sağlar.</p>

<h2>3. Erasmus+ KOBİ Personel Eğitimi</h2>
<p>En erişilebilir AB programlarından biri: KOBİ çalışanlarının Avrupa'da mesleki eğitim ve staj programlarına katılımı desteklenir.</p>
<ul>
  <li>Seyahat ve konaklama giderleri karşılanır</li>
  <li>Türkiye Ulusal Ajansı (erasmusplus.org.tr) üzerinden başvuru</li>
  <li>Başvuru sürecinde İngilizce gereklilik düşük; ulusal ajans Türkçe destek sunar</li>
</ul>

<h2>AB Fonu Başvurusunda Dikkat Edilmesi Gerekenler</h2>
<ol>
  <li><strong>Konsorsiyum kurun:</strong> Çoğu AB programı ortaklık gerektirir. Avrupalı üniversite veya KOBİ ortakları CORDIS, Enterprise Europe Network (EEN) veya LinkedIn üzerinden bulunabilir.</li>
  <li><strong>Erken hazırlık:</strong> AB teklifleri hazırlanması 3–6 ay sürer. Son başvuru tarihinden en az 4 ay önce hazırlığa başlayın.</li>
  <li><strong>Profesyonel destek alın:</strong> Deneyimli bir Horizon danışmanı başarı olasılığını önemli ölçüde artırır.</li>
  <li><strong>Finansal güç gösterin:</strong> AB fonları, firmanın projeyi yönetebilecek mali güce sahip olduğunu değerlendirir. Bilanço ve mali tablolar hazır olsun.</li>
</ol>

<h2>Türk KOBİ'leri için Başarı Hikayeleri</h2>
<p>Özellikle yazılım, sağlık teknolojileri ve temiz enerji alanlarında Türk startupları EIC Accelerator'dan destek almıştır. TÜBİTAK TEYDEB, Horizon projelerinde ortak kuruluş olarak yer alarak Türk firmalara rehberlik edebilmektedir.</p>
    `,
  },
];

export function blogYazisiBul(slug: string): BlogYazisi | undefined {
  return blogYazilari.find((y) => y.slug === slug);
}
