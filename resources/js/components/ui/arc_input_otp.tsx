import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { convertToEnglishDigits } from "@/shared/utils/convertUtils";

//==================================================| Types
interface ArcOtpInputPropsInterface {
    inputCount: number;
    value?: string;
    setValue: (value: string) => void;
    onComplete?: (value: string) => void;// when all the inputs are filled, it is called
    disabled?: boolean;
    ariaLabel?: string;// it's for screen readers
}

/**
 * empty all inputs except the first one
 */
function clampOutput(output: string[]): string[] {
    const result = [...output];
    let sawEmpty = false;
    for (let i = 0; i < result.length; i++) {
        if (sawEmpty) result[i] = '';
        else if (result[i] === '') sawEmpty = true;
    }
    return result;
}

/**
 * @example
 * <ArcOtpInput
 *     inputCount={6}
 *     setValue={setOtp}
 *     onComplete={(code) => formSubmit(...)}
 * />
 */
export default function ArcOtpInput({ inputCount, value, setValue, onComplete, disabled = false, ariaLabel = 'کد تایید' }: ArcOtpInputPropsInterface) {
    const [output, setOutput] = useState<string[]>(() => Array(inputCount).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const focusIndexRef = useRef<number | null>(null);
    const setValueRef = useRef(setValue);
    const onCompleteRef = useRef(onComplete);
    setValueRef.current = setValue;
    onCompleteRef.current = onComplete;

    // focus on the first input
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    //
    useEffect(() => {
        if (focusIndexRef.current !== null) {
            inputRefs.current[focusIndexRef.current]?.focus();
            focusIndexRef.current = null;
        }
    }, [output]);

    // check onComplete
    useEffect(() => {
        const joined = output.join('');
        setValueRef.current(joined);
        if (output.every((digit) => digit !== '')) {
            onCompleteRef.current?.(joined);
        }
    }, [output]);

    // reset the inputs - watch on value
    useEffect(() => {
        if (value === undefined) return;
        if (value.length > inputCount) return;

        const chars = value.split('');
        const next = clampOutput(Array.from({ length: inputCount }, (_, i) => chars[i] ?? ''));
        setOutput(next);

        const firstEmpty = next.findIndex((digit) => digit === '');
        focusIndexRef.current = firstEmpty === -1 ? inputCount - 1 : firstEmpty;
    }, [value, inputCount]);

    const firstEmptyIndex = output.findIndex((digit) => digit === '');
    const enabledCount = firstEmptyIndex === -1 ? inputCount : firstEmptyIndex + 1;

    const applyChange = (index: number, digit: string) => {
        setOutput((prev) => clampOutput(prev.map((v, i) => (i === index ? digit : v))));
    };

    //==================================================| Events
    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const raw = convertToEnglishDigits(e.target.value).replace(/\D/g, '');

        if (raw.length === 0) {
            applyChange(index, '');
            return;
        }
        if (raw.length === 1) {
            applyChange(index, raw);
            if (index < inputCount - 1) focusIndexRef.current = index + 1;
            return;
        }

        // autofill mobile
        const chars = raw.slice(0, inputCount).split('');
        setOutput(Array.from({ length: inputCount }, (_, i) => chars[i] ?? ''));
        focusIndexRef.current = Math.min(chars.length, inputCount - 1);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && output[index] === '' && index > 0) {
            e.preventDefault();
            applyChange(index - 1, '');
            focusIndexRef.current = index - 1;
        } else if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < inputCount - 1) {
            e.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }
    };

    const onPaste = (e: React.ClipboardEvent<HTMLUListElement>) => {
        e.preventDefault();

        const pasteData = e.clipboardData.getData('text').trim();
        const filtered = convertToEnglishDigits(pasteData).replace(/\D/g, '');
        if (filtered.length === 0) return;

        const chars = filtered.slice(0, inputCount).split('');
        setOutput(Array.from({ length: inputCount }, (_, i) => chars[i] ?? ''));
        focusIndexRef.current = Math.min(chars.length, inputCount - 1);
    };

    return (
        <ul
            className="arc-input-otp"
            role="group"
            aria-label={ariaLabel}
            onPaste={onPaste}
        >
            {output.map((digit, index) => (
                <li className={`${(index+1 === enabledCount) && 'active'}`} key={index}>
                    <input
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete={index === 0 ? 'one-time-code' : 'off'} // mobile sms autofill
                        maxLength={1}
                        value={digit}
                        placeholder="_"
                        disabled={disabled || index >= enabledCount}
                        aria-label={`رقم ${index + 1} از ${inputCount}`}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => onChangeInput(e, index)}
                        onKeyDown={(e) => onKeyDown(e, index)}
                    />
                </li>
            ))}
        </ul>
    );
}
