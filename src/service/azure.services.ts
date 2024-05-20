import axios from 'axios';

interface AnalyzeResult {
    apiVersion: string;
    modelId: string;
    stringIndexType: string;
    content: string;
}

interface ApiResponse {
    status: string;
    createdDateTime: string;
    lastUpdatedDateTime: string;
    analyzeResult?: AnalyzeResult;
}

export class DocumentAnalysisService {
    private endpoint: string;
    private apiKey: string;

    constructor(endpoint: string, apiKey: string) {
        this.endpoint = endpoint;
        this.apiKey = apiKey;
    }

    async analyzeDocument(fileBuffer: Buffer): Promise<string> {
        try {
            const response = await axios.post(`${this.endpoint}/formrecognizer/documentModels/prebuilt-read:analyze?api-version=2023-07-31`, fileBuffer, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Ocp-Apim-Subscription-Key': this.apiKey
                },
                timeout: 60000  // Establece un tiempo de espera de 60 segundos
            });

            const resultId = response.headers['operation-location'].split('/').pop();
            return resultId;
        } catch (error) {
            console.error('Error al analizar el documento:', error);
            throw new Error('Ocurrió un error al analizar el documento');
        }
    }

    async readResult(resultId: string): Promise<any> {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        try {
            while (true) {
                console.log("Consultando resultado")
                const response = await axios.get<ApiResponse>(`${this.endpoint}/formrecognizer/documentModels/prebuilt-read/analyzeResults/${resultId}`, {
                    headers: {
                        'Ocp-Apim-Subscription-Key': this.apiKey
                    }
                });

                console.log("response", response.data);

                if (response.data.status === "succeeded") {
                    return response.data;
                } else if (response.data.status === "failed") {
                    throw new Error('El análisis del documento falló');
                }

                // Espera 1.5 segundos antes de volver a consultar el estado
                await delay(5000);
            }
        } catch (error) {
            console.error('Error al leer el resultado:', error);
            throw new Error('Ocurrió un error al leer el resultado');
        }
    }
}
