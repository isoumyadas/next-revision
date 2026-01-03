"use client";

import { signUp } from "@/auth/nextjs/action";

const SignUpForm = () => {
  return (
    <div>
      <form
        action={async (formData: FormData) => {
          await signUp(formData);
        }}
      >
        <input placeholder="Name" name="name" type="text" />
        <input placeholder="Email" name="email" type="email" />
        <input placeholder="Password" name="password" type="password" />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
