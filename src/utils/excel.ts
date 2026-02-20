// ===================================
// Excel(.xlsx)生成・ダウンロードユーティリティ
// ===================================

import * as XLSX from 'xlsx';
import type { Entry } from '../types';
import { formatEntryDisplay, formatDateTime } from './format';
import { sanitizeFilename } from './sanitize';
import { getTimestamp } from './format';

/**
 * エントリ配列からExcel(.xlsx)ファイルを生成しダウンロードする
 * @param entries エントリ配列
 * @param baseFilename ベースファイル名（未指定時は「案件リスト」）
 */
export function generateExcel(entries: Entry[], baseFilename: string): void {
    // ベースファイル名のフォールバック
    const baseName = baseFilename.trim() || '案件リスト';

    // ヘッダー行
    const header = ['No', '顧客名', '案件名', '担当者', '金額', '登録日時', 'マージ表示'];

    // データ行の作成
    const dataRows = entries.map((entry, index) => [
        index + 1,
        entry.customerName,
        entry.projectName,
        entry.ownerName,
        entry.amount,
        formatDateTime(entry.createdAt),
        formatEntryDisplay(entry),
    ]);

    // ワークシート作成
    const ws = XLSX.utils.aoa_to_sheet([header, ...dataRows]);

    // 金額列（E列 = インデックス4）に数値書式を設定
    if (ws['!ref']) {
        const range = XLSX.utils.decode_range(ws['!ref']);
        // データ行は2行目から（インデックス1〜）
        for (let r = 1; r <= range.e.r; r++) {
            const cellRef = XLSX.utils.encode_cell({ c: 4, r });
            const cell = ws[cellRef];
            if (cell && cell.t === 'n') {
                cell.z = '#,##0';
            }
        }
    }

    // 列幅の設定
    ws['!cols'] = [
        { wch: 5 },  // No
        { wch: 20 }, // 顧客名
        { wch: 30 }, // 案件名
        { wch: 15 }, // 担当者
        { wch: 15 }, // 金額
        { wch: 20 }, // 登録日時
        { wch: 60 }, // マージ表示
    ];

    // ワークブック作成
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Entries');

    // ファイル名にタイムスタンプを付与してサニタイズ
    const timestamp = getTimestamp();
    const filename = `${sanitizeFilename(baseName)}_${timestamp}.xlsx`;

    // ダウンロード実行
    XLSX.writeFile(wb, filename);
}
