1. Layouts and Pages

   - Pages: UI that is specific to a single route.
   - Layouts: UI that is shared between multiple pages routes.

   - Mean if you have header and footer, you should put that into root layout file
   - If you have something which is common for aboutpage and their nested routes, then you should put those components into aboutpage root layout file.

2. Fonts and Images Optimization

   - Image
     - auto resize & convert to more efficient formats
     - lazyloading - only load when moving into viewport
     - prevent layout shift

3. Link component

   - Enables client-side navigation
   - Prefetches when link is in view
   - Maintains react state between navigations (Next.js <Link> maintains React state between navigations because it uses client-side routing. Unlike a normal <a href>, it does not refresh the page, so existing state (like login state) remains intact.)

4. Client vs Server Components

   - Client components
     - Code is only run in the browser
     - Must start a fetch request after the component mounts
     - useEffect and useState are needed to manage the async nature of fetching
   - Server components
     - Code only runs on the server
     - Data is fetched before rendering
     - No need for useEffect or useState, just await the data and use it your markup!

5. Dynamic Routes

   - Create a folder whose name represents what you want the path to contain
     - eg: id, slug, category etc.
   - Surround the folder name with square brackets (eg: [id], [slug], [category])
   - Use params in the page component to access the dynamic route value.

6. For params type

   ```js

      params: Promise<{
        categoryName: string // whatever dyanmic name you've gave in [], or whatever comes in params.
    }>

   ```

7. Rendering Strategies
   - Decide when and where a page's HTML is built.
     - Build-time (mostly for production purpose, where onece the app is build the new changes need another build-time)
       - Pre-rendered once, served from cache.
     - Request-time
       - HTML rendered on demand, always fresh.
     - In Browser
       - Built in browser after JS loads.

- Static Site Generation
  - Once at build-time
  - On server, when `next build` is run
- Incremental Static Regenration (ISR)
  - Once at build-time, when regenrated at a time window
  - On server, in the background when the next request triggers regenration
- Server Side Rendering (SSR)
  - On every request from the browser
  - On server, when a request for that page comes in.

8.  Dynmaic fetch for production
    ```js
    export const dynamic = "force-dynamic"; // this is used on top of your page, and this will force the it to be dynamic.
    async function getCatFact() {
      const res = await fetch("https://catfact.ninja/fact", {
        cache: "no-store",
      });
      return await res.json();
    }
    ```
9.  Search Params

        - Before diving:

               - ```js
                 <form>
                   <input type="text" name="query" placeholder="post name" />
                   {/* so here, when you type any text in input field and hit enter, the any text and the name {query} will be attached to the url like http://localhost:3000/posts?query=cvcvcvcx. Using searchParams we can actually filter the results for the user once they typed the text for their purpose.  */}
                 </form>
                 ```

              - ```js
                      import Link from "next/link";

                        export default async function MyPosts({ searchParams }) {
                        const { query } = await searchParams; // you don't need to import searchParams
                        console.log(query);
                        const data = await fetch("https://jsonplaceholder.typicode.com/posts");
                        const res = await data.json();

                        const filteredFacts = query
                           ? res.filter((obj) => obj.title.toLowerCase().includes(query.toLowerCase()))
                           : res;

                        console.log(filteredFacts);

                        return (
                           <div>
                              <form>
                              <input type="text" name="query" placeholder="post name" />
                              {/* so here, when you type any text in input field and hit enter, the any text and the name {query} will be attached to the url like http://localhost:3000/posts?query=cvcvcvcx. Using searchParams we can actually filter the results for the user once they typed the text for their purpose.  */}
                              </form>
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
                  ```

---

<!-- Server functions -->

1. What is Server functions?

   - A Server Function is an asynchronous function that runs on the server.
   - They can be called from the client through a network request, which is why they must be asynchronous.
   - In an action or mutation context, they are also called `Server Actions`.

   - Server Action is an async func used with startTransition. This happens automatically when the function is:

     - Passed to a <form> using action prop
     - Passed to a <button> using formAction prop

   - Creating server functions

     - It uses `use server` directive at the top of the file if (seprate folder) or at top of function if inline
     - ```ts
          export async function createPost(formData: FormData) {
          'use server'
          const title = formData.get('title')
          const content = formData.get('content')

          // Update data
         // Revalidate cache
        }`

       ```

     - It can created in seprate actions folder with action suffix `createPostAction.ts`
     - In Client components
       - It's not possible to define server components
       - Here you should use the separate folders
     - You can also pass the server function as a prop.
       - `ts <ClientComponent updateItemAction={updateItem} /> `

2. Invoking Server functions

   - Learn more about here : https://nextjs.org/docs/app/getting-started/updating-data

3. What to use server actions || route handlers?

   - Use server actions: Building the Website? Use Server Actions. (Forms, Buttons, Profile updates).
   - Use route handlers: Building for Mobile/Others? Use Route Handlers (API Routes).
     - You can't use postman directly.
     - Third party
   - For authentication use server actions

     - You simply create a <form action={login}> that calls a Server Action to verify credentials, sets a secure HTTP-only cookie (using cookies().set), and then redirects the user.

   - Don't use server actions for read. Use it for (CUD) => create, update and delete.
     - Because server actions are used for mutations.
     - Don't use them for fetching data.
   - Don't use streaming data (AI) with server actions use route handlers.

<!-- Authentication -->

1. Why scrypt is prefferd over bcrypt? and what is used in production?
   -
