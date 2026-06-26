"use client";
import { useState, useEffect, useCallback } from "react";
import { MEMBERS as DEFAULT_MEMBERS, EVAL_COLOR, SKILL_COLORS, GRADE_COLOR, ACHIEVEMENT_COLOR, ACHIEVEMENT_ICON } from "@/lib/mock-data";
import { loadMembers, saveMember, deleteMember, initIfEmpty } from "@/lib/member-store";
import { Member, Unit, Skill, EvalRating, Achievement, Grade, Role } from "@/types";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";

function cn(...c: (string | false | undefined)[]) { return c.filter(Boolean).join(" "); }

const ALL_UNITS: Unit[] = ["第1ユニット", "第2ユニット", "第3ユニット", "アソシエイト"];
const ALL_SKILLS: Skill[] = ["運用型広告", "SEO", "コンテンツ", "SNS", "CRO・LPO", "MA", "Web制作", "DXコンサル", "クリエイティブ", "調査・リサーチ", "LLMO/AIO"];
const ALL_EVALS: EvalRating[] = ["S", "A", "B", "C", "未評価"];
const ALL_ACHIEVEMENTS: Achievement[] = ["達成", "概ね達成", "一部達成", "未達", "評価中"];
const ALL_GRADES: Grade[] = ["1年目", "2年目", "3年目", "4年目", "5年目以上"];
const ALL_ROLES: Role[] = ["リーダー", "メンバー", "アソシエイト"];

function EditPanel({ m, onSave, onCancel }: { m: Member; onSave: (m: Member) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Member>({ ...m });
  const [clientInput, setClientInput] = useState("");

  const set = (key: keyof Member, value: unknown) => setForm((p) => ({ ...p, [key]: value }));
  const toggleSkill = (s: Skill) => set("skills",
    form.skills.includes(s) ? form.skills.filter((x) => x !== s) : [...form.skills, s]);
  const addClient = () => {
    const v = clientInput.trim();
    if (v && !form.clients.includes(v)) { set("clients", [...form.clients, v]); setClientInput(""); }
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200";

  return (
    <div className="border-t bg-gray-50 px-4 py-4 space-y-4">
      {/* 基本 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">氏名</p>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">年次</p>
          <select value={form.grade} onChange={(e) => set("grade", e.target.value as Grade)} className={inputCls}>
            {ALL_GRADES.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">ユニット</p>
          <select value={form.unit} onChange={(e) => set("unit", e.target.value as Unit)} className={inputCls}>
            {ALL_UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">役割</p>
          <select value={form.role} onChange={(e) => set("role", e.target.value as Role)} className={inputCls}>
            {ALL_ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* スキル */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1.5">スキル</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_SKILLS.map((s) => (
            <button key={s} onClick={() => toggleSkill(s)}
              className={cn("text-xs px-2.5 py-1 rounded-full border transition-colors",
                form.skills.includes(s) ? cn(SKILL_COLORS[s], "border-current") : "border-gray-200 text-gray-400")}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* クライアント */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1.5">担当クライアント</p>
        <div className="flex gap-2 mb-1.5">
          <input value={clientInput} onChange={(e) => setClientInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addClient()}
            placeholder="追加してEnter" className={cn(inputCls, "flex-1")} />
          <button onClick={addClient} className="text-xs bg-gray-200 px-2 py-1.5 rounded-lg">追加</button>
        </div>
        <div className="flex flex-wrap gap-1">
          {form.clients.map((c) => (
            <span key={c} className="flex items-center gap-1 text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full">
              {c}
              <button onClick={() => set("clients", form.clients.filter((x) => x !== c))} className="text-gray-300 hover:text-red-400">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* 評価 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1.5">前期評価</p>
          <div className="flex gap-1 flex-wrap">
            {ALL_EVALS.map((e) => (
              <button key={e} onClick={() => set("eval_prev", e)}
                className={cn("text-xs px-2.5 py-1 rounded-full border font-bold",
                  form.eval_prev === e ? "bg-gray-700 text-white border-gray-700" : "border-gray-300 text-gray-500")}>
                {e}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1.5">今期評価</p>
          <div className="flex gap-1 flex-wrap">
            {ALL_EVALS.map((e) => (
              <button key={e} onClick={() => set("eval_current", e)}
                className={cn("text-xs px-2.5 py-1 rounded-full border font-bold",
                  form.eval_current === e ? "bg-gray-700 text-white border-gray-700" : "border-gray-300 text-gray-500")}>
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 目標・結果・達成度 */}
      <div>
        <p className="text-xs font-semibold text-indigo-600 mb-1">📌 今期目標</p>
        <textarea value={form.goal} onChange={(e) => set("goal", e.target.value)}
          rows={2} className={cn(inputCls, "resize-none")} />
      </div>
      <div>
        <p className="text-xs font-semibold text-green-700 mb-1">📊 実績・結果</p>
        <textarea value={form.result} onChange={(e) => set("result", e.target.value)}
          rows={2} className={cn(inputCls, "resize-none")} />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1.5">達成度</p>
        <div className="flex gap-1.5 flex-wrap">
          {ALL_ACHIEVEMENTS.map((a) => (
            <button key={a} onClick={() => set("achievement", a)}
              className={cn("text-xs px-2.5 py-1 rounded-full border font-medium transition-colors",
                form.achievement === a
                  ? cn(ACHIEVEMENT_COLOR[a])
                  : "border-gray-200 text-gray-400")}>
              {ACHIEVEMENT_ICON[a]} {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1">メモ</p>
        <textarea value={form.memo ?? ""} onChange={(e) => set("memo", e.target.value)}
          rows={1} className={cn(inputCls, "resize-none")} />
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(form)}
          className="flex items-center gap-1.5 bg-violet-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors">
          <Check className="w-3.5 h-3.5" />保存
        </button>
        <button onClick={onCancel} className="text-xs text-gray-500 px-3 py-2 hover:text-gray-700">キャンセル</button>
      </div>
    </div>
  );
}

function MemberCard({ m, onSaved, onDeleted }: { m: Member; onSaved: () => void; onDeleted: () => void }) {
  const [editing, setEditing] = useState(false);

  const handleSave = (updated: Member) => {
    saveMember(updated);
    setEditing(false);
    onSaved();
  };

  const handleDelete = () => {
    if (confirm(`${m.name} を削除しますか？`)) {
      deleteMember(m.id);
      onDeleted();
    }
  };

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900">{m.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{m.unit} · {m.role}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", EVAL_COLOR[m.eval_current])}>{m.eval_current}</span>
            <span className={cn("text-xs px-2 py-0.5 rounded-full", GRADE_COLOR[m.grade])}>{m.grade}</span>
            <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", ACHIEVEMENT_COLOR[m.achievement])}>
              {ACHIEVEMENT_ICON[m.achievement]} {m.achievement}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {m.skills.map((s) => (
            <span key={s} className={cn("text-xs px-2 py-0.5 rounded-full", SKILL_COLORS[s])}>{s}</span>
          ))}
        </div>
        <div className="text-xs text-gray-500 line-clamp-1">{m.clients.join("、")}</div>

        {/* 目標・結果（コンパクト） */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-indigo-50 rounded-lg px-3 py-2">
            <p className="text-xs font-bold text-indigo-500 mb-0.5">📌 目標</p>
            <p className="text-xs text-gray-700 line-clamp-2">{m.goal || "—"}</p>
          </div>
          <div className="bg-green-50 rounded-lg px-3 py-2">
            <p className="text-xs font-bold text-green-600 mb-0.5">📊 結果</p>
            <p className="text-xs text-gray-700 line-clamp-2">{m.result || "—"}</p>
          </div>
        </div>

        {/* アクション */}
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={() => setEditing(!editing)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-violet-600 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors">
            {editing ? <><X className="w-3 h-3" />閉じる</> : <><Pencil className="w-3 h-3" />編集</>}
          </button>
          <button onClick={handleDelete}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors">
            <Trash2 className="w-3 h-3" />削除
          </button>
        </div>
      </div>

      {editing && <EditPanel m={m} onSave={handleSave} onCancel={() => setEditing(false)} />}
    </div>
  );
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [unit, setUnit] = useState<Unit | "全員">("全員");
  const [skill, setSkill] = useState<Skill | "すべて">("すべて");
  const [query, setQuery] = useState("");

  const reload = useCallback(() => {
    initIfEmpty();
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
    if (skill !== "すべて" && !m.skills.includes(skill)) return false;
    if (query && !m.name.includes(query) && !m.clients.some((c) => c.includes(query))) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">メンバー一覧</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} / {members.length}名を表示中</p>
        </div>
        <Link href="/register"
          className="flex items-center gap-1.5 bg-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-violet-700 transition-colors">
          <Plus className="w-4 h-4" />メンバー登録
        </Link>
      </div>

      {/* フィルター */}
      <div className="flex flex-wrap gap-3 items-center">
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="名前・クライアント名で検索…"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 w-52" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((m) => (
          <MemberCard key={m.id} m={m} onSaved={reload} onDeleted={reload} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          条件に一致するメンバーが見つかりません
          <Link href="/register" className="block mt-2 text-violet-500 hover:underline">＋ 新しいメンバーを登録する</Link>
        </div>
      )}
    </div>
  );
}
