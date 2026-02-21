import {
  Target,
  Clock,
  Award,
  BarChart3,
  Brain,
  Zap,
} from "lucide-react";
import HeroSection from "@/components/HeroSection";

const features = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Topic-Wise Practice",
    description: "Focus on specific subjects and topics with customizable difficulty levels",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "UPSC Standard Timing",
    description: "Auto-calculated time limits with smart extensions and warnings",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Detailed Analytics",
    description: "Track your performance with comprehensive insights and progress charts",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Smart Question Bank",
    description: "Curated questions from easy to hard with detailed explanations",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Performance Tracking",
    description: "Monitor your strengths and weaknesses across all subjects",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Results",
    description: "Get immediate feedback with answer explanations and time analysis",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-4000"></div>
      </div>

      {/* Hero Section (Client Component — handles auth + animations) */}
      <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <HeroSection />
      </section>

      {/* Features Section — Server Rendered */}
      <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Everything You Need to Succeed
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
            Comprehensive features designed specifically for UPSC aspirants
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section — Server Rendered */}
      <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Simple 3-Step Process
          </h2>
        </div>

        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6 sm:gap-8">
          {[
            { step: "01", title: "Choose Topics", desc: "Select subjects and difficulty level" },
            { step: "02", title: "Take Test", desc: "Practice with UPSC-standard timing" },
            { step: "03", title: "Analyze Results", desc: "Review performance and improve" },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 shadow-xl">
                {item.step}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section — Server Rendered */}
      <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 mb-12 sm:mb-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-2xl max-w-5xl mx-auto shimmer">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 px-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of aspirants who are preparing smarter with our platform
          </p>
          <a
            href="/login"
            className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Get Started Free →
          </a>
        </div>
      </section>

      {/* Footer — Server Rendered */}
      <footer className="relative border-t border-gray-200 bg-white/50 backdrop-blur-sm py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm sm:text-base">
          <p>© 2024 UPSC Practice Platform. Built with ❤️ for aspirants.</p>
        </div>
      </footer>
    </main>
  );
}