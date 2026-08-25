<?php

namespace App\Http\Controllers\Bank;

use App\Models\Invoice;
use App\Models\Register;
use App\Models\Transaction;
use App\Models\User;
use App\Payment\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    /**
     * redirect to bank
     * @param Register $register
     * @throws \Throwable
     */
    public function redirectToBank(Register $register){
        $price = $register->tariff->price;// get the latest price

        if($price > 0){
            // redirect to back
            // todo: add TAX to price
            try {
                return (new Payment('Mellat'))->pay(
                    Register::class,
                    $register->id,
                    $price * 10,// تبدیل به ریال
                    env('APP_URL').'/bank-callback/register/'.$register->id
                );
            } catch (MellatException|\Exception $e){
                return back()->withErrors($e->getMessage());
            }
        }else {
            $this->_finalize($register);
            return Inertia::location('/login');// redirect with a full reload
        }
    }

    /**
     * call-back from bank
     * @param Request $request
     * @param int $registerId
     * @return Response
     */
    public function bankCallback(Request $request, int $registerId): Response{
        $error = "";
        $register = Register::findOrFail($registerId);

        // if user refresh the page
        if(is_null($register->user_id)){
            try {
                $lastTransaction = $register->latestTransaction;

                $payment = new Payment($lastTransaction->gateway);
                $bankDetail = $payment->verify($request);

                $this->_finalize($register);

            } catch (MellatException|\Exception|\Throwable $e){
                $error = $e->getMessage();
            }
        }

        return inertia::render('Bank/callback',[
            'error' => $error,
            'redirectUrl' => (empty($error)) ? '/login' : '/register'
        ]);
    }

    /**
     * @throws \Throwable
     */
    private function _finalize(Register $register): void{
        $tariff = $register->tariff;

        // atomic
        DB::transaction(function () use ($register, $tariff) {
            //------------------------------| create a new user
            $user = User::createNewUser([
                'mobile' => $register['mobile'],
                'first_name' => $register['first_name'],
                'last_name' => $register['last_name'],
                'national_code' => $register['national_code'],
            ], $tariff->detail['duration'], 'register');

            // todo: add bonus credit to user wallet

            //------------------------------| create a new invoice
            $invoice = Invoice::create([
                'user_id' => $user->id,
                'total' => $tariff->price,
                'status' => 'paid',
            ]);

            $invoice->invoiceItems()->create([
                'type' => 'membership',
                'variety' => $tariff->variety,
                'price' => $tariff->price,
            ]);

            //------------------------------| move register transactions to invoice transaction
            Transaction::where([
                'transactionable_type' => Register::class,
                'transactionable_id' => $register->id,
            ])->update([
                'transactionable_type' => Invoice::class,
                'transactionable_id'   => $invoice->id,
            ]);

            //------------------------------| update register
            $register->update([
                'user_id' => $user->id,
            ]);
        });
    }
}
