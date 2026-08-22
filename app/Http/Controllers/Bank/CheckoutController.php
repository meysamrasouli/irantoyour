<?php

namespace App\Http\Controllers\Bank;

use App\Models\Cart;
use App\Models\Invoice;
use App\Models\InvoiceOrder;
use App\Models\Membership;
use App\Models\Register;
use App\Models\User;
use App\Payment\Payment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * redirect to bank
     * @param Register $register
     */
    public function redirectToBank(Cart $cart, int $price){
        $cart->update(['status' => true]);// lock the cart

        try {
            $payment = new Payment('Mellat');
            return $payment->pay(
                Cart::class,
                $cart->id,
                $price * 10,// تومان
                env('APP_URL').'/bank-callback/checkout/'.$cart->id
            );
        } catch (MellatException|\Exception $e){
            $cart->update(['status' => null]);// lock the cart
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * call-back from bank
     * @param Request $request
     * @param int $cartId
     * @return Response
     */
    public function bankCallback(Request $request, int $cartId): Response{
        $error = "";
        $cart = Cart::findOrFail($cartId);

        // جدول transaction را به cart با cart_id وصل کن و درنهایت با invoice_id جایگزین کن
        try {
            $lastTransaction = $cart->latestTransaction;

            $payment = new Payment($lastTransaction->gateway);
            $bankDetail = $payment->verify($request);

            //------------------------------| finalizing
            $this->_finalize($cartId, $bankDetail);

            //------------------------------| login user if logged out
            if (!Auth::guard('web')->check()) {
                Auth::guard('web')->login(User::find($cart->user_id));// login user
            }
        } catch (MellatException|\Exception $e){
            // check cart table for pallarell cart
            $newCart = Cart::where('user_id', $cart->user_id)->whereNull('status')->first();
            // merge two carts with each other
            if(!is_null($newCart)){
                $detail = array_merge($cart['detail'], $newCart['detail']);
                $newCart->delete();
            }else{
                $detail = $cart['detail'];
            }
            // update cart and make it usable
            $cart->update([
                'detail' => $detail,
                'status' => null,
            ]);

            $error = $e->getMessage();
        }

        return inertia::render('Bank/callback',[
            'error' => $error,
            'redirectUrl' => (empty($error)) ? '/login' : '/register'
        ]);
    }

    /**
     * نهایی کردن سفارش
     * @param int $cartId
     * @param array|null $bankDetail
     * @return void
     */
    private function _finalize(int $cartId, array $bankDetail = null): void{}
    public function finalize(int $cartId, array $bankDetail = null): void{
        $user = Auth::guard('web')->user();
        $cart = Cart::findOrFail($cartId);
        $order = InvoiceOrder::orderMaker($cart['detail']);

        // create a new invoice
        $invoice = Invoice::create([
            'user_id' => $cart->user_id,
            'total' => Cart::calculatePrice($cart),
            'respond_bank' => $bankDetail,
            'status' => 'paid',
        ]);
        $invoice->invoiceOrders()->createMany($order);

        $cart->transactions()->update([
            'transactionable_type' => Invoice::class,
            'transactionable_id' => $invoice->id,
        ]);

        // update user wallet
        if(isset($cart['detail']['wallet'])){
            $user->update(['balance' => $user->balance + $cart['detail']['wallet']]);
        }
        // update user wallet
        if(isset($cart['detail']['membership'])){
            Membership::purchase($user, $cart['detail']['membership']);
        }

        $cart->delete();
    }
}
