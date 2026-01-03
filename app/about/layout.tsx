import { ReactNode } from "react";
import MissionNavLink from "../components/MissionNavLink";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <MissionNavLink href={"/about/mission"}>Mission</MissionNavLink>
      {children}
    </div>
  );
}
