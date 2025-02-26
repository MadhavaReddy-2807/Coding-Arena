import Link from "next/link";

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 shadow-md py-4 px-6 flex justify-between items-center fixed w-full top-0 z-50">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <Link href="/" className="text-white hover:text-gray-200 font-medium">
            Home
          </Link>
          <Link href="/dashboard" className="text-white hover:text-gray-200 font-medium">
            Dashboard
          </Link>
        </nav>
      </header>

      <main className="pt-20 p-6">
        <h2 className="text-xl font-semibold">Analytics Overview</h2>
        <p className="text-gray-700 mt-2">Track your stats and performance here.</p>
      </main>
    </div>
  );
}
