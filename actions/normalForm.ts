"use server";

import { prisma } from "@/lib/prisma";
//import { personDatas } from "@/utils/services";
import { revalidatePath } from "next/cache";

export async function createForm(_prevState: any, formData: FormData) {
  const name = formData.get("firstName")?.toString();
  const age = formData.get("age")?.toString();

  if (!name || !age) {
    return { message: "All fields are required" };
    // throw new Error();
  }

  // try {
  const res = await prisma.user.create({
    data: {
      name,
      age,
    },
  });

  console.log("Created Data:: ", res);

  // personDatas.push({ name: name, age: age });

  // console.log("persons: ", personDatas);

  //   refresh();
  revalidatePath("/form");

  // return { success: true };
  // } catch (error) {
  //   console.error(error);
  //   // return {
  //   //   error: error,
  //   // };
  // }
}
