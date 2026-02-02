"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  days: string[];
  tasksCompletedPerDay: number[];
  bugsOpenedPerDay: number[];
  bugsFixedPerDay: number[];
  sprintProgress: number[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week");

  useEffect(() => {
    fetch(`/api/stats/analytics?period=${period}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        Failed to load analytics data
      </div>
    );
  }

  // Transform data for charts
  const tasksData = data.days.map((day, i) => ({
    day,
    completed: data.tasksCompletedPerDay[i],
  }));

  const bugsData = data.days.map((day, i) => ({
    day,
    opened: data.bugsOpenedPerDay[i],
    fixed: data.bugsFixedPerDay[i],
  }));

  const progressData = data.days.map((day, i) => ({
    day,
    progress: data.sprintProgress[i],
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="space-y-8">
        {/* Tasks Completed Per Day */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tasks Completed Per Day
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Shows execution velocity. Flat or declining trends indicate blockers or capacity issues.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bugs Opened vs Fixed */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Bugs: Opened vs Fixed
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Track quality debt. If opened consistently exceeds fixed, quality is eroding.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bugsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="opened" fill="#f59e0b" name="Opened" />
                <Bar dataKey="fixed" fill="#10b981" name="Fixed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sprint Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sprint Progress
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Shows completion trajectory. Should be roughly linear. Flat sections indicate blockers.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                  name="Progress"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          How to read these charts
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            <strong>Tasks Completed:</strong> Steady daily completion = healthy velocity. Spikes at week-end = scrambling.
          </li>
          <li>
            <strong>Bugs Opened vs Fixed:</strong> Green bars should match or exceed orange over time.
          </li>
          <li>
            <strong>Sprint Progress:</strong> Flat sections reveal when the team was stuck.
          </li>
        </ul>
      </div>
    </div>
  );
}
