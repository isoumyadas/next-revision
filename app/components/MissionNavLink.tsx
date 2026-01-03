"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function MissionNavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathName = usePathname();

  return (
    <div>
      <Link
        href={href}
        className={
          pathName === "/about/mission" ? "underline text-[#F77D36]" : ""
        }
      >
        {children}
      </Link>
    </div>
  );
}
