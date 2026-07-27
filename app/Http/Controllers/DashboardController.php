<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = today();

        // 1. Today's Revenue
        $todaysRevenue = (float) Transaction::whereDate('created_at', $today)->sum('total_amount');

        // 2. Transactions Today
        $transactionsToday = Transaction::whereDate('created_at', $today)->count();

        // 3. Active Products
        $activeProducts = Product::where('is_active', true)->count();

        // 4. Low Stock Products (stock <= 5 and active)
        $lowStock = Product::where('is_active', true)->where('stock', '<=', 5)->count();

        // 5. Top Products Today
        $topProductsToday = TransactionDetail::select(
                'products.name as product_name',
                DB::raw('SUM(transaction_details.quantity) as units'),
                DB::raw('SUM(transaction_details.subtotal) as revenue')
            )
            ->join('products', 'transaction_details.product_id', '=', 'products.id')
            ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
            ->whereDate('transactions.created_at', $today)
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('units')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'product_name' => $item->product_name,
                    'units' => (int) $item->units,
                    'revenue' => (float) $item->revenue,
                ];
            });

        // 6. Recent Sales (Latest 7 transactions)
        $recentSales = Transaction::with(['details.product'])
            ->latest()
            ->limit(7)
            ->get()
            ->map(function ($trx) {
                $itemsSummary = $trx->details->map(function ($d) {
                    $name = $d->product->name ?? 'Product';
                    return "{$name} ×{$d->quantity}";
                })->implode(', ');

                return [
                    'id' => $trx->id,
                    'invoice_number' => $trx->invoice_number,
                    'total_amount' => (float) $trx->total_amount,
                    'items_summary' => $itemsSummary ?: 'No details',
                    'time' => $trx->created_at->format('g:i:s A'),
                ];
            });

        return Inertia::render('dashboard', [
            'todaysRevenue' => $todaysRevenue,
            'transactionsToday' => $transactionsToday,
            'activeProducts' => $activeProducts,
            'lowStock' => $lowStock,
            'topProductsToday' => $topProductsToday,
            'recentSales' => $recentSales,
        ]);
    }
}
