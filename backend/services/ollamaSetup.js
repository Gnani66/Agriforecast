const axios = require("axios");

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

async function checkOllama() {
  try {
    const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`);
    return { running: true, models: response.data.models || [], error: null };
  } catch (error) {
    return { running: false, models: [], error: error.message };
  }
}

module.exports = { checkOllama };
