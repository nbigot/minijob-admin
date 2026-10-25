import { apiClient } from "../../src/services/index.js";
import { SERVER_URL, server } from "./helpers.js";

// The services read VITE_API_BASE_URL, which the "test" mode does not load.
apiClient.defaults.baseURL = SERVER_URL;

try {
  await server.get("/ping");
} catch (error) {
  throw new Error(`minijob server unreachable at ${SERVER_URL} (set MINIJOB_URL): ${error.message}`);
}
