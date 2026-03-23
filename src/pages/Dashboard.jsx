import  { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getUserSubscriptions } from "../services/api";

const statusColor = {
    active: 'bg-green-500/10 text-green-400 border border-green-500/30',
    cancelled: 'bg-red-500/10 text-red-400 border border-red-500/30',
    expired: 'bg-gray-500/10 text-gray-400 border border-gray-500/30',
};

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await getUserSubscriptions(user._id);
        setSubscriptions(res.data.data);
      } catch (err) {
        setError("Failed to load subscriptions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, [user._id]);

  const totalMonthly = subscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, s) => {
      if (s.frequency === "monthly") return sum + s.price;
      if (s.frequency === "yearly") return sum + s.price / 12;
      if (s.frequency === "weekly") return sum + s.price * 4;
      if (s.frequency === "daily") return sum + s.price * 30;
      return sum;
    }, 0);

  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">SubTracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Total Subscriptions</p>
            <p className="text-3xl font-bold">{subscriptions.length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Active</p>
            <p className="text-3xl font-bold text-green-400">
              {subscriptions.filter((s) => s.status === "active").length}
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Monthly Spend</p>
            <p className="text-3xl font-bold text-blue-400">
              ₹{totalMonthly.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Subscriptions</h2>
          <button
            onClick={() => navigate("/subscriptions/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            + Add New
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-20">{error}</div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-lg mb-4">No subscriptions yet</p>
            <button
              onClick={() => navigate("/subscriptions/create")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Add your first subscription
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <Link
                to={`/subscriptions/${sub._id}`}
                key={sub._id}
                className="block bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-xl p-5 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{sub.name}</h3>
                    <p className="text-gray-400 text-sm capitalize">
                      {sub.category} · {sub.frequency}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Renews: {new Date(sub.renewalDate).toDateString()}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-lg font-bold">₹{sub.price}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${statusColor[sub.status]}`}
                    >
                      {sub.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
