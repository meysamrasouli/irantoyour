//==================================================| Types
export interface ProgressColorInterface {
    background: string;
    progress: string;
    text: string;
}
export type ProgressTextType = 'percent' | 'value' | 'text' | 'none';
export type ProgressColorType = 'fix' | 'progress';

//==================================================| Helpers
// منطق مشترک بین arc_progressCircle و arc_progress_bar — اینجا یک‌جا نگه داشته می‌شود
// که رفتار دو کامپوننت (محاسبه‌ی درصد، متن، رنگ) هیچ‌وقت از هم جدا نیفتد.

export function getProgressPercentage(value: number, max: number): number {
    if (max === 0) return 0;
    return Math.min(Math.max((value / max) * 100, 0), 100);
}

export function getProgressAriaValueNow(value: number, max: number): number {
    return Math.min(Math.max(value, 0), max);
}

export function getProgressText(textType: ProgressTextType, percentage: number, value: number, text: string): string {
    switch (textType) {
        case 'percent':
            return `${Math.round(percentage)}%`;
        case 'value':
            return String(value);
        case 'text':
            return text;
        case 'none':
            return '';
        default:
            console.error(`arc-progress: invalid textType: ${textType}`);
            return '';
    }
}

export function getProgressColor(colorType: ProgressColorType, percentage: number, fixedColor: string): string {
    switch (colorType) {
        case 'fix':
            return fixedColor;
        case 'progress': {
            const r = Math.max(0, Math.min(255, Math.round(255 * (1 - percentage / 100))));
            const g = Math.max(0, Math.min(255, Math.round(255 * (percentage / 100))));
            return `rgb(${r}, ${g}, 0)`;
        }
        default:
            console.error(`arc-progress: invalid colorType: ${colorType}`);
            return fixedColor;
    }
}
