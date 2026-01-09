"use client";

import { oAuthSignIn, signUp } from "@/auth/nextjs/action";

const SignUpForm = () => {
  return (
    <div>
      <form
        action={async (formData: FormData) => {
          await signUp(formData);
        }}
      >
        <div className="flex gap-3">
          <button
            className="p-2 rounded-2xl bg-blue-600 font-bold text-white cursor-pointer hover:bg-blue-800"
            type="button"
            onClick={async () => await oAuthSignIn("discord")}
          >
            Discord
          </button>
          <button
            className="p-2 rounded-2xl bg-gray-800 font-bold text-white cursor-pointer hover:bg-gray-950"
            type="button"
            onClick={async () => await oAuthSignIn("github")}
          >
            Github
          </button>
        </div>
        <input placeholder="Name" name="name" type="text" />
        <input placeholder="Email" name="email" type="email" />
        <input placeholder="Password" name="password" type="password" />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
