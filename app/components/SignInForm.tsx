"use client";

import { oAuthSignIn, signIn } from "@/auth/nextjs/action";
import { useState } from "react";

const SignInForm = () => {
  const [message, setMessage] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onFormaDataHandler = async (formData: FormData) => {
    setIsSubmitting(true);

    const result = await signIn(formData);

    if (result.status === "error") {
      setStatus("error");
      setMessage(result.message);
    } else {
      setStatus("success");
      setMessage(result.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div>
      <form action={onFormaDataHandler}>
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
        <input placeholder="Email" name="email" type="email" />
        <input placeholder="Password" name="password" type="password" />
        <button type="submit">
          {isSubmitting ? "Submitting..." : "Sign In"}
        </button>
      </form>

      {message && (
        <p style={{ color: status === "error" ? "red" : "green" }}>{message}</p>
      )}
    </div>
  );
};

export default SignInForm;
