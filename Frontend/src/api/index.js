import { apiClient } from "./axios";
import { routes } from "./routes";

const authenticate = () => {
  return apiClient({
    url: routes.AUTHENTICATE.url,
    method: routes.AUTHENTICATE.method,
  });
};

export { authenticate };
