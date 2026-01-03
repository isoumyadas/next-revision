"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const pathName = usePathname();
  console.log("pathname:: ", pathName);
  return (
    <header>
      <nav className="flex gap-2">
        <Link href={"/"} className={pathName === "/" ? "underline" : ""}>
          Home
        </Link>
        <Link
          href={"/about"}
          className={pathName === "/about" ? "underline" : ""}
        >
          About us
        </Link>
        <button>Sales</button>
      </nav>
    </header>
  );
}
