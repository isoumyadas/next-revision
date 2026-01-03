import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1>Trying out stuffs</h1>
          <h2>Making stuffs better and life easy</h2>
          <p>Thins which looks easy but ain&apos;t easy until you try</p>
        </div>

        <div className="flex items-center justify-center gap-4 text-base font-medium sm:flex-row">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
        </div>
      </main>
    </div>
  );
}
