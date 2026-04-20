import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Azure Document Intelligence Setup
const azureEndpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT || "";
const azureKey = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY || "";

const documentClient = new DocumentAnalysisClient(
    azureEndpoint,
    new AzureKeyCredential(azureKey)
);

// Firebase Admin Setup
if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
        if (Object.keys(serviceAccount).length > 0) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET
            });
        } else {
            console.warn("Firebase service account not provided. Storage functionality will be limited.");
        }
    } catch (e) {
        console.error("Failed to initialize Firebase Admin:", e);
    }
}

export class DocumentService {
    /**
     * Upload a document to Firebase Storage
     */
    static async uploadToFirebase(fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> {
        if (!admin.apps.length) throw new Error("Firebase Admin not initialized");
        
        const bucket = admin.storage().bucket();
        const file = bucket.file(`documents/${Date.now()}_${fileName}`);
        
        await file.save(fileBuffer, {
            metadata: { contentType },
            public: true
        });
        
        return file.publicUrl();
    }

    /**
     * Analyze a document using Azure AI Document Intelligence
     */
    static async analyzeDocument(fileUrl: string, modelId: string = "prebuilt-layout") {
        const poller = await documentClient.beginAnalyzeDocumentFromUrl(modelId, fileUrl);
        const { content, pages, tables, documents } = await poller.pollUntilDone();
        
        return {
            content,
            pages: pages?.length || 0,
            tables: tables?.length || 0,
            extractedData: documents?.[0]?.fields || {}
        };
    }

    /**
     * Process a full document workflow: Upload -> Analyze
     */
    static async processDocument(fileBuffer: Buffer, fileName: string, contentType: string) {
        // 1. Upload to Firebase
        const fileUrl = await this.uploadToFirebase(fileBuffer, fileName, contentType);
        
        // 2. Analyze with Azure
        const analysis = await this.analyzeDocument(fileUrl);
        
        return {
            fileUrl,
            analysis
        };
    }
}
