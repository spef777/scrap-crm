"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { STAGES, getStageInfo } from "@/lib/utils";

export default function Pipeline() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/suppliers").then(r => r.json()).then(d => { setSuppliers(d); setLoading(false); });
  }, []);

  const byStage = (stage: string) => suppliers.filter(s => s.stage === stage);

  async function moveStage(supplierId: string, newStage: string) {
    setSuppliers(prev => prev.map(s => s.id === supplierId ? { ...s, stage: newStage } : s));
    await fetch(`/api/suppliers/${supplierId}/stage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    });
  }

  function handleDragStart(e: React.DragEvent, id: string) {
    setDragging(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(e: React.DragEvent, stage: string) {
    e.preventDefault();
    if (dragging) { moveStage(dragging, stage); setDragging(null); setDragOver(null); }
  }

  const openStages = STAGES.slice(0, 5);
  const closedStages = STAGES.slice(5);

  if (loading) return <div style={{ display:"flex", justifyContent:"center", padding:"3rem" }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pipeline</h1>
          <p className="page-subtitle">Drag suppliers between stages</p>
        </div>
        <Link href="/suppliers/new" className="btn btn-primary">+ Add Supplier</Link>
      </div>

      <div className="kanban-board">
        {[...openStages, ...closedStages].map(stage => {
          const list = byStage(stage.value);
          const isOver = dragOver === stage.value;
          return (
            <div
              key={stage.value}
              className="kanban-col"
              style={{ borderTop:`3px solid ${stage.color}`, opacity: isOver ? 0.9 : 1 }}
              onDragOver={e => { e.preventDefault(); setDragOver(stage.value); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => handleDrop(e, stage.value)}
            >
              <div className="kanban-col-header">
                <span style={{ fontWeight:700, fontSize:"0.8rem", color: stage.color }}>{stage.label}</span>
                <span style={{ background:`${stage.color}22`, color:stage.color, padding:"0.1rem 0.5rem", borderRadius:999, fontSize:"0.7rem", fontWeight:700 }}>
                  {list.length}
                </span>
              </div>

              {list.length === 0 && (
                <div style={{ textAlign:"center", padding:"1.5rem 0", color:"var(--text-muted)", fontSize:"0.75rem" }}>
                  Drop here
                </div>
              )}

              {list.map(s => (
                <div
                  key={s.id}
                  className="kanban-card"
                  draggable
                  onDragStart={e => handleDragStart(e, s.id)}
                  onDragEnd={() => { setDragging(null); setDragOver(null); }}
                  style={{ opacity: dragging === s.id ? 0.5 : 1 }}
                >
                  <Link href={`/suppliers/${s.id}`} style={{ textDecoration:"none", color:"inherit" }}>
                    <div style={{ fontWeight:600, fontSize:"0.875rem", marginBottom:"0.3rem" }}>{s.name}</div>
                    <div style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginBottom:"0.4rem" }}>📞 {s.phone}</div>
                    <div style={{ fontSize:"0.75rem", color:"var(--text-muted)" }}>📍 {s.location}</div>
                    {s.scrapTypes?.length > 0 && (
                      <div style={{ fontSize:"0.7rem", color:"var(--accent)", marginTop:"0.35rem" }}>
                        ♻️ {s.scrapTypes.slice(0,2).join(", ")}
                      </div>
                    )}
                    {s.nextFollowUp && (
                      <div style={{ fontSize:"0.7rem", color:"var(--warning)", marginTop:"0.3rem" }}>
                        📅 {new Date(s.nextFollowUp).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}
                      </div>
                    )}
                    {s.tags?.length > 0 && (
                      <div style={{ display:"flex", gap:"0.25rem", flexWrap:"wrap", marginTop:"0.4rem" }}>
                        {s.tags.slice(0,2).map((t: string) => (
                          <span key={t} style={{ fontSize:"0.6rem", padding:"0.1rem 0.4rem", background:"var(--accent-light)", color:"var(--accent)", borderRadius:4 }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </Link>
                  {/* Quick stage move */}
                  <div style={{ display:"flex", gap:"0.25rem", marginTop:"0.5rem", flexWrap:"wrap" }}>
                    {STAGES.filter(st => st.value !== stage.value).slice(0,3).map(st => (
                      <button key={st.value} onClick={e => { e.preventDefault(); moveStage(s.id, st.value); }}
                        style={{ fontSize:"0.6rem", padding:"0.1rem 0.4rem", background:`${st.color}22`, color:st.color, border:`1px solid ${st.color}44`, borderRadius:4, cursor:"pointer" }}>
                        → {st.label.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
