"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var index_exports = {};
__export(index_exports, {
  getRSSFeed: () => getRSSFeed,
  getRSSItemById: () => getRSSItemById,
  getRSSItemsByType: () => getRSSItemsByType,
  refreshRSSFeed: () => refreshRSSFeed,
  searchRSSFeed: () => searchRSSFeed
});
module.exports = __toCommonJS(index_exports);
var import_rss_parser = __toESM(require("rss-parser"));
var import_node_crypto = require("node:crypto");
var import_rss_config = require("../rss-config");
const RSS_FETCH_TIMEOUT_MS = 12e3;
const parser = new import_rss_parser.default({
  customFields: {
    item: [
      ["itunes:author", "author"],
      ["itunes:subtitle", "subtitle"],
      ["itunes:summary", "summary"],
      ["itunes:image", "image"],
      ["itunes:duration", "duration"],
      ["itunes:explicit", "explicit"],
      ["itunes:episode", "episode"],
      ["itunes:season", "season"],
      ["media:content", "mediaContent"],
      ["media:thumbnail", "thumbnail"],
      ["guid", "guid"],
      ["enclosure", "enclosure"]
    ]
  }
});
let cachedFeed = null;
let inflightFeed = null;
async function fetchWithTimeout(url, init, timeoutMs = RSS_FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}
async function fetchAndParse(url) {
  const response = await fetchWithTimeout(url, {
    headers: import_rss_config.RSS_REQUEST_HEADERS
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
  }
  const xml = await response.text();
  return parser.parseString(xml);
}
async function loadFeedFromSources() {
  const sources = [import_rss_config.AFROPOP_RSS_URL, ...import_rss_config.ALTERNATIVE_RSS_URLS];
  let lastError = null;
  for (const source of sources) {
    try {
      const feed = await fetchAndParse(source);
      return { feed, source };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Unknown RSS error");
}
function determineContentType(item) {
  const categories = (item.categories || []).map((entry) => entry.toLowerCase());
  if (categories.some((cat) => cat.includes("feature") || cat.includes("article") || cat.includes("story"))) {
    return "Feature";
  }
  if (categories.some((cat) => cat.includes("event") || cat.includes("concert") || cat.includes("festival"))) {
    return "Event";
  }
  if (categories.some((cat) => cat.includes("program"))) {
    return "Program";
  }
  return "Episode";
}
function findKeyword(categories, keywords) {
  const lowered = categories.map((cat) => cat.toLowerCase());
  const match = lowered.find((cat) => keywords.some((keyword) => cat.includes(keyword)));
  return match ?? null;
}
function normalizeRSSItems(items) {
  return items.map((item) => {
    const categories = item.categories || [];
    const type = determineContentType(item);
    const region = findKeyword(categories, import_rss_config.REGION_KEYWORDS);
    const genre = findKeyword(categories, import_rss_config.GENRE_KEYWORDS);
    const enclosure = item.enclosure ?? item.mediaContent;
    const enclosureUrl = enclosure?.url || (typeof enclosure?.$?.url === "string" ? enclosure.$.url : null);
    const enclosureType = enclosure?.type || (typeof enclosure?.$?.type === "string" ? enclosure.$.type : null);
    const image = item.image?.$?.href || item.thumbnail?.$?.url || null;
    return {
      id: item.guid || item.link || (0, import_node_crypto.randomUUID)(),
      title: item.title || "Untitled",
      description: item.summary || item.contentSnippet || item.content || "",
      content: item.content,
      link: item.link || "",
      pubDate: item.pubDate,
      isoDate: item.isoDate,
      author: item.author || item.creator || "Afropop Worldwide",
      duration: item.duration,
      categories,
      image,
      audioUrl: enclosureUrl || null,
      audioType: enclosureType || null,
      type,
      region,
      genre
    };
  });
}
async function resolveFeed(forceRefresh = false) {
  if (!forceRefresh && cachedFeed && Date.now() - cachedFeed.timestamp < import_rss_config.RSS_CACHE_TIMEOUT) {
    return cachedFeed.data;
  }
  if (!forceRefresh && inflightFeed) {
    return inflightFeed;
  }
  inflightFeed = (async () => {
    const { feed } = await loadFeedFromSources();
    const items = normalizeRSSItems(feed.items);
    const data = {
      title: feed.title,
      description: feed.description,
      link: feed.link,
      items,
      count: items.length,
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
    };
    cachedFeed = {
      data,
      timestamp: Date.now()
    };
    return data;
  })();
  try {
    return await inflightFeed;
  } finally {
    inflightFeed = null;
  }
}
async function getRSSFeed({ forceRefresh = false } = {}) {
  return resolveFeed(forceRefresh);
}
async function refreshRSSFeed() {
  cachedFeed = null;
  const data = await resolveFeed(true);
  return {
    message: "RSS feed refreshed successfully",
    count: data.count,
    lastUpdated: data.lastUpdated
  };
}
async function getRSSItemById(id) {
  const feed = await resolveFeed();
  const match = feed.items.find((item) => item.id === id);
  if (!match) {
    throw new Error(`Item with ID ${id} not found`);
  }
  return match;
}
async function getRSSItemsByType(type) {
  const feed = await resolveFeed();
  const normalized = type.toLowerCase();
  return feed.items.filter((item) => item.type.toLowerCase() === normalized).sort((a, b) => {
    const aDate = new Date(a.isoDate || a.pubDate || "").getTime();
    const bDate = new Date(b.isoDate || b.pubDate || "").getTime();
    return bDate - aDate;
  });
}
function matchesFilterRange(item, filters) {
  if (!filters.dateFrom && !filters.dateTo) return true;
  const itemDate = new Date(item.isoDate || item.pubDate || "");
  if (Number.isNaN(itemDate.getTime())) {
    return false;
  }
  if (filters.dateFrom && itemDate < new Date(filters.dateFrom)) {
    return false;
  }
  if (filters.dateTo && itemDate > new Date(filters.dateTo)) {
    return false;
  }
  return true;
}
async function searchRSSFeed(query, filters = {}) {
  const feed = await resolveFeed();
  const loweredQuery = query.trim().toLowerCase();
  const items = feed.items.filter((item) => {
    const matchesQuery = !loweredQuery || item.title.toLowerCase().includes(loweredQuery) || item.description.toLowerCase().includes(loweredQuery) || (item.content?.toLowerCase().includes(loweredQuery) ?? false);
    const matchesType = !filters.type || item.type.toLowerCase() === filters.type.toLowerCase();
    const matchesRegion = !filters.region || item.region && item.region.toLowerCase().includes(filters.region.toLowerCase());
    const matchesGenre = !filters.genre || item.genre && item.genre.toLowerCase().includes(filters.genre.toLowerCase());
    const matchesDate = matchesFilterRange(item, filters);
    return matchesQuery && matchesType && matchesRegion && matchesGenre && matchesDate;
  }).sort((a, b) => {
    const aDate = new Date(a.isoDate || a.pubDate || "").getTime();
    const bDate = new Date(b.isoDate || b.pubDate || "").getTime();
    return bDate - aDate;
  });
  return {
    items,
    count: items.length,
    query,
    filters
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRSSFeed,
  getRSSItemById,
  getRSSItemsByType,
  refreshRSSFeed,
  searchRSSFeed
});
