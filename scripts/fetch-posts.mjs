// Fetches the latest public posts from the IdolVPN Telegram channel and
// writes them to data/posts.json. Runs on a schedule via
// .github/workflows/update-posts.yml — no bot token or login needed,
// because Telegram exposes a read-only HTML preview for public channels
// at https://t.me/s/<channel>.
//
// Usage: node scripts/fetch-posts.mjs

import { writeFile, readFile } from "node:fs/promises";
import * as cheerio from "cheerio";

const CHANNEL = "Idolvpn";
const SOURCE_URL = `https://t.me/s/${CHANNEL}`;
const OUTPUT_PATH = new URL("../data/posts.json", import.meta.url);
const MAX_POSTS = 8;

function stripHtmlToText($, el) {
  // Telegram's preview marks up <br> as line breaks and keeps links as <a>;
  // we just want plain, safe text for the card preview.
  const clone = $(el).clone();
  clone.find("br").replaceWith("\n");
  return clone.text().replace(/\u00a0/g, " ").replace(/\n{2,}/g, "\n").trim();
}

async function fetchChannelHtml() {
  const res = await fetch(SOURCE_URL, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; IdolVPNSiteBot/1.0; +https://t.me/Idolvpn)"
    }
  });
  if (!res.ok) throw new Error(`Telegram preview responded with ${res.status}`);
  return res.text();
}

function parsePosts(html) {
  const $ = cheerio.load(html);
  const posts = [];

  $(".tgme_widget_message_wrap").each((_, wrap) => {
    const msg = $(wrap).find(".tgme_widget_message").first();
    if (!msg.length) return;

    const dataPost = msg.attr("data-post"); // e.g. "Idolvpn/1234"
    const id = dataPost ? dataPost.split("/").pop() : null;
    const link = dataPost ? `https://t.me/${dataPost}` : null;

    const timeEl = msg.find("time.time").first();
    const date = timeEl.attr("datetime") || null;

    const textEl = msg.find(".tgme_widget_message_text").first();
    const text = textEl.length ? stripHtmlToText($, textEl) : "";

    const hasPhoto = msg.find(".tgme_widget_message_photo_wrap").length > 0;

    // Skip pure service messages / empty bodies with nothing worth showing.
    if (!text && !hasPhoto) return;
    if (!link) return;

    posts.push({ id, date, link, text: text || "(تصویر / رسانه)", hasPhoto });
  });

  // Telegram's preview lists oldest-first; keep the newest N.
  return posts.reverse().slice(0, MAX_POSTS);
}

async function main() {
  let posts = [];
  try {
    const html = await fetchChannelHtml();
    posts = parsePosts(html);
  } catch (err) {
    console.error("Failed to fetch/parse channel posts:", err.message);
    // Keep whatever was there before rather than wiping the feed on a
    // transient network/scrape failure.
    try {
      const prev = JSON.parse(await readFile(OUTPUT_PATH, "utf8"));
      if (Array.isArray(prev.posts) && prev.posts.length) {
        console.error("Keeping previous posts.json unchanged.");
        return;
      }
    } catch { /* no previous file, fall through and write an empty result */ }
  }

  const payload = {
    updated_at: new Date().toISOString(),
    channel: CHANNEL,
    source: SOURCE_URL,
    posts
  };

  await writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`Wrote ${posts.length} posts to data/posts.json`);
}

main();
