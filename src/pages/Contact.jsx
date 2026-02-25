import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from "lucide-react";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState(""); // "", "sending", "sent", "error"

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus("sending");

        // Simulate sending (in production, connect to backend)
        setTimeout(() => {
            setStatus("sent");
            setForm({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setStatus(""), 5000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950">
            <Navbar />

            <section className="pt-32 pb-20 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium mb-6">
                            <MessageCircle className="w-4 h-4" />
                            Get In Touch
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Contact Us
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                            Have questions, feedback, or partnership inquiries? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-8 border border-gray-100 dark:border-neutral-800">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                            <a href="mailto:support@eduspace.in" className="font-medium text-gray-900 dark:text-white hover:text-blue-600 transition">
                                                support@eduspace.in
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                            <a href="tel:+919000000000" className="font-medium text-gray-900 dark:text-white hover:text-green-600 transition">
                                                +91 90000 00000
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                            <p className="font-medium text-gray-900 dark:text-white">Mumbai, Maharashtra, India</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Business Hours</p>
                                            <p className="font-medium text-gray-900 dark:text-white">Mon–Sat, 9 AM – 6 PM IST</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Teaser */}
                            <div className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-8 border border-gray-100 dark:border-neutral-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Common Questions</h3>
                                <div className="space-y-4">
                                    {[
                                        { q: "How much does it cost to list a space?", a: "Listing is completely free. We charge a small 10% service fee on bookings." },
                                        { q: "Can I cancel a booking?", a: "Yes, teachers can cancel pending or confirmed bookings from their dashboard." },
                                        { q: "How do payments work?", a: "Currently we support cash, UPI, card, and bank transfers. Payment is arranged directly." }
                                    ].map((faq, i) => (
                                        <div key={i}>
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">{faq.q}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            <div className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-8 border border-gray-100 dark:border-neutral-800">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h3>

                                {status === "sent" && (
                                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-sm">
                                        ✅ Message sent successfully! We'll get back to you soon.
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                placeholder="Your name"
                                                className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent outline-none text-sm transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                placeholder="you@example.com"
                                                className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent outline-none text-sm transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.subject}
                                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            placeholder="What can we help with?"
                                            className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent outline-none text-sm transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            placeholder="Tell us more..."
                                            className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent outline-none text-sm transition resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "sending"}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all disabled:opacity-60"
                                    >
                                        {status === "sending" ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white dark:border-gray-900 border-t-transparent" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
