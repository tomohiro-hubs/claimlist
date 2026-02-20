// ===================================
// 汎用確認モーダルコンポーネント
// ===================================

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'default';
}

/** 削除確認などに使う汎用モーダル */
export function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = '削除',
    cancelLabel = 'キャンセル',
    onConfirm,
    onCancel,
    variant = 'danger',
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const confirmBtnClass =
        variant === 'danger'
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-primary-600 hover:bg-primary-700 text-white';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* オーバーレイ */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />
            {/* モーダル本体 */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-modal-in">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-4">
                    {variant === 'danger' && (
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                    )}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{message}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${confirmBtnClass}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
