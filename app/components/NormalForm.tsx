"use client";

import Form from "next/form";
import { createForm } from "@/actions/normalForm";
import { useActionState, useOptimistic, useTransition } from "react";

export default function NormalForm() {
  //   const [isPending, startTransition] = useTransition();
  // const ref = useRef<HTMLFormElement>(null);
  const initialState = {
    message: "",
  };
  const [state, formAction, pending] = useActionState(createForm, initialState);
  // const [optimisticTodos, addOptimisticTodo] = useOptimistic(prevState, (state, new) => {
  //   return [...state, new]
  // })
  return (
    <>
      <h1>Normal Form</h1>

      <Form
        // action={(formData: FormData) => {
        //   startTransition(() => {
        //     createForm(formData);
        //   });
        // }}

        // action={async (formData: FormData) => {
        //   ref.current?.reset();
        //   await createForm(formData);
        // }}

        // action={async (formData: FormData) => {
        //   // const { error } = await createForm(formData); (should not do this)

        //   await createForm(formData)

        //   if (typeof error === undefined) return;

        //   if (error) alert(error.message);
        // }}

        action={(formData) => {
          //  addOptimisticTodo({
          //   id: Math.random(),
          //   name: formData.get("name")?.toString(),
          //   age:  formData.get("age")?.toString()
          //  })
          formAction(formData);
        }}
      >
        <input placeholder="name" name="firstName" type="text" />
        <input placeholder="age" name="age" type="text" />
        {/* <button disabled={isPending} type="submit">
          {isPending ? "Adding..." : "Add"}
        </button> */}
        {state?.message && (
          <p aria-live="polite" className="text-red-500">
            {state.message}
          </p>
        )}
        <button
          disabled={pending}
          type="submit"
          className="p-2 bg-green-800 rounded-xl"
        >
          {pending ? "Adding..." : "Add"}
        </button>
      </Form>
    </>
  );
}
