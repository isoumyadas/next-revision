type SlugParamsType = {
  params: Promise<{
    slug: number | string;
  }>;
};

export default async function SingleBlog({ params }: SlugParamsType) {
  const { slug } = await params; // you have to put the name which you have given the [] name, if dk what is the value console.log(await params)
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${slug}`);
  const data = await res.json();
  return <h1>{`Hello, ${data.title}`}</h1>;
}
