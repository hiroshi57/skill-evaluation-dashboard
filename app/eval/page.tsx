"use client";
import { useState, useEffect, useCallback } from "react";
import { MEMBERS as DEFAULT_MEMBERS, EVAL_COLOR, GRADE_COLOR, ACHIEVEMENT_COLOR, ACHIEVEMENT_ICON } from "@/lib/mock-data";
import { Member, EvalRating, Unit, Achievement } from "@/types";
import { loadMembers } from "@/lib/member-store";

function cn(...c: (string | false | undefined)[]) { return c.filter(Boolean).join(" "); }

const ALL_UNITS: Unit[] = ["第1ユニット", "第2ユニット", "第3ユニット", "アソシエイト"];
const ALL_EVALS: EvalRating[] = ["S", "A", "B", "C", "未評価"];
const ALL_ACHIEVEMENTS: Achievement[] = ["達成", "概ね達成", "一部達成", "未達", "評価中"];

const rank: Record<string, number> = { S: 4, A: 3, B: 2, C: 1, 未評価: 0 };

function trend(cur: EvalRating, prev: EvalRating) {
  const d = (rank[cur] ?? 0) - (rank[prev] ?? 0);
  if (d > 0) return { icon: "↑", color: "text-green-600 font-bold" };
  if (d < 0) return { icon: "↓", color: "text-red-500 font-bold" };
  return { icon: "→", color: "text-gray-400" };
}

function downloadEvalTxt(m: Member) {
  const trendLabel = (rank[m.eval_current] ?? 0) > (rank[m.eval_prev] ?? 0) ? "↑ 上昇"
    : (rank[m.eval_current] ?? 0) < (rank[m.eval_prev] ?? 0) ? "↓ 下降" : "→ 維持";
  const lines = [
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "　個人評価シート（1on1 用）",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    `氏名　　　: ${m.name}`,
    `ユニット　: ${m.unit}`,
    `ロール　　: ${m.role}`,
    `年次　　　: ${m.grade}`,
    "",
    "【評価】",
    `前期評価　: ${m.eval_prev}`,
    `今期評価　: ${m.eval_current}　（${trendLabel}）`,
    `達成度　　: ${ACHIEVEMENT_ICON[m.achievement]} ${m.achievement}`,
    "",
    "【今期目標】",
    m.goal,
    "",
    "【実績・結果】",
    m.result,
    ...(m.memo ? ["", "【メモ・コメント】", m.memo] : []),
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `出力日: ${new Date().toLocaleDateString("ja-JP")}`,
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `評価_${m.name}_${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function GoalResultRow({ m }: { m: Member }) {
  const [open, setOpen] = useState(false);
  const t = trend(m.eval_current, m.eval_prev);
  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      {/* サマリー行 */}
      <div className="flex items-center">
        <button
          onClick={() => setOpen(!open)}
          className="flex-1 text-left px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {/* 名前・ユニット */}
            <div className="w-32 flex-shrink-0">
              <p className="font-semibold text-sm text-gray-900">{m.name}</p>
              <p className="text-xs text-gray-400">{m.unit}</p>
            </div>
            {/* 年次 */}
            <span className={cn("text-xs px-2 py-0.5 rounded-full flex-shrink-0", GRADE_COLOR[m.grade])}>{m.grade}</span>
            {/* 達成度バッジ */}
            <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0", ACHIEVEMENT_COLOR[m.achievement])}>
              {ACHIEVEMENT_ICON[m.achievement]} {m.achievement}
            </span>
            {/* 評価推移 */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", EVAL_COLOR[m.eval_prev])}>{m.eval_prev}</span>
              <span className={cn("text-sm", t.color)}>{t.icon}</span>
              <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", EVAL_COLOR[m.eval_current])}>{m.eval_current}</span>
            </div>
            {/* 目標（1行プレビュー） */}
            <p className="text-xs text-gray-500 flex-1 truncate hidden md:block">{m.goal}</p>
            <span className="text-xs text-gray-300 flex-shrink-0">{open ? "▲" : "▼"}</span>
          </div>
        </button>
        {/* DLボタン */}
        <button
          onClick={(e) => { e.stopPropagation(); downloadEvalTxt(m); }}
          title="個人評価をTXTでダウンロード"
          className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 mr-3 text-xs text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
          DL
        </button>
      </div>

      {/* 展開：目標 → 結果 */}
      {open && (
        <div className="border-t grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
          <div className="px-5 py-4 space-y-1">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">📌 今期目標</p>
            <p className="text-sm text-gray-700 leading-relaxed">{m.goal}</p>
          </div>
          <div className="px-5 py-4 space-y-1">
            <p className="text-xs font-bold text-green-700 uppercase tracking-wide">📊 実績・結果</p>
            <p className="text-sm text-gray-700 leading-relaxed">{m.result}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EvalPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [unit, setUnit] = useState<Unit | "全員">("全員");
  const [evalFilter, setEvalFilter] = useState<EvalRating | "すべて">("すべて");
  const [achieveFilter, setAchieveFilter] = useState<Achievement | "すべて">("すべて");

  const reload = useCallback(() => {
    const stored = loadMembers();
    setMembers(stored.length > 0 ? stored : DEFAULT_MEMBERS);
  }, []);

  useEffect(() => {
    reload();
    window.addEventListener("members_updated", reload);
    return () => window.removeEventListener("members_updated", reload);
  }, [reload]);

  const filtered = members.filter((m) => {
    if (unit !== "全員" && m.unit !== unit) return false;
    if (evalFilter !== "すべて" && m.eval_current !== evalFilter) return false;
    if (achieveFilter !== "すべて" && m.achievement !== achieveFilter) return false;
    return true;
  }).sort((a, b) => (rank[b.eval_current] ?? 0) - (rank[a.eval_current] ?? 0));

  // 達成度サマリー
  const summary = ALL_ACHIEVEMENTS.map((a) => ({
    label: a,
    count: members.filter((m) => m.achievement === a).length,
  }));

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">評価管理</h1>
        <p className="text-gray-500 text-sm mt-1">目標・実績・達成度・評価推移を一覧確認。行をクリックで詳細表示。</p>
      </div>

      {/* 達成度サマリーバー */}
      <div className="flex gap-3 flex-wrap">
        {summary.map(({ label, count }) => (
          <div key={label} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium", ACHIEVEMENT_COLOR[label])}>
            {ACHIEVEMENT_ICON[label]} {label} <span className="font-bold">{count}名</span>
          </div>
        ))}
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
        <div className="flex gap-1 flex-wrap">
          {(["すべて", ...ALL_EVALS] as const).map((e) => (
            <button key={e} onClick={() => setEvalFilter(e as typeof evalFilter)}
              className={cn("text-xs px-3 py-1.5 rounded-full border transition-colors",
                evalFilter === e ? "bg-gray-700 text-white border-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-50")}>
              {e}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {(["すべて", ...ALL_ACHIEVEMENTS] as const).map((a) => (
            <button key={a} onClick={() => setAchieveFilter(a as typeof achieveFilter)}
              className={cn("text-xs px-3 py-1.5 rounded-full border transition-colors",
                achieveFilter === a ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 text-gray-600 hover:bg-gray-50")}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">{filtered.length}名を表示中</p>

      <div className="space-y-2">
        {filtered.map((m) => <GoalResultRow key={m.id} m={m} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">条件に一致するメンバーが見つかりません</div>
      )}
    </div>
  );
}
