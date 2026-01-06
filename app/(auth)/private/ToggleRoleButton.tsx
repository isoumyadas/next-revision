"use client";

import { toggleRole } from "@/actions/toggleRole";

export function ToggleRoleButton() {
  return (
    <button
      onClick={toggleRole}
      className="rounded-2xl p-2 bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-800"
    >
      Toggle Role
    </button>
  );
}
