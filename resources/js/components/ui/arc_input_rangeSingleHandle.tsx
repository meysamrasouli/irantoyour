import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { convertDecimalToInt, convertIntToDecimal } from "@/shared/utils/convertUtils";

//==================================================| Types
interface RangeSliderTextInterface {
    title?: string;
    value?: true | { prefix?: string; suffix?: string };
    button?: string;
}
type EmitsOptionsType = 'change' | 'delay' | 'button';
type TriggerType = 'change' | 'click' | 'button';

interface ArcRangeSliderPropsInterface {
    value: number;
    setValue: (value: number) => void;
    range: [number, number]; // [min, max]
    rangeDecimalDigits?: number; // decimal numbers
    step?: number;
    tickCount?: number; // number of labels on the track
    text?: RangeSliderTextInterface;
    emitsOptions?: EmitsOptionsType;
    delaySeconds?: number; // مهلت قبل از ارسال در حالت 'delay' - پیش‌فرض 0.1
}

const TRACK_COLOR_ACTIVE = '#0e584d';
const TRACK_COLOR_INACTIVE = '#dadada';

/**
 * ArcRangeSlider
 *
 * @example
 * <ArcRangeSlider
 *     value={price}
 *     setValue={setPrice}
 *     range={[0, 5000000]}
 *     tickCount={5}
 *     text={{ title: 'قیمت', value: { suffix: 'تومان' } }}
 *     emitsOptions="delay"
 * />
 */
export default function ArcRangeSlider({
                                           value,
                                           setValue,
                                           range,
                                           rangeDecimalDigits = 0,
                                           step = 1,
                                           tickCount = 5,
                                           text,
                                           emitsOptions = 'change',
                                           delaySeconds = 0.1,
                                       }: ArcRangeSliderPropsInterface) {
    // validation
    if (!Number.isFinite(step) || step <= 0) {
        console.error(`arc-range-slider: invalid step: ${step} (باید عددی مثبت باشد)`);
        step = 1;
    }
    let [rangeMin, rangeMax] = range;
    if (rangeMin >= rangeMax) {
        console.error(`arc-range-slider: invalid range: [${range[0]}, ${range[1]}] (min باید کوچک‌تر از max باشد)`);
        [rangeMin, rangeMax] = rangeMin > rangeMax ? [rangeMax, rangeMin] : [rangeMin, rangeMin + 1];
    }

    const trackRef = useRef<HTMLUListElement>(null);
    const delayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // range adjustment
    const sliderRange = useMemo<[number, number]>(() => {
        if (rangeDecimalDigits === 0) return [Math.trunc(rangeMin), Math.trunc(rangeMax)];
        return [convertDecimalToInt(rangeMin, rangeDecimalDigits), convertDecimalToInt(rangeMax, rangeDecimalDigits)];
    }, [rangeMin, rangeMax, rangeDecimalDigits]);

    const totalStep = Math.max(1, (sliderRange[1] - sliderRange[0]) / step);
    const percentPerStep = 100 / totalStep;

    const [sliderInt, setSliderInt] = useState<number>(() =>
        value !== undefined && value !== null
            ? (rangeDecimalDigits === 0 ? Math.trunc(value) : convertDecimalToInt(value, rangeDecimalDigits))
            : sliderRange[0]
    );

    useEffect(() => {
        setSliderInt((prev) => {
            const source = value !== undefined && value !== null
                ? (rangeDecimalDigits === 0 ? Math.trunc(value) : convertDecimalToInt(value, rangeDecimalDigits))
                : prev;
            return Math.min(Math.max(source, sliderRange[0]), sliderRange[1]);
        });
    }, [value, rangeDecimalDigits, sliderRange]);

    // slide track color
    useEffect(() => {
        if (!trackRef.current) return;
        const percent = ((sliderInt - sliderRange[0]) / step) * percentPerStep;
        trackRef.current.style.background = `linear-gradient(to left, ${TRACK_COLOR_ACTIVE} ${percent}%, ${TRACK_COLOR_INACTIVE} ${percent}%)`;
    }, [sliderInt, sliderRange, step, percentPerStep]);

    // labels on the track
    const ticks = useMemo(() => {
        const count = Math.min(50, Math.max(2, tickCount));
        return Array.from({ length: count }, (_, i) => {
            const rawValue = sliderRange[0] + ((sliderRange[1] - sliderRange[0]) * i) / (count - 1);
            return Math.round(rawValue);
        });
    }, [sliderRange, tickCount]);

    const halfTickSpacing = (sliderRange[1] - sliderRange[0]) / (ticks.length - 1) / 2;

    //==================================================| Function
    const outputStage = (trigger: TriggerType, currentSliderInt: number) => {
        const output = rangeDecimalDigits === 0 ? currentSliderInt : convertIntToDecimal(currentSliderInt, rangeDecimalDigits);

        switch (emitsOptions) {
            case 'button':
                if (trigger === 'button') setValue(output);
                break;
            case 'change':
                if (trigger === 'change' || trigger === 'click') setValue(output);
                break;
            case 'delay':
                if (trigger === 'change' || trigger === 'click') {
                    if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
                    delayTimeoutRef.current = setTimeout(() => {
                        setValue(output);
                        delayTimeoutRef.current = null;
                    }, delaySeconds * 1000);
                }
                break;
        }
    };

    //==================================================| Events
    const onChangeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSliderInt = parseInt(e.target.value, 10);
        setSliderInt(newSliderInt);
        outputStage('change', newSliderInt); // مقدار تازه مستقیم پاس داده می‌شه، نه از state (که هنوز آپدیت نشده) خونده بشه
    };

    const onClickSubmit = () => {
        outputStage('button', sliderInt);
    };

    const onClickTrack = (e: React.MouseEvent<HTMLUListElement>) => {
        e.stopPropagation();
        if (!trackRef.current) return;

        const trackWidth = trackRef.current.offsetWidth;
        const oneStepInPx = trackWidth / (sliderRange[1] - sliderRange[0]);
        const percentInPx = oneStepInPx / percentPerStep;

        const trackRight = Math.round(trackRef.current.getBoundingClientRect().right);
        const moveDiff = trackRight - e.clientX;
        const moveInPercent = moveDiff / percentInPx;

        if (moveInPercent < 1 || moveInPercent > 100) return;

        const newSliderInt = Math.round(moveInPercent / percentPerStep) * step + sliderRange[0];
        setSliderInt(newSliderInt);
        outputStage('click', newSliderInt);
    };

    return (
        <div className="arc-input-range-single-handle">
            {text?.title && <div className="title">{text.title}</div>}

            <div className="slider">
                <ul className="slider-track" ref={trackRef} onClick={onClickTrack}>
                    {ticks.map((tickValue, index) => {
                        const isActive = Math.abs(tickValue - sliderInt) <= halfTickSpacing;
                        const textValueConfig = text?.value && text.value !== true ? text.value : null; // یک‌بار محاسبه، به‌جای دوبار تکرار همون شرط

                        return (
                            <li key={index} className={isActive ? 'active' : undefined}>
                                {text?.value && (
                                    <span data-prefix={textValueConfig?.prefix ?? ''} data-suffix={textValueConfig?.suffix ?? ''}>
                                        {rangeDecimalDigits === 0 ? tickValue : convertIntToDecimal(tickValue, rangeDecimalDigits)}
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <input
                    type="range"
                    className="max"
                    step={step}
                    min={sliderRange[0]}
                    max={sliderRange[1]}
                    value={sliderInt}
                    aria-label={text?.title}
                    onChange={onChangeSlider}
                />
            </div>

            {emitsOptions === 'button' && text?.button && (
                <button type="button" className="custom-button-theme" onClick={onClickSubmit}>
                    {text.button}
                </button>
            )}
        </div>
    );
}
