import { useState, useEffect, useCallback } from 'react';
import type {
    Entry,
    FavoriteTemplate,
    Settings,
    AppConfig,
    FormState,
    LoadState,
    ToastMessage,
    ToastType,
} from '../types';
import {
    loadFavorites,
    saveFavorites,
    loadSettings,
    saveSettings,
} from '../utils/storage';
import { useToast } from './useToast';
import { useEntries } from './useEntries';

/** デフォルト設定 */
const DEFAULT_SETTINGS: Settings = {
    baseFilename: '案件リスト',
    ttlHours: 24,
};

/** フォーム初期状態 */
const INITIAL_FORM: FormState = {
    customerName: '',
    projectName: '',
    ownerName: '',
    amountText: '',
};

/** ユニークID生成 */
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** useAppState の戻り値型 */
export interface AppState {
    // 状態
    loadState: LoadState;
    errorMessage: string | null;
    config: AppConfig | null;
    entries: Entry[];
    favorites: FavoriteTemplate[];
    settings: Settings;
    form: FormState;
    toasts: ToastMessage[];
    isRefreshing: boolean;

    // フォーム操作
    setForm: React.Dispatch<React.SetStateAction<FormState>>;

    // エントリ操作
    addEntry: () => boolean;
    removeEntry: (id: string) => void;
    clearEntries: () => void;

    // お気に入り操作
    addFavorite: (entry: { customerName: string; projectName: string; ownerName: string }) => void;
    removeFavorite: (id: string) => void;
    applyFavorite: (fav: FavoriteTemplate) => void;

    // 設定操作
    updateSettings: (newSettings: Partial<Settings>) => void;

    // リフレッシュ
    refresh: () => Promise<void>;

    // トースト
    addToast: (type: ToastType, message: string) => void;
    removeToast: (id: string) => void;
}

export function useAppState(): AppState {
    const [loadState, setLoadState] = useState<LoadState>('loading');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [favorites, setFavorites] = useState<FavoriteTemplate[]>([]);
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // カスタムフック
    const { toasts, addToast, removeToast } = useToast();
    const {
        entries,
        hasLoaded: entriesLoaded,
        addEntry: addEntryInternal,
        removeEntry: removeEntryInternal,
        clearEntries: clearEntriesInternal,
    } = useEntries(settings.ttlHours);

    // --- data.json取得 ---
    const fetchConfig = useCallback(async (): Promise<AppConfig | null> => {
        try {
            const res = await fetch('./data.json');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return (await res.json()) as AppConfig;
        } catch {
            return null;
        }
    }, []);

    // --- 初期化処理 ---
    const initialize = useCallback(async () => {
        setLoadState('loading');
        setErrorMessage(null);

        // data.json取得
        const cfg = await fetchConfig();
        if (!cfg) {
            setErrorMessage('設定ファイルの読み込みに失敗しました。');
            setLoadState('error');
        } else {
            setConfig(cfg);
        }

        // デフォルト設定
        const defaults: Settings = cfg
            ? {
                baseFilename: cfg.app.defaultBaseFilename,
                ttlHours: cfg.app.defaultTtlHours,
            }
            : DEFAULT_SETTINGS;

        // 設定読み込み
        const loadedSettings = loadSettings(defaults);
        setSettings(loadedSettings);

        // お気に入り読み込み
        const loadedFavorites = loadFavorites();
        setFavorites(loadedFavorites);

        // ※エントリの読み込みはuseEntriesが行う
    }, [fetchConfig]);

    // useEntriesのロード完了を監視してreadyにする
    useEffect(() => {
        if (config && entriesLoaded && loadState === 'loading') {
            setLoadState('ready');
        }
    }, [config, entriesLoaded, loadState]);

    // 初回マウント時
    useEffect(() => {
        initialize();
    }, [initialize]);

    // --- エントリ追加 ---
    const addEntry = useCallback((): boolean => {
        const customerName = form.customerName.trim();
        const projectName = form.projectName.trim();
        const ownerName = form.ownerName.trim();
        const amountRaw = form.amountText.replace(/,/g, '');

        // バリデーション
        if (!customerName) {
            addToast('error', '顧客名を入力してください。');
            return false;
        }
        if (customerName.length > 100) {
            addToast('error', '顧客名は100文字以内で入力してください。');
            return false;
        }
        if (!projectName) {
            addToast('error', '案件名を入力してください。');
            return false;
        }
        if (projectName.length > 100) {
            addToast('error', '案件名は100文字以内で入力してください。');
            return false;
        }
        if (!ownerName) {
            addToast('error', '担当者を入力してください。');
            return false;
        }
        if (ownerName.length > 60) {
            addToast('error', '担当者は60文字以内で入力してください。');
            return false;
        }
        const amount = parseInt(amountRaw, 10);
        if (!Number.isFinite(amount) || amount < 0 || amountRaw === '') {
            addToast('error', '金額は0以上の整数を入力してください。');
            return false;
        }
        if (amountRaw.includes('.')) {
            addToast('error', '金額に小数は使用できません。');
            return false;
        }

        // useEntriesの関数を使用
        addEntryInternal({
            customerName,
            projectName,
            ownerName,
            amount,
        });

        // フォーム初期化
        setForm(INITIAL_FORM);
        addToast('success', '案件を追加しました。');
        return true;
    }, [form, addToast, addEntryInternal]);

    // --- エントリ削除 ---
    const removeEntry = useCallback(
        (id: string) => {
            removeEntryInternal(id);
            addToast('info', '案件を削除しました。');
        },
        [addToast, removeEntryInternal]
    );

    // --- 全クリア ---
    const clearEntries = useCallback(() => {
        clearEntriesInternal();
        addToast('info', '全件削除しました。');
    }, [addToast, clearEntriesInternal]);

    // --- お気に入り追加 ---
    const addFavorite = useCallback(
        (entry: { customerName: string; projectName: string; ownerName: string }) => {
            const newFav: FavoriteTemplate = {
                id: generateId(),
                customerName: entry.customerName,
                projectName: entry.projectName,
                ownerName: entry.ownerName,
                updatedAt: new Date().toISOString(),
            };
            setFavorites((prev) => {
                const updated = [...prev, newFav];
                saveFavorites(updated);
                return updated;
            });
            addToast('success', 'テンプレートを保存しました。');
        },
        [addToast]
    );

    // --- お気に入り削除 ---
    const removeFavorite = useCallback(
        (id: string) => {
            setFavorites((prev) => {
                const updated = prev.filter((f) => f.id !== id);
                saveFavorites(updated);
                return updated;
            });
            addToast('info', 'テンプレートを削除しました。');
        },
        [addToast]
    );

    // --- お気に入り適用 ---
    const applyFavorite = useCallback((fav: FavoriteTemplate) => {
        setForm((prev) => ({
            ...prev,
            customerName: fav.customerName,
            projectName: fav.projectName,
            ownerName: fav.ownerName,
        }));
    }, []);

    // --- 設定更新 ---
    const updateSettings = useCallback(
        (newSettings: Partial<Settings>) => {
            setSettings((prev) => {
                const updated = { ...prev, ...newSettings };
                saveSettings(updated);
                return updated;
            });
            addToast('success', '設定を保存しました。');
        },
        [addToast]
    );

    // --- リフレッシュ ---
    const refresh = useCallback(async () => {
        setIsRefreshing(true);
        setForm(INITIAL_FORM);
        await initialize();
        setIsRefreshing(false);
        addToast('info', '画面を更新しました。');
    }, [initialize, addToast]);

    return {
        loadState,
        errorMessage,
        config,
        entries,
        favorites,
        settings,
        form,
        toasts,
        isRefreshing,
        setForm,
        addEntry,
        removeEntry,
        clearEntries,
        addFavorite,
        removeFavorite,
        applyFavorite,
        updateSettings,
        refresh,
        addToast,
        removeToast,
    };
}
