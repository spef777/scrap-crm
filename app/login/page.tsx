"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/");
    }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--bg-primary)", padding:"1rem" }}>
      <div style={{ width:"100%", maxWidth:"400px" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ width:56, height:56, background:"var(--accent)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", fontSize:"1.5rem" }}>♻️</div>
          <h1 style={{ fontSize:"1.75rem", fontWeight:700 }}>ScrapCRM</h1>
          <p style={{ color:"var(--text-muted)", fontSize:"0.875rem", marginTop:"0.25rem" }}>Scrap Trading Management</p>
        </div>

        <div className="card" style={{ padding:"2rem" }}>
          <h2 style={{ fontSize:"1.125rem", fontWeight:600, marginBottom:"1.5rem" }}>Sign in to your account</h2>
          {error && (
            <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"0.75rem", color:"#fca5a5", fontSize:"0.875rem", marginBottom:"1rem" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Email</label>
              <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@scrapcrm.com" required />
            </div>
            <div className="form-group">
              <label className="label">Password</label>
              <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p style={{ textAlign:"center", color:"var(--text-muted)", fontSize:"0.75rem", marginTop:"1.5rem" }}>
            Default: admin@scrapcrm.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
