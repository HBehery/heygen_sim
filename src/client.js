/**
 * Fetches the current status from the server.
 * @param {string} algorithm - The algorithm to use.
 *
 * @returns {Promise<{status: string, completion_time: string | null, requests: int}>}
 * The current status, server completion time, and number of requests made for that algorithm.
 */
const fetchStatus = async (algorithm) => {
  // Check if algorithm is valid before making a request
  if (
    ![
      "manual",
      "constant",
      "exponential_inc",
      "exponential_dec",
      "fibonacci",
    ].includes(algorithm)
  ) {
    throw new Error("Invalid algorithm");
  }

  let prevWaitPeriod = 1000;
  let currWaitPeriod = algorithm !== "exponential_dec" ? 1000 : 2000;
  const waitLimit = 16001;
  let requests = 0;

  while (true) {
    try {
      const response = await fetch("/status");
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
      const data = await response.json();
      requests++;

      if (algorithm == "manual") {
        return {
          status: data.result,
          completion_time: data.completion_time,
          requests,
        };
      }

      if (data.result !== "pending") {
        return {
          status: data.result,
          completion_time: data.completion_time,
          requests,
        };
      }

      await new Promise((resolve) => setTimeout(resolve, currWaitPeriod));

      let tempWaitPeriod;

      switch (algorithm) {
        case "constant":
          currWaitPeriod = 1000;
          break;
        case "exponential_inc":
          currWaitPeriod = Math.min(currWaitPeriod * 2, waitLimit);
          break;
        case "exponential_dec":
          currWaitPeriod = (2 ** -requests + 1) * 1000;
          break;
        case "fibonacci":
          tempWaitPeriod = currWaitPeriod;
          currWaitPeriod = Math.min(currWaitPeriod + prevWaitPeriod, waitLimit);
          prevWaitPeriod = tempWaitPeriod;
          break;
        default:
          throw new Error("Invalid algorithm");
      }
    } catch (error) {
      return error;
    }
  }
};

/**
 * Reset the server status to pending.
 * @returns {Promise<string>} The new status.
 */
const resetStatus = async () => {
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

module.exports = { fetchStatus, resetStatus };
