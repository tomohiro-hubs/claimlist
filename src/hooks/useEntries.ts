import { useState, useCallback, useEffect } from 'react';
import type { Entry } from '../types';
import { loadEntries, saveEntries, applyTTL } from '../utils/storage';

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** エントリ管理フック */
export function useEntries(ttlHours: number) {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    // 初期ロード & TTLチェック
    useEffect(() => {
        const rawEntries = loadEntries();
        const validEntries = applyTTL(rawEntries, ttlHours);

        // 期限切れがあれば保存し直す
        if (validEntries.length !== rawEntries.length) {
            saveEntries(validEntries);
        }

        setEntries(validEntries);
        setHasLoaded(true);
    }, [ttlHours]);

    // 追加
    const addEntry = useCallback((entry: Omit<Entry, 'id' | 'createdAt'>) => {
        const newEntry: Entry = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            ...entry,
        };
        setEntries((prev) => {
            const updated = [newEntry, ...prev];
            saveEntries(updated);
            return updated;
        });
        return true;
    }, []);

    // 削除
    const removeEntry = useCallback((id: string) => {
        setEntries((prev) => {
            const updated = prev.filter((e) => e.id !== id);
            saveEntries(updated);
            return updated;
        });
    }, []);

    // 全クリア
    const clearEntries = useCallback(() => {
        setEntries([]);
        saveEntries([]);
    }, []);

    return { entries, hasLoaded, addEntry, removeEntry, clearEntries, setEntries };
}
