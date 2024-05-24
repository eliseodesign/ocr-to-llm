import { HttpProvider, IHttpProvider } from '../shared/utils/HttpProvider';  // Asegúrate de usar la ruta correcta a tu archivo HttpReq.ts
import { AxiosResponse } from 'axios';
import { envConfig } from '../shared/config/env'
import fs from 'fs';
import path from 'path';


export interface IMistralProvider {
    createCompletion(message: string, jsonMode: boolean): Promise<string>;
}

export class MistralProvider {
    private httpClient: IHttpProvider;
    private apiUrl: string;

    constructor() {
        this.apiUrl = 'https://api.mistral.ai/v1'
        this.httpClient = new HttpProvider(this.apiUrl);
    }

    public async createCompletion(message: string, jsonMode: boolean = false): Promise<string> {
        const propmtPath = path.join('src/shared/utils/prompt.txt')
        const propmt = fs.readFileSync(propmtPath, 'utf8');
        message = propmt.replace(/{{ocr}}/g, message);

        console.log("message", message)
        
        // minificar el mensaje, espacios en blanco, saltos de línea, etc.
        message = message.trim().replace(/\s+/g, ' ');
        // const obj = {
        //     length: message.length,
        //     message
        // }
        // return JSON.stringify(obj)
        const responseFormat = {
            type: jsonMode ? 'json_object' : 'text',
        };
        const requestData = {
            model: 'mistral-small',
            messages: [{ role: 'user', content: message }],
            response_format: responseFormat,
        };

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${envConfig.MISTRAL_API_KEY}`,
        };

        try {
            const response: AxiosResponse<any> = await this.httpClient.post<any>(
                '/chat/completions',
                requestData,
                { headers }
            );
            return response.data.choices[0].message.content as string;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
