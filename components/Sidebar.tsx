"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutDashboard, Star, Users } from "lucide-react";

const NAV = [
  { href: "/",        label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/members", label: "メンバー一覧",   icon: Users },
  { href: "/skills",  label: "スキルマップ",   icon: BarChart3 },
  { href: "/eval",    label: "評価管理",        icon: Star },
];

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 bg-white border-r flex flex-col py-6 px-3 gap-1 flex-shrink-0">
      <div className="px-3 mb-6">
        <p className="text-xs font-bold text-violet-600 tracking-widest">SKILL BOARD</p>
        <p className="text-xs text-gray-400 mt-0.5">スキル＆評価管理</p>
      </div>
      {NAV.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            pathname === href
              ? "bg-violet-50 text-violet-700"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}>
          <Icon className="w-4 h-4 flex-shrink-0" />
          {label}
        </Link>
      ))}
    </aside>
  );
}
