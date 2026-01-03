"use client";

import { logOut } from "../action";

export default function LogOutButton() {
  return <button onClick={async () => await logOut()}>Log Out</button>;
}
