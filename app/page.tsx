"use client";
import { useEffect, useState, useCallback } from "react";
import { EVAL_COLOR, SKILL_COLORS } from "@/lib/mock-data";
import { Member } from "@/types";
import { loadMembers } from "@/lib/member-store";
import Link from "next/link";

function cn(...c: (string | false | undefined)[]) { return c.filter(Boolean).join(" "); }

const rank: Record<string, number> = { S: 4, A: 3, B: 2, C: 1, 未評価: 0 };

export default function DashboardPage() {
  const [members, setMembers] = useState<Member[]>([]);

  const reload = useCallback(() => setMembers(loadMembers()), []);

  useEffect(() => {
    reload();
    window.addEventListener("members_updated", reload);
    return () => window.removeEventListener("members_updated", reload);
  }, [reload]);

  const total = members.length;
  const byUnit = ["第1ユニット", "第2ユニット", "第3ユニット", "アソシエイト"] as const;
  const evalDist = ["S", "A", "B", "C", "未評価"].map((e) => ({
    label: e,
    count: members.filter((m) => m.eval_current === e).length,
    color: EVAL_COLOR[e],
  }));

  const skillCount: Record<string, number> = {};
  members.forEach((m) => m.skills.forEach((s) => { skillCount[s] = (skillCount[s] ?? 0) + 1; }));
  const topSkills = Object.entries(skillCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const improved = members.filter((m) => (rank[m.eval_current] ?? 0) > (rank[m.eval_prev] ?? 0));

  if (total === 0) return <div className="text-gray-400 text-sm py-10 text-center">読み込み中...</div>;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">スキル＆評価ボード</h1>
        <p className="text-gray-500 text-sm mt-1">全{total}名のメンバー状況を一覧で確認できます</p>
      </div>

      {/* KPI カード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {byUnit.map((unit) => {
          const unitMembers = members.filter((m) => m.unit === unit);
          const leaders = unitMembers.filter((m) => m.role === "リーダー").length;
          return (
            <div key={unit} className="bg-white border rounded-xl p-4 space-y-1">
              <p className="text-xs font-semibold text-gray-400">{unit}</p>
              <p className="text-2xl font-bold text-gray-900">{unitMembers.length}<span className="text-sm font-normal text-gray-400 ml-1">名</span></p>
              <p className="text-xs text-gray-500">うちリーダー {leaders}名</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 評価分布 */}
        <div className="bg-white border rounded-xl p-5">
          <p className="font-semibold text-sm text-gray-700 mb-4">今期評価分布</p>
          <div className="space-y-2">
            {evalDist.map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full w-10 text-center flex-shrink-0", color)}>{label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-violet-500 h-2 rounded-full" style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{count}名</span>
              </div>
            ))}
          </div>
        </div>

        {/* スキル保有TOP */}
        <div className="bg-white border rounded-xl p-5">
          <p className="font-semibold text-sm text-gray-700 mb-4">スキル保有数 TOP6</p>
          <div className="space-y-2">
            {topSkills.map(([skill, count]) => (
              <div key={skill} className="flex items-center gap-3">
                <span className={cn("text-xs px-2 py-0.5 rounded-full flex-shrink-0 w-28 text-center truncate", SKILL_COLORS[skill])}>{skill}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-violet-400 h-2 rounded-full" style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{count}名</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 評価アップメンバー */}
      {improved.length > 0 && (
        <div className="bg-white border rounded-xl p-5">
          <p className="font-semibold text-sm text-gray-700 mb-3">📈 今期評価アップ（{improved.length}名）</p>
          <div className="flex flex-wrap gap-2">
            {improved.map((m) => (
              <div key={m.id} className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
                <span className="text-sm font-medium text-gray-800">{m.name}</span>
                <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded-full", EVAL_COLOR[m.eval_prev])}>{m.eval_prev}</span>
                <span className="text-xs text-gray-400">→</span>
                <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded-full", EVAL_COLOR[m.eval_current])}>{m.eval_current}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* クイックリンク */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { href: "/members", label: "メンバー一覧を見る", sub: "スキル・担当クライアントを確認" },
          { href: "/skills", label: "スキルマップを見る", sub: "誰がどのスキルを持つか一目で確認" },
          { href: "/eval", label: "評価管理を見る", sub: "目標・評価・前期比較を管理" },
        ].map(({ href, label, sub }) => (
          <Link key={href} href={href}
            className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow space-y-1">
            <p className="text-sm font-semibold text-violet-700">{label} →</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
