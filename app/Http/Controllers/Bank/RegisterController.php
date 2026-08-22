<?php

namespace App\Http\Controllers\Bank;

use App\Models\Invoice;
use App\Models\Register;
use App\Models\User;
use Illuminate\Http\Request;
use inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    /**
     * redirect to bank
     * @param Register $register
     */
    public function redirectToBank(Register $register){
        $price = $register->tariff->price;

//        try {
//            $payment = new Payment('Mellat');
//            return $payment->pay(
//                Register::class,
//                $register->id,
//                $price * 10,// تومان
//                env('APP_URL').'/bank-callback/register/'.$register->id
//            );
//        } catch (MellatException|\Exception $e){
//            return back()->withErrors($e->getMessage());
//        }
    }

    /**
     * call-back from bank
     * @param Request $request
     * @param int $registerId
     * @return Response
     */
    public function bankCallback(Request $request, int $registerId): Response{
        try {
            $error = "";
            $register = Register::findOrFail($registerId);
            $tariff = $register->tariff;

            // if user refresh the page
            $user = User::where([
                'mobile' => $register['mobile'],
                'national_id_number' => $register['national_id_number'],
            ])->first();

            if(!$user){
                // create a new user
                $user = User::createNewUser([
                    'mobile' => $register['mobile'],
                    'first_name' => $register['first_name'],
                    'last_name' => $register['last_name'],
                    'national_id_number' => $register['national_id_number'],
                ], $tariff->variety, 'register');

                // create a new invoice
                Invoice::craete([
                    'user_id' => $user->id,
                    'total' => $tariff->price,
                    'respond_bank' => $request,
                    'status' => 'paid',
                ])->invoiceItem()->create([
                    'type' => 'membership',
                    'variety' => $tariff->variety,
                    'price' => $tariff->price,
                ]);

                // update register
                $register->update([
                    'user_id' => $user->id,
                ]);
            }
        } catch (MellatException|\Exception $e){
            $error = $e->getMessage();
        }

        return inertia::render('Bank/callback',[
            'error' => $error,
            'redirectUrl' => (empty($error)) ? '/login' : '/register'
        ]);
    }
}
