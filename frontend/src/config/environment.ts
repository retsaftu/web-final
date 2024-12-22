interface Config {
  apiUrl: string;
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL!,
};

// Валидация конфига
const validateConfig = (conf: Config): void => {
  const requiredFields: (keyof Config)[] = ["apiUrl"];

  requiredFields.forEach((field) => {
    if (!conf[field]) {
      throw new Error(`Missing required config field: ${field}`);
    }
  });
};

validateConfig(config);

export default config;
