// ===================================
// 設定タブコンポーネント
// ===================================

import { useState } from 'react';
import { Save } from 'lucide-react';
import type { Settings } from '../types';

interface SettingsTabProps {
    settings: Settings;
    onUpdateSettings: (newSettings: Partial<Settings>) => void;
}

/** TTL選択肢 */
const TTL_OPTIONS = [
    { value: 6, label: '6時間' },
    { value: 12, label: '12時間' },
    { value: 24, label: '24時間' },
    { value: 48, label: '48時間' },
];

/** アプリ設定（ファイル名・TTL） */
export function SettingsTab({ settings, onUpdateSettings }: SettingsTabProps) {
    const [localFilename, setLocalFilename] = useState(settings.baseFilename);
    const [localTtl, setLocalTtl] = useState(settings.ttlHours);

    const handleSave = () => {
        onUpdateSettings({
            baseFilename: localFilename.trim() || '案件リスト',
            ttlHours: localTtl,
        });
    };

    // 変更があるかチェック
    const hasChanges =
        localFilename.trim() !== settings.baseFilename || localTtl !== settings.ttlHours;

    return (
        <div className="space-y-6">
            {/* ファイル名設定 */}
            <div className="space-y-1.5">
                <label htmlFor="baseFilename" className="block text-sm font-medium text-slate-700">
                    出力ファイル名（ベース）
                </label>
                <input
                    id="baseFilename"
                    type="text"
                    value={localFilename}
                    onChange={(e) => setLocalFilename(e.target.value)}
                    placeholder="案件リスト"
                    className="w-full max-w-md px-4 py-2.5 border border-slate-300 rounded-xl text-sm
            focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            transition-all placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-500">
                    ダウンロード時のファイル名：
                    <code className="ml-1 px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">
                        {(localFilename.trim() || '案件リスト')}_20260220_120000.xlsx
                    </code>
                </p>
            </div>

            {/* TTL設定 */}
            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                    データ保持期間（TTL）
                </label>
                <div className="flex flex-wrap gap-2">
                    {TTL_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setLocalTtl(opt.value)}
                            className={`px-4 py-2 text-sm rounded-xl border transition-all ${localTtl === opt.value
                                ? 'bg-primary-50 border-primary-300 text-primary-700 font-semibold'
                                : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-500">
                    登録から設定時間を過ぎた案件は、アプリ起動時に自動的に削除されます。
                </p>
            </div>

            {/* 表示オプション（固定説明） */}
            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                    表示フォーマット
                </label>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <code className="text-sm font-mono text-slate-700">
                        【顧客名様】　案件名（担当者名様）　金額円
                    </code>
                    <p className="mt-2 text-xs text-slate-500">
                        ※ 全角スペース区切り固定です（変更不可）
                    </p>
                </div>
            </div>

            {/* 保存ボタン */}
            <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl
          transition-all ${hasChanges
                        ? 'text-white bg-gradient-to-r from-primary-600 to-primary-500 shadow-md shadow-primary-500/25 hover:shadow-lg hover:from-primary-700 hover:to-primary-600 active:scale-[0.98]'
                        : 'text-slate-400 bg-slate-100 cursor-not-allowed'
                    }`}
            >
                <Save className="w-4 h-4" />
                設定を保存
            </button>
        </div>
    );
}
