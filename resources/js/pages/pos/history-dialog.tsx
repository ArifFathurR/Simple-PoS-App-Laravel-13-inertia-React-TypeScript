import { useState } from "react";
import { Transaction } from "@/types";
import { formatRupiah } from "./cart-panel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { History, Search, Receipt, Calendar, User, Banknote } from "lucide-react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transactions: Transaction[];
    onSelectTransaction: (transaction: Transaction) => void;
}

export default function HistoryDialog({ open, onOpenChange, transactions, onSelectTransaction }: Props) {
    const [search, setSearch] = useState("");

    const filtered = transactions.filter((t) =>
        t.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
        t.payment_method.toLowerCase().includes(search.toLowerCase()) ||
        (t.user?.name || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        Transaction History
                    </DialogTitle>
                </DialogHeader>

                {/* Search Bar */}
                <div className="relative my-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by invoice number, payment method, cashier..."
                        className="pl-9"
                    />
                </div>

                {/* Transactions List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2">
                    {filtered.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <History className="h-10 w-10 mx-auto mb-2 opacity-30" />
                            <p className="text-sm font-medium">No transactions found</p>
                        </div>
                    ) : (
                        filtered.map((t) => {
                            const dateStr = new Date(t.created_at).toLocaleString("id-ID", {
                                dateStyle: "short",
                                timeStyle: "short",
                            });
                            return (
                                <div
                                    key={t.id}
                                    className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-xs"
                                >
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-foreground font-mono">
                                                {t.invoice_number}
                                            </span>
                                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase">
                                                {t.payment_method}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {dateStr}
                                            </span>
                                            <span className="flex items-center gap-1 truncate">
                                                <User className="h-3 w-3" />
                                                {t.user?.name || "Cashier"}
                                            </span>
                                            <span className="font-medium text-foreground">
                                                {t.details?.length || 0} items
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <span className="block text-base font-extrabold text-primary font-mono">
                                                {formatRupiah(t.total_amount)}
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                onSelectTransaction(t);
                                                onOpenChange(false);
                                            }}
                                            className="gap-1.5 h-9"
                                        >
                                            <Receipt className="h-4 w-4" />
                                            Receipt
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
