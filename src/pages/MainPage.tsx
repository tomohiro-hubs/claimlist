// ===================================
// メインページ（タブUI）
// ===================================

import { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { Layout, type TabId } from '../components/Layout';
import { InputTab } from '../components/InputTab';
import { ListTab } from '../components/ListTab';
import { SettingsTab } from '../components/SettingsTab';
import { FormSkeleton, ListSkeleton } from '../components/Skeleton';
import { ErrorBanner } from '../components/ErrorBanner';
import { ToastContainer } from '../components/Toast';
import { ExportModal } from '../components/ExportModal';
import { generateExcel } from '../utils/excel';

/** メインページ：タブ切替でフォーム/リスト/設定を表示 */
export function MainPage() {
    const state = useAppState();
    const [activeTab, setActiveTab] = useState<TabId>('input');
    const [showExportModal, setShowExportModal] = useState(false);

    // Excel出力実行
    const handleExport = () => {
        generateExcel(state.entries, state.settings.baseFilename);
        setShowExportModal(false);
        state.addToast('success', 'Excelファイルをダウンロードしました。');
    };

    // クリップボードコピー
    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            state.addToast('success', 'クリップボードにコピーしました。');
        } catch {
            state.addToast('error', 'コピーに失敗しました。');
        }
    };

    // タブコンテンツ描画
    const renderContent = () => {
        // ローディング中はスケルトン表示
        if (state.loadState === 'loading') {
            return activeTab === 'list' ? <ListSkeleton /> : <FormSkeleton />;
        }

        switch (activeTab) {
            case 'input':
                return (
                    <div className="space-y-10">
                        <InputTab
                            form={state.form}
                            favorites={state.favorites}
                            onFormChange={(f) => state.setForm(f)}
                            onSubmit={state.addEntry}
                            onApplyFavorite={state.applyFavorite}
                            onRemoveFavorite={state.removeFavorite}
                        />

                        <div className="border-t border-slate-200 pt-8">
                            <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">登録済み案件一覧</h2>
                            <ListTab
                                entries={state.entries}
                                onRemoveEntry={state.removeEntry}
                                onClearEntries={state.clearEntries}
                                onAddFavorite={state.addFavorite}
                                onCopy={handleCopy}
                            />
                        </div>
                    </div>
                );
            case 'list':
                return (
                    <ListTab
                        entries={state.entries}
                        onRemoveEntry={state.removeEntry}
                        onClearEntries={state.clearEntries}
                        onAddFavorite={state.addFavorite}
                        onCopy={handleCopy}
                    />
                );
            case 'settings':
                return (
                    <SettingsTab
                        settings={state.settings}
                        onUpdateSettings={state.updateSettings}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Layout
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onRefresh={state.refresh}
                onExport={() => setShowExportModal(true)}
                isRefreshing={state.isRefreshing}
                entryCount={state.entries.length}
            >
                {/* エラーバナー */}
                {state.loadState === 'error' && state.errorMessage && (
                    <div className="mb-4 -mt-1">
                        <ErrorBanner
                            message={state.errorMessage}
                            onRetry={state.refresh}
                            isRetrying={state.isRefreshing}
                        />
                    </div>
                )}

                {renderContent()}
            </Layout>

            {/* Excel出力プレビューモーダル */}
            <ExportModal
                isOpen={showExportModal}
                entries={state.entries}
                baseFilename={state.settings.baseFilename}
                onConfirm={handleExport}
                onCancel={() => setShowExportModal(false)}
            />

            {/* トースト通知 */}
            <ToastContainer toasts={state.toasts} onRemove={state.removeToast} />
        </>
    );
}
