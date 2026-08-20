import sharp from "sharp";
import path from "node:path";

const SCALE = 2;
const ASSETS = "/Users/cseckler/.cursor/projects/Users-cseckler-web-new-portfolio/assets";
const OUT = "public/projects/fox-international-portal";

const sources = [
  { input: `${ASSETS}/1-5149e779-d70f-455c-b7d6-bd07ab5cf366.png`, output: `${OUT}/1-homepage-hero.jpg` },
  { input: `${ASSETS}/2-4c9bf5ac-e0b8-4b05-8b5f-08cb4ff4a403.png`, output: `${OUT}/2-movie-info.jpg` },
  { input: `${ASSETS}/3-4c97bd3a-8ce9-41dd-8082-6883ed5919ac.png`, output: `${OUT}/3-promo-tiles.jpg` },
  { input: `${ASSETS}/4-085f6b0e-9732-48f2-a1c8-ea28ec4568e2.png`, output: `${OUT}/4-catalog-grid.jpg` },
  { input: `${ASSETS}/5-012b3f08-26a9-4e37-ad17-092ec3d70eb3.png`, output: `${OUT}/5-photos-slider.jpg` },
  { input: `${ASSETS}/6-44ab7a92-8fd1-41c3-b393-b69130810b7a.png`, output: `${OUT}/6-digital-hd-retailers.jpg` },
  { input: `${ASSETS}/7-1731a96f-ea27-4069-a78d-7a322fe77a94.png`, output: `${OUT}/7-early-access.jpg` },
];

for (const { input, output } of sources) {
  const image = sharp(input);
  const meta = await image.metadata();
  const w = Math.round((meta.width ?? 750) * SCALE);
  const h = Math.round((meta.height ?? 430) * SCALE);

  await image
    .resize(w, h, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 1.4, m1: 0.6, m2: 2.2, x1: 2, y2: 10, y3: 20 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(path.resolve(output));

  console.log(`${path.basename(input)} → ${output} (${w}x${h})`);
}
