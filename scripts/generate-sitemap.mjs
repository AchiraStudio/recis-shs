import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "node:stream";
import { writeFileSync, existsSync } from "node:fs";
import path from "node:path";

// ✅ CHANGE THIS
const SITE_URL = "https://yourdomain.com";

const staticRoutes = ["/", "/about", "/pricing", "/contact"];

async function getDynamicRoutes() {
  // return ["/blog/hello-world", "/blog/my-second-post"];
  return [];
}

async function main() {
  const distDir = path.resolve("dist");
  if (!existsSync(distDir)) {
    console.error("dist/ not found. Run this after `vite build`.");
    process.exit(1);
  }

  const dynamicRoutes = await getDynamicRoutes();
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const links = allRoutes.map((url) => ({
    url,
    changefreq: "weekly",
    priority: 0.7,
  }));

  const sitemapStream = new SitemapStream({ hostname: SITE_URL });

  // ✅ Readable.from(...) creates a proper Node stream of link objects
  const xmlBuffer = await streamToPromise(Readable.from(links).pipe(sitemapStream));
  const xml = xmlBuffer.toString();

  const outPath = path.join(distDir, "sitemap.xml");
  writeFileSync(outPath, xml);

  console.log(`✅ sitemap generated: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
