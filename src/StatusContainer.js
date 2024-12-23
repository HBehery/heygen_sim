import React, { useState } from "react";
import { fetchStatus } from "./client";

const StatusContainer = ({ containerState, setContainerState }) => {
  const [isFetching, setIsFetching] = useState(false);

  const updateStatus = async () => {
    setIsFetching(true);

    const result = await fetchStatus(containerState.fetchAlgorithm);

    const endTime = new Date().toISOString();
    const timeWasted = result.completion_time
      ? new Date(endTime) - new Date(result.completion_time)
      : "N/A";

    console.log(result.requests);

    setContainerState((s) => ({
      ...s,
      status: result.status,
      requests: s.requests + result.requests,
      timeWasted: timeWasted,
    }));

    setIsFetching(false);
  };

  return (
    <div className="status-container">
      <div className="title">Job Status: {containerState.status}</div>
      <select
        value={containerState.fetchAlgorithm}
        onChange={(e) =>
          setContainerState((states) => ({
            ...states,
            fetchAlgorithm: e.target.value,
          }))
        }
      >
        <option value="manual">Fetch Status Manually</option>
        <option value="exponential">Exponential Backoff</option>
        <option value="linear">Linear Backoff</option>
        <option value="fibonacci">Fibonacci Backoff</option>
      </select>
      <button
        className={`button ${
          isFetching
            ? "fetching"
            : containerState.fetchAlgorithm !== "manual"
            ? "awaiting"
            : ""
        }`}
        onClick={() => updateStatus()}
        disabled={isFetching || containerState.fetchAlgorithm !== "manual"}
      >
        {isFetching ? "Fetching..." : "Update Status"}
      </button>
    </div>
  );
};

export default StatusContainer;
