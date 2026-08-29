<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Otp;
use App\Services\GeneralService;
use Carbon\Carbon;

class OtpController extends Controller
{
    private string $_mobile = '';
    public function __construct($mobile = ''){
        $this->_mobile = $mobile;
    }

    public function sendSMS(): float|bool {
        $otp = Otp::where('mobile', $this->_mobile)->first();
        $code = GeneralService::randomGenerator(5,'int');

        //------------------------------| check for previous attempts
        if($otp){
            $now = Carbon::now();
            $sendTime = Carbon::parse($otp->updated_at->addMinutes(2));

            //------------------------| there is still 2 min time left
            if($sendTime->gt($now))
                return $now->diffInSeconds($sendTime);// return remaining time

            $otp->update([
                'code' => $code,
                'sent_count' => $otp->sent_count + 1,
                'attempt' => 0,
            ]);

        }else{
            Otp::create([
                'mobile' => $this->_mobile,
                'code' => $code,
            ]);
        }

        //------------------------------| send sms
        //OtpSMSJob::dispatch($this->_mobile, $code);

        return true;
    }

    public function check($code): string{
        $otp = Otp::where('mobile', $this->_mobile)->first();

        //----------| exist
        if(!$otp) return "خطا در پردازش.  یک کد جدید دریافت کنید.";

        //----------| attempts
        if($otp->attempt > 5) return "حداکثر تعداد خطا. یک کد جدید دریافت کنید.";

        //----------| correct code
        if($otp->code !== $code){
            $otp->update(['attempt'=>intval($otp->attempt)+1]);// +1 to its attempts
            return "کد وارد شده اشتباه است";
        }

        //----------| time range
        if(Carbon::parse($otp->updated_at)->addMinutes(2)->isPast())
            return "زمان اعتبار کد به پایان رسید. یک کد جدید دریافت کنید.";

        //----------| valid
        $otp->update(['login_count'=>intval($otp->login_count)+1]);// +1 to its attempts
        return '';
    }
}
