# IranToYour — راهنمای پروژه برای Claude

> این فایل حافظه‌ی پایدار پروژه‌ست. چون هر سشن جدید (وب/CLI) ریپو رو fresh clone می‌کنه،
> این فایل تنها جایی‌ست که context معماری/تصمیمات/قرارداد‌های پروژه رو نگه می‌داره.
> هر تصمیم معماری مهم جدید رو همین‌جا اضافه کن، نه فقط توی چت.

## معرفی پروژه

سایت آگهی/مارکت‌پلیس **صنعت طیور** ایران. کاربران (تولیدکننده/تاجر) با عضویت پولی
ثبت‌نام می‌کنن و آگهی `offer` (عرضه) / `demand` (تقاضا) ثبت می‌کنن.

**فازهای بعدی (روی همین بک‌اند):**
- اپ موبایل با **React Native** (به همین دلیل از Vue به React/TS سوییچ شد)
- بخش **باربری/لجستیک محصولات**: راننده‌ها مسیر مبدا→مقصد رو مشخص می‌کنن و بار حمل می‌کنن

**ریپو:** `github.com/meysamrasouli/irantoyour`
**Stack:** Laravel + MySQL + Inertia.js + TypeScript + React + Zustand + axios

## وضعیت مهاجرت (مهم!)

پروژه‌ی قبلی با **Laravel قدیمی + Vue** نوشته شده بود و روی سیستم شخصی کاربره (نه توی این گیت).
الان داریم به این ریپوی جدید (Laravel + React/TS) **تیکه‌تیکه** منتقلش می‌کنیم:

1. **فاز فعلی:** تبدیل کامپوننت‌های Vue قدیمی به React/TypeScript، یکی‌یکی
2. **فاز بعدی:** رفتن سراغ Controller ها و Migration های قدیمی

وقتی کاربر یک کامپوننت Vue می‌فرسته:
- کد رو مستقیم/کلمه‌به‌کلمه ترجمه نکن؛ با در نظر گرفتن **بهترین پیاده‌سازی ممکن** در
  React/TS بازنویسی‌اش کن (معماری، hookها، تایپ‌ها بهتر از نسخه‌ی Vue باشه)
- قرارداد نام‌گذاری `arc_` رو رعایت کن (پایین‌تر توضیح داده شده)

## قراردادهای نام‌گذاری

- **کامپوننت‌های UI جدید (React):** پیشوند `arc_` = *Advanced React Component*
  (مثال: `arc_modal.tsx`, `arc_input_otp.tsx`). بعد از پیشوند snake_case یا camelCase هر
  دو توی پروژه هست — هنوز کامل یکدست نشده، نگران match کردن دقیقش نباش.
- **کامپوننت‌های Vue قدیمی (مرجع/در حال حذف):** پیشوند `avc_` = *Advanced Vue Component*
- **Utility ها:** پسوند `Utils` (مثل `validationUtils.ts`, `convertUtils.ts`)
- **Interface ها:** پسوند `Interface`
- **State سراسری:** Zustand (نه Context API) — `resources/js/shared/store/zustandStore.ts`
- **Routing:** Inertia (بدون SSR فعال)
- **HTTP:** همیشه از `axiosClient` (در `shared/utils/axiosUtils.ts`) استفاده کن، نه `fetch` خام
- **فرم‌ها:** از `useFormHandler` (در `shared/hooks/useFormSubmit.ts`) استفاده کن — Inertia's
  `useForm` رو با `validateField` و `formSubmit` می‌پیچه

## تنظیمات مهم پروژه

- **TypeScript 7** نصبه:
  - `baseUrl` حذف شده؛ `paths` باید نسبی باشه (`./resources/js/*`)
  - `skipLibCheck: true` لازمه (به‌خاطر type های axios توی `@inertiajs/core`)
- **همیشه** بعد از هر تغییری با این دستور کامل (بدون grep/فیلتر) چک کن:
  ```
  npx tsc --noEmit -p tsconfig.json
  ```
  یک بار `tsconfig.json` خراب بود و کل type-check بی‌سروصدا fail می‌شد بدون این‌که معلوم
  باشه — پس یه **چک صداقت** هم بزن: عمداً یه خطای تایپ بذار، مطمئن شو گزارش می‌شه، بعد revert کن.

## زیرساخت فرانت‌اند ساخته‌شده (`resources/js/shared/`)

| فایل | کاربرد |
|---|---|
| `hooks/useFormSubmit.ts` | `useFormHandler(initialData)` → `{form, formError, validateField, formSubmit}` |
| `hooks/useFetch.ts` | fetch با axios + AbortController + `refetch` |
| `hooks/useSlide.ts` | انیمیشن باز/بسته با CSS transition (جایگزین `useSlideToggle` قدیمی Vue) |
| `hooks/useClickOutside.ts` | تشخیص کلیک بیرون از یک ref |
| `utils/validationUtils.ts` | `validate(data, conditions, errorMessageStatus?, customError?)` با rule های: `notEmpty`, `mobile`, `national_code`, `string_fa`, `integer`, `length_fix`, ... (معادل React از mixin های Vue قدیمی) |
| `utils/convertUtils.ts` | `convertToEnglishDigits`, `FormatNumber` (حرف بزرگ عمدیه!)، `convertToPersianDate`/`convertToGregorianDate` (با `react-date-object`, **نه** moment) |
| `utils/axiosUtils.ts` | `axiosClient` (session-based, `withCredentials`) + `createAxiosApi(tokenType)` برای Sanctum |
| `types/pageDetailInterface.ts` | shape مشترک SEO/breadcrumb برای همه‌ی صفحات website |

## کامپوننت‌های UI ساخته‌شده (`resources/js/components/ui/`)

`arc_modal`، `arc_input_checkbox`، `arc_countDownTimer`، `arc_input_otp` (ترکیبی: ارسال
SMS + گرفتن کد + گزارش صحیح/غلط به parent، با `useImperativeHandle` برای trigger از
بیرون)، `arc_pagination`، `arc_input_rangeSingleHandle`، `arc_input_rangeDualHandle`،
`arc_progressCircle`، `arc_progressStep`، `arc_tariff_membershipPlan`، `arc_datatable`
(جدول کامل با جستجو/مرتب‌سازی/صفحه‌بندی)، `arc_breadcrumb`، `arc_faq`، `arc_notification`،
`arc_overlay`، `arc_select`، `arc_address_plain`، `arc_otp`.

## طراحی دیتابیس (توافق‌شده)

```
tariffs          -- کاتالوگ همه‌ی تعرفه‌ها (عضویت، هزینه آگهی، شارژ کیف‌پول)
  type, variety, price, detail(JSON شامل duration به روز), status

registers        -- لاگ تلاش ثبت‌نام قبل از پرداخت (نه جدول موقت که پاک می‌شه)
  user_id(nullable), tariff_id/cart_item, mobile, first_name, last_name, national_code

users            -- فقط حساب‌های واقعی (بعد از پرداخت موفق ساخته می‌شن)

carts            -- سبد خرید موقت (JSON items) - قبل رفتن به بانک
invoices         -- فقط لاگ خریدهای موفق (نه pending) - user_id NOT NULL
invoice_items    -- اقلام هر فاکتور
transactions     -- پلی‌مورفیک (transactionable) - همه‌ی تلاش‌های پرداخت، موفق/ناموفق
```

**تصمیمات کلیدی:**
- `invoices`/`invoice_items` = لاگ تمیز فقط موفق‌ها (نه مثل Stripe که pending هم نگه
  می‌داره — تصمیم آگاهانه‌ی پروژه به‌خاطر شماره‌گذاری فاکتور رسمی)
- ثبت‌نام: `registers` ساخته می‌شه → بانک → موفق: `User` + `Invoice` ساخته می‌شن،
  `transactions` مربوط به Register به Invoice منتقل می‌شن (bulk update، داخل
  `DB::transaction`)
- تمدید عضویت باید از **تاریخ انقضای فعلی** جمع بشه، نه از امروز (تا روزهای باقی‌مونده
  هدر نره)
- کل `_finalize()` (تغییر وضعیت invoice + user + حذف cart) باید atomic
  (`DB::transaction`) باشه
- موبایل+OTP به‌جای username/password

## درس‌های تکرارشونده‌ی این پروژه (مهم برای هر کد جدید)

1. **Stale state/closure:** بعد از `setState`/`form.setData`، بلافاصله از همون متغیر
   state نخون — یا مقدار تازه رو مستقیم پاس بده، یا از `ref` برای قفل‌های سنکرون استفاده
   کن (مثل `isSendingOtpRef`)
2. `useEffect` روی mount هم اجرا می‌شه (برخلاف Vue's `watch` غیر-immediate) — اگه یه
   effect فقط باید روی تغییرات بعدی اجرا بشه، باید با یه ref گارد mount اول رو نادیده بگیره
3. State که فقط prop رو کپی می‌کنه (مثل `useState(0); useEffect(()=>setState(prop),[prop])`)
   معمولاً غیرضروریه و باعث فلاش بصری اشتباه می‌شه — مستقیم از prop استفاده کن
4. `.join(' ')` روی آرایه‌ی حاوی `false` باعث می‌شه کلمه‌ی `"false"` واقعاً به className
   اضافه بشه — همیشه `.filter(Boolean).join(' ')`
5. هر migration جدید: ستون‌های ارجاعی باید `foreignId()`/`unsignedBigInteger` باشن (نه
   `integer` ساده) تا با primary key های پیش‌فرض لاراول (`unsignedBigInteger`) جور باشن
6. همیشه بعد از هر تغییر، `npx tsc --noEmit -p tsconfig.json` رو کامل (بدون grep) چک کن،
   و یه چک صداقت (خطای عمدی + revert) بزن تا مطمئن بشی واقعاً داره چک می‌کنه

## چیزهای ناتمام/یادآوری

- `pages/dashboard/user/craete.tsx` — تایپوی «craete» هنوز اصلاح نشده + محتوای placeholder
- بانک پرداخت هنوز انتخاب نشده — `App\Payment\Payment` و `MellatException` **عمداً**
  وجود ندارن (نه باگ، decision آگاهانه‌ست تا انتخاب درگاه بعداً انجام بشه)
- `checkout.tsx` (صفحه سبد خرید) هنوز خالیه
- مقادیر تستی هاردکد توی `useFormHandler` اولیه‌ی `register.tsx` باید قبل از production
  پاک بشن
- سرویس شاهکار (تطبیق موبایل+کدملی) بحث شد ولی هنوز پیاده نشده
- `.env.example` فعلاً `DB_CONNECTION=sqlite` داره؛ استک نهایی MySQL هست — قبل از دیپلوی
  واقعی باید عوض بشه (فعلاً برای dev/CI مشکلی نداره)
- آگهی‌های `offer`/`demand` (هدف اصلی محصول) هنوز هیچ model/migration/controller‌ای
  ندارن — این‌ها بعد از تمام‌شدن مهاجرت component ها و controller/migration های قدیمی
  ساخته می‌شن

## نکات کاری با Claude

- Claude هر بار باید ریپو رو **fresh clone** کنه (نه cache قدیمی) چون کاربر مستقیم گیت
  پوش می‌کنه، نه از طریق Claude
- کاربر ترجیح می‌ده **فایل‌های کد اول بیان، توضیحات بعد** (محدودیت token/credit)
- تصمیمات معماری رو با **استدلال صادقانه** بحث کنید، نه فقط تأیید — این پروژه چندبار روی
  تصمیم‌های اشتباه (مثل حذف Cart، جدول register جدا) برگشت خورد بعد از بحث درست
