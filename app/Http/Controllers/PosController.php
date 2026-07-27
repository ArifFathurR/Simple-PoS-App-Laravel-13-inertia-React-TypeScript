<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PosController extends Controller
{
    public function index()
    {
        $products = Product::with('category')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $categories = Category::orderBy('name')->get();

        $recentTransactions = Transaction::with(['user', 'details.product'])
            ->latest()
            ->take(15)
            ->get();

        return Inertia::render('pos/index', [
            'products' => $products,
            'categories' => $categories,
            'recentTransactions' => $recentTransactions,
        ]);
    }

    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string|in:cash,qris,transfer,card',
            'pay_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:500',
        ]);

        $itemPayloads = $validated['items'];
        $productIds = collect($itemPayloads)->pluck('product_id')->unique();
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        // Verify stock and compute total
        $totalAmount = 0;
        $detailsData = [];

        foreach ($itemPayloads as $item) {
            $product = $products->get($item['product_id']);
            if (!$product) {
                return back()->withErrors(['items' => 'Product not found.']);
            }

            if (!$product->is_active) {
                return back()->withErrors(['items' => "Product {$product->name} is currently inactive."]);
            }

            if ($product->stock < $item['quantity']) {
                return back()->withErrors(['items' => "Insufficient stock for {$product->name}. Remaining stock: {$product->stock}."]);
            }

            $price = (float) $product->price;
            $subtotal = $price * $item['quantity'];
            $totalAmount += $subtotal;

            $detailsData[] = [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $price,
                'subtotal' => $subtotal,
            ];
        }

        $payAmount = (float) $validated['pay_amount'];
        if ($payAmount < $totalAmount) {
            return back()->withErrors(['pay_amount' => 'Paid amount is less than total amount.']);
        }

        $changeAmount = $payAmount - $totalAmount;

        $transaction = DB::transaction(function () use ($request, $validated, $totalAmount, $payAmount, $changeAmount, $detailsData, $products) {
            // Generate Invoice Number TRX-YYYYMMDD-XXXX
            $datePrefix = date('Ymd');
            $todayCount = Transaction::whereDate('created_at', today())->count() + 1;
            $invoiceNumber = 'TRX-' . $datePrefix . '-' . str_pad($todayCount, 4, '0', STR_PAD_LEFT);

            $trx = Transaction::create([
                'invoice_number' => $invoiceNumber,
                'user_id' => $request->user()->id,
                'total_amount' => $totalAmount,
                'pay_amount' => $payAmount,
                'change_amount' => $changeAmount,
                'payment_method' => $validated['payment_method'],
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($detailsData as $detail) {
                $trx->details()->create($detail);

                // Decrement product stock
                Product::where('id', $detail['product_id'])->decrement('stock', $detail['quantity']);
            }

            return $trx->load(['user', 'details.product']);
        });

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'transaction' => $transaction,
            ]);
        }

        return back()->with('transaction', $transaction);
    }

    public function history(Request $request)
    {
        $transactions = Transaction::with(['user', 'details.product'])
            ->latest()
            ->paginate(20);

        return response()->json($transactions);
    }
}
