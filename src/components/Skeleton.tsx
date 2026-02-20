// ===================================
// スケルトンローディングコンポーネント
// ===================================

/** フォーム用スケルトン表示 */
export function FormSkeleton() {
    return (
        <div className="animate-pulse space-y-5 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-20" />
                        <div className="h-10 bg-slate-200 rounded" />
                    </div>
                ))}
            </div>
            <div className="h-10 bg-slate-200 rounded w-32" />
        </div>
    );
}

/** リスト用スケルトン表示 */
export function ListSkeleton() {
    return (
        <div className="animate-pulse space-y-4 p-6">
            <div className="flex gap-3">
                <div className="h-10 bg-slate-200 rounded flex-1" />
                <div className="h-10 bg-slate-200 rounded w-40" />
            </div>
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-xl p-5 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                </div>
            ))}
        </div>
    );
}
