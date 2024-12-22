from flask import Flask, jsonify, request
import time
import threading
import random

app = Flask(__name__)

global status, delay

status = "pending"
delay = random.randint(1, 20) 

def simulate_job():
    """
    Simulates a job by sleeping for the configured delay and then setting the status to 'completed'.
    """
    global status

    time.sleep(int(delay))
    status = "completed" if random.randint(0, 1) == 1 else "error"

@app.route('/status', methods=['GET'])
def get_status():
    """
    Endpoint to get the current status of the job.
    Returns:
        JSON: The current status.
    """
    return jsonify({"result": globals()["status"]})

@app.route('/reset', methods=['POST'])
def reset_status():
    """
    Endpoint to reset the job status to 'pending' and start the job simulation.
    Returns:
        JSON: The new status.
    """
    global status, delay
    
    status = "pending"
    delay = random.randint(1, 20) 
    threading.Thread(target=simulate_job).start()
    return jsonify({"result": status})

if __name__ == '__main__':
    threading.Thread(target=simulate_job).start()
    app.run(debug=True, port=5000)
