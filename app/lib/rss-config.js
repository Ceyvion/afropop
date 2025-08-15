"use strict";
// app/lib/rss-config.ts
// Configuration file for RSS feed integration
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENRE_KEYWORDS = exports.REGION_KEYWORDS = exports.CONTENT_TYPE_MAPPING = exports.RSS_REQUEST_HEADERS = exports.RSS_CACHE_TIMEOUT = exports.ALTERNATIVE_RSS_URLS = exports.AFROPOP_RSS_URL = void 0;
// Afropop Worldwide RSS feed URL (using FeedBurner)
exports.AFROPOP_RSS_URL = 'https://feeds.feedburner.com/afropop/podcast';
// Alternative RSS feed URLs (fallbacks)
exports.ALTERNATIVE_RSS_URLS = [
    'https://afropop.org/feed/podcast',
    'https://f.prxu.org/afropop/feed-rss.xml',
    'https://feeds.prx.org/afropop'
];
// Cache timeout (5 minutes)
exports.RSS_CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
// Default headers for RSS requests
exports.RSS_REQUEST_HEADERS = {
    'User-Agent': 'Afropop Worldwide Website Client (+https://afropop.org)',
    'Accept': 'application/xml,text/xml,*/*',
    'Accept-Encoding': 'gzip, deflate, br'
};
// Content type mappings
exports.CONTENT_TYPE_MAPPING = {
    'episode': 'Episode',
    'feature': 'Feature',
    'event': 'Event',
    'program': 'Program'
};
// Region keywords for categorization
exports.REGION_KEYWORDS = [
    'africa', 'caribbean', 'diaspora', 'west', 'east', 'south', 'north',
    'nigeria', 'ghana', 'senegal', 'kenya', 'egypt', 'morocco', 'tunisia',
    'south africa', 'zimbabwe', 'uganda', 'ethiopia', 'tanzania'
];
// Genre keywords for categorization
exports.GENRE_KEYWORDS = [
    'highlife', 'afrobeat', 'soukous', 'apapiano', 'taarab', 'juju', 'makossa',
    'mbaqanga', 'kwaito', 'azonto', 'afropop', 'world music', 'traditional'
];
