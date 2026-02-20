// ===================================
// データモデル型定義
// ===================================

/** 案件エントリ */
export interface Entry {
    id: string;
    customerName: string;
    projectName: string;
    ownerName: string;
    amount: number;
    createdAt: string; // ISO 8601形式
}

/** お気に入りテンプレート */
export interface FavoriteTemplate {
    id: string;
    customerName: string;
    projectName: string;
    ownerName: string;
    updatedAt: string; // ISO 8601形式
}

/** アプリ設定 */
export interface Settings {
    baseFilename: string;
    ttlHours: number;
}

/** data.json のアプリ設定部分 */
export interface AppConfig {
    app: {
        name: string;
        defaultBaseFilename: string;
        defaultTtlHours: number;
    };
    schema: Record<string, Record<string, string>>;
}

/** フォームの入力状態 */
export interface FormState {
    customerName: string;
    projectName: string;
    ownerName: string;
    amountText: string;
}

/** アプリのロード状態 */
export type LoadState = 'loading' | 'error' | 'ready';

/** ソートキー */
export type SortKey = 'createdAt-desc' | 'createdAt-asc' | 'amount-desc' | 'amount-asc' | 'ownerName-asc' | 'ownerName-desc';

/** トースト通知の種類 */
export type ToastType = 'success' | 'error' | 'info';

/** トースト通知 */
export interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
}
