import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchStatus, fetchStatusWithBackoff, resetStatus } from "./client";

function App() {
  const [leftStatus, setLeftStatus] = useState("pending");
  const [rightStatus, setRightStatus] = useState("pending");
  const [delay, setDelayValue] = useState(10);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isFetchingLeft, setIsFetchingLeft] = useState(false);
  const [isFetchingRight, setIsFetchingRight] = useState(false);
  const [leftFetchAlgorithm, setLeftFetchAlgorithm] = useState("fetchStatus");
  const [rightFetchAlgorithm, setRightFetchAlgorithm] = useState("fetchStatus");
  const [leftRequests, setLeftRequests] = useState(0);
  const [rightRequests, setRightRequests] = useState(0);
  const [leftTimeWasted, setLeftTimeWasted] = useState(0);
  const [rightTimeWasted, setRightTimeWasted] = useState(0);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  const handleClick = async (
    algorithm,
    setStatus,
    setIsFetching,
    setRequests,
    setTimeWasted
  ) => {
    setIsFetching(true);
    setRequests(0);
    const startTime = Date.now();
    let result;
    if (algorithm === "fetchStatus") {
      result = await fetchStatus();
      setRequests((prev) => prev + 1);
    } else if (algorithm === "fetchStatusWithBackoff") {
      result = await fetchStatusWithBackoff(delay, setRequests);
    }
    const endTime = Date.now();
    setTimeWasted(endTime - startTime);
    setStatus(result);
    setStatus("complete");
    setIsFetching(false);
  };

  const handleReset = async () => {
    setError(null);
    const result = await resetStatus();
    setLeftStatus(result);
    setRightStatus(result);
    setLeftRequests(0);
    setRightRequests(0);
    setLeftTimeWasted(0);
    setRightTimeWasted(0);
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
      <div className="left-container">
        <div className="title">Job Status: {leftStatus}</div>
        {error && <div className="error">Error: {error}</div>}
        <select
          value={leftFetchAlgorithm}
          onChange={(e) => setLeftFetchAlgorithm(e.target.value)}
        >
          <option value="fetchStatus">Fetch Status</option>
          <option value="fetchStatusWithBackoff">
            Fetch Status with Backoff
          </option>
        </select>
        <button
          className={`button ${isFetchingLeft ? "fetching" : ""}`}
          onClick={() =>
            handleClick(
              leftFetchAlgorithm,
              setLeftStatus,
              setIsFetchingLeft,
              setLeftRequests,
              setLeftTimeWasted
            )
          }
          disabled={isFetchingLeft}
        >
          {isFetchingLeft ? "Fetching..." : "Check Status"}
        </button>
      </div>
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
              <td>{leftRequests}</td>
              <td>{leftTimeWasted} ms</td>
            </tr>
            <tr>
              <td>Right Approach</td>
              <td>{rightRequests}</td>
              <td>{rightTimeWasted} ms</td>
            </tr>
          </tbody>
        </table>
        <div className="button-row">
          <button className="button" onClick={handleReset}>
            Reset Status
          </button>
        </div>
      </div>
      <div className="right-container">
        <div className="title">Job Status: {rightStatus}</div>
        {error && <div className="error">Error: {error}</div>}
        <select
          value={rightFetchAlgorithm}
          onChange={(e) => setRightFetchAlgorithm(e.target.value)}
        >
          <option value="fetchStatus">Fetch Status</option>
          <option value="fetchStatusWithBackoff">
            Fetch Status with Backoff
          </option>
        </select>
        <button
          className={`button ${isFetchingRight ? "fetching" : ""}`}
          onClick={() =>
            handleClick(
              rightFetchAlgorithm,
              setRightStatus,
              setIsFetchingRight,
              setRightRequests,
              setRightTimeWasted
            )
          }
          disabled={isFetchingRight}
        >
          {isFetchingRight ? "Fetching..." : "Check Status"}
        </button>
      </div>
    </div>
  );
}

export default App;
