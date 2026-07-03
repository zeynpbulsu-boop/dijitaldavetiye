// NUVE etkileşimli görsel QA — gerçek Chrome ile: seremoniye dokun,
// aşağı kaydır, slot makinesini ve bölümleri ekran görüntüsüyle doğrula.
import { chromium } from "playwright-core";

const theme = process.argv[2] ?? "celenk";
const base = "http://localhost:3000";
const out = (n) => `/tmp/nuve-qa/${theme}-${n}.png`;

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 430, height: 932 },
  deviceScaleFactor: 2,
});

await page.goto(`${base}/themes/${theme}`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.screenshot({ path: out("1-seremoni") });

// Seremoniye dokun (mühür = tüm ekran buton)
await page.mouse.click(215, 466);
await page.waitForTimeout(2600); // kırılma + perde
await page.screenshot({ path: out("2-hero") });

// Geri sayım bandının BAŞINA kaydır → slot makaraları görünürde dönsün
await page.evaluate(() => {
  const bands = Array.from(document.querySelectorAll("section"));
  const band =
    bands.find((s) => /geriye|kalan|countdown/i.test(s.textContent ?? "")) ?? bands[1];
  band?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(900);
await page.screenshot({ path: out("3-slot-donuyor") });
await page.waitForTimeout(2800); // makaralar dursun + kalpler
await page.screenshot({ path: out("4-slot-durdu") });
await page.waitForTimeout(1500); // serif tarihe çözülme
await page.screenshot({ path: out("5-tarih-cozuldu") });

// RSVP'ye kadar in
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1200);
await page.screenshot({ path: out("6-rsvp") });

await browser.close();
console.log("QA tamam:", theme);
