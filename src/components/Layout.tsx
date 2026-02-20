// ===================================
// ヘッダー＋タブレイアウトコンポーネント
// ===================================

import { RefreshCw, FileSpreadsheet, ClipboardList, ListOrdered, Settings, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export type TabId = 'input' | 'list' | 'settings';

interface LayoutProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
    onRefresh: () => void;
    onExport: () => void;
    isRefreshing: boolean;
    entryCount: number;
    children: React.ReactNode;
}

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'input', label: '入力', icon: ClipboardList },
    { id: 'list', label: 'リスト', icon: ListOrdered },
    { id: 'settings', label: '設定', icon: Settings },
];

/** メインレイアウト: ヘッダー + タブバー + コンテンツ領域 */
export function Layout({
    activeTab,
    onTabChange,
    onRefresh,
    onExport,
    isRefreshing,
    entryCount,
    children,
}: LayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
            {/* ヘッダー */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* アプリ名 */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600
              flex items-center justify-center shadow-sm">
                            <FileSpreadsheet className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-slate-900 leading-tight">案件リスト</h1>
                            <p className="text-[10px] text-slate-400 leading-none">Excel Exporter</p>
                        </div>
                    </div>

                    {/* 右側アクション */}
                    <div className="flex items-center gap-2">
                        <Link
                            to="/about"
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100
                rounded-xl transition-colors"
                            title="このアプリについて"
                        >
                            <Info className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50
                rounded-xl transition-all disabled:opacity-50"
                            title="リフレッシュ"
                        >
                            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={onExport}
                            disabled={entryCount === 0}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white
                bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl
                hover:from-emerald-600 hover:to-emerald-700
                shadow-md shadow-emerald-500/25 hover:shadow-lg
                active:scale-[0.98] transition-all
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Excel出力
                        </button>
                    </div>
                </div>
            </header>

            {/* タブバー */}
            <div className="sticky top-[57px] z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
                <div className="max-w-4xl mx-auto px-4">
                    <nav className="flex gap-1" role="tablist">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => onTabChange(tab.id)}
                                    className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium
                    transition-all ${isActive
                                            ? 'text-primary-600'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    {tab.id === 'list' && entryCount > 0 && (
                                        <span
                                            className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${isActive
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'bg-slate-100 text-slate-500'
                                                }`}
                                        >
                                            {entryCount}
                                        </span>
                                    )}
                                    {/* アクティブインジケーター */}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* コンテンツ領域 */}
            <main className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
