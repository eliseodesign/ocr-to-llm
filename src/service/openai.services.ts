import { HttpProvider, IHttpProvider } from '../shared/utils/HttpProvider';  // Asegúrate de usar la ruta correcta a tu archivo HttpReq.ts
import { AxiosResponse } from 'axios';
import { envConfig } from '../shared/config/env';
import fs from 'fs';
import path from 'path';

export interface IOpenAIProvider {
    createCompletion(message: string, jsonMode: boolean): Promise<string>;
}

export class OpenAIProvider implements IOpenAIProvider {
    private httpClient: IHttpProvider;
    private apiUrl: string;

    constructor() {
        this.apiUrl = 'https://api.openai.com/v1';
        this.httpClient = new HttpProvider(this.apiUrl);
    }

    public async createCompletion(message: string, jsonMode: boolean = false): Promise<string> {
        const promptPath = path.join('src/shared/utils/prompt.txt');
        const prompt = fs.readFileSync(promptPath, 'utf8');
        message = prompt.replace(/{{ocr}}/g, message);

        console.log("message", message);
        
        // Minificar el mensaje, eliminar espacios en blanco, saltos de línea, etc.
        message = message.trim().replace(/\s+/g, ' ');

        const messages = [
            { role: 'system', content: jsonMode ? "You are a helpful assistant designed to output JSON." : "You are a helpful assistant." },
            { role: 'user', content: message }
        ];

        const requestData = {
            model: 'gpt-3.5-turbo-0125', 
            messages: messages,
            max_tokens: 4096,  // Ajusta esto según tus necesidades
            temperature: 0,
            n: 1,
            stop: null,
            response_format: jsonMode ? { type: "json_object" } : undefined,
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${envConfig.OPENAI_API_KEY}`,
        };

        try {
            const response: AxiosResponse<any> = await this.httpClient.post<any>(
                '/chat/completions',
                requestData,
                { headers }
            );

            console.log("response", response.data.choices[0].message.content);
            return response.data.choices[0].message.content as string;
            
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
