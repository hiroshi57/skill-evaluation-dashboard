"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Member, Unit, Role, Grade, Skill, EvalRating, Achievement } from "@/types";
import { saveMember } from "@/lib/member-store";
import { SKILL_COLORS } from "@/lib/mock-data";
import { Check } from "lucide-react";

function cn(...c: (string | false | undefined)[]) { return c.filter(Boolean).join(" "); }

const ALL_UNITS: Unit[] = ["第1ユニット", "第2ユニット", "第3ユニット", "アソシエイト"];
const ALL_ROLES: Role[] = ["リーダー", "メンバー", "アソシエイト"];
const ALL_GRADES: Grade[] = ["1年目", "2年目", "3年目", "4年目", "5年目以上"];
const ALL_SKILLS: Skill[] = ["運用型広告", "SEO", "コンテンツ", "SNS", "CRO・LPO", "MA", "Web制作", "DXコンサル", "クリエイティブ", "調査・リサーチ", "LLMO/AIO"];
const ALL_EVALS: EvalRating[] = ["S", "A", "B", "C", "未評価"];
const ALL_ACHIEVEMENTS: Achievement[] = ["達成", "概ね達成", "一部達成", "未達", "評価中"];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-600">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState<Omit<Member, "id">>({
    name: "",
    unit: "第1ユニット",
    role: "メンバー",
    grade: "1年目",
    skills: [],
    clients: [],
    eval_current: "未評価",
    eval_prev: "未評価",
    goal: "",
    result: "",
    achievement: "評価中",
    memo: "",
  });

  const [clientInput, setClientInput] = useState("");

  const set = (key: keyof typeof form, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleSkill = (s: Skill) =>
    set("skills", form.skills.includes(s)
      ? form.skills.filter((x) => x !== s)
      : [...form.skills, s]);

  const addClient = () => {
    const v = clientInput.trim();
    if (v && !form.clients.includes(v)) {
      set("clients", [...form.clients, v]);
      setClientInput("");
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const member: Member = {
      ...form,
      id: `m_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    };
    saveMember(member);
    setSaved(true);
    setTimeout(() => router.push("/members"), 1200);
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">メンバー登録</h1>
        <p className="text-gray-500 text-sm mt-1">新しいメンバーの情報・スキル・評価・目標を登録します</p>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-5">
        {/* 基本情報 */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="氏名" required>
            <input value={form.name} onChange={(e) => set("name", e.target.value)}
              placeholder="例：山田 太郎" className={inputCls} />
          </Field>
          <Field label="年次" required>
            <select value={form.grade} onChange={(e) => set("grade", e.target.value as Grade)} className={inputCls}>
              {ALL_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="ユニット" required>
            <select value={form.unit} onChange={(e) => set("unit", e.target.value as Unit)} className={inputCls}>
              {ALL_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </Field>
          <Field label="役割" required>
            <select value={form.role} onChange={(e) => set("role", e.target.value as Role)} className={inputCls}>
              {ALL_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
        </div>

        {/* スキル */}
        <Field label="スキル（複数選択可）">
          <div className="flex flex-wrap gap-2 mt-1">
            {ALL_SKILLS.map((s) => (
              <button key={s} onClick={() => toggleSkill(s)}
                className={cn("text-xs px-3 py-1.5 rounded-full border transition-colors font-medium",
                  form.skills.includes(s)
                    ? cn(SKILL_COLORS[s], "border-current")
                    : "border-gray-200 text-gray-500 hover:border-gray-400")}>
                {s}
              </button>
            ))}
          </div>
        </Field>

        {/* 担当クライアント */}
        <Field label="担当クライアント">
          <div className="flex gap-2">
            <input value={clientInput} onChange={(e) => setClientInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addClient()}
              placeholder="クライアント名を入力してEnter" className={cn(inputCls, "flex-1")} />
            <button onClick={addClient}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors font-medium">
              追加
            </button>
          </div>
          {form.clients.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.clients.map((c) => (
                <span key={c} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {c}
                  <button onClick={() => set("clients", form.clients.filter((x) => x !== c))}
                    className="text-gray-400 hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          )}
        </Field>

        {/* 評価 */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="前期評価">
            <div className="flex gap-1.5 flex-wrap">
              {ALL_EVALS.map((e) => (
                <button key={e} onClick={() => set("eval_prev", e)}
                  className={cn("text-xs px-3 py-1.5 rounded-full border font-bold transition-colors",
                    form.eval_prev === e ? "bg-gray-700 text-white border-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-50")}>
                  {e}
                </button>
              ))}
            </div>
          </Field>
          <Field label="今期評価">
            <div className="flex gap-1.5 flex-wrap">
              {ALL_EVALS.map((e) => (
                <button key={e} onClick={() => set("eval_current", e)}
                  className={cn("text-xs px-3 py-1.5 rounded-full border font-bold transition-colors",
                    form.eval_current === e ? "bg-gray-700 text-white border-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-50")}>
                  {e}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* 目標・結果・達成度 */}
        <Field label="今期目標" required>
          <textarea value={form.goal} onChange={(e) => set("goal", e.target.value)}
            placeholder="例：チーム全体のCPA改善率20%向上をリード"
            rows={2} className={cn(inputCls, "resize-none")} />
        </Field>

        <Field label="実績・結果">
          <textarea value={form.result} onChange={(e) => set("result", e.target.value)}
            placeholder="例：担当3社のCPAを平均18%改善。チームPDCA体制の整備も完了。"
            rows={2} className={cn(inputCls, "resize-none")} />
        </Field>

        <Field label="達成度">
          <div className="flex gap-1.5 flex-wrap">
            {ALL_ACHIEVEMENTS.map((a) => (
              <button key={a} onClick={() => set("achievement", a)}
                className={cn("text-xs px-3 py-1.5 rounded-full border transition-colors font-medium",
                  form.achievement === a ? "bg-violet-600 text-white border-violet-600" : "border-gray-300 text-gray-600 hover:bg-gray-50")}>
                {a}
              </button>
            ))}
          </div>
        </Field>

        <Field label="メモ（任意）">
          <textarea value={form.memo} onChange={(e) => set("memo", e.target.value)}
            placeholder="補足・特記事項など"
            rows={2} className={cn(inputCls, "resize-none")} />
        </Field>

        <button onClick={handleSave} disabled={!form.name.trim() || saved}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-colors">
          {saved
            ? <><Check className="w-4 h-4" />登録しました → メンバー一覧へ</>
            : "メンバーを登録する"}
        </button>
      </div>
    </div>
  );
}
