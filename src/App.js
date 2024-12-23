import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchStatus, resetStatus } from "./client";
import ApproachContainer from "./components/ApproachContainer";

function App() {
  const [leftContainerState, setLeftContainerState] = useState({
    status: "pending",
    requests: 0,
    timeWasted: "N/A",
    fetchAlgorithm: "manual",
    isFetching: false,
    approachNum: 1,
  });

  const [rightContainerState, setRightContainerState] = useState({
    status: "pending",
    requests: 0,
    timeWasted: "N/A",
    fetchAlgorithm: "manual",
    isFetching: false,
    approachNum: 2,
  });

  useEffect(() => {
    const spinUpServer = async () => {
      await resetStatus();
    };
    spinUpServer();
  }, []);

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
    </div>
  );
}

export default App;
