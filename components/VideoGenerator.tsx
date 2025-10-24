import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

// Helper to convert a file blob to a base64 string
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix e.g. "data:image/png;base64,"
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const loadingMessages = [
    "Contacting the video generation service...",
    "Analyzing the image and prompt...",
    "Generating video frames... this is the longest step and may take a few minutes.",
    "Finalizing the video..."
];

const VideoGenerator: React.FC = () => {
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('A cinematic, dramatic, and epic shot of this image.');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [error, setError] = useState<string | null>(null);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const loadingIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        const checkKey = async () => {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            setApiKeySelected(hasKey);
        };
        checkKey();
    }, []);

    useEffect(() => {
        if (isLoading) {
            let messageIndex = 0;
            loadingIntervalRef.current = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[messageIndex]);
            }, 5000);
        } else if (loadingIntervalRef.current) {
            clearInterval(loadingIntervalRef.current);
            loadingIntervalRef.current = null;
        }

        return () => {
            if (loadingIntervalRef.current) {
                clearInterval(loadingIntervalRef.current);
            }
        };
    }, [isLoading]);

    const handleSelectKey = async () => {
        await (window as any).aistudio.openSelectKey();
        // Assume key selection is successful to avoid race conditions
        setApiKeySelected(true);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setError(null);
            setGeneratedVideoUrl(null);
            setImageFile(file);
            const base64 = await blobToBase64(file);
            setImageBase64(base64);
        }
    };

    const handleSubmit = async () => {
        if (!imageFile || !imageBase64 || !prompt) {
            setError("Please upload an image and provide a prompt.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedVideoUrl(null);
        setLoadingMessage(loadingMessages[0]);

        try {
            // Create a new instance right before the call to ensure the latest key is used.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                image: {
                    imageBytes: imageBase64,
                    mimeType: imageFile.type,
                },
                config: {
                    numberOfVideos: 1,
                    aspectRatio: aspectRatio,
                    resolution: '720p',
                }
            });

            // Polling loop
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

            if (downloadLink) {
                 const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                 if (!videoResponse.ok) {
                     throw new Error(`Failed to download video: ${videoResponse.statusText}`);
                 }
                 const videoBlob = await videoResponse.blob();
                 const videoUrl = URL.createObjectURL(videoBlob);
                 setGeneratedVideoUrl(videoUrl);
            } else {
                throw new Error("Video generation completed, but no download link was found.");
            }
        } catch (e: any) {
            console.error(e);
            const errorMessage = e.message || "An unknown error occurred.";
            setError(errorMessage);
             if (errorMessage.includes("Requested entity was not found.")) {
                setError("API Key is invalid. Please select a valid key.");
                setApiKeySelected(false);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <section id="video-generator" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="AI Video Generation">
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">AI Video Generation</h2>
            </div>
            
            {!apiKeySelected ? (
                <div className="text-center p-8 border-2 border-dashed border-slate-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">API Key Required</h3>
                    <p className="text-slate-400 mb-4">Please select an API key to use the Veo video generation model.</p>
                    <button onClick={handleSelectKey} className="font-medium text-white bg-sky-600 hover:bg-sky-500 px-6 py-2 rounded-md transition-colors">
                        Select API Key
                    </button>
                     <p className="text-xs text-slate-500 mt-3">
                        For more information on billing, visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-sky-300">ai.google.dev/gemini-api/docs/billing</a>.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium text-slate-300 mb-2">1. Upload an Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {imageBase64 ? (
                                    <img src={`data:${imageFile?.type};base64,${imageBase64}`} alt="Image preview" className="mx-auto h-32 w-auto rounded-md" />
                                ) : (
                                   <svg className="mx-auto h-12 w-12 text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                   </svg>
                                )}
                                <div className="flex text-sm text-slate-500">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-sky-400 hover:text-sky-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 focus-within:ring-sky-500 px-1">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-slate-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">2. Enter a Prompt</label>
                        <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} className="block w-full bg-slate-800 border-slate-700 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm p-2"></textarea>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-slate-300 mb-2">3. Choose Aspect Ratio</label>
                         <div className="flex gap-4">
                             <label className="flex items-center space-x-2 cursor-pointer">
                                 <input type="radio" name="aspectRatio" value="16:9" checked={aspectRatio === '16:9'} onChange={() => setAspectRatio('16:9')} className="form-radio h-4 w-4 text-sky-600 bg-slate-700 border-slate-600 focus:ring-sky-500" />
                                 <span className="text-sm">Landscape (16:9)</span>
                             </label>
                             <label className="flex items-center space-x-2 cursor-pointer">
                                 <input type="radio" name="aspectRatio" value="9:16" checked={aspectRatio === '9:16'} onChange={() => setAspectRatio('9:16')} className="form-radio h-4 w-4 text-sky-600 bg-slate-700 border-slate-600 focus:ring-sky-500"/>
                                 <span className="text-sm">Portrait (9:16)</span>
                             </label>
                         </div>
                    </div>

                    <button onClick={handleSubmit} disabled={isLoading || !imageFile} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed">
                        {isLoading ? 'Generating...' : 'Generate Video'}
                    </button>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    
                    {isLoading && (
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-300 mx-auto"></div>
                            <p className="mt-3 text-sm text-slate-300">{loadingMessage}</p>
                        </div>
                    )}

                    {generatedVideoUrl && (
                        <div>
                             <h3 className="text-lg font-semibold text-white mb-2 text-center">Generated Video</h3>
                             <video src={generatedVideoUrl} controls autoPlay loop className="w-full rounded-lg"></video>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default VideoGenerator;
