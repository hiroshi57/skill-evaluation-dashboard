export type Unit = "第1ユニット" | "第2ユニット" | "第3ユニット" | "アソシエイト" | "その他";
export type Role = "リーダー" | "メンバー" | "アソシエイト";
export type Grade = "1年目" | "2年目" | "3年目" | "4年目" | "5年目以上";
export type Skill = "運用型広告" | "SEO" | "コンテンツ" | "SNS" | "CRO・LPO" | "MA" | "Web制作" | "DXコンサル" | "クリエイティブ" | "調査・リサーチ" | "LLMO/AIO";
export type EvalRating = "S" | "A" | "B" | "C" | "未評価";

export type Member = {
  id: string;
  name: string;
  unit: Unit;
  role: Role;
  grade: Grade;
  skills: Skill[];
  clients: string[];         // 主担当クライアント
  eval_current: EvalRating;  // 今期評価
  eval_prev: EvalRating;     // 前期評価
  goal: string;              // 今期目標
  memo?: string;
};
