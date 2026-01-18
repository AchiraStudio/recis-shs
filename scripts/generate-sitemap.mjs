import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "node:fs";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";

// ✅ CHANGE THIS
const SITE_URL = "https://yourdomain.com";

// ✅ Put your static routes here or import from a JSON file
const staticRoutes = ["/", "/about", "/pricing", "/contact"];

// If you have dynamic routes, generate them here:
async function getDynamicRoutes() {
  // Example: blog slugs from a local JSON, CMS, or API
  // return ["/blog/hello-world", "/blog/my-second-post"];
  return [];
}

async function main() {
  const distDir = path.resolve("dist");
  if (!existsSync(distDir)) {
    console.error("dist/ not found. Run after `vite build`.");
    process.exit(1);
  }

  const dynamicRoutes = await getDynamicRoutes();
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const sitemap = new SitemapStream({ hostname: SITE_URL });

  const xml = await streamToPromise(async function () {
    for (const url of allRoutes) {
      sitemap.write({ url, changefreq: "weekly", priority: 0.7 });
    }
    sitemap.end();
    return sitemap;
  }());

  const outPath = path.join(distDir, "sitemap.xml");
  mkdirSync(distDir, { recursive: true });
  const writeStream = createWriteStream(outPath);
  writeStream.write(xml.toString());
  writeStream.end();

  console.log(`✅ sitemap generated: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
