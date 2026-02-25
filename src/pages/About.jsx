import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Users, Building2, Shield, Heart, BookOpen, Award } from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-16 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium mb-6">
                        <Building2 className="w-4 h-4" />
                        About EduSpace
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Connecting Teachers with
                        <br />
                        <span className="text-gray-400 dark:text-gray-500">Learning Spaces</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        EduSpace is India's first platform dedicated to renting school and college spaces for tuition, training, workshops, and events.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 px-6 lg:px-8 bg-gray-50 dark:bg-neutral-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                                We believe every teacher deserves access to quality learning environments, and every school should be able to maximize the use of their facilities.
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                EduSpace bridges this gap by creating a seamless marketplace where schools can list their idle spaces — classrooms, laboratories, auditoriums, and sports halls — and teachers can discover and book them instantly.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: BookOpen, label: "Quality Spaces", desc: "Verified and trusted venues" },
                                { icon: Shield, label: "Secure Platform", desc: "Safe and reliable bookings" },
                                { icon: Heart, label: "Community First", desc: "Built for educators" },
                                { icon: Award, label: "Best Prices", desc: "Transparent and fair pricing" }
                            ].map((item, i) => (
                                <div key={i} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-gray-100 dark:border-neutral-700 hover:shadow-lg transition">
                                    <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center mb-4">
                                        <item.icon className="w-6 h-6 text-white dark:text-gray-900" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.label}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">How It Works</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-lg mx-auto">Simple steps for both teachers and schools</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* For Teachers */}
                        <div className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-8 border border-gray-100 dark:border-neutral-800">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-medium mb-6">
                                <Users className="w-4 h-4" />
                                For Teachers
                            </div>
                            <ol className="space-y-6">
                                {[
                                    { title: "Sign Up", desc: "Create a free teacher account in seconds" },
                                    { title: "Browse Spaces", desc: "Search verified classrooms, labs, and halls" },
                                    { title: "Book Instantly", desc: "Choose date, time slot, and submit your request" },
                                    { title: "Start Teaching", desc: "Show up and teach — it's that simple" }
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-4">
                                        <span className="w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{step.title}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* For Schools */}
                        <div className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-8 border border-gray-100 dark:border-neutral-800">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium mb-6">
                                <Building2 className="w-4 h-4" />
                                For Schools
                            </div>
                            <ol className="space-y-6">
                                {[
                                    { title: "Register Your School", desc: "Create an account and verify your institution" },
                                    { title: "List Your Spaces", desc: "Add classrooms, labs, auditoriums with photos" },
                                    { title: "Manage Bookings", desc: "Accept or decline booking requests from teachers" },
                                    { title: "Earn Revenue", desc: "Turn idle spaces into income" }
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-4">
                                        <span className="w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{step.title}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 lg:px-8 bg-gray-50 dark:bg-neutral-900">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Join EduSpace Today</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                        Whether you're a teacher or a school, there's a place for you on EduSpace.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:opacity-90 transition text-center">
                            Get Started Free
                        </Link>
                        <Link to="/contact" className="px-8 py-4 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-neutral-700 rounded-xl font-semibold hover:border-gray-400 dark:hover:border-neutral-500 transition text-center">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
