// Utility function to get status class for job statuses
export function getStateClass(state) {
  if (!state) return "";

  switch (state.toLowerCase()) {
    case "running":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400";
    case "scheduled":
    case "queued":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400";
    case "completed":
    case "succeeded":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-400";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400";
    case "created":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
  }
}
