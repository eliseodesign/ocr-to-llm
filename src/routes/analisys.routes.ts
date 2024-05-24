import { Router, Request, Response } from 'express';
import { envConfig } from '../shared/config/env'
import { DocumentAnalysisService } from '../service/azure.services'
import { MistralProvider} from '../service/mistral.services'
import multer from 'multer';
import fs from 'fs';
import { config } from 'dotenv'
config()

const upload = multer({ memoryStorage: multer.memoryStorage() });
const router = Router();

router.post('/ocr', upload.single('image'), async (req: Request, res: Response, next) => {
    try {
        console.log("files", req.file)
        const file = req.file

        if (!file) {
            return res.status(400).json({ error: 'No se recibió un archivo' });
        }

        // Read the current counter value from the file
        let counter = parseInt(fs.readFileSync('counter.txt', 'utf-8'));
        
        // Check if the counter is less than 10
        if (counter < Number(process.env.LIMIT)) {
            // Increment the counter by one
            counter++;
            
            // Write the updated counter value back to the file
            fs.writeFileSync('counter.txt', counter.toString(), 'utf-8');
            
            const documentService = new DocumentAnalysisService(envConfig.AZURE_END, envConfig.AZURE_KEY);
            const id = await documentService.analyzeDocument(file.buffer)
        
            const read = await documentService.readResult(id)
            console.log("end read")
            const mistral = new MistralProvider()
            const result = await mistral.createCompletion(read.analyzeResult.content, true)
            
            const json = JSON.parse(result)
            res.json({
                counter: counter,
                limit: Number(process.env.LIMIT),
                mistral: json
            });
        } else {
            res.status(400).json({ 
                counter: counter,
                error: 'Limite alcanzado',
                limit: Number(process.env.LIMIT)

            });
        }
    } catch (error) {
        next(error);
    }
});

router.post('/reset', async (req: Request, res: Response, next) => {
    try {
        fs.writeFileSync('counter.txt', '0', 'utf-8');
        res.json({ message: 'Counter reset' });
    } catch (error) {
        next(error);
    }
});

export { router }