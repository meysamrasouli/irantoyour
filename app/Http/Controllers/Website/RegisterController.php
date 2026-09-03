<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Bank\RegisterController as Bank;
use App\Http\Requests\Website\RegisterStoreRequest;
use App\Models\Register;
use App\Models\Tariff;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function index(): Response
    {
        $faq = [
            ['پس از پرداخت، اشتراک من چه زمانی فعال می‌شود؟', 'بلافاصله پس از پرداخت موفق، اشتراک شما فعال می‌شود و می‌توانید اولین آگهی خود را ثبت کنید.'],
            ['آیا می‌توانم مدت اشتراک خود را ارتقا دهم؟', 'بله، در هر زمان می‌توانید مدت اشتراک خود را به در حساب اختصاصی خود ارتقا دهید.'],
            ['چرا کد ملی برای ثبت‌نام لازم است؟', 'احراز هویت با کد ملی برای امنیت معاملات و جلوگیری از سوءاستفاده انجام می‌شود و اطلاعات شما محرمانه باقی می‌ماند.'],
            ['اگر کد تأیید پیامکی دریافت نکنم چه کنم؟', 'پس از پایان شمارش معکوس می‌توانید «ارسال مجدد کد» را بزنید یا شماره موبایل خود را ویرایش کنید. در صورت تکرار مشکل با پشتیبانی تماس بگیرید.'],
        ];

        return inertia::render('website/register', [
            'list_plan' => Tariff::get_membership(),
            'list_faq' => $faq,
            'pageDetail' => [
                'url' => env('APP_URL').'/register',// canonical
                'description' => "",
                'breadcrumb' => [
                    ['name' => env('APP_NAME_FA'), 'url' => env('APP_URL')],
                    ['name' => 'عضویت', 'url' => env('APP_URL').'/register'],
                ],
            ]
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function store(RegisterStoreRequest $request){
        $inputData = $request->validated();

        $register = Register::query()->updateOrCreate([
            'mobile' => $inputData['mobile'],
            'national_code' => $inputData['national_code'],
        ],[
            'cart_item' => $inputData['cart_item'],
            'first_name' => $inputData['first_name'],
            'last_name' => $inputData['last_name'],
        ]);

        return (new Bank())->redirectToBank($register);
    }
}
