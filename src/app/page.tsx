import Link from "next/link"
import { BookOpen, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <main className="text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-16">
            <div className="mb-8 sm:mb-0">
              <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400">
                  StudyShare
                </span>
                <br />
                Learn Together
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8">
                Collaborate, share, and excel in your studies
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </div>
            <div className="w-full sm:w-1/2 h-64 sm:h-96 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-300 rounded-3xl transform rotate-3 scale-95 opacity-20"></div>
              <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src="/placeholder.svg?height=384&width=384"
                  alt="Students collaborating"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
            {[ 
              { title: "Share Resources", icon: BookOpen, description: "Upload and share your notes, assignments, and projects with fellow students." },
              { title: "Discover Content", icon: Search, description: "Find valuable study materials shared by your peers across various subjects." },
              { title: "Collaborate", icon: Users, description: "Interact with other students through comments, ratings, and bookmarks." }
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-600 text-white rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to boost your academic journey?</h2>
            <p className="text-xl mb-8">Join StudyShare today and experience the power of collaborative learning!</p>
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link href="/signup">Start Sharing Now</Link>
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}