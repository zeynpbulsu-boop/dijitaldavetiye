// Vitrin karşılaştırma QA'sı: rakip #themes bölümü vs bizim tema vitrini.
// Rakip sayfası yalnızca İNCELEME için görüntülenir (tasarım ilkesi çıkarımı);
// hiçbir varlık indirilip projeye kopyalanmaz.
import { chromium } from "playwright-core";

const browser = await chromium.launch({ channel: "chrome", headless: true });

// 1) Rakip: thedigitalinvite #themes (desktop görünüm)
const p1 = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await p1.goto("https://www.thedigitalinvite.com/#themes", {
  waitUntil: "networkidle",
  timeout: 45000,
});
await p1.waitForTimeout(3500); // SPA hidrasyonu + görseller
await p1.evaluate(() => document.querySelector("#themes")?.scrollIntoView({ block: "start" }));
await p1.waitForTimeout(1500);
await p1.screenshot({ path: "/tmp/nuve-qa/tdi-themes-1.png" });
await p1.evaluate(() => window.scrollBy(0, 900));
await p1.waitForTimeout(1000);
await p1.screenshot({ path: "/tmp/nuve-qa/tdi-themes-2.png" });
// Kart hover davranışı
const card = p1.locator('#themes [class*="card"], #themes article, #themes a').first();
try {
  await card.hover({ timeout: 5000 });
  await p1.waitForTimeout(1200);
  await p1.screenshot({ path: "/tmp/nuve-qa/tdi-themes-hover.png" });
} catch { console.log("tdi hover: bulunamadı"); }
await p1.close();

// 2) Bizim landing tema carousel'i + hover video testi
const p2 = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await p2.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await p2.evaluate(() => {
  const el = document.querySelector('#themes, [id*="theme"], section');
  el?.scrollIntoView({ block: "start" });
});
await p2.waitForTimeout(1500);
// carousel'i bul: tema kartları
await p2.evaluate(() => {
  const links = Array.from(document.querySelectorAll('a[href^="/themes/"]'));
  links[0]?.scrollIntoView({ block: "center" });
});
await p2.waitForTimeout(1200);
await p2.screenshot({ path: "/tmp/nuve-qa/nuve-showcase.png" });
// hover → video oynuyor mu?
const ourCard = p2.locator('a[href^="/themes/"]').first();
await ourCard.hover();
await p2.waitForTimeout(1800);
const videoState = await p2.evaluate(() => {
  const v = document.querySelector('a[href^="/themes/"] video');
  return v ? { found: true, paused: v.paused, opacity: getComputedStyle(v).opacity, src: v.currentSrc.split("/").pop() } : { found: false };
});
console.log("NUVE kart hover video:", JSON.stringify(videoState));
await p2.screenshot({ path: "/tmp/nuve-qa/nuve-showcase-hover.png" });
await p2.close();

// 3) /tasarimlar grid'i
const p3 = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
await p3.goto("http://localhost:3000/tasarimlar", { waitUntil: "networkidle" });
await p3.waitForTimeout(1500);
await p3.screenshot({ path: "/tmp/nuve-qa/nuve-tasarimlar.png" });
await p3.close();

await browser.close();
console.log("karşılaştırma ekran görüntüleri hazır");
