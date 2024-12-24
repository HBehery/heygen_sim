import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchStatus, resetStatus } from "heygen-client";
import ApproachContainer from "./components/ApproachContainer";
import logo from "./images/heygen_logo.svg";

function App() {
  // Single state variable with left container data
  const [leftContainerState, setLeftContainerState] = useState({
    status: "pending",
    requests: 0,
    timeWasted: "N/A",
    fetchAlgorithm: "manual",
    isFetching: false,
    approachNum: 1,
  });

  // Single state variable with right container data
  const [rightContainerState, setRightContainerState] = useState({
    status: "pending",
    requests: 0,
    timeWasted: "N/A",
    fetchAlgorithm: "manual",
    isFetching: false,
    approachNum: 2,
  });

  // Reset server status on initial load/reload
  useEffect(() => {
    const spinUpServer = async () => {
      await resetStatus();
    };
    spinUpServer();
  }, []);

  // Helper function to call fetchStatus on containers with algorithmic approaches
  const checkContainerState = async (containerState, setContainerState) => {
    if (containerState.fetchAlgorithm !== "manual") {
      setContainerState((s) => ({ ...s, isFetching: true }));
      const result = await fetchStatus(containerState.fetchAlgorithm);

      const endTime = new Date().toISOString();
      const timeWasted = result.completion_time
        ? new Date(endTime) - new Date(result.completion_time)
        : "N/A";

      setContainerState((s) => ({
        ...s,
        status: result.status,
        requests: result.requests,
        timeWasted: timeWasted,
        isFetching: false,
      }));
    }
  };

  // Handle translate video button click.
  // Resets server/client status and runs fetchStatus for algorithmic containers to update tables
  const handleTranslate = async () => {
    const result = await resetStatus();

    setLeftContainerState((s) => ({
      ...s,
      status: result,
      requests: 0,
      timeWasted: "N/A",
      isFetching: false,
    }));

    setRightContainerState((s) => ({
      ...s,
      status: result,
      requests: 0,
      timeWasted: "N/A",
      isFetching: false,
    }));

    Promise.all([
      checkContainerState(leftContainerState, setLeftContainerState),
      checkContainerState(rightContainerState, setRightContainerState),
    ]);
  };

  const renderTimeWasted = (timeWasted) => {
    return timeWasted === "N/A" ? timeWasted : `${timeWasted} ms`;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Translation Simulation*</h1>
      </header>

      <div className="client-section">
        <ApproachContainer
          containerState={leftContainerState}
          setContainerState={setLeftContainerState}
        />

        <div className="middle-container">
          <table>
            <tbody>
              <tr>
                <td></td>
                <td># of Requests</td>
                <td>Time Wasted</td>
              </tr>
              <tr>
                <td>Approach #1</td>
                <td>
                  {leftContainerState.isFetching
                    ? "..."
                    : leftContainerState.requests}
                </td>
                <td>{renderTimeWasted(leftContainerState.timeWasted)}</td>
              </tr>
              <tr>
                <td>Approach #2</td>
                <td>
                  {rightContainerState.isFetching
                    ? "..."
                    : rightContainerState.requests}
                </td>
                <td>{renderTimeWasted(rightContainerState.timeWasted)}</td>
              </tr>
            </tbody>
          </table>

          <div className="button-row">
            <button className="button translate" onClick={handleTranslate}>
              Translate Video
            </button>
          </div>
        </div>

        <ApproachContainer
          containerState={rightContainerState}
          setContainerState={setRightContainerState}
        />
      </div>
      <div className="disclaimer">
        *This is a simulation of a video translation service that is part of a
        take-home assignment, and is not a product/direct work of HeyGen. The
        translation status and time wasted are simulated and do not reflect
        actual data.
      </div>
    </div>
  );
}

export default App;
