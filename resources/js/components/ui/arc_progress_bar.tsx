import * as React from "react";
import {
    ProgressColorInterface,
    ProgressColorType,
    ProgressTextType,
    getProgressAriaValueNow,
    getProgressColor,
    getProgressPercentage,
    getProgressText,
} from "@/shared/utils/progressUtils";

//==================================================| Types
interface ProgressBarSizeInterface {
    height: number;
    fontSize: number;
}

interface ArcProgressBarProps {
    value: number;
    max: number;
    textType?: ProgressTextType;
    colorType?: ProgressColorType;
    color?: Partial<ProgressColorInterface>;
    size?: Partial<ProgressBarSizeInterface>;
    text?: string;
    title?: string;
    ariaLabel?: string;
}

const DEFAULT_COLOR: ProgressColorInterface = {
    background: '#e0e0e0',
    progress: '#4CAF50',
    text: '#1a1a1a',
};
const DEFAULT_SIZE: ProgressBarSizeInterface = {
    height: 5,
    fontSize: 12,
};

/**
 * نسخه‌ی خطی arc_progressCircle — برای جاهایی که فضای افقی باریک (مثل نمایش مدت‌زمان
 * باقی‌مانده‌ی اشتراک یا آگهی توی یک ردیف) مناسب‌تر از دایره است. منطق محاسبه‌ی درصد/متن/رنگ
 * دقیقاً با نسخه‌ی دایره‌ای مشترک است (از shared/utils/progressUtils).
 *
 * @example
 * <ArcProgressBar value={7} max={10} textType="percent" />
 * <ArcProgressBar value={45} max={90} textType="text" text="۴۵ روز مانده" colorType="progress" />
 * <ArcProgressBar value={45} max={90} title="اشتراک طلایی" textType="text" text="۴۵ روز مانده" />
 */
export default function ArcProgressBar({
                                            value,
                                            max,
                                            textType = 'percent',
                                            colorType = 'fix',
                                            color,
                                            size,
                                            text = '',
                                            title,
                                            ariaLabel = 'میزان پیشرفت',
                                        }: ArcProgressBarProps) {
    const mergedColor: ProgressColorInterface = { ...DEFAULT_COLOR, ...color };
    const mergedSize: ProgressBarSizeInterface = { ...DEFAULT_SIZE, ...size };

    const percentage = getProgressPercentage(value, max);
    const currentProgressText = getProgressText(textType, percentage, value, text);
    const progressColor = getProgressColor(colorType, percentage, mergedColor.progress);
    const ariaValueNow = getProgressAriaValueNow(value, max);

    return (
        <div
            className="progress-bar-container"
            role="progressbar"
            aria-label={ariaLabel}
            aria-valuenow={ariaValueNow}
            aria-valuemin={0}
            aria-valuemax={max}
        >
            {(title || textType !== 'none') && (
                <div className="progress-bar-text" style={{ fontSize: `${mergedSize.fontSize}px`, color: mergedColor.text }}>
                    {title && <span className="progress-bar-title">{title}</span>}
                    {textType !== 'none' && <span className="progress-bar-value-text">{currentProgressText}</span>}
                </div>
            )}

            <div className="progress-bar-track" style={{ height: `${mergedSize.height}px`, backgroundColor: mergedColor.background }}>
                <div
                    className="progress-bar-value"
                    style={{ width: `${percentage}%`, backgroundColor: progressColor }}
                />
            </div>
        </div>
    );
}
