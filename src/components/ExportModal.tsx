// ===================================
// Excel出力プレビューモーダルコンポーネント
// ===================================

import { FileSpreadsheet, X, Download } from 'lucide-react';
import type { Entry } from '../types';
import { formatEntryDisplay } from '../utils/format';
import { sanitizeFilename } from '../utils/sanitize';
import { getTimestamp } from '../utils/format';

interface ExportModalProps {
    isOpen: boolean;
    entries: Entry[];
    baseFilename: string;
    onConfirm: () => void;
    onCancel: () => void;
}

/** Excel出力前のプレビューモーダル */
export function ExportModal({
    isOpen,
    entries,
    baseFilename,
    onConfirm,
    onCancel,
}: ExportModalProps) {
    if (!isOpen) return null;

    const baseName = baseFilename.trim() || '案件リスト';
    const filename = `${sanitizeFilename(baseName)}_${getTimestamp()}.xlsx`;
    const previewEntries = entries.slice(0, 3);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* オーバーレイ */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />
            {/* モーダル本体 */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-modal-in">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* ヘッダー */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Excel出力</h3>
                        <p className="text-sm text-slate-500">出力内容を確認してください</p>
                    </div>
                </div>

                {/* 情報 */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 mb-5">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">出力件数</span>
                        <span className="font-semibold text-slate-900">{entries.length}件</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">ファイル名</span>
                        <span className="font-mono text-xs text-slate-700 break-all">{filename}</span>
                    </div>
                </div>

                {/* プレビュー */}
                {previewEntries.length > 0 && (
                    <div className="mb-5">
                        <p className="text-xs font-medium text-slate-500 mb-2">
                            先頭{previewEntries.length}件のプレビュー
                        </p>
                        <div className="space-y-2">
                            {previewEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="text-xs text-slate-700 bg-slate-50 rounded-lg px-3 py-2 font-mono break-all"
                                >
                                    {formatEntryDisplay(entry)}
                                </div>
                            ))}
                            {entries.length > 3 && (
                                <p className="text-xs text-slate-400 text-center">
                                    ...他 {entries.length - 3} 件
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* ボタン */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={onConfirm}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        ダウンロード
                    </button>
                </div>
            </div>
        </div>
    );
}
