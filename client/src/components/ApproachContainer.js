import React, { useState } from "react";
import { fetchStatus } from "heygen-client";

const ApproachContainer = ({ containerState, setContainerState }) => {
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
    <div className="approach-backdrop">
      <div className="approach-container">
        <div className="approach-title">
          Approach #{containerState.approachNum}
        </div>
        <div className="status-container">
          <div className="status-title">Translation Status</div>
          <div className="status">{containerState.status}</div>
        </div>
        <div className="dropdown-container">
          <div className="dropdown-title">Retest Algorithm</div>
          <select
            value={containerState.fetchAlgorithm}
            onChange={(e) =>
              setContainerState((states) => ({
                ...states,
                fetchAlgorithm: e.target.value,
              }))
            }
          >
            <option value="manual">Update Manually</option>
            <option value="constant">Constant (1s Retest)</option>
            <option value="fibonacci">Fibonacci Retest</option>
            <option value="exponential_inc">Exponential Inc. (2^x)</option>
            <option value="exponential_dec">Exponential Dec. (2^-x + 1)</option>
          </select>
        </div>
        <button
          className={`button ${
            isFetching
              ? "fetching"
              : containerState.fetchAlgorithm !== "manual"
              ? "awaiting"
              : containerState.status !== "pending"
              ? "completed"
              : ""
          }`}
          onClick={() => updateStatus()}
          disabled={
            isFetching ||
            containerState.fetchAlgorithm !== "manual" ||
            containerState.status !== "pending"
          }
        >
          {isFetching ? "Fetching..." : "Update Status"}
        </button>
      </div>
    </div>
  );
};

export default ApproachContainer;
