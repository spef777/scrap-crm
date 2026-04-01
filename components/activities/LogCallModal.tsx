"use client";
import { useState } from "react";
import { X, Save } from "lucide-react";
import { STAGES } from "@/lib/utils";

interface Props {
  supplierId: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function LogCallModal({ supplierId, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    remarks: "", outcome: "INTERESTED", followUpDate: "", stage: "",
    date: new Date().toISOString().slice(0,16),
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/activities", {
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
          <h2 className="modal-title" style={{ margin:0 }}>📞 Log Call</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Date & Time</label>
            <input className="input" type="datetime-local" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>

          <div className="form-group">
            <label className="label">Remarks / Notes *</label>
            <textarea className="textarea" value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} placeholder="What did you discuss? What did they say?" required style={{ minHeight:100 }} />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="label">Outcome *</label>
              <select className="select" value={form.outcome} onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))}>
                <option value="INTERESTED">✅ Interested</option>
                <option value="CALL_LATER">🔁 Call Later</option>
                <option value="NO_ANSWER">📵 No Answer</option>
                <option value="NOT_INTERESTED">❌ Not Interested</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Update Stage</label>
              <select className="select" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>
                <option value="">Keep Current</option>
                {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="label">Next Follow-up Date</label>
            <input className="input" type="date" value={form.followUpDate} onChange={e => setForm(f => ({ ...f, followUpDate: e.target.value }))} min={new Date().toISOString().split("T")[0]} />
          </div>

          <div style={{ display:"flex", gap:"0.75rem", justifyContent:"flex-end" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? "Saving..." : "Save Call"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
