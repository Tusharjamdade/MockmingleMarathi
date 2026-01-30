import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LayoutDashboard, Users, UserPlus } from 'lucide-react'

export default function AdminNav() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Dashboard Overview", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Students Profiles", href: "/admin/studentProfiles", icon: <Users size={20} /> },
    { name: "Students Registration", href: "/admin/signup", icon: <UserPlus size={20} /> },
  ]

  return (
    <>
      {/* Mobile Header (Visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm transition-all">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold shadow-rose-200 shadow-lg">S</div>
           <h1 className="text-xl font-bold text-slate-800 tracking-tight">SPPU Admin</h1>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 md:w-80 bg-white border-r border-slate-200 shadow-2xl md:shadow-none
          transform transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 md:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-rose-200">
              S
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">SPPU</h1>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <nav className="px-4 py-2 h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-500 font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 ease-in-out"
                >
                  <span className="text-slate-400 group-hover:text-indigo-500 transition-colors duration-200">
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Optional Footer/User Section inside Sidebar */}
          {/* <div className="mt-8 px-4 py-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                AD
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-700 truncate">Administrator</p>
                <p className="text-xs text-slate-400 truncate">admin@sppu.edu</p>
              </div>
            </div>
          </div> */}
        </nav>
      </aside>

      {/* SPACERS */}
      {/* 1. Mobile Top Spacer */}
      <div className="md:hidden h-[70px]" />

      {/* 2. Desktop Side Spacer */}
      <div className="hidden md:block w-80 shrink-0 bg-slate-50" />
    </>
  )
}