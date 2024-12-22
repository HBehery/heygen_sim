import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchStatusWithBackoff, resetStatus, setDelay } from "./client";

function App() {
  const [status, setStatus] = useState("pending");
  const [delay, setDelayValue] = useState(10);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  const handleClick = async () => {
    setError(null);
    setIsFetching(true);
    const result = await fetchStatusWithBackoff(
      1000,
      16000,
      setStatus,
      setError,
      delay
    );
    setStatus(result);
    setIsFetching(false);
  };

  const handleReset = async () => {
    setError(null);
    const result = await resetStatus();
    setStatus(result);
  };

  const handleDelayChange = (event) => {
    setDelayValue(event.target.value);
  };

  const handleDelayConfirm = async () => {
    setError(null);
    const result = await setDelay(delay);
    if (result === "error") {
      setError("Failed to set delay");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="App">
      <div className="title">Job Status: {status}</div>
      {error && <div className="error">Error: {error}</div>}
      <button
        className={`button ${isFetching ? "fetching" : ""}`}
        onClick={handleClick}
        disabled={isFetching}
      >
        {isFetching ? "Fetching..." : "Check Status"}
      </button>
      <button className="button" onClick={handleReset}>
        Reset Status
      </button>
      <div className="slider-container">
        <label className="slider-label">
          Set Delay:
          <input
            className="slider"
            type="range"
            min="1"
            max="60"
            value={delay}
            onChange={handleDelayChange}
          />
          {delay} seconds
        </label>
        <button
          className="button"
          onClick={handleDelayConfirm}
          disabled={isFetching}
        >
          Confirm Delay
        </button>
      </div>
      <button className="button" onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
    </div>
  );
}

export default App;
