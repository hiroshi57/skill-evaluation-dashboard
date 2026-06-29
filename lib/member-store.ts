import { Member } from "@/types";
import { MEMBERS as DEFAULT_MEMBERS } from "@/lib/mock-data";

const KEY = "skill_members";
const VERSION_KEY = "skill_members_version";
// データを更新したらこの番号を上げる → 全ユーザーのlocalStorageが自動リセットされる
const CURRENT_VERSION = "2";

/** バージョンが古ければ強制リセットしてから読む */
function migrateIfNeeded() {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(VERSION_KEY);
  if (stored !== CURRENT_VERSION) {
    localStorage.setItem(KEY, JSON.stringify(DEFAULT_MEMBERS));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  }
}

export function loadMembers(): Member[] {
  if (typeof window === "undefined") return DEFAULT_MEMBERS;
  try {
    migrateIfNeeded();
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_MEMBERS;
    const parsed = JSON.parse(raw) as Member[];
    return parsed.length > 0 ? parsed : DEFAULT_MEMBERS;
  } catch {
    return DEFAULT_MEMBERS;
  }
}

export function saveMembers(members: Member[]) {
  localStorage.setItem(KEY, JSON.stringify(members));
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  window.dispatchEvent(new CustomEvent("members_updated"));
}

export function saveMember(member: Member) {
  const all = loadMembers();
  const idx = all.findIndex((m) => m.id === member.id);
  if (idx >= 0) {
    all[idx] = member;
  } else {
    all.push(member);
  }
  saveMembers(all);
}

export function deleteMember(id: string) {
  const all = loadMembers().filter((m) => m.id !== id);
  saveMembers(all);
}

export function initIfEmpty() {
  if (typeof window === "undefined") return;
  migrateIfNeeded();
  if (!localStorage.getItem(KEY)) {
    saveMembers(DEFAULT_MEMBERS);
  }
}
