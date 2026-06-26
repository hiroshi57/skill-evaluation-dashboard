export type Unit = "第1ユニット" | "第2ユニット" | "第3ユニット" | "アソシエイト" | "その他";
export type Role = "リーダー" | "メンバー" | "アソシエイト";
export type Grade = "1年目" | "2年目" | "3年目" | "4年目" | "5年目以上";
export type Skill = "運用型広告" | "SEO" | "コンテンツ" | "SNS" | "CRO・LPO" | "MA" | "Web制作" | "DXコンサル" | "クリエイティブ" | "調査・リサーチ" | "LLMO/AIO";
export type EvalRating = "S" | "A" | "B" | "C" | "未評価";
export type Achievement = "達成" | "概ね達成" | "一部達成" | "未達" | "評価中";

export type Member = {
  id: string;
  name: string;
  unit: Unit;
  role: Role;
  grade: Grade;
  skills: Skill[];
  clients: string[];
  eval_current: EvalRating;
  eval_prev: EvalRating;
  goal: string;              // 今期目標
  result: string;            // 実際の結果・実績
  achievement: Achievement;  // 達成度
  memo?: string;
};
