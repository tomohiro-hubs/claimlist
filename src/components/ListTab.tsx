// ===================================
// リストタブコンポーネント
// ===================================

import { useState } from 'react';
import { Search, Trash2, Star, ArrowUpDown, Copy } from 'lucide-react';
import type { Entry, SortKey } from '../types';
import { formatEntryDisplay, formatAmount, formatDateTime } from '../utils/format';
import { ConfirmModal } from './ConfirmModal';

interface ListTabProps {
    entries: Entry[];
    onRemoveEntry: (id: string) => void;
    onClearEntries: () => void;
    onAddFavorite: (entry: { customerName: string; projectName: string; ownerName: string }) => void;
    onCopy: (text: string) => void;
}

/** 案件リスト表示（検索・ソート・削除・お気に入り追加） */
export function ListTab({
    entries,
    onRemoveEntry,
    onClearEntries,
    onAddFavorite,
    onCopy,
}: ListTabProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('createdAt-desc');
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // 検索フィルター
    const filtered = entries.filter((entry) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            entry.customerName.toLowerCase().includes(q) ||
            entry.projectName.toLowerCase().includes(q) ||
            entry.ownerName.toLowerCase().includes(q)
        );
    });

    // ソート
    const sorted = [...filtered].sort((a, b) => {
        switch (sortKey) {
            case 'createdAt-desc':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'createdAt-asc':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'amount-desc':
                return b.amount - a.amount;
            case 'amount-asc':
                return a.amount - b.amount;
            case 'ownerName-asc':
                return a.ownerName.localeCompare(b.ownerName, 'ja-JP');
            case 'ownerName-desc':
                return b.ownerName.localeCompare(a.ownerName, 'ja-JP');
            default:
                return 0;
        }
    });

    return (
        <div className="space-y-4">
            {/* 検索・ソート・全クリア */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* 検索 */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="顧客名・案件名・担当者で検索..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm
              focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
              transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* ソート */}
                <div className="relative">
                    <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value as SortKey)}
                        className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-xl text-sm bg-white
              focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
              transition-all appearance-none cursor-pointer"
                    >
                        <option value="createdAt-desc">登録日時（新しい順）</option>
                        <option value="createdAt-asc">登録日時（古い順）</option>
                        <option value="amount-desc">金額（高い順）</option>
                        <option value="amount-asc">金額（低い順）</option>
                        <option value="ownerName-asc">担当者（昇順）</option>
                        <option value="ownerName-desc">担当者（降順）</option>
                    </select>
                </div>

                {/* 全クリア */}
                {entries.length > 0 && (
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium
              text-red-600 bg-red-50 border border-red-200 rounded-xl
              hover:bg-red-100 transition-colors whitespace-nowrap"
                    >
                        <Trash2 className="w-4 h-4" />
                        全件削除
                    </button>
                )}
            </div>

            {/* 件数表示 */}
            <p className="text-xs text-slate-500">
                {searchQuery ? `${sorted.length}件 / ${entries.length}件中` : `${entries.length}件`}
            </p>

            {/* リスト */}
            {sorted.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="text-sm text-slate-500">
                        {entries.length === 0 ? 'まだ案件がありません' : '検索結果がありません'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sorted.map((entry) => (
                        <div
                            key={entry.id}
                            className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md
                hover:border-slate-300 transition-all group"
                        >
                            {/* 表示文字列（クリックでコピー） */}
                            <div className="flex items-start justify-between gap-2">
                                <p
                                    onClick={() => onCopy(formatEntryDisplay(entry))}
                                    className="font-semibold text-slate-900 text-sm break-all leading-relaxed cursor-pointer
                                        hover:text-primary-600 transition-colors flex-1"
                                    title="クリックしてコピー"
                                >
                                    {formatEntryDisplay(entry)}
                                </p>
                                <button
                                    onClick={() => onCopy(formatEntryDisplay(entry))}
                                    className="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg
                                        hover:bg-primary-50 transition-colors shrink-0"
                                    title="タイトルをコピー"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>

                            {/* 詳細データ */}
                            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500">
                                <div>
                                    <span className="text-slate-400">顧客名：</span>
                                    {entry.customerName}
                                </div>
                                <div>
                                    <span className="text-slate-400">案件名：</span>
                                    {entry.projectName}
                                </div>
                                <div>
                                    <span className="text-slate-400">担当者：</span>
                                    {entry.ownerName}
                                </div>
                                <div>
                                    <span className="text-slate-400">金額：</span>
                                    <span className="tabular-nums">{formatAmount(entry.amount)}円</span>
                                </div>
                            </div>

                            {/* フッター（日時 + アクション） */}
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-xs text-slate-400 tabular-nums">
                                    {formatDateTime(entry.createdAt)}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() =>
                                            onAddFavorite({
                                                customerName: entry.customerName,
                                                projectName: entry.projectName,
                                                ownerName: entry.ownerName,
                                            })
                                        }
                                        className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg
                      hover:bg-amber-50 transition-colors"
                                        title="テンプレートに保存"
                                    >
                                        <Star className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(entry.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg
                      hover:bg-red-50 transition-colors"
                                        title="削除"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 1行削除確認モーダル */}
            <ConfirmModal
                isOpen={deleteTarget !== null}
                title="案件の削除"
                message="この案件を削除しますか？この操作は取り消せません。"
                onConfirm={() => {
                    if (deleteTarget) onRemoveEntry(deleteTarget);
                    setDeleteTarget(null);
                }}
                onCancel={() => setDeleteTarget(null)}
            />

            {/* 全件削除確認モーダル */}
            <ConfirmModal
                isOpen={showClearConfirm}
                title="全件削除"
                message={`すべての案件（${entries.length}件）を削除しますか？この操作は取り消せません。`}
                confirmLabel="全件削除"
                onConfirm={() => {
                    onClearEntries();
                    setShowClearConfirm(false);
                }}
                onCancel={() => setShowClearConfirm(false)}
            />
        </div>
    );
}
