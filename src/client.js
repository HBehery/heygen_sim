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
