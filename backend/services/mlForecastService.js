const { spawn } = require("child_process");
const path = require("path");

/**
 * Calls the Python Prophet script with historical data to get future predictions.
 * @param {Array<{date: string, value: number}>} historyData 
 * @param {number} periods Number of future days to predict
 * @returns {Promise<Array<{date: string, prediction: number, lower_bound: number, upper_bound: number}>>}
 */
const getProphetForecast = (historyData, periods = 7) => {
  return new Promise((resolve, reject) => {
    // Make sure to resolve the absolute path to predict.py
    const scriptPath = path.join(__dirname, "../ml/predict.py");
    
    // Spawn python process
    // Use 'python' or 'python3' depending on the environment. On Windows 'python' is standard.
    const pythonProcess = spawn("python", [scriptPath]);

    let dataString = "";
    let errorString = "";

    pythonProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorString += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("Python Script Error:", errorString);
        return reject(new Error(`Python script exited with code ${code}`));
      }

      try {
        const result = JSON.parse(dataString);
        if (result.success) {
          resolve(result.forecast);
        } else {
          reject(new Error(result.error || "Unknown error from ML script"));
        }
      } catch (error) {
        console.error("Failed to parse Python output:", dataString);
        reject(new Error("Invalid output format from ML script"));
      }
    });

    // Send data to python script via stdin
    const inputPayload = JSON.stringify({
      history: historyData,
      periods: periods
    });
    
    pythonProcess.stdin.write(inputPayload);
    pythonProcess.stdin.end();
  });
};

module.exports = {
  getProphetForecast
};
