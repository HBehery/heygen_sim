from flask import Flask, jsonify, request
import time
import threading
import random
from datetime import datetime, timezone

app = Flask(__name__)

global status, delay, completion_time

status = "pending"
delay = random.randint(1, 20)
completion_time = None

def simulate_job():
    """
    Simulates a job by sleeping for the configured delay and then setting the status to 'completed'.
    """
    global status, completion_time

    time.sleep(int(delay))
    status = "completed" if random.randint(0, 1) == 1 else "error"
    completion_time = datetime.now(timezone.utc).isoformat()

@app.route('/status', methods=['GET'])
def get_status():
    """
    Endpoint to get the current status of the job.
    Returns:
        JSON: The current status and completion time.
    """
    return jsonify({"result": globals()["status"], "completion_time": completion_time})

@app.route('/reset', methods=['POST'])
def reset_status():
    """
    Endpoint to reset the job status to 'pending' and start the job simulation.
    Returns:
        JSON: The new status.
    """
    global status, delay, completion_time
    
    status = "pending"
    delay = random.randint(1, 20)
    completion_time = None
    threading.Thread(target=simulate_job).start()
    return jsonify({"result": status})

if __name__ == '__main__':
    threading.Thread(target=simulate_job).start()
    app.run(debug=True, port=5000)
