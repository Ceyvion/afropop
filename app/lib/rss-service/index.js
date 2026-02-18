"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRSSFeed = getRSSFeed;
exports.refreshRSSFeed = refreshRSSFeed;
exports.getRSSItemById = getRSSItemById;
exports.getRSSItemsByType = getRSSItemsByType;
exports.searchRSSFeed = searchRSSFeed;
const rss_parser_1 = __importDefault(require("rss-parser"));
const node_crypto_1 = require("node:crypto");
const rss_config_1 = require("../rss-config");
const RSS_FETCH_TIMEOUT_MS = 12000;
const META_PUBLISHED_AT = Symbol('rssPublishedAt');
const META_SEARCH_TEXT = Symbol('rssSearchText');
const META_TYPE_LOWER = Symbol('rssTypeLower');
const META_REGION_LOWER = Symbol('rssRegionLower');
const META_GENRE_LOWER = Symbol('rssGenreLower');
const parser = new rss_parser_1.default({
    customFields: {
        item: [
            ['itunes:author', 'author'],
            ['itunes:subtitle', 'subtitle'],
            ['itunes:summary', 'summary'],
            ['itunes:image', 'image'],
            ['itunes:duration', 'duration'],
            ['itunes:explicit', 'explicit'],
            ['itunes:episode', 'episode'],
            ['itunes:season', 'season'],
            ['media:content', 'mediaContent'],
            ['media:thumbnail', 'thumbnail'],
            ['guid', 'guid'],
            ['enclosure', 'enclosure'],
        ],
    },
});
let cachedFeed = null;
let inflightFeed = null;
async function fetchWithTimeout(url, init, timeoutMs = RSS_FETCH_TIMEOUT_MS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, {
            ...init,
            signal: controller.signal,
        });
    }
    finally {
        clearTimeout(timeout);
    }
}
async function fetchAndParse(url) {
    const response = await fetchWithTimeout(url, {
        headers: rss_config_1.RSS_REQUEST_HEADERS,
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }
    const xml = await response.text();
    return parser.parseString(xml);
}
async function loadFeedFromSources() {
    const sources = [rss_config_1.AFROPOP_RSS_URL, ...rss_config_1.ALTERNATIVE_RSS_URLS];
    const attempts = sources.map(async (source) => {
        const feed = await fetchAndParse(source);
        return { feed, source };
    });
    try {
        return await Promise.any(attempts);
    }
    catch (error) {
        if (error instanceof AggregateError && Array.isArray(error.errors) && error.errors.length > 0) {
            const firstError = error.errors.find((entry) => entry instanceof Error);
            if (firstError instanceof Error) {
                throw firstError;
            }
            throw new Error(String(error.errors[0] || 'Unknown RSS error'));
        }
        throw error instanceof Error ? error : new Error(String(error || 'Unknown RSS error'));
    }
}
function determineContentType(item) {
    const categories = (item.categories || []).map((entry) => entry.toLowerCase());
    if (categories.some((cat) => cat.includes('feature') || cat.includes('article') || cat.includes('story'))) {
        return 'Feature';
    }
    if (categories.some((cat) => cat.includes('event') || cat.includes('concert') || cat.includes('festival'))) {
        return 'Event';
    }
    if (categories.some((cat) => cat.includes('program'))) {
        return 'Program';
    }
    return 'Episode';
}
function findKeyword(categories, keywords) {
    const lowered = categories.map((cat) => cat.toLowerCase());
    const match = lowered.find((cat) => keywords.some((keyword) => cat.includes(keyword)));
    return match ?? null;
}
function toTimestamp(item) {
    const rawDate = item.isoDate || item.pubDate;
    if (!rawDate)
        return 0;
    const parsed = Date.parse(rawDate);
    return Number.isNaN(parsed) ? 0 : parsed;
}
function compareByPublishedDateDesc(a, b) {
    return b[META_PUBLISHED_AT] - a[META_PUBLISHED_AT];
}
function normalizeType(type) {
    const lowered = type.trim().toLowerCase();
    if (lowered === 'episode' || lowered === 'episodes')
        return 'Episode';
    if (lowered === 'feature' || lowered === 'features')
        return 'Feature';
    if (lowered === 'event' || lowered === 'events')
        return 'Event';
    if (lowered === 'program' || lowered === 'programs')
        return 'Program';
    return null;
}
function normalizeRSSItems(items) {
    return items.map((item) => {
        const categories = item.categories || [];
        const type = determineContentType(item);
        const region = findKeyword(categories, rss_config_1.REGION_KEYWORDS);
        const genre = findKeyword(categories, rss_config_1.GENRE_KEYWORDS);
        const title = item.title || 'Untitled';
        const description = item.summary || item.contentSnippet || item.content || '';
        const content = item.content;
        const publishedAt = toTimestamp(item);
        const enclosure = item.enclosure ?? item.mediaContent;
        const enclosureUrl = enclosure?.url ||
            (typeof enclosure?.$?.url === 'string' ? enclosure.$.url : null);
        const enclosureType = enclosure?.type ||
            (typeof enclosure?.$?.type === 'string' ? enclosure.$.type : null);
        const image = item.image?.$?.href ||
            item.thumbnail?.$?.url ||
            null;
        return {
            id: item.guid || item.link || (0, node_crypto_1.randomUUID)(),
            title,
            description,
            content,
            link: item.link || '',
            pubDate: item.pubDate,
            isoDate: item.isoDate,
            author: item.author || item.creator || 'Afropop Worldwide',
            duration: item.duration,
            categories,
            image,
            audioUrl: enclosureUrl || null,
            audioType: enclosureType || null,
            type,
            region,
            genre,
            [META_PUBLISHED_AT]: publishedAt,
            [META_SEARCH_TEXT]: `${title} ${description} ${content || ''}`.toLowerCase(),
            [META_TYPE_LOWER]: type.toLowerCase(),
            [META_REGION_LOWER]: (region || '').toLowerCase(),
            [META_GENRE_LOWER]: (genre || '').toLowerCase(),
        };
    });
}
function buildFeedIndexes(items) {
    const allSorted = [...items].sort(compareByPublishedDateDesc);
    const byType = {
        Episode: [],
        Feature: [],
        Event: [],
        Program: [],
    };
    const byId = new Map();
    for (const item of allSorted) {
        if (!byId.has(item.id)) {
            byId.set(item.id, item);
        }
        byType[item.type].push(item);
    }
    return {
        byId,
        byType,
        allSorted,
    };
}
async function resolveFeed(forceRefresh = false) {
    if (!forceRefresh && cachedFeed && Date.now() - cachedFeed.timestamp < rss_config_1.RSS_CACHE_TIMEOUT) {
        return cachedFeed;
    }
    if (!forceRefresh && inflightFeed) {
        return inflightFeed;
    }
    inflightFeed = (async () => {
        const { feed } = await loadFeedFromSources();
        const normalizedItems = normalizeRSSItems(feed.items);
        const indexes = buildFeedIndexes(normalizedItems);
        const items = indexes.allSorted;
        const data = {
            title: feed.title,
            description: feed.description,
            link: feed.link,
            items,
            count: items.length,
            lastUpdated: new Date().toISOString(),
        };
        const nextCache = {
            data,
            indexes,
            timestamp: Date.now(),
        };
        cachedFeed = nextCache;
        return nextCache;
    })();
    try {
        return await inflightFeed;
    }
    finally {
        inflightFeed = null;
    }
}
async function getRSSFeed({ forceRefresh = false } = {}) {
    const feed = await resolveFeed(forceRefresh);
    return feed.data;
}
async function refreshRSSFeed() {
    cachedFeed = null;
    const { data } = await resolveFeed(true);
    return {
        message: 'RSS feed refreshed successfully',
        count: data.count,
        lastUpdated: data.lastUpdated,
    };
}
async function getRSSItemById(id) {
    const feed = await resolveFeed();
    const match = feed.indexes.byId.get(id);
    if (!match) {
        throw new Error(`Item with ID ${id} not found`);
    }
    return match;
}
async function getRSSItemsByType(type) {
    const feed = await resolveFeed();
    const normalizedType = normalizeType(type);
    if (!normalizedType) {
        return [];
    }
    return feed.indexes.byType[normalizedType].slice();
}
function toFilterTimestamp(value) {
    if (!value)
        return null;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
}
function matchesFilterRange(item, dateFrom, dateTo) {
    if (dateFrom === null && dateTo === null)
        return true;
    const itemDate = item[META_PUBLISHED_AT];
    if (!itemDate) {
        return false;
    }
    if (dateFrom !== null && itemDate < dateFrom) {
        return false;
    }
    if (dateTo !== null && itemDate > dateTo) {
        return false;
    }
    return true;
}
async function searchRSSFeed(query, filters = {}, pagination = {}) {
    const feed = await resolveFeed();
    const loweredQuery = query.trim().toLowerCase();
    const loweredType = filters.type?.trim().toLowerCase() || '';
    const normalizedType = normalizeType(loweredType);
    const typeFilter = normalizedType ? normalizedType.toLowerCase() : loweredType;
    const loweredRegion = filters.region?.trim().toLowerCase() || '';
    const loweredGenre = filters.genre?.trim().toLowerCase() || '';
    const dateFrom = toFilterTimestamp(filters.dateFrom);
    const dateTo = toFilterTimestamp(filters.dateTo);
    const requestedPage = Number(pagination.page) || 1;
    const requestedPageSize = Number(pagination.pageSize) || 24;
    const page = Math.max(1, requestedPage);
    const pageSize = Math.min(50, Math.max(1, requestedPageSize));
    const source = loweredType && normalizedType
        ? feed.indexes.byType[normalizedType]
        : loweredType
            ? []
            : feed.indexes.allSorted;
    const filtered = source
        .filter((item) => {
        if (loweredQuery && !item[META_SEARCH_TEXT].includes(loweredQuery)) {
            return false;
        }
        if (typeFilter && item[META_TYPE_LOWER] !== typeFilter) {
            return false;
        }
        if (loweredRegion && !item[META_REGION_LOWER].includes(loweredRegion)) {
            return false;
        }
        if (loweredGenre && !item[META_GENRE_LOWER].includes(loweredGenre)) {
            return false;
        }
        return matchesFilterRange(item, dateFrom, dateTo);
    });
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    const hasMore = start + items.length < total;
    return {
        items,
        count: items.length,
        total,
        page,
        pageSize,
        hasMore,
        query,
        filters,
    };
}
