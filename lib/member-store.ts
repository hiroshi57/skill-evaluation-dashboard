import { Member } from "@/types";
import { MEMBERS as DEFAULT_MEMBERS } from "@/lib/mock-data";

const KEY = "skill_members";

export function loadMembers(): Member[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Member[];
  } catch {
    return [];
  }
}

export function saveMembers(members: Member[]) {
  localStorage.setItem(KEY, JSON.stringify(members));
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
  if (!localStorage.getItem(KEY)) {
    saveMembers(DEFAULT_MEMBERS);
  }
}
