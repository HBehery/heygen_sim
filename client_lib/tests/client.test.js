const { fetchStatus, resetStatus } = require("../client.js");
const { exec } = require("child_process");
const path = require("path");
const fetch = require("node-fetch");

let serverProcess;

jest.setTimeout(15000);

beforeAll((done) => {
  // Spin up the server by executing server.py script
  const serverScriptPath = path.join(__dirname, "./test_server.py");
  serverProcess = exec(`python "${serverScriptPath}"`);

  // Wait a few seconds to ensure the server is up and running
  setTimeout(done, 10000);
});

afterAll((done) => {
  // Kill the server process after tests
  if (serverProcess) {
    serverProcess.stderr.destroy();
    serverProcess.stdout.destroy();
    serverProcess.kill();
  }
  done();
});

// Mock fetch function to prepend the base URL to relative URLs
global.fetch = (url, options) => {
  const baseUrl = "http://localhost:5000";
  const absoluteUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  return fetch(absoluteUrl, options);
};

test("fetchStatus with 'manual' algorithm should return expected result", async () => {
  const result = await fetchStatus("manual");
  expect(result.status).toBeDefined();
  expect(result.completion_time).toBeDefined();
  expect(result.requests).toBeGreaterThan(0);
});

test("fetchStatus with 'constant' algorithm should return expected result", async () => {
  const result = await fetchStatus("constant");
  expect(result.status).toBeDefined();
  expect(result.completion_time).toBeDefined();
  expect(result.requests).toBeGreaterThan(0);
});

test("fetchStatus with 'exponential_inc' algorithm should return expected result", async () => {
  const result = await fetchStatus("exponential_inc");
  expect(result.status).toBeDefined();
  expect(result.completion_time).toBeDefined();
  expect(result.requests).toBeGreaterThan(0);
});

test("fetchStatus with 'exponential_dec' algorithm should return expected result", async () => {
  const result = await fetchStatus("exponential_dec");
  expect(result.status).toBeDefined();
  expect(result.completion_time).toBeDefined();
  expect(result.requests).toBeGreaterThan(0);
});

test("fetchStatus with 'fibonacci' algorithm should return expected result", async () => {
  const result = await fetchStatus("fibonacci");
  expect(result.status).toBeDefined();
  expect(result.completion_time).toBeDefined();
  expect(result.requests).toBeGreaterThan(0);
});

test("fetchStatus with invalid algorithm should throw an error", async () => {
  await expect(fetchStatus("invalid")).rejects.toThrow("Invalid algorithm");
});

test("resetStatus should reset the status to pending", async () => {
  const result = await resetStatus();
  expect(result).toBe("pending");
});
