"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface Stats {
  activeTasks: number;
  blockedTasks: number;
  openBugs: number;
  sprintCompletion: number;
  recentBlockers: Array<{
    id: string;
    title: string;
    blockReason: string | null;
    blockedAt: string | null;
    assignedTo: { name: string } | null;
  }>;
  tasksDueThisWeek: Array<{
    id: string;
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate: string;
  }>;
}

function getDaysBlocked(blockedAt: string | null): string {
  if (!blockedAt) return "Unknown";
  const days = Math.floor(
    (Date.now() - new Date(blockedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) return "Blocked today";
  if (days === 1) return "Blocked for 1 day";
  return `Blocked for ${days} days`;
}

function formatDueDate(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.toDateString() === now.toDateString()) return "Due Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Due Tomorrow";

  return `Due ${d.toLocaleDateString("en-US", {
    weekday: "long",
  })}`;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sprint Overview</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Active Tasks"
          value={stats.activeTasks}
          subtitle="To-do + In Progress"
        />
        <MetricCard
          title="Blocked Tasks"
          value={stats.blockedTasks}
          warning={stats.blockedTasks > 0}
          subtitle={stats.blockedTasks > 0 ? "Needs attention" : "All clear"}
        />
        <MetricCard title="Bugs Open" value={stats.openBugs} />
        <MetricCard
          title="Sprint Completion"
          value={`${stats.sprintCompletion}%`}
          progress={stats.sprintCompletion}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blockers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Blockers
            </h2>
            <Link
              href="/blockers"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          {stats.recentBlockers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No blockers right now. Execution is healthy.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentBlockers.map((blocker) => (
                <div
                  key={blocker.id}
                  className="p-3 bg-amber-50 border border-amber-200 rounded-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {blocker.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {getDaysBlocked(blocker.blockedAt)}
                        {blocker.assignedTo &&
                          ` — @${blocker.assignedTo.name}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks Due This Week */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Tasks Due This Week
            </h2>
            <Link
              href="/tasks"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          {stats.tasksDueThisWeek.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tasks due this week
            </div>
          ) : (
            <div className="space-y-3">
              {stats.tasksDueThisWeek.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-900">{task.title}</span>
                    <StatusBadge status={task.priority} type="priority" />
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDueDate(task.dueDate)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
