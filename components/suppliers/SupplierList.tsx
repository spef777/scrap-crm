"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Users, PhoneCall, Search, Filter, Plus, X } from "lucide-react";
import { SCRAP_TYPES, STAGES, TAGS, formatDate, getStageInfo } from "@/lib/utils";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ stage: "", scrapType: "", category: "", tag: "" });
  const [showFilters, setShowFilters] = useState(false);

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    setLoading(true);
    fetch(`/api/suppliers?${params}`).then(r => r.json()).then(d => { setSuppliers(d); setLoading(false); });
  }, [search, filters]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);

  const stageColor: Record<string, string> = {
    NEW_LEAD:"#6366f1", CONTACTED:"#3b82f6", FOLLOW_UP_NEEDED:"#f59e0b", INTERESTED:"#10b981",
    REGULAR_SUPPLIER:"#059669", DEAL_FINALIZED:"#8b5cf6", NOT_INTERESTED:"#ef4444", INVALID_CONTACT:"#6b7280"
  };

  const clearFilters = () => setFilters({ stage:"", scrapType:"", category:"", tag:"" });
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Suppliers</h1>
          <p className="page-subtitle">{suppliers.length} suppliers found</p>
        </div>
        <Link href="/suppliers/new" className="btn btn-primary"><Plus size={16} /> Add Supplier</Link>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={16} className="search-icon" />
        <input placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Filter toggle */}
      <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1rem" }}>
        <button className={`btn btn-secondary btn-sm ${hasFilters ? "active" : ""}`} onClick={() => setShowFilters(!showFilters)}>
          <Filter size={14} /> Filters {hasFilters ? `(${Object.values(filters).filter(Boolean).length})` : ""}
        </button>
        {hasFilters && <button className="btn btn-ghost btn-sm" onClick={clearFilters}><X size={14} /> Clear</button>}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="card" style={{ marginBottom:"1rem", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:"0.75rem" }}>
          <div>
            <label className="label">Stage</label>
            <select className="select" value={filters.stage} onChange={e => setFilters(f => ({ ...f, stage: e.target.value }))}>
              <option value="">All Stages</option>
              {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Scrap Type</label>
            <select className="select" value={filters.scrapType} onChange={e => setFilters(f => ({ ...f, scrapType: e.target.value }))}>
              <option value="">All Types</option>
              {SCRAP_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Category</label>
            <select className="select" value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
              <option value="">All</option>
              <option value="SMALL">Small</option>
              <option value="MEDIUM">Medium</option>
              <option value="BULK">Bulk</option>
            </select>
          </div>
          <div>
            <label className="label">Tag</label>
            <select className="select" value={filters.tag} onChange={e => setFilters(f => ({ ...f, tag: e.target.value }))}>
              <option value="">All Tags</option>
              {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:"3rem" }}><div className="spinner" /></div>
      ) : suppliers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Users size={48} /></div>
          <h3>No suppliers found</h3>
          <p style={{ marginBottom:"1rem" }}>Add your first supplier to start tracking</p>
          <Link href="/suppliers/new" className="btn btn-primary">+ Add Supplier</Link>
        </div>
      ) : (
        <div>
          {suppliers.map(s => {
            const stColor = stageColor[s.stage] || "#6b7280";
            return (
              <Link key={s.id} href={`/suppliers/${s.id}`} className="supplier-item">
                <div className="supplier-avatar">{s.name[0]?.toUpperCase()}</div>
                <div className="supplier-info">
                  <div className="supplier-name">{s.name}</div>
                  <div className="supplier-meta">
                    <span>📞 {s.phone}</span>
                    <span>📍 {s.location}</span>
                    {s.scrapTypes?.length > 0 && <span>♻️ {s.scrapTypes.slice(0,2).join(", ")}</span>}
                  </div>
                  <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap", marginTop:"0.35rem" }}>
                    <span className="badge" style={{ background:`${stColor}22`, color:stColor, border:`1px solid ${stColor}44` }}>
                      {STAGES.find(st => st.value === s.stage)?.label || s.stage}
                    </span>
                    <span className="badge" style={{ background:"var(--bg-hover)", color:"var(--text-muted)" }}>
                      {s._count?.activities || 0} calls
                    </span>
                    {s.nextFollowUp && (
                      <span className="badge" style={{ background:"rgba(249,115,22,0.15)", color:"var(--accent)" }}>
                        📅 {formatDate(s.nextFollowUp)}
                      </span>
                    )}
                    {s.tags?.slice(0,2).map((t: string) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="supplier-actions">
                  <a href={`tel:${s.phone}`} className="btn btn-primary btn-sm" onClick={e => e.stopPropagation()}>
                    <PhoneCall size={14} />
                  </a>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
