// ===================================
// ファイル名サニタイズユーティリティ
// ===================================

/**
 * Windows禁止文字をアンダースコアに置換
 * 対象: \ / : * ? " < > |
 */
export function sanitizeFilename(name: string): string {
    return name.replace(/[\\/:*?"<>|]/g, '_');
}
