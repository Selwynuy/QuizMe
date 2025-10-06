import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import HeroClientUploader from '@/components/hero-client-uploader'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { GlobalNavbar } from '@/components/global-navbar'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <GlobalNavbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>

        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  AI-Powered Learning Platform
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-gray-900 lg:text-6xl">
                  Create Flashcards from
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {' '}
                    Any Content
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Upload PDFs, paste text, or share URLs. Our AI instantly transforms your study
                  materials into personalized flashcards. Study smarter with spaced repetition that
                  adapts to your pace.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                >
                  Start Learning Free
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Active Learners</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Retention Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">50%</div>
                  <div className="text-sm text-gray-600">Faster Learning</div>
                </div>
              </div>
            </div>

            {/* Right Content - Upload Demo */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Try It Now</h3>
                    <p className="text-gray-600">
                      Upload a PDF and watch AI create smart flashcards
                    </p>
                  </div>
                  <HeroClientUploader />

                  {/* Alternative Option */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <Link href="/decks/new">
                      <Button
                        variant="outline"
                        className="w-full py-3 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      >
                        <span className="mr-2">✏️</span>
                        Create Deck Manually
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-500 mt-2">
                      Start with a blank deck and add cards yourself
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powered by Advanced AI</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent system understands context, identifies key concepts, and creates
              optimal learning experiences tailored to your needs.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="group p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Generation</h3>
              <p className="text-gray-600">
                AI analyzes content and creates high-quality flashcards with perfect question-answer
                pairs.
              </p>
            </div>

            <div className="group p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adaptive Learning</h3>
              <p className="text-gray-600">
                Spaced repetition algorithm adjusts to your performance for optimal memory
                retention.
              </p>
            </div>

            <div className="group p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Intelligence</h3>
              <p className="text-gray-600">
                Advanced analytics track your learning patterns and suggest optimal study times.
              </p>
            </div>

            <div className="group p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contextual Understanding</h3>
              <p className="text-gray-600">
                AI understands subject matter and creates contextually relevant learning materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free and upgrade when you need more. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 relative flex flex-col">
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-8">Perfect for getting started</p>

                <ul className="space-y-4 mb-8 text-left flex-1">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>3 decks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>50 cards per deck</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>AI flashcard generation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Basic spaced repetition</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Progress tracking</span>
                  </li>
                </ul>

                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white mt-auto">
                  Get Started Free
                </Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl border-2 border-blue-500 p-8 relative flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$9</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-8">For serious learners</p>

                <ul className="space-y-4 mb-8 text-left flex-1">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Unlimited decks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Unlimited cards</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Advanced AI features</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Export to Anki/Quizlet</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mt-auto">
                  Start Pro Trial
                </Button>
              </div>
            </div>

            {/* Team Plan */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 relative flex flex-col">
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Team</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-8">For classrooms & teams</p>

                <ul className="space-y-4 mb-8 text-left flex-1">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Up to 10 team members</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Shared deck libraries</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Team analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Admin controls</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Dedicated support</span>
                  </li>
                </ul>

                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white mt-auto">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              All plans include 14-day free trial. Cancel anytime.
            </p>
            <p className="text-sm text-gray-500">
              Need a custom plan?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about QuizMe</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-xl font-semibold text-gray-900 hover:no-underline">
                How does the AI flashcard generation work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                Our AI analyzes your content (PDFs, text, or notes) and identifies key concepts,
                definitions, and important information. It then creates high-quality question-answer
                pairs that are perfect for spaced repetition learning. The AI understands context
                and creates flashcards that are both comprehensive and focused.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-xl font-semibold text-gray-900 hover:no-underline">
                What file types can I upload?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                Currently, we support PDF files up to 10MB. You can also paste text directly into
                our editor. We're working on adding support for Word documents, PowerPoint
                presentations, and other formats in the coming months.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-xl font-semibold text-gray-900 hover:no-underline">
                How accurate is the spaced repetition algorithm?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                Our algorithm is based on the scientifically-proven SM-2 method, enhanced with
                machine learning to adapt to your individual learning patterns. Studies show that
                spaced repetition can improve retention by up to 200% compared to traditional study
                methods.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-xl font-semibold text-gray-900 hover:no-underline">
                Can I export my flashcards to other platforms?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                Yes! Pro and Team users can export their flashcards to popular platforms like Anki,
                Quizlet, and CSV format. This ensures you never lose your study materials and can
                use them with other tools if needed.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left text-xl font-semibold text-gray-900 hover:no-underline">
                Is my data secure and private?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                Absolutely. We use enterprise-grade security with SSL encryption, and your data is
                stored securely in our cloud infrastructure. We never share your personal
                information or study materials with third parties. You can delete your account and
                all data at any time.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left text-xl font-semibold text-gray-900 hover:no-underline">
                Can I use QuizMe on my mobile device?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                Yes! QuizMe is fully responsive and works great on mobile devices through your web
                browser. We're also developing dedicated mobile apps for iOS and Android that will
                be available soon.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left text-xl font-semibold text-gray-900 hover:no-underline">
                What's the difference between the free and paid plans?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                The free plan includes 3 decks with up to 50 cards each, basic AI generation, and
                standard spaced repetition. Pro plans offer unlimited decks and cards, advanced AI
                features, detailed analytics, export capabilities, and priority support. Team plans
                add collaboration features for classrooms and organizations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-left text-xl font-semibold text-gray-900 hover:no-underline">
                Do you offer student or educational discounts?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                Yes! We offer special pricing for students, teachers, and educational institutions.
                Contact our support team with your educational email address to learn about our
                discounted rates and special features for academic use.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-32 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 md:mb-12 max-w-3xl mx-auto">
            Join thousands of students who are already studying smarter with AI-powered flashcards.
          </p>
          <div className="flex justify-center">
            <Button className="px-6 py-3 md:px-16 md:py-6 text-lg md:text-2xl bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-xl w-full max-w-sm md:max-w-none">
              🚀 Start Learning Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
