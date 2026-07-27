import { useState, useEffect } from "react";
import { CartItem, Transaction } from "@/types";
import { formatRupiah } from "./cart-panel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, QrCode, CreditCard, Building2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { router } from "@inertiajs/react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cart: CartItem[];
    total: number;
    onSuccess: (transaction: Transaction) => void;
}

type PaymentMethod = 'cash' | 'qris' | 'transfer' | 'card';

export default function CheckoutModal({ open, onOpenChange, cart, total, onSuccess }: Props) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
    const [payAmountInput, setPayAmountInput] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Reset or set defaults when modal opens or total changes
    useEffect(() => {
        if (open) {
            setPaymentMethod('cash');
            setPayAmountInput(total.toString());
            setNotes('');
            setErrorMsg(null);
        }
    }, [open, total]);

    // Update pay amount when payment method changes
    const handleMethodChange = (method: PaymentMethod) => {
        setPaymentMethod(method);
        setErrorMsg(null);
        if (method !== 'cash') {
            setPayAmountInput(total.toString());
        }
    };

    const payAmountNum = parseFloat(payAmountInput || '0');
    const changeAmount = payAmountNum - total;
    const isPayAmountValid = payAmountNum >= total && payAmountNum > 0;

    const quickCashPresets = [
        total, // Exact amount
        10000,
        20000,
        50000,
        100000,
        200000,
        500000,
    ].filter((val, idx, self) => val >= total && self.indexOf(val) === idx).slice(0, 5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPayAmountValid) {
            setErrorMsg("Payment amount must be equal to or greater than total bill.");
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        const payload = {
            items: cart.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
            })),
            payment_method: paymentMethod,
            pay_amount: payAmountNum,
            notes: notes.trim() || null,
        };

        // Submit to Laravel backend via Inertia router with json response
        router.post('/pos/checkout', payload, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                setLoading(false);
                const flashTrx = (page.props as any).flash?.transaction || (page.props as any).transaction;
                if (flashTrx) {
                    onSuccess(flashTrx as Transaction);
                } else {
                    // Fallback: fetch latest or reload
                    onOpenChange(false);
                }
            },
            onError: (errors) => {
                setLoading(false);
                const firstErr = Object.values(errors)[0];
                setErrorMsg(typeof firstErr === 'string' ? firstErr : 'Checkout failed. Please try again.');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        Checkout & Payment
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-2">
                    {/* Bill Summary Banner */}
                    <div className="rounded-xl border bg-muted/40 p-4 text-center space-y-1">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Amount Due</span>
                        <div className="text-3xl font-black text-primary font-mono">
                            {formatRupiah(total)}
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment Method</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleMethodChange('cash')}
                                className={`flex items-center gap-2.5 rounded-lg border p-3 text-sm font-medium transition-all text-left ${
                                    paymentMethod === 'cash'
                                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                                        : 'hover:bg-muted/50 text-foreground'
                                }`}
                            >
                                <Banknote className="h-5 w-5 shrink-0" />
                                <div>
                                    <p className="font-semibold leading-none">Cash</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">Tunai</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleMethodChange('qris')}
                                className={`flex items-center gap-2.5 rounded-lg border p-3 text-sm font-medium transition-all text-left ${
                                    paymentMethod === 'qris'
                                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                                        : 'hover:bg-muted/50 text-foreground'
                                }`}
                            >
                                <QrCode className="h-5 w-5 shrink-0" />
                                <div>
                                    <p className="font-semibold leading-none">QRIS</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">Scan QR Code</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleMethodChange('transfer')}
                                className={`flex items-center gap-2.5 rounded-lg border p-3 text-sm font-medium transition-all text-left ${
                                    paymentMethod === 'transfer'
                                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                                        : 'hover:bg-muted/50 text-foreground'
                                }`}
                            >
                                <Building2 className="h-5 w-5 shrink-0" />
                                <div>
                                    <p className="font-semibold leading-none">Transfer</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">Bank Transfer</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleMethodChange('card')}
                                className={`flex items-center gap-2.5 rounded-lg border p-3 text-sm font-medium transition-all text-left ${
                                    paymentMethod === 'card'
                                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                                        : 'hover:bg-muted/50 text-foreground'
                                }`}
                            >
                                <CreditCard className="h-5 w-5 shrink-0" />
                                <div>
                                    <p className="font-semibold leading-none">Debit / Credit</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">EDC Machine</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Cash Payment Details */}
                    {paymentMethod === 'cash' ? (
                        <div className="space-y-3 pt-1 border-t">
                            <div className="space-y-1.5">
                                <Label htmlFor="pay_amount" className="text-xs font-semibold">Amount Received (Rp)</Label>
                                <Input
                                    id="pay_amount"
                                    type="number"
                                    min="0"
                                    step="500"
                                    value={payAmountInput}
                                    onChange={(e) => setPayAmountInput(e.target.value)}
                                    placeholder="Enter received amount"
                                    className="font-mono text-lg h-11 font-bold"
                                />
                            </div>

                            {/* Quick Presets */}
                            <div className="flex flex-wrap gap-1.5">
                                {quickCashPresets.map((val) => (
                                    <Button
                                        key={val}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPayAmountInput(val.toString())}
                                        className={`text-xs h-7 font-mono ${
                                            payAmountNum === val ? 'border-primary text-primary font-bold' : ''
                                        }`}
                                    >
                                        {val === total ? 'Exact Amount' : formatRupiah(val)}
                                    </Button>
                                ))}
                            </div>

                            {/* Change Display */}
                            <div className={`rounded-lg p-3 flex justify-between items-center ${
                                changeAmount >= 0 ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
                            }`}>
                                <span className="text-sm font-semibold">Change (Kembalian)</span>
                                <span className="text-lg font-black font-mono">
                                    {changeAmount >= 0 ? formatRupiah(changeAmount) : `- ${formatRupiah(Math.abs(changeAmount))}`}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            <span>Exact payment amount of <strong>{formatRupiah(total)}</strong> will be charged via {paymentMethod.toUpperCase()}.</span>
                        </div>
                    )}

                    {/* Notes Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="notes" className="text-xs font-semibold text-muted-foreground">Notes (Optional)</Label>
                        <Input
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g. Table 4, Takeaway..."
                            className="text-xs"
                        />
                    </div>

                    {/* Error Banner */}
                    {errorMsg && (
                        <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !isPayAmountValid}
                            className="gap-2 font-bold min-w-[120px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>Complete Sale</>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
