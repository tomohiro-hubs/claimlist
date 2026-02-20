// ===================================
// Aboutページ
// ===================================

import { ArrowLeft, Shield, HardDrive, FileSpreadsheet, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

/** アプリ概要・保存仕様・免責事項 */
export function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
            {/* ヘッダー */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
                    <Link
                        to="/"
                        className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50
              rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-base font-bold text-slate-900">このアプリについて</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                {/* アプリ概要 */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600
              flex items-center justify-center shadow-sm">
                            <FileSpreadsheet className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">案件リスト Excel Exporter</h2>
                            <p className="text-xs text-slate-500">ver 1.0.0</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        案件情報（顧客名・案件名・担当者・金額）を素早く入力・一時保存し、
                        整形済みのExcel（.xlsx）ファイルをワンクリックでダウンロードできるツールです。
                        サーバーへのデータ送信は一切行わず、すべてのデータはお使いの端末内にのみ保存されます。
                    </p>
                </section>

                {/* 機能一覧 */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
                    <h2 className="text-base font-bold text-slate-900 mb-4">主な機能</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {[
                            {
                                icon: FileSpreadsheet,
                                title: 'Excel出力',
                                desc: '案件データを整形済みの.xlsxファイルとして出力',
                                bgClass: 'bg-emerald-100',
                                iconClass: 'text-emerald-600',
                            },
                            {
                                icon: HardDrive,
                                title: 'ローカル保存',
                                desc: 'ブラウザのLocal Storageに一時保存（端末内のみ）',
                                bgClass: 'bg-blue-100',
                                iconClass: 'text-blue-600',
                            },
                            {
                                icon: Clock,
                                title: '自動削除（TTL）',
                                desc: '設定した時間が経過したデータを自動的に削除',
                                bgClass: 'bg-amber-100',
                                iconClass: 'text-amber-600',
                            },
                            {
                                icon: Shield,
                                title: 'プライバシー重視',
                                desc: 'サーバーへのデータ送信・外部共有は一切なし',
                                bgClass: 'bg-purple-100',
                                iconClass: 'text-purple-600',
                            },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="flex items-start gap-3">
                                    <div
                                        className={`w-9 h-9 rounded-lg ${item.bgClass} flex items-center justify-center shrink-0`}
                                    >
                                        <Icon className={`w-5 h-5 ${item.iconClass}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 保存仕様 */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
                    <h2 className="text-base font-bold text-slate-900 mb-3">データ保存について</h2>
                    <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                        <li>データはブラウザの<strong>Local Storage</strong>に保存されます</li>
                        <li>他のユーザーとデータが共有されることはありません</li>
                        <li>ブラウザのキャッシュクリアでデータは消去されます</li>
                        <li>TTL（有効期限）設定により、一定時間経過後に自動削除されます</li>
                        <li>「全件削除」で手動での即時消去も可能です</li>
                    </ul>
                </section>

                {/* 免責事項 */}
                <section className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
                    <h2 className="text-base font-bold text-amber-900 mb-3">⚠️ 免責事項</h2>
                    <ul className="text-sm text-amber-800 space-y-2 list-disc list-inside">
                        <li>本ツールは簡易的な案件メモ・Excel出力を目的としています</li>
                        <li>ブラウザの仕様変更やキャッシュクリアにより、保存データが失われる場合があります</li>
                        <li>重要なデータは別途バックアップをお取りください</li>
                        <li>本ツールの利用により生じた損害について、開発者は責任を負いません</li>
                    </ul>
                </section>
            </main>
        </div>
    );
}
