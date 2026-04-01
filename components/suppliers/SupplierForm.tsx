"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { SCRAP_TYPES, STAGES, TAGS } from "@/lib/utils";

interface Props { supplierId?: string; }

export default function SupplierForm({ supplierId }: Props) {
  const router = useRouter();
  const isEdit = !!supplierId;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", location: "", quantity: "", notes: "",
    category: "SMALL", stage: "NEW_LEAD",
    scrapTypes: [] as string[], tags: [] as string[],
  });

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      fetch(`/api/suppliers/${supplierId}`).then(r => r.json()).then(d => {
        setForm({ name:d.name, phone:d.phone, location:d.location||"", quantity:d.quantity||"", notes:d.notes||"", category:d.category, stage:d.stage, scrapTypes:d.scrapTypes||[], tags:d.tags||[] });
        setLoading(false);
      });
    }
  }, [supplierId, isEdit]);

  function toggleChip(arr: string[], val: string, setter: (v: string[]) => void) {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = isEdit ? `/api/suppliers/${supplierId}` : "/api/suppliers";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      const data = await res.json();
      router.push(`/suppliers/${data.id}`);
    } else {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ display:"flex", justifyContent:"center", padding:"3rem" }}><div className="spinner" /></div>;

  return (
    <div style={{ maxWidth:640 }}>
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.back()}><ArrowLeft size={18} /></button>
          <h1 className="page-title">{isEdit ? "Edit Supplier" : "Add New Supplier"}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-grid">
          <div className="form-group">
            <label className="label">Supplier Name *</label>
            <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Ramesh Trading" required />
          </div>
          <div className="form-group">
            <label className="label">Phone Number *</label>
            <input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" required />
          </div>
          <div className="form-group">
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City / Area" />
          </div>
          <div className="form-group">
            <label className="label">Approx. Quantity</label>
            <input className="input" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="e.g. 500 kg/month" />
          </div>
          <div className="form-group">
            <label className="label">Category</label>
            <select className="select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="SMALL">Small</option>
              <option value="MEDIUM">Medium</option>
              <option value="BULK">Bulk</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label">Stage</label>
            <select className="select" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>
              {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="label">Scrap Types</label>
          <div className="checkbox-group">
            {SCRAP_TYPES.map(t => (
              <label key={t.value} className={`checkbox-chip ${form.scrapTypes.includes(t.value) ? "selected" : ""}`}>
                <input type="checkbox" checked={form.scrapTypes.includes(t.value)} onChange={() => toggleChip(form.scrapTypes, t.value, v => setForm(f => ({ ...f, scrapTypes: v })))} />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="label">Tags</label>
          <div className="checkbox-group">
            {TAGS.map(t => (
              <label key={t} className={`checkbox-chip ${form.tags.includes(t) ? "selected" : ""}`}>
                <input type="checkbox" checked={form.tags.includes(t)} onChange={() => toggleChip(form.tags, t, v => setForm(f => ({ ...f, tags: v })))} />
                {t}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="label">Notes</label>
          <textarea className="textarea" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any additional notes about this supplier..." />
        </div>

        <div style={{ display:"flex", gap:"0.75rem", justifyContent:"flex-end" }}>
          <button type="button" className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={16} /> {saving ? "Saving..." : isEdit ? "Update Supplier" : "Add Supplier"}
          </button>
        </div>
      </form>
    </div>
  );
}
