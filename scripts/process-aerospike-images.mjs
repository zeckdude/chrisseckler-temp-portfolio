import sharp from "sharp";
import path from "node:path";

const ASSETS = "/Users/cseckler/.cursor/projects/Users-cseckler-web-new-portfolio/assets";
const OUT = "public/projects/aerospike-cloud-console";

const files = [
  ["Screenshot_2026-08-17_at_15.12.44_2x-7bda1a22-53d0-4d6e-91e4-fd899ba4b9b8.png", "1-home.jpg"],
  ["Screenshot_2026-08-17_at_15.26.21_2x-d89bef78-7c3b-4645-aefa-b4b493453cc0.png", "2-step1-cluster-details.jpg"],
  ["Screenshot_2026-08-17_at_15.26.57_2x-2a52a31e-41b5-436a-8663-37a8643a20fc.png", "3-step2-region-layout.jpg"],
  ["Screenshot_2026-08-17_at_15.27.15_2x-bb237d5d-186f-41ef-abe7-b1c76ea5ab72.png", "4-step3-availability.jpg"],
  ["Screenshot_2026-08-17_at_15.28.33_2x-e1fda15a-cd6a-40dd-b48d-50bb01d7ae74.png", "5-step4-node-sizing.jpg"],
  ["Screenshot_2026-08-17_at_15.28.52_2x-6aecc16d-22d7-402f-8a90-a07adb0d5d47.png", "6-step5-server-config-json.jpg"],
  ["Screenshot_2026-08-17_at_15.29.13_2x-e097fba8-f43d-451a-98f8-f63e10919491.png", "7-step6-review-launch.jpg"],
];

for (const [src, dst] of files) {
  await sharp(path.join(ASSETS, src))
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 1.5, x1: 2, y2: 10, y3: 20 })
    .jpeg({ quality: 93, mozjpeg: true })
    .toFile(path.resolve(OUT, dst));
  console.log(dst);
}
