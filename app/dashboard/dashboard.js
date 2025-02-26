import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <header className="bg-blue-600 shadow-md py-4 px-6 flex justify-between items-center fixed w-full top-0 z-50">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <Link href="/" className="text-white hover:text-gray-200 font-medium">
            Home
          </Link>
          <Link href="/analytics" className="text-white hover:text-gray-200 font-medium hover:cursor-pointer">
            Analytics
          </Link>
        </nav>
      </header>

      {/* Page Content */}
      <main className="pt-20 p-6">
        <h2 className="text-xl font-semibold">Welcome to the Dashboard!</h2>
        <p className="text-gray-700 mt-2">Manage your activities and track your progress here.</p>
      </main>
    </div>
  );
}
