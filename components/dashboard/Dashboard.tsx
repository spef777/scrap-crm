"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, PhoneCall, TrendingUp, AlertCircle, Clock, CheckCircle, Package } from "lucide-react";
import { formatCurrency, formatDate, getStageInfo } from "@/lib/utils";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh" }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">{new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</p>
        </div>
        <Link href="/suppliers/new" className="btn btn-primary">+ Add Supplier</Link>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        <div className="stat-card orange">
          <div className="stat-icon"><PhoneCall size={20} /></div>
          <div className="stat-value">{data.todayFollowUps}</div>
          <div className="stat-label">Calls Today</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon"><AlertCircle size={20} /></div>
          <div className="stat-value">{data.overdueFollowUps}</div>
          <div className="stat-label">Overdue</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><TrendingUp size={20} /></div>
          <div className="stat-value">{data.monthDealsCount}</div>
          <div className="stat-label">Deals (Month)</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon"><Package size={20} /></div>
          <div className="stat-value">{(data.monthQuantity||0).toFixed(0)}kg</div>
          <div className="stat-label">Quantity</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon"><Users size={20} /></div>
          <div className="stat-value">{data.totalSuppliers}</div>
          <div className="stat-label">Total Suppliers</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon"><TrendingUp size={20} /></div>
          <div className="stat-value">{formatCurrency(data.monthDealsValue||0)}</div>
          <div className="stat-label">Revenue (Month)</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" }}>

        {/* Today's Call List */}
        <div className="card" style={{ gridColumn: data.overdueList?.length > 0 ? "1" : "1 / -1" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
            <h2 style={{ fontWeight:700, fontSize:"1rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <PhoneCall size={18} style={{ color:"var(--accent)" }} /> Today's Call List
              <span style={{ background:"var(--accent)", color:"#fff", fontSize:"0.7rem", padding:"0.1rem 0.5rem", borderRadius:999, fontWeight:700 }}>{data.todayCallList?.length || 0}</span>
            </h2>
            <Link href="/followups" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          {data.todayCallList?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📞</div>
              <h3>No calls scheduled today</h3>
              <p>Add suppliers or set follow-up dates</p>
            </div>
          ) : (
            <div>
              {data.todayCallList.slice(0, 8).map((s: any) => (
                <Link key={s.id} href={`/suppliers/${s.id}`} className="supplier-item" style={{ marginBottom:"0.5rem" }}>
                  <div className="supplier-avatar">{s.name[0].toUpperCase()}</div>
                  <div className="supplier-info">
                    <div className="supplier-name">{s.name}</div>
                    <div className="supplier-meta">
                      <span>📞 {s.phone}</span>
                      <span>📍 {s.location}</span>
                    </div>
                  </div>
                  <a href={`tel:${s.phone}`} className="btn btn-primary btn-sm" onClick={e=>e.stopPropagation()}>
                    <PhoneCall size={14} /> Call
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Overdue Follow-ups */}
        {data.overdueList?.length > 0 && (
          <div className="card">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
              <h2 style={{ fontWeight:700, fontSize:"1rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <AlertCircle size={18} style={{ color:"var(--danger)" }} /> Overdue
                <span style={{ background:"var(--danger)", color:"#fff", fontSize:"0.7rem", padding:"0.1rem 0.5rem", borderRadius:999, fontWeight:700 }}>{data.overdueList.length}</span>
              </h2>
              <Link href="/followups" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            {data.overdueList.slice(0, 6).map((s: any) => (
              <Link key={s.id} href={`/suppliers/${s.id}`} className="supplier-item" style={{ marginBottom:"0.5rem" }}>
                <div className="supplier-avatar" style={{ background:"rgba(239,68,68,0.15)", color:"var(--danger)" }}>{s.name[0].toUpperCase()}</div>
                <div className="supplier-info">
                  <div className="supplier-name">{s.name}</div>
                  <div className="supplier-meta">
                    <span style={{ color:"var(--danger)" }}>⚠️ Due: {formatDate(s.nextFollowUp)}</span>
                  </div>
                </div>
                <a href={`tel:${s.phone}`} className="btn btn-danger btn-sm" onClick={e=>e.stopPropagation()}>
                  <PhoneCall size={14} /> Call
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Top Suppliers */}
      {data.topSuppliers?.length > 0 && (
        <div className="card" style={{ marginTop:"1.25rem" }}>
          <h2 style={{ fontWeight:700, fontSize:"1rem", marginBottom:"1rem" }}>🏆 Top Suppliers by Deals</h2>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Supplier</th><th>Deals</th><th>Total Value</th></tr></thead>
              <tbody>
                {data.topSuppliers.map((s: any) => (
                  <tr key={s.id}>
                    <td><Link href={`/suppliers/${s.id}`} style={{ color:"var(--accent)", textDecoration:"none", fontWeight:600 }}>{s.name}</Link></td>
                    <td>{s.dealCount}</td>
                    <td>{formatCurrency(s.totalValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
