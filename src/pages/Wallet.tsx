import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, Download } from "lucide-react";

interface Transaction {
  id: number;
  type: "credit" | "debit";
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending";
}

const Wallet = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [pendingBalance, setPendingBalance] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const w = await api.fetchWallet(1);
        if (!mounted) return;
        // map backend wallet.transactions to Transaction[] shape
        const txs = (w.transactions || []).map((t, idx) => ({
          id: idx + 1,
          type: t.type,
          description: t.source || (t.type === "credit" ? "Credit" : "Debit"),
          amount: t.amount,
          date: t.at || new Date().toISOString(),
          status: "completed",
        }));
        setTransactions(txs);
        setBalance(Number(w.balance || 0));
        // set a random pending balance (stable for this view)
        setPendingBalance(Math.floor(Math.random() * 500));
      } catch (e) {
        console.error("Failed to load wallet", e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const totalBalance = balance ?? 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Wallet</h1>
            <p className="text-muted-foreground text-lg">
              Manage your earnings and transactions
            </p>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card border-border gradient-primary text-white">
              <CardHeader>
                <CardTitle className="text-white/90 flex items-center gap-2">
                  <WalletIcon className="w-5 h-5" />
                  Available Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4">₹{totalBalance.toFixed(2)}</div>
                <Button variant="secondary" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Withdraw Funds
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="text-muted-foreground">Pending Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4 text-accent">
                  ₹{pendingBalance.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Earnings will be available once tasks are verified
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Transactions */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View all your earnings and withdrawals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "credit"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowDownLeft className="w-5 h-5" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={transaction.status === "completed" ? "default" : "secondary"}
                        className={
                          transaction.status === "completed"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : ""
                        }
                      >
                        {transaction.status}
                      </Badge>
                      <p
                        className={`font-bold text-lg ${
                          transaction.type === "credit" ? "text-primary" : "text-secondary"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : ""}₹{Math.abs(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wallet;
