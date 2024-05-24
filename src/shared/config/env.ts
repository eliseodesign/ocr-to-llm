import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  PORT: number;
  MISTRAL_API_KEY: string;
  AZURE_KEY: string;
  AZURE_END: string;
  OPENAI_API_KEY: string;
}

export const envConfig: EnvConfig = {
  PORT: parseInt(process.env.PORT as string) || 3000,
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY as string,
  AZURE_KEY: process.env.AZURE_KEY as string,
  AZURE_END: process.env.AZURE_END as string,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
};