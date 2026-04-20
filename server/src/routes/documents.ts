import { Router } from 'express';
import multer from 'multer';
import { DocumentService } from '../services/documentService.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route POST /api/documents/upload
 * @desc Upload and analyze a document
 */
router.post('/upload', authenticate, upload.single('document'), async (req: any, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { buffer, originalname, mimetype } = req.file;
        
        // Process the document (Upload to Firebase + Azure OCR)
        const result = await DocumentService.processDocument(buffer, originalname, mimetype);
        
        res.json({
            message: 'Document processed successfully',
            data: result
        });
    } catch (error: any) {
        console.error('Document Upload Error:', error);
        res.status(500).json({ error: 'FAILED_TO_PROCESS_DOCUMENT', details: error.message });
    }
});

/**
 * @route GET /api/documents/analyze-url
 * @desc Analyze a document already in Firebase from a URL
 */
router.get('/analyze-url', authenticate, async (req, res) => {
    try {
        const { url } = req.query;
        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: 'URL is required' });
        }

        const analysis = await DocumentService.analyzeDocument(url);
        res.json({ data: analysis });
    } catch (error: any) {
        res.status(500).json({ error: 'FAILED_TO_ANALYZE_DOCUMENT', details: error.message });
    }
});

export default router;
