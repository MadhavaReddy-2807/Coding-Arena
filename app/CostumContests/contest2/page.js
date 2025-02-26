import Link from "next/link";

export default function Contest1() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">Contest 2</h1>
      <p className="text-gray-600">Welcome to Contest 2!</p>

      {/* Back to Custom Contests */}
      <Link href="/CostumContests" className="text-blue-600 hover:underline">
        ← Back to Custom Contests
      </Link>
    </div>
  );
}
