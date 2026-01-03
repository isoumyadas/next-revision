"use client";

import { useEffect, useState } from "react";

type Persons = {
  id: string;
  name: string;
  age: string;
};

export default function AllPersons() {
  const [persons, setPersons] = useState<Persons[]>([]);
  const [person, setPerson] = useState<Persons>();

  useEffect(() => {
    async function getAllPersons() {
      const data = await fetch(`http://localhost:3000/api/testing-route`);
      const res = await data.json();

      setPersons(res.data);
      return;
    }

    getAllPersons();
  }, []);

  // userByid

  useEffect(() => {
    async function getSinglePerson() {
      const data = await fetch(
        `http://localhost:3000/api/testing-route/${"6b9da32b-35ff-46d6-9cf1-6a8e2b422040"}`
      );
      const res = await data.json();

      setPerson(res.data);
      return;
    }

    getSinglePerson();
  }, []);

  if (!person) {
    return <div className="text-blue-500 font-bold">Loading......</div>;
  }

  return (
    <>
      <h1>Here are age of following persons</h1>
      <div>
        {persons.map((person) => (
          <ul key={person.id}>
            <li>{person.name}</li>
          </ul>
        ))}
      </div>

      <h1>Single Person list</h1>
      <div className="bg-pink-800 rounded-xl p-2">
        <p>{person?.name}</p>
        <small>{person?.age}</small>
      </div>
    </>
  );
}
