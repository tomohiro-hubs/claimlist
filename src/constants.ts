// ===================================
// 定数定義
// ===================================

/** ローカルストレージキー */
export const STORAGE_KEYS = {
    ENTRIES: 'claimlist_entries',
    FAVORITES: 'claimlist_favorites',
    SETTINGS: 'claimlist_settings',
} as const;

/** デフォルト設定 */
export const DEFAULT_SETTINGS = {
    baseFilename: '案件リスト',
    ttlHours: 12,
} as const;

/** TTL（データ保持期間）の選択肢 */
export const TTL_OPTIONS = [
    { value: 6, label: '6時間' },
    { value: 12, label: '12時間' },
    { value: 24, label: '24時間' },
    { value: 48, label: '48時間' },
] as const;

/** トースト表示時間 (ms) */
export const TOAST_DURATION = 3000;
