"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { PhoneCall, Calendar, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import LogCallModal from "../activities/LogCallModal";

type Tab = "today" | "overdue" | "upcoming";

export default function FollowUps() {
  const [tab, setTab] = useState<Tab>("today");
  const [data, setData] = useState<any>({ suppliers: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [callModal, setCallModal] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/followups?type=${tab}`).then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  const tabConfig = [
    { key: "today" as Tab, label: "Today", icon: PhoneCall, color: "var(--accent)" },
    { key: "overdue" as Tab, label: "Overdue", icon: AlertCircle, color: "var(--danger)" },
    { key: "upcoming" as Tab, label: "Upcoming (7 days)", icon: Clock, color: "var(--info)" },
  ];

  const stageColors: Record<string, string> = {
    NEW_LEAD:"#6366f1", CONTACTED:"#3b82f6", FOLLOW_UP_NEEDED:"#f59e0b",
    INTERESTED:"#10b981", REGULAR_SUPPLIER:"#059669", DEAL_FINALIZED:"#8b5cf6",
    NOT_INTERESTED:"#ef4444", INVALID_CONTACT:"#6b7280"
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Follow-ups</h1>
          <p className="page-subtitle">Your daily call schedule</p>
        </div>
        <Link href="/suppliers/new" className="btn btn-primary">+ Add Supplier</Link>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabConfig.map(({ key, label, icon: Icon, color }) => (
          <button key={key} className={`tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
            <span style={{ display:"flex", alignItems:"center", gap:"0.4rem", justifyContent:"center" }}>
              <Icon size={15} style={{ color: tab === key ? color : "inherit" }} />
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Alert banner */}
      {!loading && (
        <div className={`alert ${tab === "overdue" ? "alert-overdue" : tab === "today" ? "alert-today" : "alert-upcoming"}`}>
          {tab === "overdue" ? <AlertCircle size={18} /> : tab === "today" ? <PhoneCall size={18} /> : <Clock size={18} />}
          <span>
            <strong>{data.count} supplier{data.count !== 1 ? "s" : ""}</strong>
            {tab === "overdue" ? " overdue — call them now!" : tab === "today" ? " scheduled for today" : " in the next 7 days"}
          </span>
        </div>
      )}

      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:"3rem" }}><div className="spinner" /></div>
      ) : data.suppliers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><CheckCircle size={48} /></div>
          <h3>
            {tab === "today" ? "No calls due today 🎉" :
             tab === "overdue" ? "No overdue follow-ups! ✅" :
             "No upcoming follow-ups scheduled"}
          </h3>
          <p>
            {tab === "today" ? "You're all caught up. Add new suppliers or check upcoming." :
             tab === "overdue" ? "Great job staying on top of your calls!" :
             "Set follow-up dates when logging calls to see them here."}
          </p>
        </div>
      ) : (
        <div>
          {data.suppliers.map((s: any) => {
            const stColor = stageColors[s.stage] || "#6b7280";
            const isOverdue = tab === "overdue";
            return (
              <div key={s.id} className="supplier-item" style={{ flexWrap:"wrap", gap:"0.75rem" }}>
                <Link href={`/suppliers/${s.id}`} style={{ display:"flex", alignItems:"center", gap:"1rem", flex:1, textDecoration:"none", color:"inherit", minWidth:0 }}>
                  <div className="supplier-avatar" style={isOverdue ? { background:"rgba(239,68,68,0.15)", color:"var(--danger)" } : {}}>
                    {s.name[0]?.toUpperCase()}
                  </div>
                  <div className="supplier-info">
                    <div className="supplier-name">{s.name}</div>
                    <div className="supplier-meta">
                      <span>📞 {s.phone}</span>
                      <span>📍 {s.location}</span>
                    </div>
                    <div style={{ display:"flex", gap:"0.5rem", marginTop:"0.35rem", flexWrap:"wrap" }}>
                      <span className="badge" style={{ background:`${stColor}22`, color:stColor, border:`1px solid ${stColor}44` }}>
                        {s.stage.replace(/_/g, " ")}
                      </span>
                      <span className="badge" style={{
                        background: isOverdue ? "rgba(239,68,68,0.15)" : "rgba(249,115,22,0.1)",
                        color: isOverdue ? "var(--danger)" : "var(--accent)",
                      }}>
                        {isOverdue ? "⚠️" : "📅"} {formatDate(s.nextFollowUp)}
                      </span>
                      <span className="badge" style={{ background:"var(--bg-hover)", color:"var(--text-muted)" }}>
                        {s._count?.activities || 0} calls
                      </span>
                    </div>
                  </div>
                </Link>
                <div style={{ display:"flex", gap:"0.5rem", flexShrink:0 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setCallModal(s.id)}>
                    📝 Log Call
                  </button>
                  <a href={`tel:${s.phone}`} className="btn btn-primary btn-sm">
                    <PhoneCall size={14} /> Call
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {callModal && (
        <LogCallModal
          supplierId={callModal}
          onClose={() => setCallModal(null)}
          onSaved={() => { setCallModal(null); load(); }}
        />
      )}
    </div>
  );
}
