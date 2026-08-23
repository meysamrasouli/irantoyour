<?php

namespace App\Http\Controllers\Bank;

use App\Models\Cart;
use App\Models\Invoice;
use App\Models\Register;
use App\Models\Tariff;
use App\Models\User;
use App\Payment\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    /**
     * redirect to bank
     * @param Register $register
     */
    public function redirectToBank(Cart $cart){
        $cart->update(['lock_status' => true]);// lock the cart

        $invoice = $this->_moveCartToInvoice($cart);

        // redirect to back
        // todo: add TAX to price
        try {
            $payment = new Payment('Mellat');
            return $payment->pay(
                Invoice::class,
                $invoice->id,
                $invoice->total * 10,// تبدیل به ریال
                env('APP_URL').'/bank-callback/invoice/'.$invoice->id
            );
        } catch (MellatException|\Exception $e){
            $cart->update(['lock_status' => null]);// unlock the cart
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * call-back from bank
     * @param Request $request
     * @param int $invoiceId
     * @return Response
     */
    public function bankCallback(Request $request, int $invoiceId): Response{
        $error = "";
        $invoice = Invoice::findOrFail($invoiceId);

        try {
            $lastTransaction = $invoice->latestTransaction;

            $payment = new Payment($lastTransaction->gateway);
            $bankDetail = $payment->verify($request);

            //------------------------------| finalizing
            $this->_finalize($invoice);

            //------------------------------| login user if logged out
            if (!Auth::guard('web')->check()) {
                Auth::guard('web')->login(User::find($invoice->user_id));// login user
            }
        } catch (MellatException|\Exception|\Throwable $e){
            // check for new cart while one is locked
            $this->_mergeAndCleanUserCarts($invoice->user_id);
            $error = $e->getMessage();
        }

        return inertia::render('Bank/callback',[
            'error' => $error,
            'redirectUrl' => (empty($error)) ? '/profile' : '/profile/cart'
        ]);
    }

    /**
     * نهایی کردن سفارش
     * @param Invoice $invoice
     * @return void
     */
    private function _finalize(Invoice $invoice): void{
        $invoice->update(['status' => 'paid']);

        $user = User::find($invoice->user_id);
        $invoiceItems = $invoice->invoiceItems;

        foreach ($invoiceItems as $invoiceItem){
            switch ($invoiceItem->type){
                //------------------------------| membership
                case 'membership':
                    $tariff = Tariff::where([
                        'type' => $invoiceItem->type,
                        'variety' => $invoiceItem->variety,
                    ])->first();

                    $user->update(['membership_expires_at' => Carbon::now()->addDays($tariff['detail']['duration'])->toDateString()]);
                    break;
                    //------------------------------| wallet
                    case 'wallet':
                        $user->update(['balance' => $user->balance + $invoiceItem->price]);
                    break;
            }
        }

        Cart::where('user_id', $invoice->user_id)->delete();
    }





    private function _moveCartToInvoice(Cart $cart): Invoice {
        $invoice = Invoice::query()
            ->where('user_id', $cart->user_id)
            ->whereNull('status')
            ->orderByDesc('created_at')
            ->first();

        $cartItems = Cart::prepareCartToInvoice($cart);

        if($invoice){
            $invoiceItems = $invoice->invoiceItems->toArray();

            // compare last available invoice_items and cart_items
            $mapAndSort = fn($items) => collect($items)
                ->map(fn($item) => $item['type'] . ':' . $item['variety'] . ':' . $item['price'])
                ->sort()
                ->values()
                ->all();
            if($mapAndSort($invoiceItems) === $mapAndSort($cartItems)) return $invoice;// nothing changed
        }

        // create a new invoice
        $invoice = Invoice::create([
            'user_id' => $cart->user_id,
            'total' => Cart::totalPrice($cart),
        ]);
        $invoice->invoiceItems()->createMany($cartItems);

        return $invoice;
    }

    /**
     * @throws \Throwable
     */
    private function _mergeAndCleanUserCarts(int $userId): void{
        $carts = Cart::where('user_id', $userId)
            ->orderByDesc('updated_at')
            ->get();

        if ($carts->count() > 1) {
            DB::transaction(function () use ($carts, $userId) {
                $mergedDetails = [];

                // change the cart sort inorder to overwrite the last values over firsts
                foreach ($carts->reverse() as $cart) {
                    foreach ($cart->detail as $item) {
                        $key = ($item['type'] ?? '') . '_' . ($item['variety'] ?? '');
                        $mergedDetails[$key] = $item;
                    }
                }

                // delete all users carts
                Cart::where('user_id', $userId)->delete();
                Cart::create([
                    'user_id' => $userId,
                    'detail' => array_values($mergedDetails),
                ]);
            });
        }else{
            if($carts->contains('lock_status', true))
                $carts->first()->update(['lock_status' => null]);
        }
    }
}
