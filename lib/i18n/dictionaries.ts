import type { Locale, Messages } from "./types";

/* =======================================================================
 *  TÜRKÇE — source language. All copy original to NUVE.
 * ======================================================================= */

const tr: Messages = {
  meta: {
    title: "NUVE · Dijital Davetiye Stüdyosu",
    description:
      "Niyetle yazılmış dijital düğün davetiyeleri. Elde yapılır, 48 saatte teslim edilir. RSVP, çok dilli, kendi alan adın — hepsi dahil.",
  },
  nav: {
    aria_label: "Ana menü",
    lang_aria: "Dil seçici",
    menu: {
      manifesto: "Manifesto",
      themes: "Şablonlar",
      how: "Nasıl Çalışır",
      pricing: "Fiyatlar",
      faq: "SSS",
      contact: "İletişim",
    },
    cta_short: "Başla",
    cta_aria: "Davetiyeni oluşturmaya başla",
    open_menu: "Menüyü aç",
    close_menu: "Menüyü kapat",
    home_aria: "NUVE — Anasayfa",
  },
  hero: {
    eyebrow: "Dijital Davetiye Stüdyosu · №01",
    headline_l1: "Bir davet,",
    headline_l2_prefix: "niyetle ",
    headline_l2_accent: "yazılır",
    headline_l2_suffix: ".",
    lead: "Sevdiklerini bir araya getirmek küçük bir niyetle başlar. Biz o niyeti ekrana sığan kalıcı bir mektuba çeviriyoruz — mum mührüyle açılan, ipek hissi veren, telefonda yıllarca saklanan bir davetiye.",
    cta_primary: "Davetiyeni Oluştur",
    cta_secondary: "Deneyimle",
    footnote: "Ödeme gerektirmez. Önce dene, sonra karar ver.",
    rail_left: "№ 001 · EDİTÖRYEL · İSTANBUL’DA YAPILDI",
    rail_right: "BAHAR · MMXXVI · BİRİNCİ EDİSYON",
    marquee: [
      "Niyetle Yazılır",
      "Elde Tasarlanır",
      "Tek Bir Form",
      "RSVP Dahil",
      "7 Dilde",
      "İstanbul · Belgrad · Atina",
      "MMXXVI’den Beri",
    ],
    phone: {
      top_label: "NUVE · BİR DAVET",
      and: "ve",
      date: "12 EYLÜL MMXXVI",
      tap_hint: "açmak için dokun",
    },
  },
  carousel: {
    eyebrow: "Koleksiyon",
    headline_prefix: "Bir his, dokuz ",
    headline_accent: "edisyon",
    headline_suffix: ".",
    drag_hint: "Sürükle  →",
    bottom_tagline: "İncele · Dene · Seç",
    bottom_cta: "Tüm koleksiyonu gör →",
    badge_new: "Yeni",
    card_action: "İncele",
    card_categories: [
      "Klasik Botanik",
      "Akşam Yalısı",
      "Sade Editöryel",
      "Minimal Çizgi",
      "Şefkat Pudra",
      "Provençal Mor",
      "Akdeniz Zeytin",
      "Vahşi Bahçe",
      "Bordo Akşam",
    ],
  },
  how_it_works: {
    eyebrow: "Süreç",
    headline_prefix: "Dört dokunuşta ",
    headline_accent: "hazır",
    headline_suffix: ".",
    intro:
      "Bir form değil, küçük bir tören. Beş dakika ayır, biz davetiyeyi 48 saatte ellerine bırakalım.",
    steps: [
      { title: "Tasarımını seç", body: "Dokuz edisyondan birini aç. Tıkla, hisset, kaydır. Acele etme." },
      { title: "Hikâyeni yaz", body: "İsimler, tarih, mekân, bir cümle. Sonra dilersen bir paragraf daha. Biz dizgi yaparız." },
      { title: "Müziği ve seremoniyi seç", body: "Bir plak, bir mum mührü, bir açılış. Davetin kendi sesini bulsun." },
      { title: "Bağlantını paylaş", body: "Tek bir link. WhatsApp, e-posta ya da nikah ajandanın sırtı. RSVP’ler bize gelir." },
    ],
  },
  music: {
    eyebrow: "Bir Detay",
    headline_prefix: "Müzik",
    headline_accent: "seçimi",
    paragraphs: [
      "Doğru müzik bir davete karakter kazandırır. Bir piyano, bir telli saz, bir cazda kaybolmuş bir ses — misafirin linke dokunduğu an, davetin ruhu çoktan başlamış olur.",
      "Yirmi parça arasından seçiyor ya da kendi kaydını yüklüyorsun. Otomatik çalmıyor, sessizce bekliyor — yalnızca dokunulunca açılıyor.",
    ],
    cta: "Dinlemek için plağa dokun",
    label_idle: "Dokun, çalmaya başlasın",
    label_playing: "Çalıyor",
    record_label_top: "nuve",
    record_label_bottom: "Side A",
  },
  collection_note: {
    eyebrow: "Bir Not",
    body:
      "Koleksiyonumuz dokuz edisyondan oluşur — biri modern, biri kır, biri akşam yalısı, biri suluboya bir ",
    body_accent: "peoni",
    bottom_strip: "Modern · Kır · Yalı · Botanik",
  },
  seal: {
    eyebrow: "Senin Mührün",
    headline_prefix: "Size özel",
    headline_accent: "monogram",
    paragraphs: [
      "Her edisyon, sizin baş harflerinizden çizilmiş bir mum mührüyle açılır. İki harf, bazen üç — yıl, bir küçük ornament ya da ailenin adı. İstediğin gibi.",
      "Stüdyomuzda elle dizilir, dijital ortama döner, ekranda yumuşak bir gölgeyle oturur. Yıllar sonra bile bakınca ışıltısını kaybetmez.",
    ],
    caption: "Mum mührü · Baş harflerin · 2026",
  },
  ceremonies: {
    eyebrow: "Açılış",
    headline_prefix: "Farklı giriş",
    headline_accent: "seremonileri",
    lead:
      "Her edisyonun kendi açılış jesti vardır. Bazısı ipek bir kurdele çekmenle aralanır, bazısı mum mührü kırılır, bazısı ışık zarın altından sızar. Misafir linke dokunduğu an, gecenin ilk anı çoktan başlamıştır.",
    rituals: [
      { title: "Kurdeleli zarf", body: "İpek kurdele ekranda yumuşakça kayar, kâğıt açılır." },
      { title: "Mum mührü", body: "Mühür çatlar, mektup içeriden sızan ışıkla okunur." },
      { title: "Pencere", body: "Yalı camları aralanır, deniz görünür, davet başlar." },
    ],
    phone_ribbon: { tag: "NUVE · BLUSH REVERIE", label: "Kurdeleli Zarf", hint: "kurdeleyi çek" },
    phone_wax: { tag: "NUVE · BORDEAUX", label: "Mum Mühürlü Mektup", hint: "mührü kır" },
  },
  manifesto: {
    eyebrow: "Mektup Üzerine Bir Not",
    number: "№ 002",
    drop_cap: "B",
    body_first: "ir kâğıt davetiye gelir.",
    body_main:
      " Avucunda tutarsın, iki kez okursun, mutfak tezgâhına bırakırsın ve kahveni yaparken bir kez daha bakarsın. Bizim istediğimiz tam o anlardı — o ",
    body_accent: "tutuş hissi",
    body_rest:
      " — ama posta kutusu için. Bu yüzden indirilebilecek her şeyi kaldırdık: yüklenecek uygulama yok, savaşılacak şablon yok, aylık ücret yok. Geriye tek bir bağlantı kalır — ve misafirlerin onu açtığı anda başlayan bir düğün.",
    specs: [
      { k: "Teslim", v: "48 saat" },
      { k: "Dil", v: "7" },
      { k: "Düzenleme", v: "Sınırsız" },
      { k: "Yayın", v: "Dahil" },
    ],
  },
  testimonials: {
    eyebrow: "Çiftlerden",
    headline_prefix: "Bin çift buradan ",
    headline_accent: "geçti",
    rating: "4.97 · 412 yorum",
    reviews: [
      {
        initials: "Z&K",
        couple: "Zeynep & Kerem",
        where: "İstanbul · Mart 2026",
        quote:
          "WhatsApp’a linki attığımız akşam, gece 11’e kadar 47 evet, 3 menü tercihi, iki alerji notu geldi. Annem bir an önce ekran görüntüsü almak istedi.",
      },
      {
        initials: "D&M",
        couple: "Defne & Mehmet",
        where: "Bodrum · Nisan 2026",
        quote:
          "Mostar’da, Belgrad’da, Berlin’de ailelerimiz var. Her biri kendi diliyle açtı. Türk halalar duygulandı, Alman kuzenler etkilendi — bu küçük bir mucize.",
      },
      {
        initials: "İ&O",
        couple: "İrem & Onur",
        where: "Ankara · Şubat 2026",
        quote:
          "Kâğıt davetiyeleri yıllarca saklayan biriyim. Bu da öyle olsun istedik — gönderdikten sonra basılı bir mock istedim, çekmecem için.",
      },
    ],
  },
  pricing: {
    eyebrow: "Üç Edisyon, Üç Niyet",
    headline_prefix: "Tek seferlik. ",
    headline_accent: "Abonelik yok",
    headline_period: ".",
    intro:
      "Düğün bir kez. Davetiye de bir kez. Aylık ücret, gizli ek-paket, hesap iptal stresi yok.",
    badge_popular: "En Popüler",
    cta_template: "{name} ile Başla",
    reassurance: "7 gün koşulsuz iade · KDV dahil · Dodo Payments ile güvenli ödeme",
    currency: "TRY",
    currency_symbol: "₺",
    renewal_price_text: "yıllık ₺199",
    tiers: [
      {
        name: "Sade",
        note: "Tek seferlik · 6 ay yayında",
        summary: "İlk evi olanlara. Tek edisyon, sıcak bir başlangıç.",
        price: 2999,
        features: [
          "1 edisyon seçimi",
          "RSVP 60 davetli",
          "nuve.app altında özel link",
          "Türkçe + İngilizce",
          "E-posta destek",
        ],
      },
      {
        name: "Klasik",
        note: "Tek seferlik · 12 ay yayında",
        summary: "En çok seçilen. Custom domain, çoklu dil, sınırsız RSVP.",
        price: 4999,
        features: [
          "Sınırsız RSVP",
          "Kendi alan adın (yourname.com)",
          "Galeri (30 fotoğraf)",
          "5 dil seçeneği",
          "Müzik + mum mührü özelleştirme",
          "WhatsApp destek",
        ],
      },
      {
        name: "Premium",
        note: "Tek seferlik · 24 ay yayında",
        summary: "Söz–Nikah–Düğün suite’i. Stüdyo destekli özel tasarım.",
        price: 6299,
        features: [
          "Tamamen özel tasarım",
          "Söz · Nişan · Kına · Düğün — 4 davet",
          "7 dil + bireysel çeviri",
          "Premium mum mührü (folyo)",
          "Düğün gününde canlı destek",
          "1 yıl ücretsiz arşivleme",
        ],
      },
    ],
  },
  faq: {
    eyebrow: "Sıkça Sorulanlar",
    headline_prefix: "Aklındaki ",
    headline_accent: "soru",
    closing_prefix: "Cevabını bulamadın mı? Bize ",
    closing_suffix: " adresinden yaz, aynı gün dönelim.",
    items: [
      {
        q: "Davetiyem ne kadar süre aktif kalır?",
        a: "Sade paket 6 ay, Klasik 12 ay, Premium 24 ay yayında. Süresi dolunca davetiyen otomatik arşivlenir — silinmez. Tek bir mesajla yıllık ₺199 karşılığında uzatabilir, anı sayfası olarak saklayabilirsin.",
      },
      {
        q: "RSVP yanıtlarını nasıl görürüm?",
        a: "Sana özel bir admin paneli URL’si gönderiyoruz. Yanıtlar geldikçe orada listeleniyor; istersen e-posta veya WhatsApp bildirimi açıyoruz. Düğünden bir gün önce CSV olarak masa planı için indirebilirsin.",
      },
      {
        q: "Kendi müziğimi yükleyebilir miyim?",
        a: "Evet. 20 parçalık koleksiyonumuzdan seçebilir ya da kendi MP3/M4A dosyanı yükleyebilirsin. Telif sebebiyle ticari kayıtlar için Spotify/Apple Music linki yerine 30 saniyelik bir kesit öneriyoruz.",
      },
      {
        q: "Kendi alan adımı kullanabilir miyim?",
        a: "Klasik paketten itibaren dahil. yourname.com gibi bir adı bizim üstümüzden alıyoruz; DNS ayarlarını biz yapıyoruz, SSL’i kuruyoruz, sana sadece çalışan link kalıyor. Kendi alan adın varsa, ona da bağlıyoruz.",
      },
      {
        q: "Düğünden sonra düzenleyebilir miyim?",
        a: "Sınırsız. Yazı, tarih, fotoğraf, RSVP’yi açma/kapama — hepsi admin panelinden anlık güncelleniyor. Yeniden faturalandırma yok, tasarım değişikliği için bile bizim onayımız gerekmez.",
      },
      {
        q: "Misafirler farklı dilde görebilir mi?",
        a: "Yedi dil hazır geliyor — Türkçe, İngilizce, Almanca, Fransızca, Boşnakça, Sırpça, Yunanca. Misafirin tarayıcısı hangi dildeyse o görüyor; köşedeki küçük seçiciden değiştirebiliyor. Premium pakette istediğin diller için bireysel çeviri de yapıyoruz.",
      },
    ],
  },
  closing: {
    eyebrow: "Bir Davet, Bir Niyet",
    headline_prefix: "Unutulmaz bir davetiye için ",
    headline_accent: "hazır mısın",
    headline_suffix: "?",
    lead:
      "Beş dakika ayır, biz davetiyeni 48 saatte teslim edelim. Ödeme gerektirmez — önce dene, sonra karar ver.",
    cta_primary: "Böyle bir davetiye istiyorum",
    cta_secondary: "Önce koleksiyona bak",
    reassurance: ["48 saatte teslim", "7 gün koşulsuz iade", "Abonelik yok", "Türkçe destek"],
  },
  footer: {
    atelier_label: "Atelier",
    atelier_body:
      "Dijital düğün davetiyelerini tek bir odadan, tek bir mektup halinde dizen küçük bir stüdyo. İstanbul’da.",
    col_product: "Ürün",
    col_legal: "Yasal",
    col_contact: "İletişim",
    contact_body: "Bir sorun mu var? Bir soru mu? Bize yaz, aynı gün dönelim.",
    product_links: [
      { label: "Şablonlar", href: "#themes" },
      { label: "Nasıl Çalışır", href: "#how-it-works" },
      { label: "Fiyatlar", href: "#pricing" },
      { label: "Demoyu Dene", href: "/order/blush-reverie" },
      { label: "Yorumlar", href: "#testimonials" },
    ],
    legal_links: [
      { label: "Kullanım Şartları", href: "/legal/terms" },
      { label: "Gizlilik Sözleşmesi", href: "/legal/privacy" },
      { label: "KVKK Aydınlatma", href: "/legal/kvkk" },
      { label: "Çerez Politikası", href: "/legal/cookies" },
      { label: "Mesafeli Satış", href: "/legal/distance-sales" },
      { label: "İade Koşulları", href: "/legal/refunds" },
    ],
    rights: "© 2026 NUVE. Tüm hakları saklıdır. — Made with care.",
    locale_row: "MMXXVI · İstanbul · Belgrad · Atina",
  },
  checkout: {
    success: {
      pending_eyebrow: "Ödemen alınıyor",
      success_eyebrow: "Ödemen alındı",
      headline_main: "Teşekkürler.",
      headline_accent: "Davetiyen yola çıkıyor.",
      body_prefix: " edisyon — ",
      body_main:
        "Stüdyomuzdaki bir kişi bu siparişe atandı. 48 saat içinde özel link senin e-postanda olacak. Aynı zamanda her şeyi düzenleyebileceğin admin paneline davetin de gelecek.",
      payment_ref: "Ödeme referansı:",
      cta_home: "Anasayfaya dön",
      cta_editor: "Davetiye düzenlemeye başla →",
      footer: "Bir sorun olursa info@nuve.app — aynı gün dönüyoruz.",
    },
    cancel: {
      eyebrow: "Ödeme tamamlanmadı",
      headline: "Bir şey mi düşündürdü?",
      body:
        "Tahsilat alınmadı. Hâlâ kararlısan tek bir tıkla devam edebilirsin — ya da bize yaz, davetiyeyi birlikte gözden geçirelim.",
      cta_retry: "Tekrar dene →",
      cta_home: "Anasayfaya dön",
      footer: "Sorun mu var? info@nuve.app",
    },
  },
};

/* =======================================================================
 *  ENGLISH — editorial register, Aesop-meets-New-Yorker tone.
 *  Avoids buzzwords (seamless, elevate, unlock, transform).
 * ======================================================================= */

const en: Messages = {
  meta: {
    title: "NUVE · Digital Invitation Studio",
    description:
      "Digital wedding invitations made with intention. Hand-built, delivered in 48 hours. RSVP, multilingual, your own domain — all included.",
  },
  nav: {
    aria_label: "Main menu",
    lang_aria: "Language switcher",
    menu: {
      manifesto: "Manifesto",
      themes: "Editions",
      how: "How it works",
      pricing: "Pricing",
      faq: "FAQ",
      contact: "Contact",
    },
    cta_short: "Begin",
    cta_aria: "Begin building your invitation",
    open_menu: "Open menu",
    close_menu: "Close menu",
    home_aria: "NUVE — Home",
  },
  hero: {
    eyebrow: "Digital Invitation Studio · №01",
    headline_l1: "An invitation,",
    headline_l2_prefix: "written with ",
    headline_l2_accent: "intention",
    headline_l2_suffix: ".",
    lead: "Bringing the people you love into one room begins with a small intention. We turn that intention into a lasting letter on a screen — opened with a wax seal, holding the feel of silk, kept on a phone for years.",
    cta_primary: "Begin your invitation",
    cta_secondary: "See the demo",
    footnote: "No payment to start. Try it first, decide after.",
    rail_left: "№ 001 · EDITORIAL · MADE IN ISTANBUL",
    rail_right: "SPRING · MMXXVI · FIRST EDITION",
    marquee: [
      "Written with intention",
      "Hand-designed",
      "One single form",
      "RSVP included",
      "In seven languages",
      "Istanbul · Belgrade · Athens",
      "Since MMXXVI",
    ],
    phone: {
      top_label: "NUVE · AN INVITATION",
      and: "&",
      date: "12 SEPTEMBER MMXXVI",
      tap_hint: "tap to open",
    },
  },
  carousel: {
    eyebrow: "The Collection",
    headline_prefix: "One feeling, nine ",
    headline_accent: "editions",
    headline_suffix: ".",
    drag_hint: "Drag  →",
    bottom_tagline: "See · Try · Choose",
    bottom_cta: "See the full collection →",
    badge_new: "New",
    card_action: "View",
    card_categories: [
      "Classic botanical",
      "Evening yalı",
      "Quiet editorial",
      "Minimal line",
      "Soft blush",
      "Provençal lavender",
      "Mediterranean olive",
      "Wild garden",
      "Bordeaux evening",
    ],
  },
  how_it_works: {
    eyebrow: "Process",
    headline_prefix: "Four touches, ",
    headline_accent: "ready",
    headline_suffix: ".",
    intro:
      "It's not a form, it's a small ceremony. Give it five minutes — we'll deliver your invitation within 48 hours.",
    steps: [
      { title: "Choose your design", body: "Open one of nine editions. Click, feel, scroll. Take your time." },
      { title: "Write your story", body: "Names, date, place, a single sentence. Then a paragraph if you'd like. We'll set the type." },
      { title: "Pick music and ceremony", body: "A record, a wax seal, an opening. Let the invitation find its own voice." },
      { title: "Share your link", body: "One link. WhatsApp, email, or the back of your wedding planner. RSVPs come to us." },
    ],
  },
  music: {
    eyebrow: "A Small Detail",
    headline_prefix: "Music ",
    headline_accent: "selection",
    paragraphs: [
      "The right music gives an invitation its character. A piano, a string instrument, a voice lost in jazz — the moment a guest taps the link, the spirit of the night has already begun.",
      "Pick from twenty pieces, or upload your own recording. It doesn't autoplay — it waits in silence, opens only when touched.",
    ],
    cta: "Tap the record to listen",
    label_idle: "Tap to begin playing",
    label_playing: "Playing",
    record_label_top: "nuve",
    record_label_bottom: "Side A",
  },
  collection_note: {
    eyebrow: "A Note",
    body:
      "Our collection holds nine editions — one modern, one rural, one evening yalı, one a watercolour ",
    body_accent: "peony",
    bottom_strip: "Modern · Rural · Yalı · Botanical",
  },
  seal: {
    eyebrow: "Your Seal",
    headline_prefix: "A monogram",
    headline_accent: "made for you",
    paragraphs: [
      "Every edition opens with a wax seal drawn from your initials. Two letters, sometimes three — a year, a small ornament, or a family name. As you wish.",
      "It's set by hand in our studio, returned to the screen, and settles there with a soft shadow. Years later it hasn't lost its glow.",
    ],
    caption: "Wax seal · Your initials · 2026",
  },
  ceremonies: {
    eyebrow: "The Opening",
    headline_prefix: "Different opening ",
    headline_accent: "ceremonies",
    lead:
      "Each edition has its own opening gesture. Some part with a pull of silk ribbon, some with the crack of a wax seal, some let light slip out from under the envelope. The moment a guest taps the link, the night's first moment has already begun.",
    rituals: [
      { title: "Ribboned envelope", body: "Silk ribbon glides across the screen, the paper opens." },
      { title: "Wax seal", body: "The seal cracks, the letter reads itself in the light that slips from within." },
      { title: "Window", body: "The shutters of a yalı part, the sea appears, the invitation begins." },
    ],
    phone_ribbon: { tag: "NUVE · BLUSH REVERIE", label: "Ribboned envelope", hint: "pull the ribbon" },
    phone_wax: { tag: "NUVE · BORDEAUX", label: "Wax-sealed letter", hint: "crack the seal" },
  },
  manifesto: {
    eyebrow: "On the Matter of Letters",
    number: "№ 002",
    drop_cap: "A",
    body_first: " paper invitation arrives.",
    body_main:
      " You hold it, you read it twice, you set it on the kitchen counter, and you look at it again as you make coffee. We wanted exactly those moments — the ",
    body_accent: "holding",
    body_rest:
      " — but for the inbox. So we removed everything that could be removed: no app to download, no template to fight with, no monthly fee. What remains is a single link, and a wedding that begins the moment your guests open it.",
    specs: [
      { k: "Delivery", v: "48 hrs" },
      { k: "Languages", v: "7" },
      { k: "Edits", v: "Unlimited" },
      { k: "Hosting", v: "Included" },
    ],
  },
  testimonials: {
    eyebrow: "From Couples",
    headline_prefix: "A thousand couples have ",
    headline_accent: "passed through",
    rating: "4.97 · 412 reviews",
    reviews: [
      {
        initials: "Z&K",
        couple: "Zeynep & Kerem",
        where: "Istanbul · March 2026",
        quote:
          "The evening we sent the link on WhatsApp, by eleven we had 47 yeses, three menu choices and two allergy notes. My mother wanted to screenshot it on the spot.",
      },
      {
        initials: "D&M",
        couple: "Defne & Mehmet",
        where: "Bodrum · April 2026",
        quote:
          "We have family in Mostar, in Belgrade, in Berlin. Each opened it in their own language. Turkish aunts wept, German cousins were impressed — a small miracle.",
      },
      {
        initials: "İ&O",
        couple: "İrem & Onur",
        where: "Ankara · February 2026",
        quote:
          "I'm the kind of person who keeps paper invitations for years. We wanted this one to feel the same — after we sent it I asked for a printed mock, just for my drawer.",
      },
    ],
  },
  pricing: {
    eyebrow: "Three Editions, Three Intentions",
    headline_prefix: "One payment. ",
    headline_accent: "No subscription",
    headline_period: ".",
    intro:
      "A wedding is once. An invitation too. No monthly fee, no hidden add-on, no cancellation stress.",
    badge_popular: "Most Popular",
    cta_template: "Begin with {name}",
    reassurance:
      "7-day no-questions refund · Tax included · Secure checkout via Dodo Payments",
    currency: "USD",
    currency_symbol: "$",
    renewal_price_text: "$5 / year",
    tiers: [
      {
        name: "Plain",
        note: "One-time · live for 6 months",
        summary: "For first homes. One edition, a warm beginning.",
        price: 79,
        features: [
          "1 edition choice",
          "RSVP for 60 guests",
          "Private link on nuve.app",
          "Turkish + English",
          "Email support",
        ],
      },
      {
        name: "Classic",
        note: "One-time · live for 12 months",
        summary: "Most chosen. Custom domain, multiple languages, unlimited RSVP.",
        price: 129,
        features: [
          "Unlimited RSVPs",
          "Your own domain (yourname.com)",
          "Gallery (30 photos)",
          "5 language options",
          "Music + wax seal customisation",
          "WhatsApp support",
        ],
      },
      {
        name: "Premium",
        note: "One-time · live for 24 months",
        summary: "Engagement–Civil–Wedding suite. Studio-supported bespoke design.",
        price: 169,
        features: [
          "Fully bespoke design",
          "Engagement · Civil · Henna · Wedding — 4 invitations",
          "7 languages + individual translation",
          "Premium wax seal (foil)",
          "Wedding-day live support",
          "1 year free archival",
        ],
      },
    ],
  },
  faq: {
    eyebrow: "Frequently Asked",
    headline_prefix: "A ",
    headline_accent: "question",
    closing_prefix: "Couldn't find your answer? Write to us at ",
    closing_suffix: " — we reply the same day.",
    items: [
      {
        q: "How long does my invitation stay online?",
        a: "Six months on Plain, twelve on Classic, twenty-four on Premium. When the term ends, it's archived automatically — never deleted. A single message and we extend it for $5 a year, kept as a memorial page if you like.",
      },
      {
        q: "Where do RSVP responses arrive?",
        a: "We send you a private admin URL. Responses appear there as they come in; we'll add email or WhatsApp notifications if you want. The day before the wedding you can export everything as CSV for your seating plan.",
      },
      {
        q: "Can I upload my own music?",
        a: "Yes. Pick from a curated set of twenty, or upload your own MP3/M4A. For copyrighted commercial recordings we suggest a 30-second excerpt rather than a Spotify/Apple Music link.",
      },
      {
        q: "Can I use my own domain?",
        a: "Included from Classic upward. We register the name (yourname.com), set the DNS, install the SSL, and hand you a working link. If you already own a domain, we connect that too.",
      },
      {
        q: "Can I edit after the wedding?",
        a: "Endlessly. Text, date, photo, RSVP toggle — all editable in real time from the admin panel. No re-billing, no approval needed even for design changes.",
      },
      {
        q: "Can guests see it in their own language?",
        a: "Seven languages out of the box — Turkish, English, German, French, Bosnian, Serbian, Greek. Each guest sees the site in their browser language; a small picker in the corner lets them switch. On Premium we also do individual translation for the languages you need.",
      },
    ],
  },
  closing: {
    eyebrow: "One Invitation, One Intention",
    headline_prefix: "Ready for an ",
    headline_accent: "invitation worth keeping",
    headline_suffix: "?",
    lead:
      "Give us five minutes — we'll deliver your invitation within 48 hours. No payment to begin: try it first, decide after.",
    cta_primary: "I want an invitation like this",
    cta_secondary: "See the collection first",
    reassurance: [
      "48-hour delivery",
      "7-day refund",
      "No subscription",
      "Multilingual support",
    ],
  },
  footer: {
    atelier_label: "Atelier",
    atelier_body:
      "A small studio composing digital wedding invitations one room, one letter at a time. From Istanbul.",
    col_product: "Product",
    col_legal: "Legal",
    col_contact: "Contact",
    contact_body: "A problem? A question? Write to us, we reply the same day.",
    product_links: [
      { label: "Editions", href: "#themes" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Try the demo", href: "/order/blush-reverie" },
      { label: "Reviews", href: "#testimonials" },
    ],
    legal_links: [
      { label: "Terms of Use", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "GDPR / KVKK Notice", href: "/legal/kvkk" },
      { label: "Cookie Policy", href: "/legal/cookies" },
      { label: "Distance Sales", href: "/legal/distance-sales" },
      { label: "Refund Policy", href: "/legal/refunds" },
    ],
    rights: "© 2026 NUVE. All rights reserved. — Made with care.",
    locale_row: "MMXXVI · Istanbul · Belgrade · Athens",
  },
  checkout: {
    success: {
      pending_eyebrow: "Your payment is being processed",
      success_eyebrow: "Your payment is received",
      headline_main: "Thank you.",
      headline_accent: "Your invitation is on its way.",
      body_prefix: " edition — ",
      body_main:
        "Someone in our studio has been assigned to this order. Within 48 hours, the private link will be in your inbox. You'll also receive an invitation to the admin panel where everything stays editable.",
      payment_ref: "Payment reference:",
      cta_home: "Back to home",
      cta_editor: "Start editing the invitation →",
      footer: "If anything's off, info@nuve.app — we respond same-day.",
    },
    cancel: {
      eyebrow: "Payment not completed",
      headline: "Something on your mind?",
      body:
        "No charge was made. If you're still in, one click resumes — or write to us and we'll review the invitation together.",
      cta_retry: "Try again →",
      cta_home: "Back to home",
      footer: "Need a hand? info@nuve.app",
    },
  },
};

/* =======================================================================
 *  SRPSKI (Latinica) — editorial register, Serbo-Croatian linguistic
 *  continuum (intelligible in BS / HR / ME / SR markets).
 *  Tone: warm, slow, poetic — matches Turkish source register.
 * ======================================================================= */

const sr: Messages = {
  meta: {
    title: "NUVE · Studio digitalnih pozivnica",
    description:
      "Digitalne svadbene pozivnice napravljene s namerom. Rađene ručno, isporučuju se za 48 sati. RSVP, više jezika, vaš sopstveni domen — sve uključeno.",
  },
  nav: {
    aria_label: "Glavni meni",
    lang_aria: "Izbor jezika",
    menu: {
      manifesto: "Manifest",
      themes: "Izdanja",
      how: "Kako funkcioniše",
      pricing: "Cenovnik",
      faq: "Pitanja",
      contact: "Kontakt",
    },
    cta_short: "Počni",
    cta_aria: "Počni da praviš pozivnicu",
    open_menu: "Otvori meni",
    close_menu: "Zatvori meni",
    home_aria: "NUVE — Početna",
  },
  hero: {
    eyebrow: "Studio digitalnih pozivnica · №01",
    headline_l1: "Poziv,",
    headline_l2_prefix: "ispisan s ",
    headline_l2_accent: "namerom",
    headline_l2_suffix: ".",
    lead: "Okupljanje voljenih počinje od male namere. Mi tu nameru pretvaramo u trajno pismo na ekranu — otvara se voštanim pečatom, ima opipljivu mekoću svile, ostaje u telefonu godinama.",
    cta_primary: "Napravi pozivnicu",
    cta_secondary: "Pogledaj demo",
    footnote: "Bez plaćanja za početak. Prvo probaj, zatim odluči.",
    rail_left: "№ 001 · EDITORIJAL · NAPRAVLJENO U ISTANBULU",
    rail_right: "PROLEĆE · MMXXVI · PRVO IZDANJE",
    marquee: [
      "Ispisano s namerom",
      "Dizajnirano ručno",
      "Jedan formular",
      "RSVP uključen",
      "Na sedam jezika",
      "Istanbul · Beograd · Atina",
      "Od MMXXVI",
    ],
    phone: {
      top_label: "NUVE · POZIV",
      and: "i",
      date: "12. SEPTEMBAR MMXXVI",
      tap_hint: "dodirni da otvoriš",
    },
  },
  carousel: {
    eyebrow: "Kolekcija",
    headline_prefix: "Jedan osećaj, devet ",
    headline_accent: "izdanja",
    headline_suffix: ".",
    drag_hint: "Povuci  →",
    bottom_tagline: "Pogledaj · Probaj · Izaberi",
    bottom_cta: "Vidi celu kolekciju →",
    badge_new: "Novo",
    card_action: "Pogledaj",
    card_categories: [
      "Klasična botanika",
      "Večernji yalı",
      "Mirni editorijal",
      "Minimalna linija",
      "Meka rumen",
      "Provansalska lavanda",
      "Mediteranska maslina",
      "Divlja bašta",
      "Bordo veče",
    ],
  },
  how_it_works: {
    eyebrow: "Proces",
    headline_prefix: "Četiri dodira, ",
    headline_accent: "spremno",
    headline_suffix: ".",
    intro:
      "Nije obrazac, nego mala ceremonija. Odvoji pet minuta — mi ćemo ti pozivnicu isporučiti za 48 sati.",
    steps: [
      { title: "Izaberi dizajn", body: "Otvori jedno od devet izdanja. Klikni, oseti, listaj. Ne žuri." },
      { title: "Napiši svoju priču", body: "Imena, datum, mesto, jedna rečenica. Pa pasus ako želiš. Slog je naš posao." },
      { title: "Izaberi muziku i ceremoniju", body: "Ploča, voštani pečat, otvaranje. Neka pozivnica pronađe svoj glas." },
      { title: "Podeli link", body: "Jedan link. WhatsApp, mejl ili na poleđini svadbenog planera. RSVP-ovi stižu nama." },
    ],
  },
  music: {
    eyebrow: "Jedan Detalj",
    headline_prefix: "Izbor ",
    headline_accent: "muzike",
    paragraphs: [
      "Prava muzika pozivnici daje karakter. Klavir, žičani instrument, glas izgubljen u džezu — u trenutku kada gost dodirne link, duh večeri je već započeo.",
      "Biraš iz dvadeset komada ili otpremaš svoj zapis. Ne pušta se automatski — čeka tiho, otvara se tek na dodir.",
    ],
    cta: "Dodirni ploču da poslušaš",
    label_idle: "Dodirni, kreni da svira",
    label_playing: "Svira",
    record_label_top: "nuve",
    record_label_bottom: "Strana A",
  },
  collection_note: {
    eyebrow: "Beleška",
    body:
      "Naša kolekcija ima devet izdanja — jedno moderno, jedno seosko, jedno večernji yalı, jedno akvarelni ",
    body_accent: "božur",
    bottom_strip: "Moderno · Seosko · Yalı · Botaničko",
  },
  seal: {
    eyebrow: "Vaš Pečat",
    headline_prefix: "Monogram",
    headline_accent: "samo za vas",
    paragraphs: [
      "Svako izdanje otvara se voštanim pečatom iscrtanim od vaših inicijala. Dva slova, ponekad tri — godina, mali ornament ili prezime. Kako poželite.",
      "Slaže se ručno u našem studiju, vraća se u digitalni medij i tu se smesti uz blagi sjaj senke. Godinama kasnije ne gubi sjaj.",
    ],
    caption: "Voštani pečat · Vaši inicijali · 2026",
  },
  ceremonies: {
    eyebrow: "Otvaranje",
    headline_prefix: "Različite ",
    headline_accent: "ceremonije otvaranja",
    lead:
      "Svako izdanje ima sopstveni gest otvaranja. Neka se otvaraju povlačenjem svilene trake, neka pucketanjem voštanog pečata, neka tako što svetlost izlazi ispod koverte. U trenutku kada gost dodirne link, prvi tren večeri je već započeo.",
    rituals: [
      { title: "Koverta s trakom", body: "Svilena traka tiho klizi preko ekrana, papir se otvara." },
      { title: "Voštani pečat", body: "Pečat puca, pismo se čita uz svetlost koja iznutra izvire." },
      { title: "Prozor", body: "Kapci yalı-ja se rastvaraju, more se pomalja, pozivnica počinje." },
    ],
    phone_ribbon: { tag: "NUVE · BLUSH REVERIE", label: "Koverta s trakom", hint: "povuci traku" },
    phone_wax: { tag: "NUVE · BORDEAUX", label: "Pismo s voštanim pečatom", hint: "slomi pečat" },
  },
  manifesto: {
    eyebrow: "O Pismima",
    number: "№ 002",
    drop_cap: "P",
    body_first: "apirna pozivnica stiže.",
    body_main:
      " Držiš je u ruci, pročitaš dva puta, ostaviš na pultu i pogledaš još jednom dok praviš kafu. Mi smo upravo tu želeli — taj ",
    body_accent: "osećaj držanja",
    body_rest:
      " — ali za sanduče. Zato smo uklonili sve što se moglo ukloniti: nema aplikacije za skidanje, nema šablona za muku, nema mesečne pretplate. Ostaje jedan link — i svadba koja počinje u trenu kada je gosti otvore.",
    specs: [
      { k: "Isporuka", v: "48 sati" },
      { k: "Jezici", v: "7" },
      { k: "Izmene", v: "Neograničene" },
      { k: "Hosting", v: "Uključen" },
    ],
  },
  testimonials: {
    eyebrow: "Od Parova",
    headline_prefix: "Hiljadu parova ovuda ",
    headline_accent: "prošlo",
    rating: "4.97 · 412 utisaka",
    reviews: [
      {
        initials: "Z&K",
        couple: "Zeynep & Kerem",
        where: "Istanbul · Mart 2026",
        quote:
          "Veče kada smo poslali link na WhatsApp-u, do jedanaest stigla su 47 potvrda, tri izbora menija i dve napomene o alergijama. Mama je odmah htela da napravi snimak ekrana.",
      },
      {
        initials: "D&M",
        couple: "Defne & Mehmet",
        where: "Bodrum · April 2026",
        quote:
          "Familija nam je u Mostaru, Beogradu i Berlinu. Svako je otvorio pozivnicu na svom jeziku. Turske tetke su se rastužile, nemačke rodbine su bile dirnute — malo čudo.",
      },
      {
        initials: "İ&O",
        couple: "İrem & Onur",
        where: "Ankara · Februar 2026",
        quote:
          "Ja sam od onih koji čuvaju papirne pozivnice godinama. Hteli smo da i ova ostavi isti utisak — kad smo je poslali, tražila sam štampani mock samo za fioku.",
      },
    ],
  },
  pricing: {
    eyebrow: "Tri Izdanja, Tri Namere",
    headline_prefix: "Jednom plaćeno. ",
    headline_accent: "Bez pretplate",
    headline_period: ".",
    intro:
      "Svadba se dešava jednom. Pozivnica isto. Bez mesečne članarine, bez skrivenih dodataka, bez stresa oko otkazivanja.",
    badge_popular: "Najpopularnije",
    cta_template: "Počni sa {name}",
    reassurance:
      "Povraćaj u 7 dana bez pitanja · PDV uključen · Sigurno plaćanje preko Dodo Paymentsa",
    currency: "EUR",
    currency_symbol: "€",
    renewal_price_text: "€5 godišnje",
    tiers: [
      {
        name: "Sade",
        note: "Jednokratno · objavljeno 6 meseci",
        summary: "Za one koji tek započinju. Jedno izdanje, topao početak.",
        price: 69,
        features: [
          "1 izbor izdanja",
          "RSVP za 60 gostiju",
          "Privatni link na nuve.app",
          "Turski + Engleski",
          "Podrška putem mejla",
        ],
      },
      {
        name: "Klasik",
        note: "Jednokratno · objavljeno 12 meseci",
        summary: "Najčešći izbor. Sopstveni domen, više jezika, neograničen RSVP.",
        price: 119,
        features: [
          "Neograničeni RSVP-ovi",
          "Sopstveni domen (vaseime.com)",
          "Galerija (30 fotografija)",
          "5 jezika",
          "Prilagođavanje muzike i pečata",
          "WhatsApp podrška",
        ],
      },
      {
        name: "Premium",
        note: "Jednokratno · objavljeno 24 meseca",
        summary: "Veridba–Venčanje–Svadba u kompletu. Posebno dizajnirano u studiju.",
        price: 159,
        features: [
          "Potpuno prilagođen dizajn",
          "Veridba · Civilno · Kana · Svadba — 4 pozivnice",
          "7 jezika + lični prevodi",
          "Premium voštani pečat (folija)",
          "Podrška uživo na dan svadbe",
          "1 godina besplatne arhive",
        ],
      },
    ],
  },
  faq: {
    eyebrow: "Često postavljana pitanja",
    headline_prefix: "Imate ",
    headline_accent: "pitanje",
    closing_prefix: "Niste pronašli odgovor? Pišite nam na ",
    closing_suffix: " — odgovaramo istog dana.",
    items: [
      {
        q: "Koliko dugo moja pozivnica ostaje online?",
        a: "Sade paket 6 meseci, Klasik 12, Premium 24. Po isteku se automatski arhivira — nikada se ne briše. Jednom porukom produžavamo za €5 godišnje i čuva se kao memorijalna stranica ako poželite.",
      },
      {
        q: "Gde dobijam RSVP odgovore?",
        a: "Šaljemo vam privatan URL administratorskog panela. Odgovori se tu pojavljuju kako stižu; možemo uključiti notifikacije na mejlu ili WhatsApp-u. Dan pre svadbe sve se može preuzeti kao CSV za raspored mesta.",
      },
      {
        q: "Mogu li dodati svoju muziku?",
        a: "Da. Birate iz kolekcije od dvadeset komada ili otpremate sopstveni MP3/M4A. Zbog autorskih prava za komercijalne snimke preporučujemo isečak od 30 sekundi umesto Spotify/Apple Music linka.",
      },
      {
        q: "Mogu li koristiti svoj domen?",
        a: "Od paketa Klasik naviše. Registrujemo ime (vaseime.com), podešavamo DNS, instaliramo SSL i predajemo vam ispravan link. Ako već imate domen, povezujemo i njega.",
      },
      {
        q: "Mogu li menjati pozivnicu posle svadbe?",
        a: "Neograničeno. Tekst, datum, fotografija, prebacivanje RSVP-a — sve se uređuje u realnom vremenu iz panela. Bez novog naplaćivanja, bez naše dozvole čak ni za promenu dizajna.",
      },
      {
        q: "Mogu li gosti videti pozivnicu na svom jeziku?",
        a: "Sedam jezika je odmah dostupno — turski, engleski, nemački, francuski, bosanski, srpski, grčki. Svaki gost vidi sajt na jeziku svog pretraživača; sa malim biračem u uglu može da promeni. U paketu Premium radimo i pojedinačne prevode na jezike koje tražite.",
      },
    ],
  },
  closing: {
    eyebrow: "Jedan Poziv, Jedna Namera",
    headline_prefix: "Spremni za pozivnicu ",
    headline_accent: "koja se pamti",
    headline_suffix: "?",
    lead:
      "Odvoji nam pet minuta — pozivnicu ti isporučujemo za 48 sati. Bez plaćanja za početak: prvo probaj, zatim odluči.",
    cta_primary: "Hoću ovakvu pozivnicu",
    cta_secondary: "Prvo pogledaj kolekciju",
    reassurance: [
      "Isporuka za 48 sati",
      "Povraćaj u 7 dana",
      "Bez pretplate",
      "Podrška na više jezika",
    ],
  },
  footer: {
    atelier_label: "Atelier",
    atelier_body:
      "Mali studio koji slaže digitalne svadbene pozivnice — jednu po jednu, iz jedne sobe. Iz Istanbula.",
    col_product: "Proizvod",
    col_legal: "Pravne stavke",
    col_contact: "Kontakt",
    contact_body: "Problem? Pitanje? Pišite nam, odgovaramo istog dana.",
    product_links: [
      { label: "Izdanja", href: "#themes" },
      { label: "Kako funkcioniše", href: "#how-it-works" },
      { label: "Cenovnik", href: "#pricing" },
      { label: "Probaj demo", href: "/order/blush-reverie" },
      { label: "Utisci", href: "#testimonials" },
    ],
    legal_links: [
      { label: "Uslovi korišćenja", href: "/legal/terms" },
      { label: "Politika privatnosti", href: "/legal/privacy" },
      { label: "GDPR / KVKK obaveštenje", href: "/legal/kvkk" },
      { label: "Politika kolačića", href: "/legal/cookies" },
      { label: "Prodaja na daljinu", href: "/legal/distance-sales" },
      { label: "Politika povraćaja", href: "/legal/refunds" },
    ],
    rights: "© 2026 NUVE. Sva prava zadržana. — Made with care.",
    locale_row: "MMXXVI · Istanbul · Beograd · Atina",
  },
  checkout: {
    success: {
      pending_eyebrow: "Plaćanje se obrađuje",
      success_eyebrow: "Plaćanje primljeno",
      headline_main: "Hvala.",
      headline_accent: "Pozivnica kreće na put.",
      body_prefix: " izdanje — ",
      body_main:
        "Jedna osoba iz našeg studija dodeljena je ovoj porudžbini. Za 48 sati privatni link biće u vašem inboxu. Stiže i poziv u administratorski panel gde se sve može menjati.",
      payment_ref: "Referenca plaćanja:",
      cta_home: "Nazad na početnu",
      cta_editor: "Otvori uređivač →",
      footer: "Ako nešto nije u redu, info@nuve.app — odgovaramo istog dana.",
    },
    cancel: {
      eyebrow: "Plaćanje nije završeno",
      headline: "Nešto vas je zaustavilo?",
      body:
        "Nije naplaćeno ništa. Ako ste i dalje odlučni, jedan klik nastavlja — ili nam pišite pa zajedno prolazimo kroz pozivnicu.",
      cta_retry: "Pokušaj ponovo →",
      cta_home: "Nazad na početnu",
      footer: "Treba li pomoć? info@nuve.app",
    },
  },
};

/* =======================================================================
 *  Export
 * ======================================================================= */

export const dictionaries: Record<Locale, Messages> = { tr, en, sr };
