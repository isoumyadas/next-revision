import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-8">Admin</h1>
      <button>
        <Link href="/">Home</Link>
      </button>
    </div>
  );
}
