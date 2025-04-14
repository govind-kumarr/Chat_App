const getEnvVars = () => {
  return {
    SERVER_URL: import.meta.env.VITE_SERVER_URL || "",
    GOOGLE_CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
    ...import.meta.env,
  };
};

const envVars = getEnvVars();

export { getEnvVars, envVars };
