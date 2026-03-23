import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSubscription } from "../services/api";

const CreateSubscription = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    currency: "INR",
    frequency: "monthly",
    category: "entertainment",
    payementMethod: "",
    startDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setLoading(true);
    setError("");

    try{
      await createSubscription(form);
      navigate("/dashboard");
    }catch(err){
      setError(err.response?.data?.message || "Failed to create subscription");
    }finally{
      setLoading(false);
    }
  }

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">SubTracker</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">Add Subscription</h2>
        <p className="text-gray-400 mb-6">Track a new subscription</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Subscription Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Netflix, Spotify..."
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
            />
          </div>

          {/* Price + Currency */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-gray-400 text-sm mb-1 block">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="499"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
              />
            </div>
            <div className="w-28">
              <label className="text-gray-400 text-sm mb-1 block">
                Currency
              </label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Frequency
            </label>
            <select
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="movie">Movie</option>
              <option value="sports">Sports</option>
              <option value="entertainment">Entertainment</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="tech">Tech</option>
              <option value="finance">Finance</option>
              <option value="politics">Politics</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Payment Method
            </label>
            <input
              type="text"
              name="payementMethod"
              value={form.payementMethod}
              onChange={handleChange}
              required
              placeholder="UPI, Credit Card..."
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Creating..." : "Add Subscription"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSubscription;
