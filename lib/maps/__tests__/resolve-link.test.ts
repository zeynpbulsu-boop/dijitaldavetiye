import { describe, it, expect } from "vitest";
import { resolveMapsCoords } from "../resolve-link";

// Tam URL'ler ağ çağrısı gerektirmeden (regex ile) çözülür — testler offline.
describe("resolveMapsCoords (tam URL, ağ yok)", () => {
  it("@lat,lng formatı", async () => {
    expect(
      await resolveMapsCoords(
        "https://www.google.com/maps/place/Cunda/@39.3419,26.6741,15z/data=x",
      ),
    ).toEqual({ lat: 39.3419, lng: 26.6741 });
  });

  it("?q=lat,lng formatı", async () => {
    expect(
      await resolveMapsCoords("https://maps.google.com/?q=41.008237,28.978358"),
    ).toEqual({ lat: 41.008237, lng: 28.978358 });
  });

  it("destination=lat,lng formatı", async () => {
    expect(
      await resolveMapsCoords(
        "https://www.google.com/maps/dir/?api=1&destination=40.9923,29.0245",
      ),
    ).toEqual({ lat: 40.9923, lng: 29.0245 });
  });

  it("!3d!4d formatı", async () => {
    expect(
      await resolveMapsCoords(
        "https://www.google.com/maps/place/X/data=!3d38.4237!4d27.1428",
      ),
    ).toEqual({ lat: 38.4237, lng: 27.1428 });
  });

  it("boş → null", async () => {
    expect(await resolveMapsCoords("")).toBeNull();
  });

  it("koordinatsız + http olmayan → null", async () => {
    expect(await resolveMapsCoords("Cunda Adası, Ayvalık")).toBeNull();
  });
});
