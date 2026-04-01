"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Package } from "lucide-react";
import { formatDate, formatCurrency, SCRAP_TYPES } from "@/lib/utils";

export default function Deals() {
  const [summary, setSummary] = useState<any>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/deals/summary").then(r => r.json()),
      fetch("/api/deals").then(r => r.json()),
    ]).then(([s, d]) => { setSummary(s); setDeals(d); setLoading(false); });
  }, []);

  if (loading) return <div style={{ display:"flex", justifyContent:"center", padding:"3rem" }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Deals</h1>
          <p className="page-subtitle">All transactions and deal history</p>
        </div>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="stat-cards" style={{ marginBottom:"1.5rem" }}>
          <div className="stat-card orange">
            <div className="stat-icon"><TrendingUp size={20} /></div>
            <div className="stat-value">{summary.today.count}</div>
            <div className="stat-label">Today's Deals</div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon"><TrendingUp size={20} /></div>
            <div className="stat-value">{summary.week.count}</div>
            <div className="stat-label">This Week</div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon"><TrendingUp size={20} /></div>
            <div className="stat-value">{summary.month.count}</div>
            <div className="stat-label">This Month</div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon"><Package size={20} /></div>
            <div className="stat-value">{(summary.month.totalQuantity||0).toFixed(0)}kg</div>
            <div className="stat-label">Qty (Month)</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon"><TrendingUp size={20} /></div>
            <div className="stat-value">{formatCurrency(summary.month.totalValue||0)}</div>
            <div className="stat-label">Revenue (Month)</div>
          </div>
        </div>
      )}

      {/* Deals table */}
      {deals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💰</div>
          <h3>No deals recorded yet</h3>
          <p>Log deals from a supplier's profile page</p>
          <Link href="/suppliers" className="btn btn-primary" style={{ marginTop:"0.5rem" }}>Go to Suppliers</Link>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Supplier</th>
                <th>Scrap Type</th>
                <th>Qty (kg)</th>
                <th>Rate/kg</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((d: any) => (
                <tr key={d.id}>
                  <td>{formatDate(d.date)}</td>
                  <td>
                    <Link href={`/suppliers/${d.supplierId}`} style={{ color:"var(--accent)", textDecoration:"none", fontWeight:600 }}>
                      {d.supplier?.name || "—"}
                    </Link>
                    <div style={{ fontSize:"0.75rem", color:"var(--text-muted)" }}>{d.supplier?.location}</div>
                  </td>
                  <td><span className="tag">♻️ {SCRAP_TYPES.find(t => t.value === d.scrapType)?.label || d.scrapType}</span></td>
                  <td>{d.quantity} kg</td>
                  <td>₹{d.ratePerKg}</td>
                  <td style={{ fontWeight:700, color:"var(--success)" }}>{formatCurrency(d.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
