from flask import Flask, jsonify, request
import time
import threading

app = Flask(__name__)

global status
global delay

status = "pending"
delay = 10 

def simulate_job():
    """
    Simulates a job by sleeping for the configured delay and then setting the status to 'completed'.
    """
    global status

    time.sleep(int(delay))
    status = "completed"

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
    global status
    
    status = "pending"
    threading.Thread(target=simulate_job).start()
    return jsonify({"result": status})

@app.route('/set_delay', methods=['POST'])
def set_delay():
    """
    Endpoint to set the delay for the job simulation.
    Returns:
        JSON: A message indicating the new delay.
    """
    global delay
    
    data = request.get_json()
    delay = int(data.get("delay", 10))
    return jsonify({"result": "delay set to " + str(delay)})

if __name__ == '__main__':
    threading.Thread(target=simulate_job).start()
    app.run(debug=True, port=5000)
