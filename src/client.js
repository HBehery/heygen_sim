/**
 * Fetches the current status from the server.
 * @returns {Promise<string>} - The current status.
 */
export const fetchStatus = async () => {
  try {
    const response = await fetch("/status");
    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching status:", error);
    return "error";
  }
};

/**
 * Fetch the status with exponential backoff and timeout.
 * @param {string} algorithm - The algorithm to use.
 */
export const fetchStatusWithBackoff = async (algorithm) => {
  let delay = 1;
  const startTime = Date.now();

  while (true) {
    try {
      const response = await fetch("/status");
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
      const data = await response.json();

      // updateRequests((prev) => prev + 1);

      if (data.result !== "pending") {
        return data.result;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, maxDelay);
    } catch (error) {
      return error;
    }
  }
};

/**
 * Reset the server status to pending.
 * @returns {Promise<string>} The new status.
 */
export const resetStatus = async () => {
  try {
    const response = await fetch("/reset", { method: "POST" });
    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error resetting status:", error);
    return "error";
  }
};
