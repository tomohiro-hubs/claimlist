// ===================================
// エラーバナーコンポーネント
// ===================================

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
    message: string;
    onRetry: () => void;
    isRetrying?: boolean;
}

/** data.json取得エラー時に画面上部に表示するバナー */
export function ErrorBanner({ message, onRetry, isRetrying = false }: ErrorBannerProps) {
    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-red-700">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{message}</span>
            </div>
            <button
                onClick={onRetry}
                disabled={isRetrying}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
            >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                再試行
            </button>
        </div>
    );
}
