"use client";
import { useState } from "react";
import { MEMBERS, EVAL_COLOR, SKILL_COLORS, GRADE_COLOR } from "@/lib/mock-data";
import { Member, Unit, Skill } from "@/types";

function cn(...c: (string | false | undefined)[]) { return c.filter(Boolean).join(" "); }

const ALL_UNITS: Unit[] = ["第1ユニット", "第2ユニット", "第3ユニット", "アソシエイト"];
const ALL_SKILLS: Skill[] = ["運用型広告", "SEO", "コンテンツ", "SNS", "CRO・LPO", "MA", "Web制作", "DXコンサル", "クリエイティブ", "調査・リサーチ", "LLMO/AIO"];

function MemberCard({ m }: { m: Member }) {
  return (
    <div className="bg-white border rounded-xl p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">{m.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{m.unit} · {m.role}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", EVAL_COLOR[m.eval_current])}>{m.eval_current}</span>
          <span className={cn("text-xs px-2 py-0.5 rounded-full", GRADE_COLOR[m.grade])}>{m.grade}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {m.skills.map((s) => (
          <span key={s} className={cn("text-xs px-2 py-0.5 rounded-full", SKILL_COLORS[s])}>{s}</span>
        ))}
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">担当クライアント</p>
        <p className="text-xs text-gray-600 line-clamp-1">{m.clients.join("、")}</p>
      </div>
      <div className="border-t pt-2">
        <p className="text-xs text-gray-400 mb-0.5">今期目標</p>
        <p className="text-xs text-gray-700 line-clamp-2">{m.goal}</p>
      </div>
    </div>
  );
}

export default function MembersPage() {
  const [unit, setUnit] = useState<Unit | "全員">("全員");
  const [skill, setSkill] = useState<Skill | "すべて">("すべて");
  const [query, setQuery] = useState("");

  const filtered = MEMBERS.filter((m) => {
    if (unit !== "全員" && m.unit !== unit) return false;
    if (skill !== "すべて" && !m.skills.includes(skill)) return false;
    if (query && !m.name.includes(query) && !m.clients.some((c) => c.includes(query))) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">メンバー一覧</h1>
        <p className="text-gray-500 text-sm mt-1">{filtered.length} / {MEMBERS.length}名を表示中</p>
      </div>

      {/* フィルター */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="名前・クライアント名で検索…"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 w-56"
        />
        <div className="flex gap-1 flex-wrap">
          {(["全員", ...ALL_UNITS] as const).map((u) => (
            <button key={u} onClick={() => setUnit(u as typeof unit)}
              className={cn("text-xs px-3 py-1.5 rounded-full border transition-colors",
                unit === u ? "bg-violet-600 text-white border-violet-600" : "border-gray-300 text-gray-600 hover:bg-gray-50")}>
              {u}
            </button>
          ))}
        </div>
        <select value={skill} onChange={(e) => setSkill(e.target.value as typeof skill)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200">
          <option value="すべて">スキル: すべて</option>
          {ALL_SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m) => <MemberCard key={m.id} m={m} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">条件に一致するメンバーが見つかりません</div>
      )}
    </div>
  );
}
