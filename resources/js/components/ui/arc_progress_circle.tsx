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
interface ProgressCircleSizeInterface {
    circle: number;
    stroke: number;
    fontSize: number;
}

interface ArcProgressCircleProps {
    value: number;
    max: number;
    textType?: ProgressTextType;
    colorType?: ProgressColorType;
    color?: Partial<ProgressColorInterface>;
    size?: Partial<ProgressCircleSizeInterface>;
    text?: string;
    ariaLabel?: string;
}

const DEFAULT_COLOR: ProgressColorInterface = {
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
    const mergedColor: ProgressColorInterface = { ...DEFAULT_COLOR, ...color };
    const mergedSize: ProgressCircleSizeInterface = { ...DEFAULT_SIZE, ...size };

    const percentage = getProgressPercentage(value, max);
    const strokeDashoffset = CIRCUMFERENCE * (1 - percentage / 100);
    const currentProgressText = getProgressText(textType, percentage, value, text);
    const progressColor = getProgressColor(colorType, percentage, mergedColor.progress);
    const ariaValueNow = getProgressAriaValueNow(value, max);

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

                {textType !== 'none' && (
                    <foreignObject x="15" y="20" width="70" height="60">
                        <div
                            className="svg-text-content"
                            style={{ fontSize: `${mergedSize.fontSize}px`, color: mergedColor.text }}
                        >
                            {currentProgressText}
                        </div>
                    </foreignObject>
                )}
            </svg>
        </div>
    );
}
