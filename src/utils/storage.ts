// ===================================
// LocalStorage管理ユーティリティ
// ===================================

import type { Entry, FavoriteTemplate, Settings } from '../types';

// LocalStorageのキー定義
const KEYS = {
    entries: 'app.entries',
    favorites: 'app.favorites',
    settings: 'app.settings',
} as const;

// ===== エントリ操作 =====

/** エントリ配列をLocalStorageから読み込み */
export function loadEntries(): Entry[] {
    try {
        const raw = localStorage.getItem(KEYS.entries);
        if (!raw) return [];
        return JSON.parse(raw) as Entry[];
    } catch {
        return [];
    }
}

/** エントリ配列をLocalStorageに保存 */
export function saveEntries(entries: Entry[]): void {
    localStorage.setItem(KEYS.entries, JSON.stringify(entries));
}

// ===== お気に入り操作 =====

/** お気に入り配列をLocalStorageから読み込み */
export function loadFavorites(): FavoriteTemplate[] {
    try {
        const raw = localStorage.getItem(KEYS.favorites);
        if (!raw) return [];
        return JSON.parse(raw) as FavoriteTemplate[];
    } catch {
        return [];
    }
}

/** お気に入り配列をLocalStorageに保存 */
export function saveFavorites(favorites: FavoriteTemplate[]): void {
    localStorage.setItem(KEYS.favorites, JSON.stringify(favorites));
}

// ===== 設定操作 =====

/** 設定をLocalStorageから読み込み（デフォルト値付き） */
export function loadSettings(defaults: Settings): Settings {
    try {
        const raw = localStorage.getItem(KEYS.settings);
        if (!raw) return defaults;
        return { ...defaults, ...JSON.parse(raw) } as Settings;
    } catch {
        return defaults;
    }
}

/** 設定をLocalStorageに保存 */
export function saveSettings(settings: Settings): void {
    localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

// ===== TTL処理 =====

/**
 * TTL（有効期限）を適用し、期限切れエントリを除外して返す
 * @param entries エントリ配列
 * @param ttlHours 有効期限（時間単位）
 * @returns 有効期限内のエントリ配列
 */
export function applyTTL(entries: Entry[], ttlHours: number): Entry[] {
    const now = Date.now();
    const ttlMs = ttlHours * 60 * 60 * 1000;
    return entries.filter((entry) => {
        const created = new Date(entry.createdAt).getTime();
        return now - created < ttlMs;
    });
}

// ===== 全クリア =====

/** 全データをLocalStorageから削除 */
export function clearAll(): void {
    localStorage.removeItem(KEYS.entries);
    localStorage.removeItem(KEYS.favorites);
    localStorage.removeItem(KEYS.settings);
}
