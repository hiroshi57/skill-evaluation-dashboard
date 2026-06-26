import { MEMBERS, SKILL_COLORS, EVAL_COLOR, GRADE_COLOR } from "@/lib/mock-data";
import { Skill } from "@/types";

function cn(...c: (string | false | undefined)[]) { return c.filter(Boolean).join(" "); }

const ALL_SKILLS: Skill[] = ["運用型広告", "SEO", "コンテンツ", "SNS", "CRO・LPO", "MA", "Web制作", "DXコンサル", "クリエイティブ", "調査・リサーチ", "LLMO/AIO"];

export default function SkillsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">スキルマップ</h1>
        <p className="text-gray-500 text-sm mt-1">スキル別に保有メンバーを一覧表示</p>
      </div>

      <div className="space-y-5">
        {ALL_SKILLS.map((skill) => {
          const holders = MEMBERS.filter((m) => m.skills.includes(skill));
          return (
            <div key={skill} className="bg-white border rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b bg-gray-50">
                <span className={cn("text-sm font-bold px-3 py-1 rounded-full", SKILL_COLORS[skill])}>{skill}</span>
                <span className="text-xs text-gray-500">{holders.length}名が保有</span>
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-2">
                {holders.length === 0 ? (
                  <p className="text-xs text-gray-400 py-1">保有者なし</p>
                ) : (
                  holders.map((m) => (
                    <div key={m.id} className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1.5 text-xs">
                      <span className="font-medium text-gray-800">{m.name}</span>
                      <span className={cn("font-bold px-1.5 py-0.5 rounded-full text-xs", EVAL_COLOR[m.eval_current])}>{m.eval_current}</span>
                      <span className={cn("px-1.5 py-0.5 rounded-full", GRADE_COLOR[m.grade])}>{m.grade}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
