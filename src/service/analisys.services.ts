// import fs from 'fs';
// import { CompletionService } from './completion.services'

// class AnalisysService {
//     private completionService: CompletionService;
//     constructor(completionService: CompletionService) {
//         this.completionService = completionService;
//     }
//     async createAnalisys(messages: MessageAnalysis[]): Promise<MessageAnalysis> {
//         const prompt = this.createPrompt(messages);
//         const completion = await this.completionService.createCompletion(prompt);
//         return  
//     }

//     private createPrompt(messages: MessageAnalysis[]): string {
//         // leer el archivo de /src/shared/utils/prompt_base.txt (estamos en src/service/analisys.services.ts)
//         const promptBase = fs.readFileSync('./src/shared/utils/prompt_base.txt', 'utf-8');
//         // Reemplazar las variables del archivo de texto con los datos de los mensajes
//         const prompt = promptBase.replace('/{{Messages}}/g', JSON.stringify(messages));
//         return prompt;

//     }

//     validateMessages(messages: any[]): boolean {
//         return messages.every((message): message is MessageAnalysis => {
//             return (
//                 typeof message.message === 'string' &&
//                 typeof message.username === 'string' 
//             );
//         });
//     }
// }


// export { AnalisysService };