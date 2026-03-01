import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import { User, Mail, Phone, Building2, MapPin, BookOpen, Award, Camera, Save, ArrowLeft, ShieldCheck, Upload, X } from "lucide-react";
import { uploadImageToCloudinary } from "../utils/uploadImage";

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [kycData, setKycData] = useState({ aadhaarNumber: "", panNumber: "", idDocumentUrl: "" });
    const [kycSaving, setKycSaving] = useState(false);
    const [kycUploading, setKycUploading] = useState(false);
    const [kycMessage, setKycMessage] = useState({ type: "", text: "" });
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
    }, [user]);

    const handleSave = async (e) => {
        // ... previous code
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

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            setKycMessage({ type: "error", text: "Please select an image file" });
            return;
        }

        try {
            setKycUploading(true);
            setKycMessage({ type: "", text: "" });
            const url = await uploadImageToCloudinary(file);
            setKycData(prev => ({ ...prev, idDocumentUrl: url }));
        } catch (error) {
            setKycMessage({ type: "error", text: error.message || "Failed to upload image. Check your internet connection or .env config." });
        } finally {
            setKycUploading(false);
            // reset file input
            e.target.value = '';
        }
    };

    const handleKYCSubmit = async (e) => {
        e.preventDefault();
        setKycSaving(true);
        setKycMessage({ type: "", text: "" });

        try {
            setKycSaving(true);
            setKycMessage({ type: "", text: "" });

            // ID document photo validation
            if (!kycData.idDocumentUrl) {
                setKycMessage({ type: "error", text: "Please upload your ID document photo first" });
                setKycSaving(false);
                return;
            }

            const res = await userAPI.submitKYC(kycData);
            if (res.data.success) {
                setKycMessage({ type: "success", text: res.data.message });
                // Refresh page to update user data
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setKycMessage({ type: "error", text: res.data.message || "Failed to submit KYC" });
            }
        } catch (err) {
            const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
            setKycMessage({ type: "error", text: msg });
        } finally {
            setKycSaving(false);
            setTimeout(() => setKycMessage({ type: "", text: "" }), 8000);
        }
    };

    if (loading) {
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

                        {/* KYC Verification (Teacher only) */}
                        {isTeacher && (
                            <div className={`rounded-2xl p-6 border ${user?.idVerificationStatus === 'verified'
                                ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                                : user?.idVerificationStatus === 'pending'
                                    ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800'
                                    : user?.idVerificationStatus === 'rejected'
                                        ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                                        : 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800'
                                }`}>
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" />
                                        ID Verification (KYC)
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user?.idVerificationStatus === 'verified'
                                        ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                                        : user?.idVerificationStatus === 'pending'
                                            ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                                            : user?.idVerificationStatus === 'rejected'
                                                ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                                                : 'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200'
                                        }`}>
                                        {user?.idVerificationStatus === 'verified' ? '✅ Verified'
                                            : user?.idVerificationStatus === 'pending' ? '⏳ Under Review'
                                                : user?.idVerificationStatus === 'rejected' ? '❌ Rejected'
                                                    : '⚠️ Not Submitted'}
                                    </span>
                                </div>

                                {user?.idVerificationStatus === 'verified' ? (
                                    <div className="text-sm text-green-700 dark:text-green-400">
                                        <p className="font-medium">Your identity has been verified. You can book spaces.</p>
                                        {user?.aadhaarLast4 && <p className="mt-2">Aadhaar: ●●●● ●●●● {user.aadhaarLast4}</p>}
                                        {user?.panLast4 && <p className="mt-1">PAN: ●●●●●●{user.panLast4}</p>}
                                    </div>
                                ) : user?.idVerificationStatus === 'pending' ? (
                                    <div className="text-sm text-yellow-700 dark:text-yellow-400">
                                        <p className="font-medium">Your documents are being reviewed by an admin. This usually takes 24-48 hours.</p>
                                        {user?.aadhaarLast4 && <p className="mt-2">Aadhaar submitted: ●●●● ●●●● {user.aadhaarLast4}</p>}
                                        {user?.panLast4 && <p className="mt-1">PAN submitted: ●●●●●●{user.panLast4}</p>}
                                    </div>
                                ) : (
                                    <>
                                        {user?.idVerificationStatus === 'rejected' && (
                                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
                                                <strong>Rejection Reason:</strong> {user?.idVerificationNote || 'No reason provided. Please resubmit with valid documents.'}
                                            </div>
                                        )}

                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            You must verify your identity to book spaces. Provide at least one government ID (Aadhaar or PAN).
                                        </p>

                                        {kycMessage.text && (
                                            <div className={`mb-4 p-3 rounded-xl text-sm border ${kycMessage.type === "success"
                                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                                                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                                                }`}>
                                                {kycMessage.type === "success" ? "✅" : "❌"} {kycMessage.text}
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                    Aadhaar Number <span className="text-xs text-gray-400">(12 digits)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={kycData.aadhaarNumber}
                                                    onChange={(e) => setKycData({ ...kycData, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                                                    placeholder="e.g. 123456789012 (test)"
                                                    maxLength={12}
                                                    className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 outline-none text-sm transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                    PAN Number <span className="text-xs text-gray-400">(ABCDE1234F)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={kycData.panNumber}
                                                    onChange={(e) => setKycData({ ...kycData, panNumber: e.target.value.toUpperCase().slice(0, 10) })}
                                                    placeholder="e.g. ABCDE1234F (test)"
                                                    maxLength={10}
                                                    className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 outline-none text-sm transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                    ID Document Photo *
                                                </label>

                                                {kycData.idDocumentUrl ? (
                                                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
                                                        <img
                                                            src={kycData.idDocumentUrl}
                                                            alt="ID Document Preview"
                                                            className="w-full h-full object-contain"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setKycData({ ...kycData, idDocumentUrl: "" })}
                                                            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition ${kycUploading
                                                        ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-neutral-800"
                                                        : "border-gray-300 dark:border-gray-600 border-gray-400 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-neutral-800"
                                                        }`}>
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            {kycUploading ? (
                                                                <>
                                                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-600 border-t-transparent mb-3" />
                                                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Uploading to cloud...</p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Upload className="w-8 h-8 text-gray-400 mb-3" />
                                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                        Click to upload ID photo
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        JPG, PNG or GIF (Max 5MB)
                                                                    </p>
                                                                </>
                                                            )}
                                                        </div>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            disabled={kycUploading}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleKYCSubmit}
                                                disabled={kycSaving}
                                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all disabled:opacity-60"
                                            >
                                                {kycSaving ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShieldCheck className="w-4 h-4" />
                                                        Submit for Verification
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}
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
