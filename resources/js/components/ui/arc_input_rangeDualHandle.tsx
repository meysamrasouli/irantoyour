import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormatNumber, convertDecimalToInt, convertIntToDecimal } from "@/shared/utils/convertUtils";

//==================================================| Types
interface DualRangeSliderTextInterface {
    title?: string;
    value?: string; // prepend text
    button?: string;
}
type EmitsOptionsType = 'delay' | 'button';

interface ArcRangeSliderDualPropsInterface {
    value: [number, number]; // [min, max]
    setValue: (value: [number, number]) => void;
    range: [number, number];
    rangeDecimalDigits?: number;
    step?: number;
    minGap?: number; // min gap between two handles
    text?: DualRangeSliderTextInterface;
    emitsOptions?: EmitsOptionsType;
    delaySeconds?: number;
}

const TRACK_COLOR_ACTIVE = '#dadada';
const TRACK_COLOR_INACTIVE = '#f3f3f3';

/**
 * @example
 * <ArcRangeSliderDual
 *     value={[minPrice, maxPrice]}
 *     setValue={([min, max]) => { setMinPrice(min); setMaxPrice(max) }}
 *     range={[0, 5000000]}
 *     text={{ title: 'بازه قیمت', value: 'تومان' }}
 * />
 */
export default function ArcRangeSliderDual({
                                               value,
                                               setValue,
                                               range,
                                               rangeDecimalDigits = 0,
                                               step = 1,
                                               minGap = 1,
                                               text,
                                               emitsOptions = 'delay',
                                               delaySeconds = 0.5,
                                           }: ArcRangeSliderDualPropsInterface) {
    const trackRef = useRef<HTMLDivElement>(null);
    const delayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // validation
    if (!Number.isFinite(step) || step <= 0) {
        console.error(`arc-range-slider-dual: invalid step: ${step}`);
        step = 1;
    }
    let [rangeMin, rangeMax] = range;
    if (rangeMin >= rangeMax) {
        console.error(`arc-range-slider-dual: invalid range: [${range[0]}, ${range[1]}]`);
        [rangeMin, rangeMax] = rangeMin > rangeMax ? [rangeMax, rangeMin] : [rangeMin, rangeMin + 1];
    }

    // range adjustment
    const sliderRange = useMemo<[number, number]>(() => {
        if (rangeDecimalDigits === 0) return [Math.trunc(rangeMin), Math.trunc(rangeMax)];
        return [convertDecimalToInt(rangeMin, rangeDecimalDigits), convertDecimalToInt(rangeMax, rangeDecimalDigits)];
    }, [rangeMin, rangeMax, rangeDecimalDigits]);

    // اگه minGap بزرگ‌تر یا مساوی کل بازه باشه، دو دستگیره هیچ‌وقت نمی‌تونن به تعادل برسن و قفل می‌کنن
    if (minGap >= sliderRange[1] - sliderRange[0]) {
        console.error(`arc-range-slider-dual: minGap (${minGap}) is too large for the given range`);
        minGap = Math.max(1, Math.floor((sliderRange[1] - sliderRange[0]) / 2));
    }

    const [sliderMin, setSliderMin] = useState<number>(() =>
        Array.isArray(value) && value.length === 2
            ? (rangeDecimalDigits === 0 ? Math.trunc(value[0]) : convertDecimalToInt(value[0], rangeDecimalDigits))
            : sliderRange[0]
    );
    const [sliderMax, setSliderMax] = useState<number>(() =>
        Array.isArray(value) && value.length === 2
            ? (rangeDecimalDigits === 0 ? Math.trunc(value[1]) : convertDecimalToInt(value[1], rangeDecimalDigits))
            : sliderRange[1]
    );

    // watch value
    useEffect(() => {
        if (!Array.isArray(value) || value.length !== 2) return;
        setSliderMin(rangeDecimalDigits === 0 ? Math.trunc(value[0]) : convertDecimalToInt(value[0], rangeDecimalDigits));
        setSliderMax(rangeDecimalDigits === 0 ? Math.trunc(value[1]) : convertDecimalToInt(value[1], rangeDecimalDigits));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value?.[0], value?.[1], rangeDecimalDigits]);

    // watch range
    const isFirstRangeEffect = useRef(true);
    useEffect(() => {
        if (isFirstRangeEffect.current) {
            isFirstRangeEffect.current = false;
            return;
        }
        setSliderMin(sliderRange[0]);
        setSliderMax(sliderRange[1]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rangeMin, rangeMax]);

    // slide track color
    const totalStep = Math.max(1, (sliderRange[1] - sliderRange[0]) / step);
    const percentPerStep = 100 / totalStep;

    useEffect(() => {
        if (!trackRef.current) return;
        const percentMin = ((sliderMin - sliderRange[0]) / step) * percentPerStep;
        const percentMax = ((sliderMax - sliderRange[0]) / step) * percentPerStep;

        trackRef.current.style.background =
            `linear-gradient(to right, ${TRACK_COLOR_INACTIVE} ${percentMin}%, ${TRACK_COLOR_ACTIVE} ${percentMin}%, ${TRACK_COLOR_ACTIVE} ${percentMax}%, ${TRACK_COLOR_INACTIVE} ${percentMax}%)`;
    }, [sliderMin, sliderMax, sliderRange, step, percentPerStep]);

    //==================================================| Function
    const outputStage = (min: number, max: number) => {
        const output: [number, number] = rangeDecimalDigits === 0
            ? [min, max]
            : [convertIntToDecimal(min, rangeDecimalDigits), convertIntToDecimal(max, rangeDecimalDigits)];

        if (emitsOptions === 'delay') {
            if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
            delayTimeoutRef.current = setTimeout(() => {
                setValue(output);
                delayTimeoutRef.current = null;
            }, delaySeconds * 1000);
        }

        if (emitsOptions === 'button') {
            setValue(output);
        }
    };

    //==================================================| Events
    const onChangeSlider = (which: 'min' | 'max', rawValue: number) => {
        let newMin = which === 'min' ? rawValue : sliderMin;
        let newMax = which === 'max' ? rawValue : sliderMax;

        if (newMax - newMin <= minGap) {
            if (which === 'min') newMin = newMax - minGap;
            if (which === 'max') newMax = newMin + minGap;
        }

        setSliderMin(newMin);
        setSliderMax(newMax);
        outputStage(newMin, newMax);
    };

    const onClickSubmit = () => {
        outputStage(sliderMin, sliderMax);
    };

    const onClickTrack = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!trackRef.current) return;

        const trackWidth = trackRef.current.offsetWidth;
        const oneStepInPx = trackWidth / (sliderRange[1] - sliderRange[0]);
        const percentInPx = oneStepInPx / percentPerStep;

        const trackLeft = Math.round(trackRef.current.getBoundingClientRect().left);
        const moveDiff = e.clientX - trackLeft;
        const moveInPercent = moveDiff / percentInPx;

        if (moveInPercent < 1 || moveInPercent > 100) return;

        const clickedValue = Math.round(moveInPercent / percentPerStep) * step + sliderRange[0];

        // دستگیره‌ای که به مقدار کلیک‌شده نزدیک‌تره حرکت می‌کنه
        const diffMin = Math.abs(sliderMin - clickedValue);
        const diffMax = Math.abs(sliderMax - clickedValue);

        if (diffMin <= diffMax) {
            onChangeSlider('min', clickedValue);
        } else {
            onChangeSlider('max', clickedValue);
        }
    };

    const displayMin = rangeDecimalDigits === 0 ? FormatNumber(sliderMin) : convertIntToDecimal(sliderMin, rangeDecimalDigits);
    const displayMax = rangeDecimalDigits === 0 ? FormatNumber(sliderMax) : convertIntToDecimal(sliderMax, rangeDecimalDigits);

    return (
        <div className="arc-input-range-dh">
            {text?.title && <div className="title">{text.title}</div>}

            <div className="range">
                <div><span>{displayMax}</span> {text?.value}</div>
                <div><span>{displayMin}</span> {text?.value}</div>
            </div>

            <div className="sliders">
                <div ref={trackRef} className="slider-track" onClick={onClickTrack} />

                <input
                    type="range"
                    className="max"
                    min={sliderRange[0]}
                    max={sliderRange[1]}
                    step={step}
                    value={sliderMax}
                    aria-label={text?.title ? `${text.title} - حداکثر` : 'حداکثر'}
                    onChange={(e) => onChangeSlider('max', parseInt(e.target.value, 10))}
                />
                <input
                    type="range"
                    className="min"
                    min={sliderRange[0]}
                    max={sliderRange[1]}
                    step={step}
                    value={sliderMin}
                    aria-label={text?.title ? `${text.title} - حداقل` : 'حداقل'}
                    onChange={(e) => onChangeSlider('min', parseInt(e.target.value, 10))}
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
