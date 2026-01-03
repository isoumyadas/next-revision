"use client";

import { signIn } from "@/auth/nextjs/action";
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
