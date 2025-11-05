// frontend/src/components/common/sidebar.jsx
import React, { useEffect, useMemo, useCallback, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { can } from "../../utils/perm";

const Item = ({ to = "#", icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
       ${isActive ? "bg-emerald-700 text-white" : "text-emerald-900 hover:bg-emerald-50"}`
    }
    aria-label={label}
  >
    <span className="h-5 w-5 text-current" aria-hidden="true">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

function Group({ label, icon, children, defaultOpen = false, hidden = false }) {
  const [open, setOpen] = useState(defaultOpen);
  if (hidden) return null;
  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
        aria-expanded={open}
        aria-controls={`section-${label.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <span className="flex items-center gap-3">
          <span className="h-5 w-5 text-current" aria-hidden="true">{icon}</span>
          {label}
        </span>
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.127l3.71-3.896a.75.75 0 111.08 1.04l-4.24 4.46a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      <div
        id={`section-${label.replace(/\s+/g, "-").toLowerCase()}`}
        className={`overflow-hidden transition-[max-height,opacity] duration-200 ${open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="pl-9 pr-2 py-1 space-y-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => { if (open) onClose?.(); }, [location.pathname]); // eslint-disable-line

  // ESC to close (mobile)
  const escHandler = useCallback((e) => { if (e.key === "Escape" && open) onClose?.(); }, [open, onClose]);
  useEffect(() => {
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, [escHandler]);

  // Define your menu with required permission codes
  const rawMenu = useMemo(() => ([
    { label: "Dashboard", to: "/dashboard", icon: iconUsers(), perm: "dashboard" },
    { label: "Manual Order Assign", to: "/manual-orders", icon: iconAssign(), perm: "order_management" },
    { label: "Help", to: "/help", icon: iconHelp(), perm: "help" },
  ]), []);

  const visibleMenu = rawMenu.filter(m => can(m.perm));

  const accessChildren = useMemo(() => ([
    { label: "Permissions", to: "/access", icon: iconLock(), perm: "access" },
    { label: "Roles",       to: "/access/roles", icon: iconUsersCog(), perm: "access" },
    { label: "Users",       to: "/access/users", icon: iconUser(), perm: "access" },
  ].filter(x => can(x.perm))), []);

  const accessOpen = location.pathname.startsWith("/access");

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 top-16 bg-black/30 lg:hidden transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!open}
      />

      <aside
        className={`fixed left-0 top-16 bottom-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-200 shadow-lg lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        role="navigation"
        aria-label="Sidebar"
      >
        {/* Logo row */}
        <div className="h-20 px-4 flex items-center justify-between border-b border-gray-200">
          <img src="/Crispy-Dosalogo.png" alt="Crispy Dosa" className="h-20 -mb-4 ml-4 w-auto object-contain" />
          <button
            onClick={onClose}
            className="ml-auto lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-5rem)]">
          {visibleMenu.map((m) => (
            <Item key={m.label} to={m.to} label={m.label} icon={m.icon} />
          ))}

          {/* Access group only if it has visible children */}
          <Group
            label="Access"
            icon={iconShield()}
            defaultOpen={accessOpen}
            hidden={accessChildren.length === 0}
          >
            {accessChildren.map((m) => (
              <Item key={m.label} to={m.to} label={m.label} icon={m.icon} />
            ))}
          </Group>
        </nav>
      </aside>
    </>
  );
}

/* ===== Icons (unchanged) ===== */
function iconUsers(){return(<svg viewBox="0 0 24 24" fill="none"><path d="M16 11a4 4 0 1 0-8 0m-5 8a7 7 0 0 1 14 0M6 21h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
function iconAssign(){return(<svg viewBox="0 0 24 24" fill="none"><path d="M4 4h10v6H4zM4 14h16v6H4zM16 4h4v6h-4z" stroke="currentColor" strokeWidth="2"/></svg>)}
function iconHelp(){return(<svg viewBox="0 0 24 24" fill="none"><path d="M12 18h.01M9 9a3 3 0 1 1 6 0c0 2-3 2-3 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
function iconShield(){return(<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
function iconLock(){return(<svg viewBox="0 0 24 24" fill="none"><path d="M7 10V7a5 5 0 0 1 10 0v3M6 10h12v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
function iconUsersCog(){return(<svg viewBox="0 0 24 24" fill="none"><path d="M12 14a5 5 0 0 0-9 3v3M21 20v-1a4 4 0 0 0-6.5-3.1M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 7.5l1 .6-1 1.7h-2l-1-1.7 1-.6V6h2v1.5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
function iconUser(){return(<svg viewBox="0 0 24 24" fill="none"><path d="M16 9a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
