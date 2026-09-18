/**
 * PBRT 4th Edition Section Scraper & Content Generator
 * 
 * Usage:
 *   node scripts/fetch-pbrt-section.js <relative-url-or-slug>
 * 
 * Example:
 *   node scripts/fetch-pbrt-section.js Geometry_and_Transformations/Bounding_Boxes.html
 */

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const targetSlug = args[0] || 'Geometry_and_Transformations/Bounding_Boxes.html';
const baseUrl = 'https://raw.githubusercontent.com/mmp/pbr-book-website/HEAD/4ed/';
const fullUrl = baseUrl + targetSlug;

console.log(`[PBRT Scraper] Fetching: ${fullUrl}`);

async function run() {
  try {
    const res = await fetch(fullUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    const html = await res.text();
    console.log(`[PBRT Scraper] Fetched HTML (${html.length} characters)`);

    // Extract SVG/image links
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    const images = [];
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const src = match[1];
      if (!src.startsWith('http') && !src.startsWith('/')) {
        images.push(src);
      }
    }
    console.log(`[PBRT Scraper] Found ${images.length} relative images:`, images);

    // Extract code fragments
    const fragmentRegex = /<div class="fragmentname">([^<]+)<\/div>\s*<div class="fragmentcode">([\s\S]*?)<\/div>/g;
    const fragments = [];
    while ((match = fragmentRegex.exec(html)) !== null) {
      fragments.push({
        name: match[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim(),
        code: match[2].replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim()
      });
    }
    console.log(`[PBRT Scraper] Found ${fragments.length} code fragments`);

    // Extract figures and captions
    const figureRegex = /<div class="card outerfigure">[\s\S]*?<img[^>]+src=["']([^"']+)["'][\s\S]*?<figcaption class="caption">([\s\S]*?)<\/figcaption>/g;
    const figures = [];
    while ((match = figureRegex.exec(html)) !== null) {
      figures.push({
        src: match[1],
        caption: match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
      });
    }
    console.log(`[PBRT Scraper] Found ${figures.length} figure cards`);

    console.log(`\n[PBRT Scraper] Extraction complete! Use this metadata to scaffold new section files in src/data/books/pbrt-4ed/content/`);
  } catch (err) {
    console.error(`[PBRT Scraper Error]:`, err);
  }
}

run();
