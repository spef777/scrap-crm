"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PhoneCall, Edit, Trash2, Plus, Star } from "lucide-react";
import { formatDate, formatDateTime, formatCurrency, getStageInfo, STAGES, SCRAP_TYPES } from "@/lib/utils";
import LogCallModal from "../activities/LogCallModal";
import LogDealModal from "../deals/LogDealModal";

export default function SupplierProfile({ supplierId }: { supplierId: string }) {
  const router = useRouter();
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"timeline" | "deals">("timeline");
  const [deleting, setDeleting] = useState(false);

  const reload = () => {
    fetch(`/api/suppliers/${supplierId}`).then(r => r.json()).then(d => { setSupplier(d); setLoading(false); });
  };
  useEffect(reload, [supplierId]);

  async function handleDelete() {
    if (!confirm("Delete this supplier and all their data? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/suppliers/${supplierId}`, { method: "DELETE" });
    router.push("/suppliers");
  }

  const stageInfo = supplier ? STAGES.find(s => s.value === supplier.stage) : null;

  if (loading) return <div style={{ display:"flex", justifyContent:"center", padding:"3rem" }}><div className="spinner" /></div>;
  if (!supplier) return <div className="empty-state"><h3>Supplier not found</h3></div>;

  // Build merged timeline
  const timeline = [
    ...(supplier.activities || []).map((a: any) => ({ ...a, _type: "activity" })),
    ...(supplier.deals || []).map((d: any) => ({ ...d, _type: "deal" })),
  ].sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());

  const outcomeColors: Record<string, string> = {
    INTERESTED: "var(--success)", NOT_INTERESTED: "var(--danger)",
    CALL_LATER: "var(--warning)", NO_ANSWER: "var(--text-muted)"
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:"1rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
        <button className="btn btn-ghost btn-sm" onClick={() => router.back()}><ArrowLeft size={18} /></button>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", flexWrap:"wrap" }}>
            <h1 style={{ fontSize:"1.5rem", fontWeight:700 }}>{supplier.name}</h1>
            <span className="badge" style={{
              background:`${stageInfo?.color || "#6b7280"}22`,
              color: stageInfo?.color || "#6b7280",
              border:`1px solid ${stageInfo?.color || "#6b7280"}44`,
              fontSize:"0.75rem"
            }}>
              {stageInfo?.label || supplier.stage}
            </span>
            <span className="badge" style={{ background:"var(--bg-hover)", color:"var(--text-muted)" }}>
              {supplier.category}
            </span>
          </div>
          <p style={{ color:"var(--text-muted)", fontSize:"0.875rem", marginTop:"0.35rem" }}>
            📞 {supplier.phone} &nbsp;|&nbsp; 📍 {supplier.location}
          </p>
          {supplier.scrapTypes?.length > 0 && (
            <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap", marginTop:"0.5rem" }}>
              {supplier.scrapTypes.map((t: string) => (
                <span key={t} className="tag">♻️ {SCRAP_TYPES.find(s => s.value === t)?.label || t}</span>
              ))}
            </div>
          )}
          {supplier.tags?.length > 0 && (
            <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap", marginTop:"0.4rem" }}>
              {supplier.tags.map((t: string) => (
                <span key={t} style={{ display:"inline-flex", alignItems:"center", gap:"0.25rem", padding:"0.15rem 0.5rem", background:"var(--accent-light)", color:"var(--accent)", borderRadius:999, fontSize:"0.7rem", fontWeight:600 }}>
                  ⭐ {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <Link href={`/suppliers/${supplierId}/edit`} className="btn btn-secondary btn-sm"><Edit size={14} /> Edit</Link>
          <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}><Trash2 size={14} /></button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(120px, 1fr))", gap:"0.75rem", marginBottom:"1.25rem" }}>
        <div className="card" style={{ textAlign:"center", padding:"1rem" }}>
          <div style={{ fontSize:"1.5rem", fontWeight:700, color:"var(--accent)" }}>{supplier._count?.activities || 0}</div>
          <div style={{ fontSize:"0.75rem", color:"var(--text-muted)" }}>Total Calls</div>
        </div>
        <div className="card" style={{ textAlign:"center", padding:"1rem" }}>
          <div style={{ fontSize:"1.5rem", fontWeight:700, color:"var(--success)" }}>{supplier._count?.deals || 0}</div>
          <div style={{ fontSize:"0.75rem", color:"var(--text-muted)" }}>Deals Done</div>
        </div>
        <div className="card" style={{ textAlign:"center", padding:"1rem" }}>
          <div style={{ fontSize:"1.1rem", fontWeight:700, color:"var(--purple)" }}>{formatCurrency(supplier.totalDealValue || 0)}</div>
          <div style={{ fontSize:"0.75rem", color:"var(--text-muted)" }}>Total Value</div>
        </div>
        <div className="card" style={{ textAlign:"center", padding:"1rem" }}>
          <div style={{ fontSize:"1.25rem", fontWeight:700, color:"var(--info)" }}>{(supplier.totalQuantity || 0).toFixed(0)}kg</div>
          <div style={{ fontSize:"0.75rem", color:"var(--text-muted)" }}>Qty Collected</div>
        </div>
        {supplier.nextFollowUp && (
          <div className="card" style={{ textAlign:"center", padding:"1rem" }}>
            <div style={{ fontSize:"0.95rem", fontWeight:700, color:"var(--warning)" }}>{formatDate(supplier.nextFollowUp)}</div>
            <div style={{ fontSize:"0.75rem", color:"var(--text-muted)" }}>Next Follow-up</div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"0.75rem", marginBottom:"1.5rem" }}>
        <a href={`tel:${supplier.phone}`} className="quick-action" style={{ color:"var(--success)", borderColor:"rgba(16,185,129,0.3)", background:"rgba(16,185,129,0.08)" }}>
          <PhoneCall size={22} /> Call Now
        </a>
        <button className="quick-action" onClick={() => setShowCallModal(true)}>
          <Plus size={22} /> Log Call
        </button>
        <button className="quick-action" onClick={() => setShowDealModal(true)}>
          <Star size={22} /> Log Deal
        </button>
        <Link href={`/suppliers/${supplierId}/edit`} className="quick-action">
          <Edit size={22} /> Edit
        </Link>
      </div>

      {/* Notes */}
      {supplier.notes && (
        <div className="card" style={{ marginBottom:"1.25rem", borderLeft:"3px solid var(--accent)" }}>
          <div style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginBottom:"0.4rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>Notes</div>
          <p style={{ fontSize:"0.875rem" }}>{supplier.notes}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === "timeline" ? "active" : ""}`} onClick={() => setActiveTab("timeline")}>
          Timeline ({timeline.length})
        </button>
        <button className={`tab ${activeTab === "deals" ? "active" : ""}`} onClick={() => setActiveTab("deals")}>
          Deals ({supplier.deals?.length || 0})
        </button>
      </div>

      {/* Timeline */}
      {activeTab === "timeline" && (
        <div>
          {timeline.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No activity yet</h3>
              <p>Log your first call with this supplier</p>
              <button className="btn btn-primary" style={{ marginTop:"0.5rem" }} onClick={() => setShowCallModal(true)}>Log First Call</button>
            </div>
          ) : (
            <div className="timeline">
              {timeline.map((item: any) => (
                <div key={item.id} className="timeline-item">
                  <div className="timeline-dot" style={{
                    background: item._type === "deal" ? "var(--success)" : (outcomeColors[item.outcome] || "var(--accent)")
                  }} />
                  <div className="timeline-card">
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.5rem" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                        <span style={{ fontSize:"0.7rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color: item._type === "deal" ? "var(--success)" : (outcomeColors[item.outcome] || "var(--accent)") }}>
                          {item._type === "deal" ? "💰 Deal" : "📞 Call"}
                        </span>
                        {item._type === "activity" && item.outcome && (
                          <span className="badge" style={{ background:`${outcomeColors[item.outcome]}22`, color:outcomeColors[item.outcome] }}>
                            {item.outcome.replace("_", " ")}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize:"0.75rem", color:"var(--text-muted)" }}>{formatDateTime(item.date || item.createdAt)}</span>
                    </div>

                    {item._type === "activity" && (
                      <>
                        <p style={{ fontSize:"0.875rem", marginBottom:"0.4rem" }}>{item.remarks}</p>
                        {item.followUpDate && (
                          <p style={{ fontSize:"0.75rem", color:"var(--warning)" }}>
                            📅 Follow-up: {formatDate(item.followUpDate)}
                          </p>
                        )}
                      </>
                    )}

                    {item._type === "deal" && (
                      <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
                        <span style={{ fontSize:"0.875rem" }}>♻️ {item.scrapType}</span>
                        <span style={{ fontSize:"0.875rem" }}>⚖️ {item.quantity} kg</span>
                        <span style={{ fontSize:"0.875rem" }}>💰 ₹{item.ratePerKg}/kg</span>
                        <span style={{ fontSize:"0.875rem", fontWeight:700, color:"var(--success)" }}>{formatCurrency(item.totalValue)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Deals tab */}
      {activeTab === "deals" && (
        <div>
          {supplier.deals?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💰</div>
              <h3>No deals yet</h3>
              <button className="btn btn-primary" onClick={() => setShowDealModal(true)}>Log First Deal</button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Date</th><th>Type</th><th>Qty (kg)</th><th>Rate/kg</th><th>Total</th></tr></thead>
                <tbody>
                  {supplier.deals.map((d: any) => (
                    <tr key={d.id}>
                      <td>{formatDate(d.date)}</td>
                      <td><span className="tag">♻️ {d.scrapType}</span></td>
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
      )}

      {/* Modals */}
      {showCallModal && (
        <LogCallModal supplierId={supplierId} onClose={() => setShowCallModal(false)} onSaved={() => { setShowCallModal(false); reload(); }} />
      )}
      {showDealModal && (
        <LogDealModal supplierId={supplierId} onClose={() => setShowDealModal(false)} onSaved={() => { setShowDealModal(false); reload(); }} />
      )}
    </div>
  );
}
