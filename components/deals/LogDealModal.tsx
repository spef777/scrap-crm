"use client";
import { useState } from "react";
import { X, Save } from "lucide-react";
import { SCRAP_TYPES, formatCurrency } from "@/lib/utils";

interface Props {
  supplierId: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function LogDealModal({ supplierId, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    scrapType: "iron", quantity: "", ratePerKg: "", notes: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [saving, setSaving] = useState(false);

  const total = parseFloat(form.quantity || "0") * parseFloat(form.ratePerKg || "0");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, supplierId }),
    });
    onSaved();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.25rem" }}>
          <h2 className="modal-title" style={{ margin:0 }}>💰 Log Deal</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="label">Date</label>
              <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="label">Scrap Type *</label>
              <select className="select" value={form.scrapType} onChange={e => setForm(f => ({ ...f, scrapType: e.target.value }))}>
                {SCRAP_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Quantity (kg) *</label>
              <input className="input" type="number" min="0" step="0.1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="e.g. 250" required />
            </div>
            <div className="form-group">
              <label className="label">Rate per kg (₹) *</label>
              <input className="input" type="number" min="0" step="0.01" value={form.ratePerKg} onChange={e => setForm(f => ({ ...f, ratePerKg: e.target.value }))} placeholder="e.g. 45" required />
            </div>
          </div>

          {total > 0 && (
            <div style={{ background:"var(--accent-light)", border:"1px solid var(--accent)", borderRadius:8, padding:"0.75rem", marginBottom:"1rem", textAlign:"center" }}>
              <div style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginBottom:"0.25rem" }}>Total Deal Value</div>
              <div style={{ fontSize:"1.5rem", fontWeight:700, color:"var(--accent)" }}>{formatCurrency(total)}</div>
            </div>
          )}

          <div className="form-group">
            <label className="label">Notes</label>
            <textarea className="textarea" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any notes about this deal..." />
          </div>

          <div style={{ display:"flex", gap:"0.75rem", justifyContent:"flex-end" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? "Saving..." : "Save Deal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
