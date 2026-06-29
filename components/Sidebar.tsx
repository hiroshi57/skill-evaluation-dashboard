"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, LayoutDashboard, LogOut, Star, UserPlus, Users } from "lucide-react";
import { getUser, clearUser } from "@/lib/auth";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/",          label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/members",   label: "メンバー一覧",   icon: Users },
  { href: "/skills",    label: "スキルマップ",   icon: BarChart3 },
  { href: "/eval",      label: "評価管理",        icon: Star },
  { href: "/register",  label: "メンバー登録",   icon: UserPlus },
];

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const u = getUser();
    if (u) {
      // name が空の場合はメールから生成（旧セッションデータの救済）
      const name = u.name || u.email.split("@")[0].split(/[._-]+/).map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
      setUserName(name);
      setUserEmail(u.email);
    }
  }, []);

  function handleLogout() {
    clearUser();
    router.replace("/login");
  }

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

      {/* ユーザー情報 */}
      <div className="mt-auto pt-4 border-t mx-1">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {userName.charAt(0) || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-800 truncate">{userName || "未ログイン"}</p>
            <p className="text-xs text-gray-400 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors mt-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          ログアウト
        </button>
      </div>
    </aside>
  );
}
