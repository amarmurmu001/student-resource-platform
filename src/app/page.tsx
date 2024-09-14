import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <main className="text-center sm:text-left">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            Student Resource
          </span>
          <br />
          Sharing Platform
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12">
          Collaborate, learn, and succeed together!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start mb-16">
          <Link
            href="/signup"
            className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-blue-600 text-lg font-semibold rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 border border-blue-600"
          >
            Login
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          {[
            { title: "Share Resources", icon: "📚", description: "Upload and share your notes, assignments, and projects with fellow students." },
            { title: "Discover Content", icon: "🔍", description: "Find valuable study materials shared by your peers across various subjects." },
            { title: "Collaborate", icon: "🤝", description: "Interact with other students through comments, ratings, and bookmarks." }
          ].map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{feature.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
