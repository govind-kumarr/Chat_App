const getEnvVars = () => {
  return {
    SERVER_URL: import.meta.env.VITE_SERVER_URL || "",
    ...import.meta.env,
  };
};

const envVars = getEnvVars();

export { getEnvVars, envVars };
