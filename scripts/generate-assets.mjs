// Generates all brand image assets into app/ from the PlugMark SVG + palette.
// Run: node scripts/generate-assets.mjs
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import satori from "satori";
import pngToIco from "png-to-ico";

const INK = "#0C0A16";
const PURPLE = "#7C3AED";
const VOLT = "#C6FF3D";
const APP = path.join(import.meta.dirname, "..", "app");

const plugMark = (body, prong) => `
  <g stroke-linejoin="round">
    <polygon points="33,53 33,27 39.5,15 46,27 46,53" fill="${prong}" stroke="${prong}" stroke-width="3"/>
    <polygon points="54,53 54,27 60.5,15 67,27 67,53" fill="${prong}" stroke="${prong}" stroke-width="3"/>
    <rect x="18" y="43" width="64" height="44" rx="13" fill="${body}" stroke="${body}" stroke-width="3"/>
  </g>`;

// icon: ink rounded square, brand mark centered
const iconSvg = (size, radius) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${radius}" fill="${INK}"/>
  <svg x="16" y="16" width="68" height="68" viewBox="0 0 100 100">${plugMark(PURPLE, VOLT)}</svg>
</svg>`;

async function googleFont(family, weight) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`,
      { headers: { "User-Agent": "curl/8.0" } } // old UA → TTF urls
    )
  ).text();
  const url = css.match(/src: url\((.+?)\)/)?.[1];
  if (!url) throw new Error(`No font URL for ${family} ${weight}`);
  return Buffer.from(await (await fetch(url)).arrayBuffer());
}

const h = (type, style, ...children) => ({
  type,
  props: {
    style,
    // satori misreads an empty children array as "multiple children"
    children:
      children.length === 0
        ? undefined
        : children.length === 1
          ? children[0]
          : children,
  },
});

async function main() {
  // --- icons ---
  await sharp(Buffer.from(iconSvg(512, 22))).png().toFile(path.join(APP, "icon.png"));
  await sharp(Buffer.from(iconSvg(180, 0))).png().toFile(path.join(APP, "apple-icon.png"));
  const png32 = await sharp(Buffer.from(iconSvg(32, 22))).png().toBuffer();
  const png16 = await sharp(Buffer.from(iconSvg(16, 22))).png().toBuffer();
  await fs.writeFile(path.join(APP, "favicon.ico"), await pngToIco([png16, png32]));
  console.log("icons done");

  // --- OG / Twitter image 1200x630 ---
  const [sora800, sora700, inter400, mono400] = await Promise.all([
    googleFont("Sora", 800),
    googleFont("Sora", 700),
    googleFont("Inter", 400),
    googleFont("Space Mono", 400),
  ]);

  const markImg = `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${plugMark("#FFFFFF", VOLT)}</svg>`
  ).toString("base64")}`;

  const ogSvg = await satori(
    h(
      "div",
      {
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        backgroundColor: INK,
        backgroundImage:
          "linear-gradient(rgba(124,58,237,0.10) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.10) 1px,transparent 1px)",
        backgroundSize: "44px 44px",
        color: "#F5F4F8",
        padding: "64px 72px",
        position: "relative",
      },
      h("div", {
        position: "absolute",
        top: -320,
        left: 250,
        width: 700,
        height: 700,
        borderRadius: 9999,
        backgroundImage:
          "radial-gradient(circle at center, rgba(124,58,237,0.45) 0%, rgba(124,58,237,0.12) 50%, rgba(12,10,22,0) 70%)",
      }),
      h(
        "div",
        { display: "flex", alignItems: "center", gap: 16 },
        { type: "img", props: { src: markImg, width: 56, height: 56 } },
        h(
          "div",
          {
            fontFamily: "Sora",
            fontWeight: 700,
            fontSize: 36,
            letterSpacing: "-0.045em",
            color: "#fff",
            display: "flex",
            alignItems: "flex-end",
          },
          "plugfolio",
          h("div", {
            width: 9,
            height: 9,
            borderRadius: 3,
            backgroundColor: VOLT,
            marginLeft: 6,
            marginBottom: 8,
          })
        )
      ),
      h(
        "div",
        {
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
        },
        h(
          "div",
          {
            fontFamily: "Space Mono",
            fontSize: 20,
            letterSpacing: "0.2em",
            color: VOLT,
            textTransform: "uppercase",
          },
          "EARLY ACCESS"
        ),
        h(
          "div",
          {
            fontFamily: "Sora",
            fontWeight: 800,
            fontSize: 76,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            color: "#fff",
            marginTop: 22,
            display: "flex",
            flexDirection: "column",
          },
          h("div", {}, "Your content is about"),
          h(
            "div",
            { display: "flex" },
            "to become ",
            h("div", { color: VOLT }, "shoppable.")
          )
        ),
        h(
          "div",
          {
            fontFamily: "Inter",
            fontSize: 27,
            lineHeight: 1.5,
            color: "#B7B2C4",
            marginTop: 26,
            maxWidth: 900,
          },
          "One link in your bio that turns content into product clicks, affiliate revenue, and brand deals."
        ),
        h(
          "div",
          {
            fontFamily: "Space Mono",
            fontSize: 20,
            letterSpacing: "0.1em",
            color: "#8C8798",
            marginTop: 40,
          },
          "plugfolio.com"
        )
      )
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Sora", data: sora800, weight: 800, style: "normal" },
        { name: "Sora", data: sora700, weight: 700, style: "normal" },
        { name: "Inter", data: inter400, weight: 400, style: "normal" },
        { name: "Space Mono", data: mono400, weight: 400, style: "normal" },
      ],
    }
  );

  const ogPng = await sharp(Buffer.from(ogSvg)).png().toBuffer();
  await fs.writeFile(path.join(APP, "opengraph-image.png"), ogPng);
  await fs.writeFile(path.join(APP, "twitter-image.png"), ogPng);
  console.log("og/twitter done");
}

main();
