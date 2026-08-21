import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

/**
 * @function convertToEnglishDigits
 * @param value
 * @return {string}
 */
export function convertToEnglishDigits(value: string | number): string {
    if (value === null || value === undefined) return ''

    const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
    const arabicDigits = '٠١٢٣٤٥٦٧٨٩'

    return String(value).replace(/[۰-۹٠-٩]/g, (digit) => {
        const persianIndex = persianDigits.indexOf(digit)
        if (persianIndex !== -1) return String(persianIndex)

        const arabicIndex = arabicDigits.indexOf(digit)
        if (arabicIndex !== -1) return String(arabicIndex)

        return digit
    })
}
/**
 * @function convertToPersianDigits
 * @param value
 * @return {string}
 */
export function convertToPersianDigits(value: string | number): string {
    if (value === null || value === undefined) return ''

    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    return String(value).replace(/[0-9]/g, (digit) => persianDigits[Number(digit)])
}

export function convertDecimalToInt(value: number, digits: number): number {
    return Math.trunc(value * 10 ** digits);
}
export function convertIntToDecimal(value: number, digits: number): number {
    return Number((value / 10 ** digits).toFixed(digits));
}

/**
 * @function convertToPersianDate
 * @param {string | Date} date - تاریخ میلادی (مثلاً '2026-08-13')
 * @param {string} format - فرمت خروجی (پیش‌فرض: 'YYYY/MM/DD')
 */
export const convertToPersianDate = (date: string | Date, format: string = "YYYY/MM/DD"): string => {
    if (!date) return "";
    try {
        const dateObject = new DateObject(date);
        return dateObject.convert(persian, persian_fa).format(format);
    } catch (error) {
        console.error("Gregorian to Persian error:", error);
        return String(date);
    }
};

/**
 * @function convertToGregorianDate
 * @param {string} persianDateStr - تاریخ شمسی (مثلاً '1405/05/22' یا '1405-05-22')
 * @param {string} format - فرمت خروجی میلادی (پیش‌فرض: 'YYYY-MM-DD')
 */
export const convertToGregorianDate = (persianDateStr: string, format: string = "YYYY-MM-DD"): string => {
    if (!persianDateStr) return "";
    try {
        const dateObject = new DateObject({date: persianDateStr, calendar: persian, locale: persian_fa});
        return dateObject.convert(gregorian, gregorian_en).format(format);
    } catch (error) {
        console.error("Persian to Gregorian error:", error);
        return persianDateStr;
    }
};


/**
 * @function FormatNumber - جداکننده هزارگان
 * @param value
 * @return {string}
 */
export function FormatNumber(value: string | number): string {
    const englishValue = convertToEnglishDigits(value)
    const numericValue = Number(englishValue)
    if (isNaN(numericValue)) return String(value)
    return numericValue.toLocaleString('en-US')

    //return parseInt(String(price)).toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
}
