"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <AppLayout>
        <div className="page-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your application preferences</p>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"center", padding:"3rem" }}>
          <div className="spinner" />
        </div>
      </AppLayout>
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your application preferences</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.25rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
          Appearance
        </h2>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0" }}>
          <div>
            <div style={{ fontWeight: 500 }}>Dark Mode</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              Switch between light and dark themes
            </div>
          </div>
          
          <button 
            type="button" 
            role="switch" 
            aria-checked={isDark}
            onClick={toggleTheme}
            style={{
              position: "relative",
              display: "inline-flex",
              height: 28,
              width: 52,
              alignItems: "center",
              borderRadius: 9999,
              border: "none",
              backgroundColor: isDark ? "var(--success)" : "rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
          >
            <span 
              style={{
                display: "inline-block",
                height: 24,
                width: 24,
                transform: isDark ? "translateX(26px)" : "translateX(2px)",
                backgroundColor: "#fff",
                borderRadius: "50%",
                transition: "transform 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }} 
            />
            {isDark && <Moon size={14} style={{ position: "absolute", left: 6, color: "#fff" }} />}
            {!isDark && <Sun size={14} style={{ position: "absolute", right: 6, color: "var(--text-secondary)" }} />}
          </button>
        </div>
        
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <button 
            className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setTheme('light')}
          >
            Light
          </button>
          <button 
            className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setTheme('dark')}
          >
            Dark
          </button>
          <button 
            className={`btn ${theme === 'system' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setTheme('system')}
          >
            System
          </button>
        </div>

      </div>
    </AppLayout>
  );
}
