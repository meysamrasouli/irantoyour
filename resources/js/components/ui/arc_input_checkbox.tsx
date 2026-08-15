import * as React from "react";

//==================================================| Types
interface ArcCheckboxPropsInterface {
    value: boolean;
    setValue: (value: boolean) => void;
    type?: 'normal' | 'small';
    required?: boolean;
    disabled?: boolean;
}

/**
 * @example
 * <ArcCheckbox value={agreed} setValue={setAgreed} required />
 */
export default function ArcCheckbox({ value, setValue, type = 'normal', required = false, disabled = false }: ArcCheckboxPropsInterface) {
    const className = [
        'arc-input-checkbox',
        'checkbox-' + type,
        required ? 'required' : '',
        disabled ? 'disabled' : '',
    ].filter(Boolean).join(' ');

    return (
        <div className={className}>
            <input
                type="checkbox"
                value="1"
                checked={value}
                onChange={(e) => setValue(e.target.checked)}
                required={required}
                disabled={disabled}
            />
            <span></span>
            <span></span>
        </div>
    );
}
