/**
 * FAZ 5.12 — Luxe theme presets per edition.
 *
 * 6 edisyonun tüm renk + asset path + meta bilgisi tek dosyada.
 * LuxeEditionDemo bunlardan birini alıp render eder.
 */

import { AETHEL_CHAPEL, EDITIONS, type EditionMeta } from "./tokens";
import type { LuxeEditionTheme } from "@/components/themed/luxe-edition-demo";

/* ── 6. AETHEL CHAPEL (mevcut) ─────────────────────────────────── */
export const AETHEL_THEME: LuxeEditionTheme = {
  meta: AETHEL_CHAPEL,
  bg: "#F2EEE4",
  footerBg: "#E8E3D5",
  ink: "#2E3326",
  inkSoft: "#5E6650",
  inkMuted: "#8A9078",
  accent: "#7A8A6E",
  haloColor: "#9EAA8E",
  waxSealSrc: "/aethel/wax-seal-luxe.png",
  watermarkSrc: "/aethel/chapel-vignette.png",
  coverScene: "/aethel/cover.jpg",
  weddingDateISO: "2026-09-12",
  coupleName: "Defne & Aras",
  monogram: "D&A",
  venue: "Aethel's Chapel · Toscana",
  greeting: "Bir davet sizi bekliyor",
  heroEyebrow: "Evleniyoruz",
  heroCta: "Bizimle olur musun?",
  envelopeCta: "Davetiyeyi Aç",
  musicTrack: "Clair de Lune · Claude Debussy",
  footerNote: "Bizimle olmanız bizi onurlandırır",
  defaultDate: { day: "12", month: "Eylül", year: "2026" },
  ambient: "doves",
  storyGlyph: "cross",
  story: [
    {
      year: "2019",
      title: "Floransa'da bir öğleden sonra",
      body: "Defne, Uffizi'nin önündeki bir kahve dükkânında bir İtalyan dergisini açmıştı. Aras, aynı sayfayı çevirmek için elini uzattığında ikisi de güldü.",
    },
    {
      year: "2021",
      title: "İlk yolculuk",
      body: "Toskana'nın küçük yollarında bir araba kiraladık. Yolda Aethel adında bir antik şapele rastladık — bir gün burada söz vermenin güzel olacağını söyledik.",
    },
    {
      year: "2024",
      title: "Söz",
      body: "Aynı şapelin önünde, zeytin ağaçlarının altında. Defne 'Evet' dedi; Aras o gün cebinde küçük bir bal kavanozu taşıyordu — sebebini hâlâ anlamış değiliz.",
    },
    {
      year: "2026",
      title: "Aethel'da buluşalım",
      body: "Sonbahar, üzüm hasadı ve birbirimizden başka bir şey istemiyoruz. Geldiğinizde, ışığın nasıl olduğunu görmek için biraz erken gelin.",
    },
  ],
  schedule: [
    {
      time: "15:30",
      title: "Geliş · Zeytinlikten",
      desc: "Şapele giden taş yolda, selvilerin gölgesinde sizi karşılayacağız",
      icon: "arrival",
    },
    {
      time: "16:00",
      title: "Tören · Şapelde",
      desc: "Bir ahid taşın içinde mühürlenir; biz de bu yedi yüz yıllık duvarlar arasında söz veriyoruz",
      icon: "vows",
    },
    {
      time: "17:30",
      title: "Aperitivo · Bahçede",
      desc: "Prosecco, taze figiusa ve mevsim çiçeklerinin arasında bir saatlik nefes",
      icon: "glass",
    },
    {
      time: "19:30",
      title: "Yemek · Loggia'da",
      desc: "Beş kapaklı bir İtalyan menüsü; mum ışığı, üzüm yaprakları ve uzak bir mandolinin sesi",
      icon: "plate",
    },
    {
      time: "22:30",
      title: "Dans · Sarmaşıkların Altında",
      desc: "Toskana gecesinin altında, sabahın limon kokusuna kadar bizimle kalın",
      icon: "dance",
    },
  ],
  faq: [
    {
      q: "Mekana nasıl ulaşırız?",
      a: "Floransa havalimanından 45 dakika. RSVP onayından sonra detaylı yol tarifi + opsiyonel transfer hizmeti için link paylaşılır.",
    },
    {
      q: "Otopark var mı?",
      a: "Şapelin batı kapısında 40 araçlık yer var. Vale hizmeti 14:00-16:00 arası aktif olacak.",
    },
    {
      q: "Ne giymeli?",
      a: "Bahçe-şık. Şapelin zeminindeki taşlar 700 yıllık; topuklu yerine alçak topuk veya elegant sandalet öneririz.",
    },
    {
      q: "Çocuklar gelebilir mi?",
      a: "Elbette. 16:00 töreni sırasında küçük misafirler için ayrı bir oyun alanı ve dadı eşliğinde aktivite olacak.",
    },
    {
      q: "Konaklama önerisi?",
      a: "Şapele 10-25 dk mesafede 3 boutique yer için özel kontenjan ayırdık — aşağıdaki listeden seçim yapabilirsiniz.",
    },
  ],
  hotels: [
    {
      name: "Castello di Nipozzano",
      address: "Pelago, Toskana · 15 dk",
      note: "Frescobaldi şarap şatosu — bağların içinde",
    },
    {
      name: "Borgo Santo Pietro",
      address: "Chiusdino · 25 dk",
      note: "Relais & Châteaux 5★ · biyodinamik bahçe",
    },
    {
      name: "Villa San Lorenzo",
      address: "Tavarnelle · 12 dk",
      note: "Aile mülkü, 8 oda · şapele en yakın",
    },
    {
      name: "Castello del Nero",
      address: "Tavarnelle Val di Pesa · 20 dk",
      note: "Como Hotels · spa + zeytinlik",
    },
  ],
};

/* ── 1. ATELIER INDIGO (gece mavisi + altın varak) ─────────────── */
export const ATELIER_INDIGO_THEME: LuxeEditionTheme = {
  meta: EDITIONS["atelier-indigo"],
  bg: "#0F1A3D",
  footerBg: "#0A1430",
  ink: "#F2EAD3",
  inkSoft: "rgba(242, 234, 211, 0.78)",
  inkMuted: "rgba(212, 161, 88, 0.78)",
  accent: "#D4A158",
  haloColor: "#D4A158",
  waxSealSrc: "/atelier-indigo/wax-seal.png",
  watermarkSrc: "/atelier-indigo/watermark.png",
  coverScene: "/atelier-indigo/cover.jpg",
  weddingDateISO: "2026-10-24",
  coupleName: "Selin & Mert",
  monogram: "S&M",
  venue: "Çırağan Sarayı · İstanbul",
  greeting: "Gece yarısı bir davet",
  heroEyebrow: "Birlikte",
  heroCta: "Yanımızda olur musun?",
  envelopeCta: "Mührü Kır",
  musicTrack: "Nocturne in E♭ · Chopin",
  footerNote: "Bir gece masalı için bekleriz",
  defaultDate: { day: "24", month: "Ekim", year: "2026" },
  ambient: "starfield",
  storyGlyph: "moon",
  story: [
    {
      year: "2018",
      title: "Bir gala gecesi",
      body: "Selin, Pera'da bir caz gecesinde. Mert, kalabalığın arasında onu fark eden tek kişi. Müzik bittiğinde Selin onun adını bile bilmiyordu.",
    },
    {
      year: "2020",
      title: "Bir gece pencere kenarında",
      body: "Karantina vardı; balkonlardan birbirimize kitap önerdik. İlk öpüştüğümüz gece İstanbul üstünde tam dolunay vardı.",
    },
    {
      year: "2023",
      title: "Bosphorus'un altın saati",
      body: "Bir vapur yolculuğunda Mert cebinden eski bir mektup çıkardı — Selin'in iki yıl önce ona bıraktığı not. Cevabını o gün verdi.",
    },
    {
      year: "2026",
      title: "Çırağan'da bir akşam",
      body: "Altın varak, gece mavisi ve sizinle. Gelirseniz, gökyüzünden bahsetmeyi ihmal etmeyin — orada en güzel hediyeyi vereceğiz.",
    },
  ],
  schedule: [
    {
      time: "18:30",
      title: "Karşılama · Altın Salon",
      desc: "Cam fenerlerin altında, kristal şampanya ve canlı tar müziği ile",
      icon: "arrival",
    },
    {
      time: "19:30",
      title: "Tören · Yıldızların Altında",
      desc: "Cıvıltısı kesilmiş Bosphorus'a karşı; sözlerimiz tek bir kelimede toplanır",
      icon: "vows",
    },
    {
      time: "20:30",
      title: "Şampanya & Caz · Loca",
      desc: "Üç parçalık caz triosu, antika altın varak salonun altında",
      icon: "music",
    },
    {
      time: "22:00",
      title: "Black Tie Yemek · Büyük Salon",
      desc: "Yedi kapaklı menü; her tabakta bir başka şehir, her kadehte bir başka yıl",
      icon: "plate",
    },
    {
      time: "00:30",
      title: "Gece Yarısı Dansı",
      desc: "Hilal yükselene kadar, son şarkı kaldığı yerden başlayana kadar",
      icon: "star",
    },
  ],
  faq: [
    {
      q: "Ne giymeli?",
      a: "Black tie. Bu büyük bir gece — smokin, uzun elbise ve en parlak takılarınız. Girişi yapmaya hazırlanın.",
    },
    {
      q: "Otopark var mı?",
      a: "Çırağan'ın vale servisi 18:00'den itibaren aktif. Ulaşımı kolaylaştırmak için merkezi noktalardan transfer aracı planlıyoruz — RSVP'de seçim yapabilirsiniz.",
    },
    {
      q: "Mekan klimalı mı?",
      a: "Tüm salonlar iklimlendirilmiştir. Mevsimsel olarak şal getirmenizi öneririz, gece Bosphorus rüzgârı sertleşir.",
    },
    {
      q: "Çocuklar gelebilir mi?",
      a: "Bu gece yetişkinlere özel. Çocuk bakıcılığı için ortaklarımızla ayrı bir hizmet sunuyoruz — bilgi RSVP onayından sonra paylaşılır.",
    },
    {
      q: "Gece geç bitiyor, dönüş?",
      a: "01:30 ve 02:30'da merkezi noktalara dönüş servisleri olacak. Detaylı rota RSVP onayından sonra.",
    },
  ],
  hotels: [
    {
      name: "Çırağan Palace Kempinski",
      address: "Çırağan Cd. · 0 dk (aynı mekan)",
      note: "Düğün için özel kontenjan + early check-in",
    },
    {
      name: "Four Seasons Bosphorus",
      address: "Çırağan Cd. · 4 dk",
      note: "Yalı odaları · özel iskele",
    },
    {
      name: "Six Senses Kocataş Mansions",
      address: "Sarıyer · 25 dk",
      note: "Spa + Bosphorus manzaralı tarihi yalı",
    },
    {
      name: "Mandarin Oriental Bosphorus",
      address: "Beşiktaş · 12 dk",
      note: "Modern lüks · plaj kulübü",
    },
  ],
};

/* ── 2. MANSION LIGHTS (boğazda akşam yalısı) ──────────────────── */
export const MANSION_LIGHTS_THEME: LuxeEditionTheme = {
  meta: EDITIONS["mansion-lights"],
  bg: "#4A1521",
  footerBg: "#3A0F19",
  ink: "#F2EAD3",
  inkSoft: "rgba(242, 234, 211, 0.78)",
  inkMuted: "rgba(217, 179, 106, 0.85)",
  accent: "#D9B36A",
  haloColor: "#D9B36A",
  waxSealSrc: "/mansion-lights/wax-seal.png",
  watermarkSrc: "/mansion-lights/watermark.png",
  coverScene: "/mansion-lights/cover.jpg",
  weddingDateISO: "2026-06-08",
  coupleName: "Zeynep & Kerem",
  monogram: "Z&K",
  venue: "Sait Halim Paşa Yalısı · Boğaziçi",
  greeting: "Boğazda bir akşam",
  heroEyebrow: "Şerefimize",
  heroCta: "Bizi onurlandırır mısın?",
  envelopeCta: "Davetiyeyi Aç",
  musicTrack: "La Vie en Rose · Édith Piaf",
  footerNote: "Geleneğe bir ışık daha katmak için",
  defaultDate: { day: "8", month: "Haziran", year: "2026" },
  ambient: "chandelier",
  storyGlyph: "candle",
  story: [
    {
      year: "2017",
      title: "Bir aile yemeği",
      body: "Zeynep'in dedesinin yalısında bir akşam. Kerem misafir olarak gelmişti ama akşam yemeğine kalmasına Zeynep'in büyükannesi sebep oldu.",
    },
    {
      year: "2019",
      title: "Bir Boğaz turu",
      body: "Üç saatlik bir vapur yolculuğunda Kerem'in cebinde küçük bir not vardı. Notu açmadan denize attı; 'Lazım olmadı, sen yanımdaydın' dedi.",
    },
    {
      year: "2024",
      title: "Söz töreni",
      body: "Aynı yalının balkonunda, kristal avizenin altında. Aile büyükleri vardı; iki tarafın da hâlâ ezberlediği bir konuşma yapıldı.",
    },
    {
      year: "2026",
      title: "Sait Halim Paşa'da",
      body: "Boğaz'a karşı, bordo kadife ve şampanya. Sizi bu masaya bekliyoruz — gece bittiğinde, bir şeyleri hatırlamak istemeyebilirsiniz.",
    },
  ],
  schedule: [
    {
      time: "17:30",
      title: "Karşılama · İskelede",
      desc: "Vapurdan inişiniz şampanya, gül yaprakları ve kanun sesiyle başlasın",
      icon: "arrival",
    },
    {
      time: "18:30",
      title: "Tören · Bahçede",
      desc: "Asırlık çınarların altında, Boğaz'a karşı; kristal avize tören boyunca yanacak",
      icon: "ring",
    },
    {
      time: "20:00",
      title: "Kokteyl · Yalı Önü",
      desc: "Akşam ışığında, taze meze ve klasik harp triosu eşliğinde",
      icon: "glass",
    },
    {
      time: "21:30",
      title: "Yemek · Salon-ı Hass",
      desc: "Osmanlı ve modern Akdeniz menüsünün buluşması; her tabakta bir hikâye",
      icon: "plate",
    },
    {
      time: "23:30",
      title: "Şampanya & Dans",
      desc: "Mehtap çıktığında, kadehler ve müzikle gecenin sonsuzluğuna",
      icon: "dance",
    },
  ],
  faq: [
    {
      q: "Mekana nasıl ulaşılır?",
      a: "İskele ile özel deniz transferi düzenliyoruz (Ortaköy ve Bebek noktalarından). Karayolu için Kireçburnu Caddesi'ne kadar geliniz; ardından vale.",
    },
    {
      q: "Dress code?",
      a: "Black-tie · long gown. Boğaz akşamı serin, ipek şal veya hafif palto getirmenizi öneririz.",
    },
    {
      q: "Vejetaryen / alerji?",
      a: "Menüde her ana tabağın vejetaryen versiyonu var. Alerji veya özel diyetinizi RSVP formunda mutlaka belirtin.",
    },
    {
      q: "Çocuklar gelebilir mi?",
      a: "Yetişkinlere özel akşam. 12 yaş altı misafirler için ayrı bir aile yemeği gündüz organize edilecektir — davetin ikinci kısmı.",
    },
    {
      q: "Gece nereye?",
      a: "01:30 sonrası dileyen misafirler için Çırağan'da kapalı bir afterparty + bar açık olacaktır.",
    },
  ],
  hotels: [
    {
      name: "Sait Halim Paşa Yalısı (Suites)",
      address: "Yeniköy · aynı mekan",
      note: "Düğün gecesi için 6 özel oda",
    },
    {
      name: "Çırağan Palace Kempinski",
      address: "Beşiktaş · 18 dk",
      note: "Bosphorus odaları · klasik servis",
    },
    {
      name: "Four Seasons Bosphorus",
      address: "Çırağan Cd. · 22 dk",
      note: "Yalı suites · özel iskele",
    },
    {
      name: "Bebek Hotel",
      address: "Bebek · 25 dk",
      note: "Boutique boutique · Bosphorus front",
    },
  ],
};

/* ── 3. BODRUM BLUE (Ege esintisi) ─────────────────────────────── */
export const BODRUM_BLUE_THEME: LuxeEditionTheme = {
  meta: EDITIONS["bodrum-blue"],
  bg: "#F4F1EA",
  footerBg: "#E8E3D8",
  ink: "#1F3848",
  inkSoft: "rgba(31, 56, 72, 0.72)",
  inkMuted: "rgba(74, 126, 148, 0.7)",
  accent: "#4A7E94",
  haloColor: "#7BA8BD",
  waxSealSrc: "/bodrum-blue/wax-seal.png",
  watermarkSrc: "/bodrum-blue/watermark.png",
  coverScene: "/bodrum-blue/cover.jpg",
  weddingDateISO: "2026-07-27",
  coupleName: "Ayda & Can",
  monogram: "A&C",
  venue: "Maçakızı · Türkbükü",
  greeting: "Bir Ege akşamı",
  heroEyebrow: "Denize karşı",
  heroCta: "Bizimle yelken aç",
  envelopeCta: "Davetiyeyi Aç",
  musicTrack: "Σ'αγαπώ · George Dalaras",
  footerNote: "Tuz, rüzgar ve birbirimiz için",
  defaultDate: { day: "27", month: "Temmuz", year: "2026" },
  ambient: "waves",
  storyGlyph: "anchor",
  story: [
    {
      year: "2018",
      title: "Türkbükü'nde bir öğle",
      body: "Ayda, bir teknede staj yapıyordu; Can o yaz Bodrum'daki ailesine yardım için gelmişti. Birbirlerine ilk söyledikleri söz: 'Çapanı çek.'",
    },
    {
      year: "2020",
      title: "Bir Yunan adası",
      body: "Patmos'a bir yelken seferi. Fırtına çıktı, geceyi küçük bir limanda geçirdik. Sabah uyandığımızda, denize bakan tek bir kahvede oturduk.",
    },
    {
      year: "2024",
      title: "Söz, denize karşı",
      body: "Maçakızı'nın iskelesinde. Can elinde tuttuğu yüzüğü öyle bir sallıyordu ki neredeyse düşürüyordu. Ayda'nın 'Evet'i denizin sesinden yüksek geldi.",
    },
    {
      year: "2026",
      title: "Maçakızı'nda",
      body: "Ege esintisi, begonvil ve yelkenler. Mutlu olmaya, denize karşı söz vermeye geliyoruz — yanımızda olun.",
    },
  ],
  schedule: [
    {
      time: "16:30",
      title: "Geliş · İskeleden",
      desc: "Tekne ile gelenleri Maçakızı iskelesinde karşılıyoruz; karadan gelenler için begonvil yolundan",
      icon: "arrival",
    },
    {
      time: "17:30",
      title: "Tören · Iskele Ucunda",
      desc: "Güneşin batmasıyla beraber, ayaklarınız tahtada, sözlerimiz denize karşı",
      icon: "vows",
    },
    {
      time: "19:00",
      title: "Meze & Rakı Sofrası",
      desc: "Beyaz mermerli uzun masada, ahtapot ızgara, deniz börülcesi, taze enginar",
      icon: "glass",
    },
    {
      time: "21:00",
      title: "Akşam Yemeği · Plajda",
      desc: "Mum ışıklı uzun masa, ızgara levrek, yerel beyazlar; arkamızda dalgaların ritmi",
      icon: "plate",
    },
    {
      time: "23:30",
      title: "Plaj Dansı",
      desc: "Yalın ayak kumun üstünde, DJ + bouzouki birlikte; gece yarısı havai fişek",
      icon: "dance",
    },
  ],
  faq: [
    {
      q: "Mekana nasıl gelinir?",
      a: "Bodrum havalimanından 35 dk. Düğün günü 14:00-16:00 arası havalimanından merkezi transfer + 16:00'da iskeleden tekne servisi düzenliyoruz. RSVP'de tercihinizi belirtin.",
    },
    {
      q: "Ne giymeli?",
      a: "Beach black-tie. Erkekler için keten takım veya beyaz gömlek + ten rengi pantolon; hanımlar için maksi kaftan veya uzun ipek. Yumuşak tabanlı ayakkabı şart (kum + iskele tahtası).",
    },
    {
      q: "Güneş çok ola bilir, koruma?",
      a: "Tören iskelesinde gölgelik kurulu, ayrıca her misafir için marka şapka + hasır yelpaze hazırlıyoruz. Hafif güneş kremi getirin.",
    },
    {
      q: "Çocuklar gelebilir mi?",
      a: "Çocuk dostuyuz — gün boyu açık çocuk plajı, dadı ekibi ve ayrı bir akşam yemeği menüsü var.",
    },
    {
      q: "Gece konaklama nerede?",
      a: "Maçakızı'da düğün için özel kontenjan + yakın çevrede 3 boutique villa anlaşmalı. Bilgi için RSVP onayı sonrası link gönderilir.",
    },
  ],
  hotels: [
    {
      name: "Maçakızı Hotel",
      address: "Türkbükü · aynı mekan",
      note: "Düğün için %20 + erken check-in",
    },
    {
      name: "Lujo Bodrum",
      address: "Bodrum Center · 35 dk",
      note: "All-inclusive lüks · plaj kulübü",
    },
    {
      name: "Mandarin Oriental Bodrum",
      address: "Cennet Koyu · 25 dk",
      note: "Özel iskele · spa",
    },
    {
      name: "Casa Dell'Arte Hotel",
      address: "Torba · 30 dk",
      note: "Boutique sanat oteli · yat marinasında",
    },
  ],
};

/* ── 4. OLIVE GROVE (Alaçatı organik lüks) ─────────────────────── */
export const OLIVE_GROVE_THEME: LuxeEditionTheme = {
  meta: EDITIONS["olive-grove"],
  bg: "#F5F2EB",
  footerBg: "#E8E3D5",
  ink: "#2D3320",
  inkSoft: "rgba(45, 51, 32, 0.7)",
  inkMuted: "rgba(103, 120, 78, 0.8)",
  accent: "#67784E",
  haloColor: "#9EAA8E",
  waxSealSrc: "/olive-grove/wax-seal.png",
  watermarkSrc: "/olive-grove/watermark.png",
  coverScene: "/olive-grove/cover.jpg",
  weddingDateISO: "2026-05-15",
  coupleName: "Ipek & Yiğit",
  monogram: "İ&Y",
  venue: "Köy Evi · Alaçatı",
  greeting: "Zeytin ağaçlarının altında",
  heroEyebrow: "Sabah esintisinde",
  heroCta: "Bahçemizde bekleriz",
  envelopeCta: "Davetiyeyi Aç",
  musicTrack: "Lemon Tree · Fool's Garden (acoustic)",
  footerNote: "Limon kokulu bir sabah için",
  defaultDate: { day: "15", month: "Mayıs", year: "2026" },
  ambient: "leaves",
  storyGlyph: "olive",
  story: [
    {
      year: "2019",
      title: "Alaçatı'da bir hasat",
      body: "Ipek, ailesinin zeytinliğinde hasat günündeydi. Yiğit, komşu bağdan geldi; ellerinde toprak vardı, gülümsemesinde bir mevsim.",
    },
    {
      year: "2021",
      title: "Bir Pazar sabahı",
      body: "Köy meydanındaki kahvaltıda Yiğit, Ipek'in kahvesine bilmeden iki şeker attı. Ipek bir şey demedi — sadece o günden sonra hep iki şekerli içti.",
    },
    {
      year: "2024",
      title: "Söz, zeytin ağacının altında",
      body: "Aile mülkündeki en yaşlı zeytin ağacının altında. Yiğit cebinden Ipek'in dedesinin yüzüğünü çıkardı. Ağaç şahit oldu.",
    },
    {
      year: "2026",
      title: "Köy Evi'nde",
      body: "Sabah esintisi, limon ve sade bir sevinç. Geliniz, zeytinlerin arasında yeni bir hikâyenin tanığı olun.",
    },
  ],
  schedule: [
    {
      time: "10:30",
      title: "Sabah Karşılama",
      desc: "Köy fırınından taze ekmek, taze sıkılmış nar suyu ve dağdan toplanmış kekik çayı",
      icon: "arrival",
    },
    {
      time: "11:30",
      title: "Tören · En Yaşlı Ağaç Altı",
      desc: "Ailenin yedi nesli boyunca dikilen 600 yaşındaki zeytin ağacının altında",
      icon: "vows",
    },
    {
      time: "13:00",
      title: "Akdeniz Sofrası · Bahçede",
      desc: "Uzun ahşap masada deniz börülcesi, taze peynir, ev yapımı pasta, yöre şarapları",
      icon: "plate",
    },
    {
      time: "16:00",
      title: "Bağda Mola",
      desc: "İkindi güneşi, uzun yastıklar, espresso + sade tatlı; dileyen şezlongda bir kestirme",
      icon: "glass",
    },
    {
      time: "20:30",
      title: "Ateş Başı Müzik",
      desc: "Kamp ateşi etrafında, yöresel müzik ve sabaha kadar yıldızlar — bonfire dance",
      icon: "music",
    },
  ],
  faq: [
    {
      q: "Mekana nasıl gelinir?",
      a: "Alaçatı merkezinden 15 dakika köy yolu. Düğün sabahı 10:00'da iki transfer aracı çekirdek noktalardan kalkacak; RSVP'de seçim yapabilirsiniz.",
    },
    {
      q: "Ne giymeli?",
      a: "Garden-chic / linen elegance. Kıyafetinizin rengi mevsim çiçekleriyle uyumlu olabilir — sage, krem, terracotta. Konfor önce.",
    },
    {
      q: "Toprakta yürüyeceğim, ayakkabı?",
      a: "Bahçede toprak + taş zemin var. Yumuşak alçak topuk veya zarif espadril önerilir. Stiletto için ayrı zemin örtüsü kuruyoruz.",
    },
    {
      q: "Çocuklar gelebilir mi?",
      a: "Çok severiz. Bahçede ayrı bir çocuk masası, mevsim meyvelerinden yapılmış ikramlar ve dadılar olacak.",
    },
    {
      q: "Konaklama?",
      a: "Köyde 3 boutique ev için kontenjan ayırdık. Alaçatı merkezindeki taş ev otelleri de yakındır.",
    },
  ],
  hotels: [
    {
      name: "Alavya Hotel",
      address: "Alaçatı merkez · 12 dk",
      note: "Taş ev · spa + bahçe",
    },
    {
      name: "Asma Yaprağı",
      address: "Germiyan · 18 dk",
      note: "5 odalı boutique · şefin sofrası",
    },
    {
      name: "Beymen Olive Hotel",
      address: "Çeşme · 25 dk",
      note: "Zeytinliğin içinde · plaj klübü",
    },
    {
      name: "Tas Otel",
      address: "Alaçatı merkez · 14 dk",
      note: "Aile işletmesi · tarihi taş ev",
    },
  ],
};

/* ── 5. AURORA (modernist minimalist) ──────────────────────────── */
export const AURORA_THEME: LuxeEditionTheme = {
  meta: EDITIONS["aurora"],
  bg: "#EFE9E4",
  footerBg: "#E2D9D1",
  ink: "#3A332D",
  inkSoft: "rgba(58, 51, 45, 0.72)",
  inkMuted: "rgba(184, 134, 122, 0.85)",
  accent: "#B8867A",
  haloColor: "#D6B0A4",
  waxSealSrc: "/aurora/wax-seal.png",
  watermarkSrc: "/aurora/watermark.png",
  coverScene: "/aurora/cover.jpg",
  weddingDateISO: "2026-10-03",
  coupleName: "Ece & Yusuf",
  monogram: "E&Y",
  venue: "Hacı Bekir Konağı · Anadoluhisarı",
  greeting: "İki çizgi, bir kavşak",
  heroEyebrow: "Mimari bir an",
  heroCta: "Bize katıl",
  envelopeCta: "Mührü Kır",
  musicTrack: "Comptine d'un autre été · Yann Tiersen",
  footerNote: "Geometri ve sevgi için",
  defaultDate: { day: "3", month: "Ekim", year: "2026" },
  ambient: "aurora",
  storyGlyph: "spark",
  story: [
    {
      year: "2020",
      title: "Bir mimarlık ofisi",
      body: "Ece bir konsept proje sunuyordu; Yusuf, eleştirmen masasındaydı. Maquette'in bir köşesi yamuktu — ikisi de aynı an gülümsedi.",
    },
    {
      year: "2022",
      title: "Anadoluhisarı'nda bir yürüyüş",
      body: "Sahil yolundan dönerken Yusuf, Ece'ye bir kâğıt tutuşturdu. İçinde sadece iki çizgi vardı, bir kavşak. Yıllar sonra anladık ne demek olduğunu.",
    },
    {
      year: "2025",
      title: "Söz",
      body: "Hacı Bekir Konağı'nın bahçesinde, mimari ışığın altında. Söz tek bir kelimeydi: 'Evet.' Sonraki günler için yeterli oldu.",
    },
    {
      year: "2026",
      title: "Konak'ta",
      body: "Mimari bir an. Geleceğin bizimle başlaması için gelin — kavşağın geri kalanını birlikte çizelim.",
    },
  ],
  schedule: [
    {
      time: "17:00",
      title: "Karşılama · Galeride",
      desc: "Sergisel beyaz duvarlar, çelik fenerler ve bir çay tezgâhı; sade ama özenli",
      icon: "arrival",
    },
    {
      time: "18:00",
      title: "Tören · Iç Avlu",
      desc: "Mimari ışık altında, geometrik bir aks üzerinde tek bir 'evet'",
      icon: "ring",
    },
    {
      time: "19:00",
      title: "Kokteyl · Çatıda",
      desc: "Şehir manzarası, minimalist kanepe ve nadir Anadolu üzümlerinden bir bardak",
      icon: "glass",
    },
    {
      time: "20:30",
      title: "Tasting Menu",
      desc: "Yedi mikro tabak; Anadolu malzemesi, fine dining yorumu, çift şef imzası",
      icon: "plate",
    },
    {
      time: "23:00",
      title: "Vinyl & Dans",
      desc: "Eski plak çalar + 90'lar minimal house. Sabah espresso'ları cebimizde.",
      icon: "music",
    },
  ],
  faq: [
    {
      q: "Konak nerede?",
      a: "Anadoluhisarı, Boğaz'ın Asya yakası. Üsküdar-Beykoz aksı; vapurla geliş için Anadolu Hisarı iskelesi en yakın.",
    },
    {
      q: "Dress code?",
      a: "Modern minimal · monokrom. Beyaz, ekrü, taupe, antrasit. Logosuz, sade, iyi kesim — fazla aksesuara gerek yok.",
    },
    {
      q: "Vegan / glütensiz?",
      a: "Tasting menüsünün tamamı vegan ve glütensiz olarak alternatifli. Tercihinizi RSVP'de mutlaka belirtin.",
    },
    {
      q: "Çocuklar?",
      a: "Bu akşam yetişkinlere ait. Yakında ailecek bir brunch düzenleyeceğiz, davetini ayrı göndereceğiz.",
    },
    {
      q: "Geç saat servisi?",
      a: "00:30 ve 01:30'da Asya + Avrupa yakasına transfer araçları olacak. Detaylı yol bilgisi RSVP onayı sonrası paylaşılır.",
    },
  ],
  hotels: [
    {
      name: "Sumahan on the Water",
      address: "Çengelköy · 8 dk",
      note: "Eski rakı fabrikası · tasarım otel · özel iskele",
    },
    {
      name: "A'jia Hotel",
      address: "Kanlıca · 6 dk",
      note: "Tarihi yalı + minimalist design",
    },
    {
      name: "Bebek Hotel",
      address: "Bebek · 22 dk",
      note: "Boutique · Boğaz manzaralı",
    },
    {
      name: "The House Hotel Bosphorus",
      address: "Ortaköy · 25 dk",
      note: "Modern lüks · yakın metro/tramvay",
    },
  ],
};

/* ── Toplu erişim ──────────────────────────────────────────────── */
export const LUXE_THEMES = {
  aethel: AETHEL_THEME,
  "atelier-indigo": ATELIER_INDIGO_THEME,
  "mansion-lights": MANSION_LIGHTS_THEME,
  "bodrum-blue": BODRUM_BLUE_THEME,
  "olive-grove": OLIVE_GROVE_THEME,
  aurora: AURORA_THEME,
} as const;

export type LuxeEditionSlug = keyof typeof LUXE_THEMES;
