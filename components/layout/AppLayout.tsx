"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, Users, GitBranch, Calendar, TrendingUp, 
  Upload, Search, LogOut, Menu, X, Bell, PhoneCall
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/suppliers", label: "Suppliers", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/followups", label: "Follow-ups", icon: Calendar },
  { href: "/deals", label: "Deals", icon: TrendingUp },
  { href: "/import", label: "Import", icon: Upload },
];

const mobileNav = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/suppliers", label: "Suppliers", icon: Users },
  { href: "/followups", label: "Follow-ups", icon: Calendar },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/deals", label: "Deals", icon: TrendingUp },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    fetch("/api/followups?type=overdue").then(r=>r.json()).then(d=>setOverdueCount(d.count||0)).catch(()=>{});
  }, []);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="page-wrapper">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div 
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:39 }} 
          onClick={()=>setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div style={{ padding:"1.25rem 1rem", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
            <div style={{ width:36, height:36, background:"var(--accent)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>♻️</div>
            <span style={{ fontWeight:700, fontSize:"1rem" }}>ScrapCRM</span>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ display:"none" }} onClick={()=>setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="divider" />

        {/* Nav items */}
        <nav style={{ padding:"0.5rem", flex:1 }}>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`nav-item ${isActive(href) ? "active" : ""}`} onClick={()=>setSidebarOpen(false)}>
              <Icon size={18} />
              {label}
              {href === "/followups" && overdueCount > 0 && (
                <span className="nav-badge">{overdueCount}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="divider" />

        {/* User */}
        <div style={{ padding:"0.75rem 1rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"0.75rem" }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--accent-light)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--accent)", fontWeight:700 }}>
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:"0.8rem", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{session?.user?.name || "User"}</div>
              <div style={{ fontSize:"0.7rem", color:"var(--text-muted)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{session?.user?.email}</div>
            </div>
          </div>
          <button className="nav-item" onClick={()=>signOut()} style={{ color:"var(--danger)" }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {/* Mobile top bar */}
        <div style={{ display:"none", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }} className="mobile-topbar">
          <button className="btn btn-ghost btn-sm" onClick={()=>setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
            <span style={{ fontWeight:700 }}>♻️ ScrapCRM</span>
          </div>
          <Link href="/suppliers/new" className="btn btn-primary btn-sm">+ Add</Link>
        </div>

        <div className="fade-in">{children}</div>
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="bottom-nav">
        {mobileNav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`bottom-nav-item ${isActive(href) ? "active" : ""}`}>
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>

      <style jsx global>{`
        @media(max-width: 768px) {
          .mobile-topbar { display: flex !important; }
          .sidebar button[style*="none"] { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
