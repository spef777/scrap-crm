"use client";
import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";

const REQUIRED_COLS = ["name", "phone"];
const OPTIONAL_COLS = ["location", "scrapTypes", "quantity", "category", "tags", "notes"];
const ALL_COLS = [...REQUIRED_COLS, ...OPTIONAL_COLS];

export default function ImportPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [status, setStatus] = useState<{ type: "idle"|"loading"|"success"|"error", message?: string }>({ type: "idle" });
  const [result, setResult] = useState<{ created: number; errors: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function downloadTemplate() {
    const data = [
      { name: "Ramesh Trading", phone: "9876543210", location: "Kochi", scrapTypes: "iron,copper", quantity: "500 kg/month", category: "MEDIUM", tags: "High Value", notes: "Good contact" },
      { name: "Suresh Metals", phone: "9988776655", location: "Ernakulam", scrapTypes: "aluminium", quantity: "200 kg", category: "SMALL", tags: "Nearby", notes: "" },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
    XLSX.writeFile(wb, "scrap_crm_import_template.xlsx");
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target?.result, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        if (json.length === 0) { setStatus({ type:"error", message:"File is empty" }); return; }
        setRows(json);
        setHeaders(Object.keys(json[0]));
        setStatus({ type:"idle" });
        setResult(null);
      } catch {
        setStatus({ type:"error", message:"Could not parse file. Use .xlsx or .csv" });
      }
    };
    reader.readAsBinaryString(file);
  }

  async function handleImport() {
    if (rows.length === 0) return;
    setStatus({ type:"loading" });
    const res = await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    const data = await res.json();
    setResult(data);
    setStatus({ type: data.errors > 0 ? "error" : "success", message: `Imported ${data.created} suppliers${data.errors > 0 ? `, ${data.errors} failed` : ""}` });
    if (data.created > 0) { setRows([]); setHeaders([]); if (fileRef.current) fileRef.current.value = ""; }
  }

  return (
    <div style={{ maxWidth:800 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Import Suppliers</h1>
          <p className="page-subtitle">Bulk import from Excel (.xlsx) or CSV</p>
        </div>
      </div>

      {/* Template download */}
      <div className="card" style={{ marginBottom:"1.25rem", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <div style={{ fontWeight:600, marginBottom:"0.25rem" }}>📄 Download Template</div>
          <div style={{ fontSize:"0.875rem", color:"var(--text-muted)" }}>Use this Excel template to format your supplier data correctly</div>
        </div>
        <button className="btn btn-secondary" onClick={downloadTemplate}>
          <Download size={16} /> Download Template
        </button>
      </div>

      {/* Column guide */}
      <div className="card" style={{ marginBottom:"1.25rem" }}>
        <div style={{ fontWeight:600, marginBottom:"0.75rem" }}>📋 Column Reference</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:"0.5rem" }}>
          {ALL_COLS.map(col => (
            <div key={col} style={{ background:"var(--bg-secondary)", borderRadius:6, padding:"0.4rem 0.75rem", fontSize:"0.8rem" }}>
              <span style={{ color: REQUIRED_COLS.includes(col) ? "var(--accent)" : "var(--text-secondary)", fontWeight:600 }}>
                {col}
              </span>
              {REQUIRED_COLS.includes(col) && <span style={{ color:"var(--danger)", marginLeft:2 }}>*</span>}
            </div>
          ))}
        </div>
        <p style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginTop:"0.75rem" }}>
          * Required. scrapTypes: comma-separated (iron,copper). category: SMALL, MEDIUM, or BULK. tags: comma-separated.
        </p>
      </div>

      {/* File upload */}
      <div className="card" style={{ marginBottom:"1.25rem" }}>
        <label
          style={{
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            border:"2px dashed var(--border)", borderRadius:10, padding:"2.5rem 1rem",
            cursor:"pointer", transition:"all 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <Upload size={32} style={{ color:"var(--text-muted)", marginBottom:"0.75rem" }} />
          <div style={{ fontWeight:600, marginBottom:"0.25rem" }}>Click to upload or drag & drop</div>
          <div style={{ fontSize:"0.875rem", color:"var(--text-muted)" }}>Excel (.xlsx) or CSV files</div>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} style={{ display:"none" }} />
        </label>
      </div>

      {/* Status messages */}
      {status.type !== "idle" && (
        <div className={`alert ${status.type === "success" ? "alert-upcoming" : status.type === "error" ? "alert-overdue" : "alert-today"}`} style={{ marginBottom:"1rem" }}>
          {status.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{status.type === "loading" ? "Importing..." : status.message}</span>
        </div>
      )}

      {/* Preview */}
      {rows.length > 0 && (
        <div className="card">
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
            <div>
              <div style={{ fontWeight:600 }}>Preview — {rows.length} supplier{rows.length !== 1 ? "s" : ""} ready to import</div>
              <div style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginTop:"0.2rem" }}>Review data before importing</div>
            </div>
            <button className="btn btn-primary" onClick={handleImport} disabled={status.type === "loading"}>
              <Upload size={16} /> {status.type === "loading" ? "Importing..." : `Import ${rows.length} Suppliers`}
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>{headers.slice(0,6).map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.slice(0,10).map((row, i) => (
                  <tr key={i}>
                    {headers.slice(0,6).map(h => (
                      <td key={h} style={{ maxWidth:150, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {String(row[h] || "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > 10 && (
            <p style={{ fontSize:"0.75rem", color:"var(--text-muted)", textAlign:"center", padding:"0.75rem 0 0" }}>
              ... and {rows.length - 10} more rows
            </p>
          )}
        </div>
      )}
    </div>
  );
}
