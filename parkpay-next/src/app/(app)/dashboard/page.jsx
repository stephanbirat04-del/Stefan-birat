"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LogOut, Settings, History, ParkingCircle } from "lucide-react";

const revenueData = [
  { day: "WED", revenue: 15000 },
  { day: "THU", revenue: 18000 },
  { day: "FRI", revenue: 22000 },
  { day: "SAT", revenue: 28000 },
  { day: "SUN", revenue: 25000 },
  { day: "MON", revenue: 19000 },
  { day: "TUE", revenue: 18450 },
];

const exitsByHour = [
  { hour: "08", exits: 5 },
  { hour: "10", exits: 8 },
  { hour: "12", exits: 12 },
  { hour: "14", exits: 15 },
  { hour: "16", exits: 18 },
  { hour: "18", exits: 14 },
  { hour: "20", exits: 5 },
];

const recentActivity = [
  { id: 1, plate: "ML05AB1234", action: "entered", time: "13:39", type: "Car" },
  { id: 2, plate: "AS01DN4421", action: "exited", time: "13:36", fee: "₹140", type: "Car" },
  { id: 3, plate: "ML04C7788", action: "entered", time: "13:30", type: "Motorcycle" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      router.push("/auth/login");
    } else {
      setUser(userEmail);
      setLoading(false);
    }
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("idToken");
      localStorage.removeItem("userEmail");
      router.push("/auth/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">P</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ParkPay</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Ananya Sharma</p>
              <p className="text-xs text-gray-500">Lot operator · Gate 1</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button onClick={() => setCurrentPage("dashboard")} className={`py-4 px-2 border-b-2 font-medium text-sm transition ${currentPage === "dashboard" ? "border-teal-600 text-teal-600" : "border-transparent text-gray-600"}`}>Dashboard</button>
            <button onClick={() => setCurrentPage("active-lot")} className={`py-4 px-2 border-b-2 font-medium text-sm transition ${currentPage === "active-lot" ? "border-teal-600 text-teal-600" : "border-transparent text-gray-600"}`}>Active Lot</button>
            <button onClick={() => setCurrentPage("history")} className={`py-4 px-2 border-b-2 font-medium text-sm transition ${currentPage === "history" ? "border-teal-600 text-teal-600" : "border-transparent text-gray-600"}`}>History</button>
            <button onClick={() => setCurrentPage("settings")} className={`py-4 px-2 border-b-2 font-medium text-sm transition ${currentPage === "settings" ? "border-teal-600 text-teal-600" : "border-transparent text-gray-600"}`}>Settings</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {currentPage === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">Live view of lot occupancy and revenue.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600 text-sm font-medium">Currently parked</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">LIVE</span>
                </div>
                <p className="text-4xl font-bold text-gray-900">42</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-gray-600 text-sm font-medium mb-4">Today's revenue</p>
                <p className="text-4xl font-bold text-gray-900">₹18,450</p>
                <p className="text-sm text-green-600 font-medium mt-2">+8.4%</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-gray-600 text-sm font-medium mb-4">Today's exits</p>
                <p className="text-4xl font-bold text-gray-900">87</p>
                <p className="text-sm text-gray-500 mt-2">12 this hour</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-gray-600 text-sm font-medium mb-4">Month revenue</p>
                <p className="text-4xl font-bold text-gray-900">₹4,28,900</p>
                <p className="text-sm text-green-600 font-medium mt-2">+11.2%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">7-day revenue trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#0d9488" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Today's exits by hour</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={exitsByHour}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="exits" stroke="#0d9488" strokeWidth={2} dot={{ fill: "#0d9488" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Latest gate activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <p className="text-sm font-medium text-gray-900">{activity.time} {activity.plate} {activity.action} · {activity.type}</p>
                    {activity.fee && <p className="text-sm font-medium text-gray-900">{activity.fee} paid</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p>System live</p>
              </div>
              <p>Live · synced 23 SEP 2026 · 13:42 IST</p>
            </div>
          </div>
        )}

        {currentPage !== "dashboard" && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600">{currentPage} page coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}
