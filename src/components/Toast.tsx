// ===================================
// トースト通知コンポーネント
// ===================================

import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastContainerProps {
    toasts: ToastMessage[];
    onRemove: (id: string) => void;
}

/** アイコンとカラー設定 */
const toastConfig = {
    success: {
        icon: CheckCircle,
        bg: 'bg-emerald-50 border-emerald-400',
        text: 'text-emerald-700',
        iconColor: 'text-emerald-500',
    },
    error: {
        icon: XCircle,
        bg: 'bg-red-50 border-red-400',
        text: 'text-red-700',
        iconColor: 'text-red-500',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-50 border-blue-400',
        text: 'text-blue-700',
        iconColor: 'text-blue-500',
    },
};

/** トースト通知の表示コンテナ（画面右下に固定） */
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => {
                const cfg = toastConfig[toast.type];
                const Icon = cfg.icon;
                return (
                    <div
                        key={toast.id}
                        className={`${cfg.bg} border rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 animate-slide-in`}
                    >
                        <Icon className={`w-5 h-5 shrink-0 ${cfg.iconColor}`} />
                        <span className={`text-sm font-medium flex-1 ${cfg.text}`}>{toast.message}</span>
                        <button
                            onClick={() => onRemove(toast.id)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
