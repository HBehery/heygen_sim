import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchStatus, resetStatus } from "./client";
import StatusContainer from "./StatusContainer";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [leftContainerState, setLeftContainerState] = useState({
    status: "pending",
    requests: 0,
    timeWasted: "N/A",
    fetchAlgorithm: "manual",
  });

  const [rightContainerState, setRightContainerState] = useState({
    status: "pending",
    requests: 0,
    timeWasted: "N/A",
    fetchAlgorithm: "manual",
  });

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  const checkContainerState = async (containerState, setContainerState) => {
    if (containerState.fetchAlgorithm !== "manual") {
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
    }));

    setRightContainerState((s) => ({
      ...s,
      status: result,
      requests: 0,
      timeWasted: "N/A",
    }));

    Promise.all([
      checkContainerState(leftContainerState, setLeftContainerState),
      checkContainerState(rightContainerState, setRightContainerState),
    ]);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="App">
      <div className="dark-mode-toggle">
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider round"></span>
        </label>
      </div>
      <StatusContainer
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
              <td>Left Approach</td>
              <td>{leftContainerState.requests}</td>
              <td>{leftContainerState.timeWasted} ms</td>
            </tr>
            <tr>
              <td>Right Approach</td>
              <td>{rightContainerState.requests}</td>
              <td>{rightContainerState.timeWasted} ms</td>
            </tr>
          </tbody>
        </table>
        <div className="button-row">
          <button className="button translate" onClick={handleTranslate}>
            Translate Video
          </button>
        </div>
      </div>
      <StatusContainer
        containerState={rightContainerState}
        setContainerState={setRightContainerState}
      />
    </div>
  );
}

export default App;
