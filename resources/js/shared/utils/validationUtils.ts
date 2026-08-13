import { convertToEnglishDigits } from './convertUtils'

/**
 * validate(data, { integer:"" , integer_limit:{ min:1, max:5 } })
 * */

//==================================================| Types |==================================================\\
export type ValidationConditionNameType =
    | 'notEmpty' | 'notEmpty_array' | 'notEmpty_object'
    | 'string' | 'string_fa'
    | 'length_min' | 'length_fix' | 'length_max' | 'length_limit'
    | 'integer' | 'integer_min' | 'integer_max' | 'integer_limit'
    | 'float'
    | 'mobile' | 'national_code' | 'postal_code' | 'email' | 'license_plate'
    | 'file_empty' | 'file_type' | 'file_size'

// شرط می‌تواند یک اسم ساده باشد، یک اسم با پسوند "!" (نقیض شرط)، یا یک آبجکت شامل پارامتر
export type ValidationConditionType =
    | ValidationConditionNameType
    | `${ValidationConditionNameType}!`
    | Partial<Record<ValidationConditionNameType, any>>

interface LengthLimitParamInterface {
    min?: number
    max?: number
}
interface IntegerLimitParamInterface {
    min: number
    max: number
}
interface LicensePlateCarParamInterface {
    alpha: string
    iran: string
    two: string
    three: string
}
interface LicensePlateMotorcycleParamInterface {
    three: string
    five: string
}
interface FileInputLikeInterface {
    value: string
    files: FileList | File[]
}

//==================================================| Error messages |==================================================\\
export const validateErrorMessages = {
    notEmpty: () => 'لطفا جای خالی را پر کنید',
    string: () => 'فقط حروف وارد کنید',
    string_fa: () => 'فقط حروف فارسی وارد کنید',
    length_min: (min: number) => `کاراکترهای وارد شده باید بیشتر از ${min} باشد`,
    length_fix: (fix: number) => `کاراکترهای وارد شده باید دقیقا ${fix} باشد`,
    length_max: (max: number) => `کاراکترهای وارد شده باید کمتر از ${max} باشد`,
    length_limit: (min?: number, max?: number) => `کاراکترهای وارد شده باید بین ${min} و ${max} باشد`,
    integer: () => 'فقط عدد وارد کنید',
    integer_min: (min: number) => `عدد وارد شده باید بزرگتر از ${min} باشد`,
    integer_max: (max: number) => `عدد وارد شده باید کوچکتر از ${max} باشد`,
    integer_limit: (min: number, max: number) => `عدد وارد شده باید بین ${min} و ${max} باشد`,
    float: () => 'فقط عدد اعشاری وارد کنید',
    mobile: () => 'شماره همراه صحیح نمی‌باشد',
    national_code: () => 'کد ملی صحیح نمی‌باشد',
    postal_code: () => 'کد پستی صحیح نمی‌باشد',
    email: () => 'ایمیل صحیح نمی‌باشد',
    license_plate: () => 'پلاک وسیله نقلیه صحیح نمی‌باشد',

    file_empty: () => 'فایلی آپلود نشد',
    file_type: () => 'فرمت فایل آپلود شده درست نیست',
    file_size: (size: number) => `حجم فایل مورد نظر بیشتر از ${size} کیلوبایت می‌باشد`,
}

//==================================================| Function |==================================================\\
/**
 * validate data against given conditions
 * @function validate
 * @param data - مقدار مورد بررسی
 * @param conditions - آرایه شرایط اعتبارسنجی
 * @param errorMessageStatus - false: خروجی boolean | true: خروجی متن پیام خطا
 * @param customError - پیام خطای دلخواه (در صورت وجود، جایگزین پیام پیش‌فرض می‌شود)
 */
export function validate(data: any, conditions: ValidationConditionType[], errorMessageStatus?: false, customError?: string): boolean
export function validate(data: any, conditions: ValidationConditionType[], errorMessageStatus: true, customError?: string): string
export function validate(
    data: any,
    conditions: ValidationConditionType[],
    errorMessageStatus: boolean = false,
    customError: string = ''
): boolean | string {
    let error = false
    let errorMessage = ''

    for (const item of conditions) {
        let conditionName: string | null = null
        let conditionParam: any = null

        if (typeof item === 'string') {
            conditionName = item
        } else if (typeof item === 'object' && item !== null) {
            conditionName = Object.keys(item)[0]
            conditionParam = Object.values(item)[0]
        }
        if (!conditionName) continue

        const baseName = conditionName.endsWith('!') ? conditionName.slice(0, -1) : conditionName

        switch (baseName as ValidationConditionNameType) {
            //==================================================| INPUT
            //--------------------------------------------------| notEmpty
            /** check for notEmpty input (true: not empty | false: empty)
             * ['empty']
             */
            case 'notEmpty':
                error = data === undefined || data === null || String(data) === ''
                errorMessage = validateErrorMessages.notEmpty()
                break

            //--------------------------------------------------| notEmpty array
            /** check for empty input (true: not empty | false: empty)
             * ['notEmpty_array']
             */
            case 'notEmpty_array':
                error = data === undefined || data === null || !Array.isArray(data) || data.length === 0
                errorMessage = validateErrorMessages.notEmpty()
                break

            //--------------------------------------------------| notEmpty object
            /** check for empty objects (true: not empty | false: empty)
             * ['notEmpty_object']
             */
            case 'notEmpty_object':
                error = data === undefined || data === null || Object.keys(data).length === 0
                errorMessage = validateErrorMessages.notEmpty()
                break

            //--------------------------------------------------| string
            /** ONLY letters (true: valid | false: NOT valid)
             * ['string']
             */
            case 'string':
                error = validate(data, ['notEmpty']) && !/^[a-zA-Zا-ی ]*$/.test(data)
                errorMessage = validateErrorMessages.string()
                break

            //--------------------------------------------------| String farsi
            /** ONLY Persian letters (true: valid | false: NOT valid)
             * ['string_fa']
             */
            case 'string_fa':
                error = validate(data, ['notEmpty']) && !/^[\u0600-\u06FF\s]+$/.test(data)
                errorMessage = validateErrorMessages.string_fa()
                break

            //--------------------------------------------------| MIN length
            /** minimum string length (true: valid | false: NOT valid)
             * [{length_min: minValue}]
             */
            case 'length_min':
                error = validate(data, ['notEmpty']) && String(data).length < conditionParam
                errorMessage = validateErrorMessages.length_min(conditionParam)
                break

            //--------------------------------------------------| Fix length
            /** fix String length (true: valid | false: NOT valid)
             * [{length_fix: fixValue}]
             */
            case 'length_fix':
                error = validate(data, ['notEmpty']) && String(data).length !== conditionParam
                errorMessage = validateErrorMessages.length_fix(conditionParam)
                break

            //--------------------------------------------------| MAX length
            /** maximum string length (true: valid | false: NOT valid)
             * [{length_max: maxValue}]
             */
            case 'length_max':
                error = validate(data, ['notEmpty']) && String(data).length > conditionParam
                errorMessage = validateErrorMessages.length_max(conditionParam)
                break

            //--------------------------------------------------| Limit string length
            /** limit string length (true: valid | false: NOT valid)
             * [{length_limit: {min: minValue, max: maxValue}}]
             */
            case 'length_limit': {
                if (!conditionParam) break
                const LengthLimitParamInterface = conditionParam as LengthLimitParamInterface
                if (validate(data, ['notEmpty'])) {
                    const len = String(data).length
                    const tooShort = LengthLimitParamInterface.min !== undefined && len < LengthLimitParamInterface.min
                    const tooLong = LengthLimitParamInterface.max !== undefined && len > LengthLimitParamInterface.max
                    error = tooShort || tooLong
                }
                errorMessage = validateErrorMessages.length_limit(LengthLimitParamInterface.min, LengthLimitParamInterface.max)
                break
            }

            //--------------------------------------------------| Integer
            /** ONLY number (true: valid | false: NOT valid)
             * ['integer']
             */
            case 'integer':
                error = validate(data, ['notEmpty']) && isNaN(Number(convertToEnglishDigits(data)))
                errorMessage = validateErrorMessages.integer()
                break

            //--------------------------------------------------| Integer MIN
            /** greater than minimum (true: valid | false: NOT valid)
             * [{integer_min: minValue}]
             * FIX: قبلاً از convertToEnglishDigits استفاده نمی‌شد، پس عدد فارسی با parseInt به NaN تبدیل می‌شد و همیشه خطا می‌داد
             */
            case 'integer_min':
                error = validate(data, ['notEmpty']) && !(parseInt(convertToEnglishDigits(data)) >= parseInt(String(conditionParam)))
                errorMessage = validateErrorMessages.integer_min(conditionParam)
                break

            //--------------------------------------------------| Integer MAX
            /** smaller than maximum (true: valid | false: NOT valid)
             * [{integer_max: maxValue}]
             * FIX: همانند integer_min
             */
            case 'integer_max':
                error = validate(data, ['notEmpty']) && !(parseInt(convertToEnglishDigits(data)) <= parseInt(String(conditionParam)))
                errorMessage = validateErrorMessages.integer_max(conditionParam)
                break

            //--------------------------------------------------| Integer Limit
            /** limit number between min and max (true: valid | false: NOT valid)
             * [{integer_limit: {min: minValue, max: maxValue}}]
             * FIX: همانند integer_min/integer_max
             */
            case 'integer_limit': {
                if (!conditionParam) break
                const IntegerLimitParamInterface = conditionParam as IntegerLimitParamInterface
                const numericValue = parseInt(convertToEnglishDigits(data))
                error =
                    validate(data, ['notEmpty']) &&
                    !(numericValue >= parseInt(String(IntegerLimitParamInterface.min)) && numericValue <= parseInt(String(IntegerLimitParamInterface.max)))
                errorMessage = validateErrorMessages.integer_limit(IntegerLimitParamInterface.min, IntegerLimitParamInterface.max)
                break
            }

            //--------------------------------------------------| Float
            /** ONLY float number (true: valid | false: NOT valid)
             * ['float']
             */
            case 'float':
                error = validate(data, ['notEmpty']) && !String(convertToEnglishDigits(data)).match(/^-?\d*(\.\d+)?$/)
                errorMessage = validateErrorMessages.float()
                break

            //--------------------------------------------------| Mobile
            /** check mobile number (true: valid | false: NOT valid)
             * ['mobile']
             */
            case 'mobile':
                error = validate(data, ['notEmpty']) && convertToEnglishDigits(data).match(/^09[0-9]{9}$/) === null
                errorMessage = validateErrorMessages.mobile()
                break

            //--------------------------------------------------| National code
            /** check national code (true: valid | false: NOT valid)
             * ['national_code']
             */
            case 'national_code': {
                // FIX: قبلاً اگر کد ملی با ارقام فارسی وارد می‌شد رد می‌شد چون تبدیل نمی‌شد
                const nationalCode = convertToEnglishDigits(data)
                if (validate(data, ['notEmpty'])) {
                    error = true
                    if (/^\d{10}$/.test(nationalCode)) {
                        const check = +nationalCode[9]
                        const sum =
                            nationalCode
                                .split('')
                                .slice(0, 9)
                                .reduce((acc: number, x: string, i: number) => acc + +x * (10 - i), 0) % 11
                        error = !(sum < 2 ? check === sum : check + sum === 11)
                    }
                }
                errorMessage = validateErrorMessages.national_code()
                break
            }

            //--------------------------------------------------| Postal code
            /** check postal code (true: valid | false: NOT valid)
             * ['postal_code']
             */
            case 'postal_code':
                // FIX: همانند mobile/national_code، تبدیل ارقام فارسی قبل از تست انجام می‌شود
                error = validate(data, ['notEmpty']) && !/^(?!(\d)\1{9})[1-9][0-9]{4}[1-9][0-9]{4}$/.test(convertToEnglishDigits(data))
                errorMessage = validateErrorMessages.postal_code()
                break

            //--------------------------------------------------| Email
            /** check email (true: valid | false: NOT valid)
             * ['email']
             */
            case 'email':
                error =
                    validate(data, ['notEmpty']) &&
                    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                        data
                    )
                errorMessage = validateErrorMessages.email()
                break

            //--------------------------------------------------| License plate
            /** check license plate (true: valid | false: NOT valid)
             * [{license_plate: 'car'}] | [{license_plate: 'motorcycle'}]
             */
            case 'license_plate':
                if (String(conditionParam) === 'car') {
                    const carPlate = data as LicensePlateCarParamInterface
                    error =
                        carPlate.alpha === '' ||
                        carPlate.iran.length !== 2 ||
                        String(carPlate.two).length !== 2 ||
                        String(carPlate.three).length !== 3
                } else if (String(conditionParam) === 'motorcycle') {
                    const motoPlate = data as LicensePlateMotorcycleParamInterface
                    error = String(motoPlate.three).length !== 3 || String(motoPlate.five).length !== 5
                } else {
                    console.warn(`license_plate: '${conditionParam}' پشتیبانی نمیشه`)
                    error = true
                }
                errorMessage = validateErrorMessages.license_plate()
                break

            //==================================================| FILE
            //--------------------------------------------------| File notEmpty
            /** check for empty file input (true: valid | false: NOT valid)
             * ['file_empty']
             */
            case 'file_empty': {
                const fileInput = data as FileInputLikeInterface | null | undefined
                error = !fileInput || fileInput.files === undefined || fileInput.files.length === 0
                errorMessage = validateErrorMessages.file_empty()
                break
            }

            //--------------------------------------------------| File type
            /** check file type (true: valid | false: NOT valid)
             * [{file_type: 'image'}]
             */
            case 'file_type': {
                if (!conditionParam) break
                const fileInput = data as FileInputLikeInterface
                let allowedExtensions: string[] = [] // پسوند فایل مثل "01.jpg"
                let allowedTypes: string[] = [] // فیلد type در File

                switch (conditionParam) {
                    case 'image':
                        allowedExtensions = ['jpg', 'jpeg', 'png']
                        allowedTypes = ['image/jpeg', 'image/png']
                        break
                    default:
                        console.warn(`file_type: '${conditionParam}' پشتیبانی نمیشه`)
                        break
                }

                const extension = fileInput.value.slice(fileInput.value.lastIndexOf('.') + 1)
                const files = fileInput.files as FileList
                error = !allowedExtensions.includes(extension) || !allowedTypes.includes(files[0]?.type)
                errorMessage = validateErrorMessages.file_type()
                break
            }

            //--------------------------------------------------| File size
            /** check file size in KB (true: valid | false: NOT valid)
             * [{file_size: 1024}]
             */
            case 'file_size': {
                const fileInput = data as FileInputLikeInterface
                if (fileInput.files.length !== 0) {
                    const files = fileInput.files as FileList
                    const size = files[0].size
                    error = !(Math.round(size / 1024) < conditionParam)
                }
                errorMessage = validateErrorMessages.file_size(conditionParam)
                break
            }
        }

        errorMessage = customError ? customError : errorMessage // custom error
        error = conditionName.endsWith('!') ? !error : error
        if (error) break
    }

    if (error) {
        return errorMessageStatus ? errorMessage : false
    } else {
        return errorMessageStatus ? '' : true
    }
}
