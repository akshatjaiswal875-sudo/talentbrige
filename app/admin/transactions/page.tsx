"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, X } from "lucide-react";

interface Transaction {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  courseId: {
    title: string;
    price: string;
  };
  amount: string;
  paymentId: string; // UTR
  status: 'success' | 'failed' | 'pending';
  createdAt: string;
  declineReason?: string;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const res = await fetch("/api/admin/transactions");
      const data = await res.json();
      if (data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    if (!confirm("Are you sure you want to approve this transaction?")) return;
    
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/transactions/${id}/approve`, {
        method: "POST",
      });
      
      if (res.ok) {
        // Update local state
        setTransactions(prev => prev.map(t => 
          t._id === id ? { ...t, status: 'success' } : t
        ));
      } else {
        alert("Failed to approve transaction");
      }
    } catch (error) {
      alert("Error approving transaction");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDecline(id: string) {
    if (!confirm("Are you sure you want to DECLINE this transaction?")) return;

    const note = prompt("Add a note for the learner (optional):");
    if (note === null) {
      return;
    }

    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/transactions/${id}/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: note?.trim() || undefined })
      });
      
      if (res.ok) {
        // Update local state
        setTransactions(prev => prev.map(t => 
          t._id === id ? { ...t, status: 'failed' } : t
        ));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Failed to decline transaction");
      }
    } catch (error) {
      alert("Error declining transaction");
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) return <div className="p-8 text-center">Loading transactions...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Transactions</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">UTR / Ref</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.map((t) => (
                  <tr key={t._id} className="bg-background hover:bg-muted/50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{t.userId?.name || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{t.userId?.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      {t.courseId?.title || "Unknown Course"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {t.amount}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {t.paymentId}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={t.status === 'success' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {t.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(t._id)}
                            disabled={processingId === t._id}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {processingId === t._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-1" /> Approve
                              </>
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDecline(t._id)}
                            disabled={processingId === t._id}
                          >
                            {processingId === t._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <X className="h-4 w-4 mr-1" /> Decline
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
