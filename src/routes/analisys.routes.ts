// rutas de analisis
import { Router, Request, Response } from 'express';
import { envConfig } from '../shared/config/env'
import { DocumentAnalysisService } from '../service/azure.services'
import { MistralProvider} from '../service/mistral.services'

import multer from 'multer';
const upload = multer({ memoryStorage: multer.memoryStorage() });

const router = Router();

router.post('/ocr', upload.single('image'), async (req: Request, res: Response, next) => {
    try {
        console.log("files", req.file)
        const file = req.file

        if (!file) {
            return res.status(400).json({ error: 'No se recibió un archivo' });
        }
        
        const documentService = new DocumentAnalysisService(envConfig.AZURE_END, envConfig.AZURE_KEY);
        const id = await documentService.analyzeDocument(file.buffer)
    
        const read = await documentService.readResult(id)
        console.log("end read")
        const mistral = new MistralProvider()
        const result = await mistral.createCompletion(read.analyzeResult.content, true)
        
        const json = JSON.parse(result)
        res.json(json);
    } catch (error) {
        next(error);
    }
});
export { router }