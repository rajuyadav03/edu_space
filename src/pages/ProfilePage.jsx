import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, Building2, MapPin, BookOpen, Award, Camera, Save, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
    const { user, isAuthenticated, authLoading } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        avatar: "",
        schoolName: "",
        address: "",
        subject: "",
        experience: ""
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login");
            return;
        }
        if (user) {
            setProfile({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                avatar: user.avatar || "",
                schoolName: user.schoolName || "",
                address: user.address || "",
                subject: user.subject || "",
                experience: user.experience || ""
            });
            setLoading(false);
        }
    }, [user, isAuthenticated, authLoading, navigate]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const token = localStorage.getItem("eduSpaceToken") || sessionStorage.getItem("eduSpaceToken");
            const { API_BASE_URL } = await import("../lib/constants");

            const res = await fetch(`${API_BASE_URL}/users/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone,
                    avatar: profile.avatar,
                    ...(user?.role === "school" && {
                        schoolName: profile.schoolName,
                        address: profile.address
                    }),
                    ...(user?.role === "teacher" && {
                        subject: profile.subject,
                        experience: profile.experience
                    })
                })
            });

            const data = await res.json();
            if (data.success) {
                setMessage({ type: "success", text: "Profile updated successfully!" });
            } else {
                setMessage({ type: "error", text: data.message || "Failed to update profile" });
            }
        } catch {
            setMessage({ type: "error", text: "Something went wrong. Please try again." });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: "", text: "" }), 5000);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-neutral-950">
                <Navbar />
                <div className="pt-32 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 dark:border-white" />
                </div>
            </div>
        );
    }

    const isTeacher = user?.role === "teacher";
    const isSchool = user?.role === "school";

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950">
            <Navbar />

            <section className="pt-32 pb-20 px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">

                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition mb-8 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-5 mb-10">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-lg">
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                                ) : (
                                    user?.name?.[0]?.toUpperCase() || "U"
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                                <Camera className="w-3.5 h-3.5 text-white dark:text-gray-900" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${isTeacher ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : isSchool ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                                </span>
                                <span className="text-sm text-gray-400">{user?.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl text-sm border ${message.type === "success"
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                            }`}>
                            {message.type === "success" ? "✅" : "❌"} {message.text}
                        </div>
                    )}

                    {/* Profile Form */}
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 outline-none text-sm transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed"
                                        />
                                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            placeholder="+91 9000000000"
                                            className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 outline-none text-sm transition"
                                        />
                                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Avatar URL</label>
                                    <input
                                        type="url"
                                        value={profile.avatar}
                                        onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                                        placeholder="https://example.com/photo.jpg"
                                        className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 outline-none text-sm transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* School-specific fields */}
                        {isSchool && (
                            <div className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    School Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">School Name</label>
                                        <input
                                            type="text"
                                            value={profile.schoolName}
                                            onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
                                            className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 outline-none text-sm transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={profile.address}
                                                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                                className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 outline-none text-sm transition"
                                            />
                                            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Teacher-specific fields */}
                        {isTeacher && (
                            <div className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Teaching Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                                        <input
                                            type="text"
                                            value={profile.subject}
                                            onChange={(e) => setProfile({ ...profile, subject: e.target.value })}
                                            placeholder="e.g. Mathematics"
                                            className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 outline-none text-sm transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Experience</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={profile.experience}
                                                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                                                placeholder="e.g. 5 years"
                                                className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 outline-none text-sm transition"
                                            />
                                            <Award className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white dark:border-gray-900 border-t-transparent" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>

            <Footer />
        </div>
    );
}
