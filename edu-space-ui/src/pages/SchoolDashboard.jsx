import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function SchoolDashboard() {
  const mySpaces = [
    {
      id: 1,
      name: "Science Lab",
      type: "Laboratory",
      capacity: 40,
      price: 1500,
      status: "Active",
      bookings: 12,
      revenue: 18000,
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=400"
    },
    {
      id: 2,
      name: "Main Auditorium",
      type: "Auditorium",
      capacity: 200,
      price: 3500,
      status: "Active",
      bookings: 8,
      revenue: 28000,
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400"
    }
  ];

  const pendingRequests = [
    {
      id: 1,
      teacher: "Rajesh Kumar",
      space: "Science Lab",
      date: "Jan 25, 2026",
      time: "Full Day",
      price: 1500,
      requestedOn: "Jan 10, 2026"
    },
    {
      id: 2,
      teacher: "Priya Sharma",
      space: "Main Auditorium",
      date: "Feb 5, 2026",
      time: "Half Day",
      price: 2000,
      requestedOn: "Jan 12, 2026"
    }
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">School Dashboard</h1>
            <p className="text-lg text-gray-600">Manage your spaces and booking requests</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">6</div>
              <div className="text-sm text-gray-600">Listed Spaces</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">45</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
              <div className="text-sm text-gray-600">Pending Requests</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">₹78,500</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
            <div className="border-b border-gray-200 px-6">
              <div className="flex gap-8">
                <button className="py-4 border-b-2 border-gray-900 font-semibold text-gray-900">
                  My Spaces
                </button>
                <button className="py-4 border-b-2 border-transparent font-medium text-gray-600 hover:text-gray-900">
                  Booking Requests
                </button>
                <button className="py-4 border-b-2 border-transparent font-medium text-gray-600 hover:text-gray-900">
                  Analytics
                </button>
                <button className="py-4 border-b-2 border-transparent font-medium text-gray-600 hover:text-gray-900">
                  Settings
                </button>
              </div>
            </div>

            {/* My Spaces */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Listed Spaces</h2>
                <button className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Space
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mySpaces.map((space) => (
                  <div key={space.id} className="bg-gray-50 rounded-2xl overflow-hidden hover:bg-gray-100 transition">
                    <img 
                      src={space.image} 
                      alt={space.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{space.name}</h3>
                          <p className="text-gray-600">{space.type} • {space.capacity} people</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          {space.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-gray-200">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Price/Day</div>
                          <div className="text-lg font-bold text-gray-900">₹{space.price}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Bookings</div>
                          <div className="text-lg font-bold text-gray-900">{space.bookings}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Revenue</div>
                          <div className="text-lg font-bold text-gray-900">₹{space.revenue}</div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition">
                          Edit
                        </button>
                        <button className="flex-1 px-4 py-2 border-2 border-gray-900 text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition">
                          View
                        </button>
                        <button className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-xl hover:border-red-300 hover:text-red-600 transition">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Requests Section */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Pending Booking Requests</h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                          {request.teacher.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{request.teacher}</h3>
                          <p className="text-gray-600">Requested {request.space}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-gray-700">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">{request.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{request.time}</span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          ₹{request.price}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </button>
                      <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
