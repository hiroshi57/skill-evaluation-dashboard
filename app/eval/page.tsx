"use client";
import { useState } from "react";
import { MEMBERS, EVAL_COLOR, GRADE_COLOR } from "@/lib/mock-data";
import { EvalRating, Unit } from "@/types";

function cn(...c: (string | false | undefined)[]) { return c.filter(Boolean).join(" "); }

const ALL_UNITS: Unit[] = ["第1ユニット", "第2ユニット", "第3ユニット", "アソシエイト"];
const ALL_EVALS: EvalRating[] = ["S", "A", "B", "C", "未評価"];

const rank: Record<string, number> = { S: 4, A: 3, B: 2, C: 1, 未評価: 0 };
function trend(cur: EvalRating, prev: EvalRating) {
  const d = (rank[cur] ?? 0) - (rank[prev] ?? 0);
  if (d > 0) return { icon: "↑", color: "text-green-600" };
  if (d < 0) return { icon: "↓", color: "text-red-500" };
  return { icon: "→", color: "text-gray-400" };
}

export default function EvalPage() {
  const [unit, setUnit] = useState<Unit | "全員">("全員");
  const [evalFilter, setEvalFilter] = useState<EvalRating | "すべて">("すべて");

  const filtered = MEMBERS.filter((m) => {
    if (unit !== "全員" && m.unit !== unit) return false;
    if (evalFilter !== "すべて" && m.eval_current !== evalFilter) return false;
    return true;
  }).sort((a, b) => (rank[b.eval_current] ?? 0) - (rank[a.eval_current] ?? 0));

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">評価管理</h1>
        <p className="text-gray-500 text-sm mt-1">{filtered.length}名を表示中 · 評価・目標・前期比較</p>
      </div>

      {/* フィルター */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 flex-wrap">
          {(["全員", ...ALL_UNITS] as const).map((u) => (
            <button key={u} onClick={() => setUnit(u as typeof unit)}
              className={cn("text-xs px-3 py-1.5 rounded-full border transition-colors",
                unit === u ? "bg-violet-600 text-white border-violet-600" : "border-gray-300 text-gray-600 hover:bg-gray-50")}>
              {u}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {(["すべて", ...ALL_EVALS] as const).map((e) => (
            <button key={e} onClick={() => setEvalFilter(e as typeof evalFilter)}
              className={cn("text-xs px-3 py-1.5 rounded-full border transition-colors",
                evalFilter === e ? "bg-gray-700 text-white border-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-50")}>
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* テーブル */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 w-36">氏名</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">ユニット</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">年次</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">前期</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">今期</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">推移</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">今期目標</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((m) => {
              const t = trend(m.eval_current, m.eval_prev);
              return (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{m.unit}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", GRADE_COLOR[m.grade])}>{m.grade}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", EVAL_COLOR[m.eval_prev])}>{m.eval_prev}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", EVAL_COLOR[m.eval_current])}>{m.eval_current}</span>
                  </td>
                  <td className={cn("px-4 py-3 text-center text-base font-bold", t.color)}>{t.icon}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-xs">
                    <p className="line-clamp-2">{m.goal}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">条件に一致するメンバーが見つかりません</div>
        )}
      </div>
    </div>
  );
}
