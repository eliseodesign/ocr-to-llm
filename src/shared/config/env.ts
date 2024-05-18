import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  PORT: number;
  MISTRAL_API_KEY: string;
}

export const envConfig: EnvConfig = {
  PORT: parseInt(process.env.PORT as string) || 3000,
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY as string,
};