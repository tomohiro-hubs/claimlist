import { useState, useCallback } from 'react';
import type { ToastMessage, ToastType } from '../types';
import { TOAST_DURATION } from '../constants';

/** ユニークID生成 */
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** トースト通知管理フック */
export function useToast() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((type: ToastType, message: string) => {
        const id = generateId();
        setToasts((prev) => [...prev, { id, type, message }]);

        // 自動削除
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, TOAST_DURATION);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return { toasts, addToast, removeToast };
}
