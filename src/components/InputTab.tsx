// ===================================
// 入力タブコンポーネント
// ===================================

import { PlusCircle, Star, X } from 'lucide-react';
import type { FormState, FavoriteTemplate } from '../types';

interface InputTabProps {
    form: FormState;
    favorites: FavoriteTemplate[];
    onFormChange: (form: FormState) => void;
    onSubmit: () => boolean;
    onApplyFavorite: (fav: FavoriteTemplate) => void;
    onRemoveFavorite: (id: string) => void;
}

/** 案件入力フォーム + お気に入りテンプレート */
export function InputTab({
    form,
    favorites,
    onFormChange,
    onSubmit,
    onApplyFavorite,
    onRemoveFavorite,
}: InputTabProps) {
    const handleChange = (field: keyof FormState, value: string) => {
        onFormChange({ ...form, [field]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    // 金額入力のハンドリング：数字とカンマのみ許可
    const handleAmountChange = (value: string) => {
        // カンマと数字以外を除去
        const cleaned = value.replace(/[^\d,]/g, '');
        handleChange('amountText', cleaned);
    };

    return (
        <div className="space-y-6">
            {/* 入力フォーム */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 顧客名 */}
                    <div className="space-y-1.5">
                        <label htmlFor="customerName" className="block text-sm font-medium text-slate-700">
                            顧客名 <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="customerName"
                            type="text"
                            value={form.customerName}
                            onChange={(e) => handleChange('customerName', e.target.value)}
                            placeholder="例：山田商事株式会社"
                            maxLength={100}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm
                focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                transition-all placeholder:text-slate-400"
                        />
                    </div>

                    {/* 案件名 */}
                    <div className="space-y-1.5">
                        <label htmlFor="projectName" className="block text-sm font-medium text-slate-700">
                            案件名 <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="projectName"
                            type="text"
                            value={form.projectName}
                            onChange={(e) => handleChange('projectName', e.target.value)}
                            placeholder="例：Webサイトリニューアル"
                            maxLength={100}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm
                focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                transition-all placeholder:text-slate-400"
                        />
                    </div>

                    {/* 担当者 */}
                    <div className="space-y-1.5">
                        <label htmlFor="ownerName" className="block text-sm font-medium text-slate-700">
                            担当者 <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="ownerName"
                            type="text"
                            value={form.ownerName}
                            onChange={(e) => handleChange('ownerName', e.target.value)}
                            placeholder="例：佐藤太郎"
                            maxLength={60}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm
                focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                transition-all placeholder:text-slate-400"
                        />
                    </div>

                    {/* 金額 */}
                    <div className="space-y-1.5">
                        <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
                            金額（円） <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="amount"
                            type="text"
                            inputMode="numeric"
                            value={form.amountText}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            placeholder="例：1500000"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-right
                focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                transition-all placeholder:text-slate-400 tabular-nums"
                        />
                    </div>
                </div>

                {/* 追加ボタン */}
                <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white
            bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl
            hover:from-primary-700 hover:to-primary-600
            shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30
            active:scale-[0.98] transition-all"
                >
                    <PlusCircle className="w-4 h-4" />
                    追加
                </button>
            </form>

            {/* お気に入りテンプレート */}
            {favorites.length > 0 && (
                <div className="border-t border-slate-200 pt-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500" />
                        お気に入りテンプレート
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {favorites.map((fav) => (
                            <div
                                key={fav.id}
                                className="group inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800
                  px-3 py-1.5 rounded-full text-xs font-medium hover:bg-amber-100 transition-colors"
                            >
                                <button
                                    onClick={() => onApplyFavorite(fav)}
                                    className="hover:underline"
                                    title="フォームに適用"
                                >
                                    {fav.customerName} / {fav.projectName}
                                </button>
                                <button
                                    onClick={() => onRemoveFavorite(fav.id)}
                                    className="ml-1 text-amber-400 hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="テンプレートを削除"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
