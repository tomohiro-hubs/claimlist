// ===================================
// 表示フォーマット・金額整形ユーティリティ
// ===================================

import type { Entry } from '../types';

/** 金額フォーマッタ（3桁区切り） */
const amountFormatter = new Intl.NumberFormat('ja-JP');

/**
 * 金額を3桁区切りの文字列に変換
 * @example formatAmount(1500000) → "1,500,000"
 */
export function formatAmount(amount: number): string {
    return amountFormatter.format(amount);
}

/**
 * 表示用文字列を生成（UI/Excel共通）
 * フォーマット: 【顧客名】　案件名（担当者名）　1,234,567円
 * ※全角スペース(\u3000)区切り
 */
export function formatEntryDisplay(entry: Entry): string {
    const c = entry.customerName;
    const p = entry.projectName;
    const o = entry.ownerName;
    const n = formatAmount(entry.amount);
    return `【${c}様】\u3000${p}（${o}様）\u3000${n}円`;
}

/**
 * ISO日時文字列を「YYYY-MM-DD HH:mm:ss」形式に変換
 */
export function formatDateTime(isoString: string): string {
    const d = new Date(isoString);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

/**
 * 現在日時を「YYYYMMDD_HHmmss」形式で返す（ファイル名用）
 */
export function getTimestamp(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}${mm}${dd}_${hh}${mi}${ss}`;
}
