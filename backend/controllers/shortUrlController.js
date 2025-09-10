import Repo from '../repository/inMemoryRepo.js';
import { Log } from '../utils/logger.js';

const DEFAULT_MINUTES = 30;
const ALPH = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateShortcode(len = 7) {
    let out = '';
    for (let i = 0; i < len; i++) {
        out += ALPH[Math.floor(Math.random() * ALPH.length)];
    }
    return out;
}

function isValidUrl(u) {
    try {
        const parsed = new URL(u);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

function isValidShortcode(s) {
    if (typeof s !== 'string') return false;
    if (s.length < 3 || s.length > 30) return false;
    return /^[a-zA-Z0-9_-]+$/.test(s);
}

export async function createShortUrl(req, res) {
    const { url, validity, shortcode } = req.body;
    Log('backend', 'info', 'controller', `create url=${url}`);

    if (!url) return res.status(400).json({ error: 'url is required' });
    if (!isValidUrl(url)) return res.status(400).json({ error: 'invalid url format' });

    if (shortcode && !isValidShortcode(shortcode)) {
        return res.status(400).json({ error: 'invalid shortcode (alphanumeric, 3-30 chars)' });
    }

    let code = shortcode;
    if (code && Repo.exists(code)) {
        return res.status(409).json({ error: 'shortcode already taken' });
    }

    if (!code) {
        do { code = generateShortcode(); }
        while (Repo.exists(code));
    }

    const minutes = Number.isInteger(validity) ? validity : DEFAULT_MINUTES;
    const expiryDate = new Date(Date.now() + minutes * 60_000);

    const record = {
        shortcode: code,
        url,
        createdAt: new Date().toISOString(),
        expiry: expiryDate.toISOString(),
        clicks: 0,
        events: []
    };

    Repo.save(code, record);
    Log('backend', 'info', 'repository', `saved shortcode=${code}`);

    return res.status(201).json({
        shortLink: `${process.env.BASE_URL || 'http://localhost:3000'}/${code}`,
        expiry: record.expiry
    });
}

export async function getStats(req, res) {
    const { code } = req.params;
    Log('backend', 'info', 'controller', `stats for ${code}`);

    const item = Repo.get(code);
    if (!item) return res.status(404).json({ error: 'shortcode not found' });

    return res.json({
        shortcode: item.shortcode,
        url: item.url,
        createdAt: item.createdAt,
        expiry: item.expiry,
        clicks: item.clicks,
        events: item.events
    });
}

export async function handleRedirect(req, res) {
    const { code } = req.params;
    Log('backend', 'info', 'controller', `redirect hit ${code}`);

    const item = Repo.get(code);
    if (!item) return res.status(404).json({ error: 'shortcode not found' });

    if (new Date(item.expiry) <= new Date()) {
        Repo.remove(code);
        return res.status(404).json({ error: 'shortcode expired' });
    }

    const event = {
        t: new Date().toISOString(),
        referrer: req.get('referer') || null,
        source: req.get('accept-language') || 'unknown'
    };

    item.clicks += 1;
    item.events.push(event);
    Repo.save(code, item);

    Log('backend', 'info', 'controller', `redirecting ${code} -> ${item.url}`);
    return res.redirect(302, item.url);
}