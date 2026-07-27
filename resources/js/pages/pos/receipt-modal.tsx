import { Transaction } from "@/types";
import { formatRupiah } from "./cart-panel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, CheckCircle2, ShoppingBag } from "lucide-react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Transaction | null;
    onNewTransaction: () => void;
}

export default function ReceiptModal({ open, onOpenChange, transaction, onNewTransaction }: Props) {
    if (!transaction) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleNew = () => {
        onOpenChange(false);
        onNewTransaction();
    };

    const formattedDate = new Date(transaction.created_at || Date.now()).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader className="text-center sm:text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-center">Transaction Successful!</DialogTitle>
                    <p className="text-xs text-muted-foreground">Invoice #{transaction.invoice_number}</p>
                </DialogHeader>

                {/* Printable Receipt Paper */}
                <div id="receipt-paper" className="my-2 rounded-xl border bg-card p-5 font-mono text-xs shadow-inner space-y-4 text-foreground">
                    {/* Store Header */}
                    <div className="text-center border-b pb-3 space-y-1">
                        <div className="flex items-center justify-center gap-1.5 font-sans font-black text-lg">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                            <span>POS STORE</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-sans">Point of Sale System</p>
                        <p className="text-[10px] text-muted-foreground">{formattedDate}</p>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Invoice:</span>
                            <span className="font-bold">{transaction.invoice_number}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Cashier:</span>
                            <span>{transaction.user?.name || 'Staff'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment:</span>
                            <span className="uppercase font-semibold">{transaction.payment_method}</span>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="border-t border-b py-3 space-y-2">
                        {transaction.details?.map((detail) => (
                            <div key={detail.id} className="space-y-0.5">
                                <div className="font-semibold text-foreground font-sans truncate">
                                    {detail.product?.name || `Product #${detail.product_id}`}
                                </div>
                                <div className="flex justify-between text-[11px] text-muted-foreground">
                                    <span>
                                        {detail.quantity} x {formatRupiah(detail.price)}
                                    </span>
                                    <span className="font-mono font-medium text-foreground">
                                        {formatRupiah(detail.subtotal)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-1.5 pt-1 text-[11px]">
                        <div className="flex justify-between font-bold text-sm text-foreground pt-1 border-t">
                            <span>TOTAL</span>
                            <span>{formatRupiah(transaction.total_amount)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>PAID ({transaction.payment_method.toUpperCase()})</span>
                            <span>{formatRupiah(transaction.pay_amount)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>CHANGE</span>
                            <span>{formatRupiah(transaction.change_amount)}</span>
                        </div>
                    </div>

                    {transaction.notes && (
                        <div className="border-t pt-2 text-[10px] text-muted-foreground">
                            <strong>Note:</strong> {transaction.notes}
                        </div>
                    )}

                    {/* Receipt Footer */}
                    <div className="text-center border-t pt-3 text-[10px] text-muted-foreground font-sans">
                        <p className="font-medium">Thank you for your purchase!</p>
                        <p>Please come again.</p>
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrint}
                        className="gap-2 flex-1"
                    >
                        <Printer className="h-4 w-4" />
                        Print Receipt
                    </Button>
                    <Button
                        type="button"
                        onClick={handleNew}
                        className="gap-2 flex-1 font-bold"
                    >
                        New Transaction
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
