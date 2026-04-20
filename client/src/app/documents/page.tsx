"use client";

import React, { useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function DocumentsPage() {
    const { instance, accounts } = useMsal();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Get token
            const tokenResponse = await instance.acquireTokenSilent({
                scopes: ["User.Read"],
                account: accounts[0]
            });

            const formData = new FormData();
            formData.append('document', file);

            const response = await axios.post('http://localhost:5000/api/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${tokenResponse.accessToken}`
                }
            });

            setResult(response.data.data);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.response?.data?.details || err.message || 'Failed to process document');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className="title neon-text-green">Document Intelligence</h1>
            <p className="subtitle">Upload documents for AI-powered OCR and Firebase storage</p>

            <div className="upload-section card">
                <div className="upload-box">
                    <input 
                        type="file" 
                        id="fileInput" 
                        className="hidden" 
                        onChange={handleFileChange}
                        accept=".pdf,.png,.jpg,.jpeg,.tiff"
                    />
                    <label htmlFor="fileInput" className="upload-label">
                        {file ? (
                            <div className="file-info">
                                <FileText size={48} className="text-glow-cyan" />
                                <span className="filename">{file.name}</span>
                            </div>
                        ) : (
                            <div className="upload-prompt">
                                <Upload size={48} className="text-glow-green" />
                                <span>Click or Drag Document</span>
                                <span className="small">PDF, PNG, JPG supported</span>
                            </div>
                        )}
                    </label>
                </div>

                <button 
                    className={`btn-primary ${!file || loading ? 'disabled' : ''}`}
                    onClick={handleUpload}
                    disabled={!file || loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <span>Analyze Document</span>
                    )}
                </button>
            </div>

            {error && (
                <div className="alert error">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {result && (
                <div className="result-section animate-in">
                    <div className="result-header">
                        <CheckCircle2 size={24} className="text-glow-green" />
                        <h2>Analysis Result</h2>
                    </div>
                    
                    <div className="result-grid">
                        <div className="card result-card">
                            <h3>Document URL</h3>
                            <a href={result.fileUrl} target="_blank" rel="noreferrer" className="link truncate">
                                {result.fileUrl}
                            </a>
                        </div>
                        
                        <div className="card result-card">
                            <h3>Quick Stats</h3>
                            <div className="stats">
                                <div className="stat">
                                    <span>Pages:</span>
                                    <span className="value">{result.analysis.pages}</span>
                                </div>
                                <div className="stat">
                                    <span>Tables:</span>
                                    <span className="value">{result.analysis.tables}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card full-width">
                        <h3>Extracted Content</h3>
                        <div className="content-box mono">
                            {result.analysis.content}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .title {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }
                .subtitle {
                    color: var(--text-dim);
                    margin-bottom: 2rem;
                }
                .card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 1.5rem;
                    transition: border-color 0.3s;
                }
                .card:hover {
                    border-color: rgba(57, 255, 20, 0.2);
                }
                .upload-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .upload-box {
                    width: 100%;
                    height: 200px;
                    border: 2px dashed rgba(57, 255, 20, 0.2);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .upload-box:hover {
                    background: rgba(57, 255, 20, 0.02);
                    border-color: var(--neon-green);
                }
                .hidden {
                    display: none;
                }
                .upload-label {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                .upload-prompt, .file-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-dim);
                }
                .btn-primary {
                    background: var(--neon-green);
                    color: black;
                    border: none;
                    padding: 0.8rem 2rem;
                    border-radius: 6px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    box-shadow: 0 0 15px var(--neon-green-glow);
                    transition: transform 0.2s;
                }
                .btn-primary:active {
                    transform: scale(0.98);
                }
                .btn-primary.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    box-shadow: none;
                }
                .alert {
                    padding: 1rem;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                }
                .alert.error {
                    background: rgba(255, 49, 49, 0.1);
                    border: 1px solid rgba(255, 49, 49, 0.3);
                    color: #ff3131;
                }
                .result-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .result-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                .result-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1rem;
                }
                .result-card h3 {
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                    color: var(--text-dim);
                }
                .link {
                    color: var(--neon-cyan);
                    text-decoration: none;
                }
                .truncate {
                    display: block;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .stats {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .stat {
                    display: flex;
                    justify-content: space-between;
                }
                .value {
                    color: var(--neon-green);
                }
                .content-box {
                    background: black;
                    padding: 1rem;
                    border-radius: 4px;
                    max-height: 400px;
                    overflow-y: auto;
                    font-size: 0.9rem;
                    line-height: 1.6;
                    white-space: pre-wrap;
                }
                .animate-in {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
