// NUVE etkileşimli görsel QA — gerçek Chrome ile: zarf töreni (İKİ dokunuş:
// çevir → mührü kır), aşağı kaydır, slot/galeri/RSVP'yi ekran görüntüsüyle
// doğrula. Kullanım: node scripts/qa-interactive.mjs <tema>
import { chromium } from "playwright-core";

const theme = process.argv[2] ?? "celenk";
const base = "http://localhost:3000";
const out = (n) => `/tmp/nuve-qa/${theme}-${n}.png`;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 430, height: 932 },
  deviceScaleFactor: 2,
});

await page.goto(`${base}/themes/${theme}`, { waitUntil: "networkidle" });
await page.waitForTimeout(1400);
await page.screenshot({ path: out("1-zarf-on") });

// 1. dokunuş: zarfı çevir
await page.mouse.click(215, 466);
await page.waitForTimeout(1100);
await page.screenshot({ path: out("2-zarf-muhur") });

// 2. dokunuş: mührü kır → tören çözülür
await page.mouse.click(215, 466);
await page.waitForTimeout(3200);
await page.screenshot({ path: out("3-hero") });

// Geri sayım bandının başına → slot makarası
await page.evaluate(() => {
  const bands = Array.from(document.querySelectorAll("section"));
  const band =
    bands.find((s) => /geriye|kalan|countdown/i.test(s.textContent ?? "")) ?? bands[1];
  band?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(4200); // makara + çözülme
await page.screenshot({ path: out("4-tarih") });

// Galeri
await page.evaluate(() => {
  // hero'yu atla: karşılama cümlesi 'hikâyemize' içerebiliyor (kurdele/defter/postakart)
  const s = Array.from(document.querySelectorAll("section")).slice(1).find((x) =>
    /anılarımız|hikâyemiz|memories/i.test(x.textContent ?? ""),
  );
  s?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(1600);
await page.screenshot({ path: out("5-galeri") });

// RSVP (sayfa sonu)
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1400);
await page.screenshot({ path: out("6-rsvp") });

await browser.close();
console.log("QA tamam:", theme);
