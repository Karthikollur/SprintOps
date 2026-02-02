type Status = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
type Severity = "LOW" | "MEDIUM" | "CRITICAL";
type BugStatus = "OPEN" | "FIXED";
type Priority = "LOW" | "MEDIUM" | "HIGH";

interface StatusBadgeProps {
  status: Status | Severity | BugStatus | Priority;
  type?: "status" | "severity" | "bugStatus" | "priority";
}

const statusColors: Record<string, string> = {
  // Task status
  TODO: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  BLOCKED: "bg-red-100 text-red-700",
  DONE: "bg-green-100 text-green-700",
  // Severity / Priority
  LOW: "bg-gray-100 text-gray-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
  // Bug status
  OPEN: "bg-red-100 text-red-700",
  FIXED: "bg-green-100 text-green-700",
};

const statusLabels: Record<string, string> = {
  TODO: "To-do",
  IN_PROGRESS: "In Progress",
  BLOCKED: "Blocked",
  DONE: "Done",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
  OPEN: "Open",
  FIXED: "Fixed",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}
