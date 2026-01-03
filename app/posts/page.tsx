// server component

import Link from "next/link";
import Form from "next/form";

export default async function MyPosts({ searchParams }) {
  const { query } = await searchParams;
  console.log(query);
  const data = await fetch(`https://jsonplaceholder.typicode.com/posts`);
  const res = await data.json();

  const filteredFacts = query
    ? res.filter((obj) => obj.title.toLowerCase().includes(query.toLowerCase()))
    : res;

  console.log(filteredFacts);

  return (
    <div>
      {/* This form doesn't reload the page */}
      <Form action="/posts">
        <input type="text" name="query" placeholder="post name" />
        {/* so here, when you type any text in input field and hit enter, the any text and the name {query} will be attached to the url like http://localhost:3000/posts?query=cvcvcvcx. Using searchParams we can actually filter the results for the user once they typed the text for their purpose.  */}
      </Form>
      <ul>
        {filteredFacts.map((i) => (
          <li key={i.id}>
            <Link href={`/posts/${i.id}`}>
              <h1>{i.title}</h1>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
