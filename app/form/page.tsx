import NormalForm from "@/app/components/NormalForm";
import { prisma } from "@/lib/prisma";
// import { personDatas } from "@/utils/services";
// import type { Person } from "@/utils/services";

export default async function AllForms() {
  const persons = await prisma.user.findMany();

  console.log("All persons:: ", persons);
  return (
    <div>
      <NormalForm />

      <div>
        {/* {personDatas.map((person: Person, index) => (
          <div
            key={index}
            className="p-5 rounded-lg bg-blue-900 flex flex-col gap-3 m-2"
          >
            <p>{person.name}</p>
            <p>{person.age}</p>
          </div>
        ))} */}

        {persons.map((person) => (
          <div
            key={person.id}
            className="p-5 rounded-lg bg-pink-900 flex flex-col gap-3 m-2"
          >
            <p>{person.name}</p>
            <p>{person.age}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
