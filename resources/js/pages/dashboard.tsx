import { Head } from '@inertiajs/react';
import {
    Banknote,
    ShoppingBag,
    PackageCheck,
    AlertTriangle,
    Trophy,
    History,
    Receipt,
    Clock
} from 'lucide-react';

interface TopProduct {
    product_name: string;
    units: number;
    revenue: number;
}

interface RecentSale {
    id: number;
    invoice_number: string;
    total_amount: number;
    items_summary: string;
    time: string;
}

interface Props {
    todaysRevenue: number;
    transactionsToday: number;
    activeProducts: number;
    lowStock: number;
    topProductsToday: TopProduct[];
    recentSales: RecentSale[];
}

export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount || 0);
}

export default function Dashboard({
    todaysRevenue = 0,
    transactionsToday = 0,
    activeProducts = 0,
    lowStock = 0,
    topProductsToday = [],
    recentSales = [],
}: Props) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                {/* Page Title */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
                </div>

                {/* 4 Top Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Today's Revenue */}
                    <div className="rounded-xl border bg-card p-5 shadow-2xs transition-all hover:shadow-xs">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Today's Revenue</p>
                                <h3 className="mt-2 text-2xl font-bold text-foreground font-mono">
                                    {formatRupiah(todaysRevenue)}
                                </h3>
                            </div>
                            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                <Banknote className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Transactions Today */}
                    <div className="rounded-xl border bg-card p-5 shadow-2xs transition-all hover:shadow-xs">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Transactions Today</p>
                                <h3 className="mt-2 text-2xl font-bold text-foreground font-mono">
                                    {transactionsToday}
                                </h3>
                            </div>
                            <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Active Products */}
                    <div className="rounded-xl border bg-card p-5 shadow-2xs transition-all hover:shadow-xs">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Active Products</p>
                                <h3 className="mt-2 text-2xl font-bold text-foreground font-mono">
                                    {activeProducts}
                                </h3>
                            </div>
                            <div className="rounded-lg bg-purple-500/10 p-2.5 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                                <PackageCheck className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Low Stock */}
                    <div className={`rounded-xl border p-5 shadow-2xs transition-all ${
                        lowStock > 0
                            ? 'border-amber-300/80 bg-amber-500/5 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400'
                            : 'bg-card text-foreground'
                    }`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-medium opacity-90">Low Stock</p>
                                <h3 className={`mt-2 text-2xl font-bold font-mono ${
                                    lowStock > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'
                                }`}>
                                    {lowStock}
                                </h3>
                            </div>
                            <div className={`rounded-lg p-2.5 ${
                                lowStock > 0
                                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                    : 'bg-muted text-muted-foreground'
                            }`}>
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2-Column Main Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column (7 cols): Top Products Today */}
                    <div className="lg:col-span-7 flex flex-col rounded-xl border bg-card p-5 shadow-2xs">
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            <h2 className="text-base font-bold text-foreground">Top Products Today</h2>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-xs text-muted-foreground font-medium">
                                        <th className="pb-3 text-left">Product</th>
                                        <th className="pb-3 text-center">Units</th>
                                        <th className="pb-3 text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {topProductsToday.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="py-8 text-center text-xs text-muted-foreground">
                                                No sales recorded today yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        topProductsToday.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-muted/40 transition-colors">
                                                <td className="py-3.5 font-medium text-foreground">
                                                    {item.product_name}
                                                </td>
                                                <td className="py-3.5 text-center font-mono text-muted-foreground">
                                                    {item.units}
                                                </td>
                                                <td className="py-3.5 text-right font-mono font-bold text-foreground">
                                                    {formatRupiah(item.revenue)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column (5 cols): Recent Sales */}
                    <div className="lg:col-span-5 flex flex-col rounded-xl border bg-card p-5 shadow-2xs">
                        <div className="flex items-center gap-2 mb-4">
                            <History className="h-5 w-5 text-primary" />
                            <h2 className="text-base font-bold text-foreground">Recent Sales</h2>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto max-h-[450px] pr-1">
                            {recentSales.length === 0 ? (
                                <div className="py-8 text-center text-xs text-muted-foreground">
                                    No recent transactions found.
                                </div>
                            ) : (
                                recentSales.map((sale) => (
                                    <div
                                        key={sale.id}
                                        className="flex flex-col gap-1 border-b pb-3.5 last:border-0 last:pb-0"
                                    >
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                                                <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
                                                Sale #{sale.invoice_number}
                                            </span>
                                            <span className="font-bold text-sm font-mono text-foreground">
                                                {formatRupiah(sale.total_amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-muted-foreground gap-2">
                                            <span className="truncate max-w-[220px]" title={sale.items_summary}>
                                                {sale.items_summary}
                                            </span>
                                            <span className="shrink-0 font-mono text-[11px] flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                {sale.time}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};