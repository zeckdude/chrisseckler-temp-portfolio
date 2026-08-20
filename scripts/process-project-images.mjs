// One-off script to upscale + sharpen legacy (2015-era) low-res screenshots
// before dropping them into public/projects/. Run with:
//   node scripts/process-project-images.mjs
import sharp from "sharp";
import path from "node:path";

const SCALE = 2; // legacy screenshots are 750x430, this brings them to ~1500x860

const sources = [
  {
    input:
      "/Users/cseckler/.cursor/projects/Users-cseckler-web-new-portfolio/assets/1__1_-5ef9f9f4-19a9-4531-adbc-7801a4bd65cb.png",
    output: "public/projects/custom-analytics-platform/1-users-chart.jpg",
  },
  {
    input:
      "/Users/cseckler/.cursor/projects/Users-cseckler-web-new-portfolio/assets/2-4d6e3597-2b58-4457-8dc6-e92bc3b86cd5.png",
    output: "public/projects/custom-analytics-platform/2-date-range-picker.jpg",
  },
  {
    input:
      "/Users/cseckler/.cursor/projects/Users-cseckler-web-new-portfolio/assets/3-2eddf8f0-6b89-44d2-8418-5c2e8c7c5d39.png",
    output: "public/projects/custom-analytics-platform/3-hotels-by-state.jpg",
  },
  {
    input:
      "/Users/cseckler/.cursor/projects/Users-cseckler-web-new-portfolio/assets/4-b547af6f-e614-4821-8534-31dd6ce65c09.png",
    output: "public/projects/custom-analytics-platform/4-hotel-details.jpg",
  },
  {
    input:
      "/Users/cseckler/.cursor/projects/Users-cseckler-web-new-portfolio/assets/5-920968a3-085a-435d-ba69-980fbecd96e5.png",
    output: "public/projects/custom-analytics-platform/5-finance-checks.jpg",
  },
];

async function run() {
  for (const { input, output } of sources) {
    const image = sharp(input);
    const meta = await image.metadata();
    const targetWidth = Math.round((meta.width ?? 750) * SCALE);
    const targetHeight = Math.round((meta.height ?? 430) * SCALE);

    await image
      .resize(targetWidth, targetHeight, { kernel: sharp.kernel.lanczos3 })
      // Unsharp-mask style sharpening tuned for soft, upscaled screenshots.
      .sharpen({ sigma: 1.4, m1: 0.6, m2: 2.2, x1: 2, y2: 10, y3: 20 })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(path.resolve(output));

    console.log(`Processed ${path.basename(input)} -> ${output} (${targetWidth}x${targetHeight})`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
