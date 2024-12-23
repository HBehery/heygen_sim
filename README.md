# HeyGen Take-Home Assignment

## Description

This project is a simulation for HeyGen, designed to demonstrate the functionality of a video translation server by using a configurable random delay. The client library provides functions to interact with the server, which processes and responds to client requests.

## Client Library Functions (`client.js`)

The client library includes the following functions:

- `fetchStatus(algorithm)`: Fetches the current status from the server using the specified algorithm via a GET \status request, and returns a hashmap of the most recently fetched translation status, number of requests made to the server by the function call, and translation completion time (if applicable). The algorithm can be one of:

  - `Manual`: Fetches the status once and returns immediately.
  - `Constant`: Requests the status from the server at a constant interval of 1 second.
  - `Fibonacci`: Requests the server using the Fibonacci sequence for intervals, up to a maximum of 16 seconds.
  - `Exponential Increase (2^x)`: Makes requests to the server at an exponentially increasing interval, doubling each time up to a maximum of 16 seconds.
  - `Exponential Decrease (2^-x + 1)`: Makes requests to the server at an exponentially decreasing interval, starting at 2 seconds and down to a minimum of 1 second.

- `resetStatus()`: Resets the server (i.e. simulates a new video translation) and returns the pending translation status to the client.

## Client Library Approach

This client library was developed with a customer mindset to provide flexibility and efficiency in simulating video translation scenarios. The `manual` algorithm serves as a trivial approach, allowing customers to fetch the status as they please. However, this can lead to too many or too few requests, making it less efficient. As a result, multiple retesting algorithms were included as part of a more reasonable approach, which the client library uses to periodically make server requests until a non-pending server status is received.

## Developing with a Customer Mindset

Since there is no single algorithm that is best in every scenario, different algorithms are provided to cater to various video translation scenarios (e.g., longer vs. shorter videos). This allows customers to choose the most efficient algorithm for their specific needs.

For instance, the exponentially increasing algorithm may be more suitable for extremely long-form videos, as a customer would likely want to minimize the number of requests made with a trade-off on more time wasted before the client library receives a "complete" status. On the other hand, a customer with an excessive amount of server resources may opt for a retesting algorithm that more frequently makes GET \status requests, allowing them to minimize the time wasted without risking much cost on the server.

Additionally, the client library returns extra variables along with the server status, such as the number of requests made and the completion time. This provides customers with more metrics related to their algorithm's performance on the video. From a customer's perspective, this allows them to compare an algorithm's efficiency in terms of time wasted and requests made until completion, as seen in this project's implementation of the client library.

## Server Functions (`server.py`)

The server includes the following functions:

- `simulate_job()`: Simulates a job by sleeping for a random delay and then setting the status to 'completed' or 'error'.
- `get_status()`: Endpoint to get the current status of the job. Returns the current status and completion time.

  The status of the server (i.e. video translation status) may be one of the following:

  - `pending`: The job is still in progress.
  - `completed`: The job has been successfully completed.
  - `error`: There was an error in completing the job.
    Once the random delay set by the server is over, it randomly sets the translation status as `completed` or `error`.

- `reset_status()`: Endpoint to reset the job status to 'pending' and start the job simulation.

## Usage

1. Start the server by running `server.py`.
2. Use the client library to interact with the server using `client.js`.

## Example

```python
# Example server implementation
if __name__ == '__main__':
    threading.Thread(target=simulate_job).start()
    app.run(debug=True, port=5000)
```

```javascript
// Example usage of the client library
const client = require("./src/client");

client.fetchStatus("constant").then((status) => {
  console.log(status);
});

client.resetStatus().then((status) => {
  console.log(status);
});
```
