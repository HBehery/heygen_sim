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
 * @param {number} initialDelay - Initial delay in milliseconds.
 * @param {number} maxDelay - Maximum delay in milliseconds.
 * @param {function} updateStatus - Callback to update the status in the frontend.
 * @param {function} onError - Callback to handle errors.
 * @param {number} totalDelay - Total delay in seconds.
 * @returns {Promise<string>} The final status.
 */
export const fetchStatusWithBackoff = async (
  initialDelay = 1000,
  maxDelay = 16000,
  updateStatus,
  onError,
  totalDelay = 10
) => {
  let delay = initialDelay;
  const timeout = totalDelay * 2 * 1000;
  const startTime = Date.now();

  while (true) {
    try {
      const response = await fetch("/status");
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
      const data = await response.json();

      updateStatus(data.result);

      if (data.result !== "pending") {
        return data.result;
      }

      if (Date.now() - startTime > timeout) {
        throw new Error("Request timed out");
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, maxDelay);
    } catch (error) {
      console.error("Error fetching status:", error);
      updateStatus("error");
      if (onError) onError(error);
      return "error";
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

/**
 * Set the delay on the server.
 * @param {number} delay - The delay in seconds.
 * @returns {Promise<string>} The result message.
 */
export const setDelay = async (delay) => {
  try {
    const response = await fetch("/set_delay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ delay }),
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error setting delay:", error);
    return "error";
  }
};
