import type { ReactNode } from "react";

export default function PostLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <h1 className="p-3 bg-blue-300 rounded-xl text-black">
        {" "}
        This is common for posts and their subs
      </h1>
      {children}
    </div>
  );
}
