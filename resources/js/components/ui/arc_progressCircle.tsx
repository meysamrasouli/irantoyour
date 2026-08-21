import * as React from "react";

//==================================================| Types
interface ProgressCircleColorInterface {
    background: string;
    progress: string;
    text: string;
}
interface ProgressCircleSizeInterface {
    circle: number;
    stroke: number;
    fontSize: number;
}
type ProgressCircleTextType = 'percent' | 'text' | 'value';
type ProgressCircleColorType = 'fix' | 'progress';

interface ArcProgressCircleProps {
    value: number;
    max: number;
    textType?: ProgressCircleTextType;
    colorType?: ProgressCircleColorType;
    color?: Partial<ProgressCircleColorInterface>;
    size?: Partial<ProgressCircleSizeInterface>;
    text?: string;
    ariaLabel?: string;
}

const DEFAULT_COLOR: ProgressCircleColorInterface = {
    background: '#e0e0e0',
    progress: '#4CAF50',
    text: '#fff',
};
const DEFAULT_SIZE: ProgressCircleSizeInterface = {
    circle: 100,
    stroke: 10,
    fontSize: 16,
};
const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

//==================================================| Pure helpers
function getProgressText(textType: ProgressCircleTextType, percentage: number, value: number, text: string): string {
    switch (textType) {
        case 'percent':
            return `${Math.round(percentage)}%`;
        case 'value':
            return String(value);
        case 'text':
            return text;
        default:
            console.error(`arc-progress-circle: invalid textType: ${textType}`);
            return '';
    }
}

function getProgressColor(colorType: ProgressCircleColorType, percentage: number, fixedColor: string): string {
    switch (colorType) {
        case 'fix':
            return fixedColor;
        case 'progress': {
            const r = Math.max(0, Math.min(255, Math.round(255 * (1 - percentage / 100))));
            const g = Math.max(0, Math.min(255, Math.round(255 * (percentage / 100))));
            return `rgb(${r}, ${g}, 0)`;
        }
        default:
            console.error(`arc-progress-circle: invalid colorType: ${colorType}`);
            return fixedColor;
    }
}

/**
 * @example
 * <ArcProgressCircle value={7} max={10} textType="percent" />
 * <ArcProgressCircle value={7} max={10} textType="value" size={{ circle: 60 }} />
 */
export default function ArcProgressCircle({
                                              value,
                                              max,
                                              textType = 'percent',
                                              colorType = 'fix',
                                              color,
                                              size,
                                              text = '',
                                              ariaLabel = 'میزان پیشرفت',
                                          }: ArcProgressCircleProps) {
    const mergedColor: ProgressCircleColorInterface = { ...DEFAULT_COLOR, ...color };
    const mergedSize: ProgressCircleSizeInterface = { ...DEFAULT_SIZE, ...size };

    const percentage = max === 0 ? 0 : Math.min(Math.max((value / max) * 100, 0), 100);
    const strokeDashoffset = CIRCUMFERENCE * (1 - percentage / 100);
    const currentProgressText = getProgressText(textType, percentage, value, text);
    const progressColor = getProgressColor(colorType, percentage, mergedColor.progress);

    const ariaValueNow = Math.min(Math.max(value, 0), max);

    return (
        <div className="progress-circle-container">
            <svg
                width={mergedSize.circle}
                height={mergedSize.circle}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                role="progressbar"
                aria-label={ariaLabel}
                aria-valuenow={ariaValueNow}
                aria-valuemin={0}
                aria-valuemax={max}
            >
                {/* Background Circle */}
                <circle cx="50" cy="50" r={RADIUS} fill="none" stroke={mergedColor.background} strokeWidth={mergedSize.stroke} />

                {/* Progress Circle */}
                <circle
                    className="progress-circle-value"
                    cx="50"
                    cy="50"
                    r={RADIUS}
                    fill="none"
                    stroke={progressColor}
                    strokeWidth={mergedSize.stroke}
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 50 50)"
                />

                <foreignObject x="15" y="20" width="70" height="60">
                    <div
                        className="svg-text-content"
                        style={{ fontSize: `${mergedSize.fontSize}px`, color: mergedColor.text }}
                    >
                        {currentProgressText}
                    </div>
                </foreignObject>
            </svg>
        </div>
    );
}
