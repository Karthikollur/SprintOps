"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface User {
  id: string;
  name: string;
}

interface BlockedTask {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  blockReason: string | null;
  blockedAt: string | null;
  assignedTo: User | null;
}

function getDaysBlocked(blockedAt: string | null): { text: string; days: number } {
  if (!blockedAt) return { text: "Unknown", days: 0 };
  const days = Math.floor(
    (Date.now() - new Date(blockedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) return { text: "Blocked today", days: 0 };
  if (days === 1) return { text: "Blocked for 1 day", days: 1 };
  return { text: `Blocked for ${days} days`, days };
}

export default function BlockersPage() {
  const [blockedTasks, setBlockedTasks] = useState<BlockedTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlockedTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      const tasks = await res.json();
      const blocked = tasks.filter(
        (t: BlockedTask & { status: string }) => t.status === "BLOCKED"
      );
      // Sort by days blocked (longest first)
      blocked.sort((a: BlockedTask, b: BlockedTask) => {
        const daysA = getDaysBlocked(a.blockedAt).days;
        const daysB = getDaysBlocked(b.blockedAt).days;
        return daysB - daysA;
      });
      setBlockedTasks(blocked);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlockedTasks();
  }, [fetchBlockedTasks]);

  const handleUnblock = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "IN_PROGRESS" }),
      });

      if (!res.ok) throw new Error("Failed to unblock task");
      await fetchBlockedTasks();
    } catch (error) {
      console.error("Unblock error:", error);
    }
  };

  const handleMarkDone = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DONE" }),
      });

      if (!res.ok) throw new Error("Failed to complete task");
      await fetchBlockedTasks();
    } catch (error) {
      console.error("Complete error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Blockers</h1>

      {blockedTasks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No blockers right now
            </h2>
            <p className="text-gray-500">Execution is healthy.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {blockedTasks.map((task) => {
            const { text: blockedText, days } = getDaysBlocked(task.blockedAt);
            const isUrgent = days >= 3;

            return (
              <div
                key={task.id}
                className={`bg-white rounded-lg border p-6 ${
                  isUrgent
                    ? "border-red-300 bg-red-50"
                    : "border-amber-300 bg-amber-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`text-lg ${isUrgent ? "text-red-500" : "text-amber-500"}`}
                      >
                        ⚠️
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {task.title}
                      </h3>
                      <StatusBadge status={task.priority} type="priority" />
                    </div>

                    <div className="ml-8">
                      <p className="text-sm text-gray-600 mb-2">
                        {task.assignedTo && (
                          <span>Assigned: @{task.assignedTo.name}</span>
                        )}
                        {task.assignedTo && task.dueDate && <span> • </span>}
                        {task.dueDate && (
                          <span>
                            Due:{" "}
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </p>

                      <p
                        className={`text-sm font-medium mb-3 ${
                          isUrgent ? "text-red-600" : "text-amber-600"
                        }`}
                      >
                        {blockedText}
                      </p>

                      {task.blockReason && (
                        <div className="bg-white bg-opacity-50 rounded-md p-3 mb-4">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Reason: </span>
                            {task.blockReason}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Link
                          href="/tasks"
                          className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          View Task
                        </Link>
                        <button
                          onClick={() => handleMarkDone(task.id)}
                          className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          ✔ Mark as Done
                        </button>
                        <button
                          onClick={() => handleUnblock(task.id)}
                          className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Unblock
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {blockedTasks.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Blocker Summary
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • {blockedTasks.length} task{blockedTasks.length !== 1 && "s"}{" "}
              currently blocked
            </li>
            <li>
              •{" "}
              {blockedTasks.filter((t) => getDaysBlocked(t.blockedAt).days >= 3).length}{" "}
              blocked for 3+ days (needs escalation)
            </li>
            <li>
              •{" "}
              {blockedTasks.filter((t) => t.priority === "HIGH").length} high
              priority
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
