import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header({ onToggleSidebar }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="mx-auto w-full px-3 sm:px-4 lg:px-6 h-full flex items-center">
        {/* Left: burger (mobile) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex lg:hidden items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100 active:scale-[0.98]"
          aria-label="Open sidebar"
        >
          <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>


        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `hidden md:inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium ${
                isActive ? "bg-gray-100 text-gray-900" : "text-gray-800 hover:bg-gray-50"
              }`
            }
            aria-label="Orders"
          >
            Orders
          </NavLink>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login", { replace: true });
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 text-white px-4 py-3 text-sm font-semibold hover:bg-emerald-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
