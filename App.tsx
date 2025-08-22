

import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai"; // i have to change the import if i change the API e.g to OpenAI, or etc...
import { PromptData } from './types';
import { shotCompositionPresets, cameraMovementPresets, visualStylePresets, lightingPresets, environmentPresets, audioCuePresets, colorPalettePresets } from './presets';
import Header from './components/Header';
import Footer from './components/Footer';
import FormField from './components/FormField';
import OutputArea from './components/OutputArea';
import AspectRatioSelector from './components/AspectRatioSelector';
import InspireButton from './components/InspireButton';
import PresetSelector from './components/PresetSelector';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { LoaderIcon } from './components/icons/LoaderIcon';
import SeoContent from './components/SeoContent';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import TermsPage from './components/TermsPage';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState('Generator');
    const [formData, setFormData] = useState<PromptData>({
        primarySubject: '',
        sceneDescription: '',
        shotComposition: '',
        cameraMovement: '',
        visualStyle: '',
        lighting: '',
        environment: '',
        audioCue: '',
        dialogue: '',
        colorPalette: '',
        qualityDetails: '',
        negativePrompt: '',
        aspectRatio: '16:9',
    });
    const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [inspirationLoading, setInspirationLoading] = useState<Partial<Record<keyof Omit<PromptData, 'aspectRatio'>, boolean>>>({});

    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
    
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);
    
    const handleAspectRatioChange = useCallback((ratio: string) => {
        setFormData(prev => ({ ...prev, aspectRatio: ratio }));
    }, []);

    const handleClearAll = useCallback(() => {
        setFormData({
            primarySubject: '',
            sceneDescription: '',
            shotComposition: '',
            cameraMovement: '',
            visualStyle: '',
            lighting: '',
            environment: '',
            audioCue: '',
            dialogue: '',
            colorPalette: '',
            qualityDetails: '',
            negativePrompt: '',
            aspectRatio: '16:9',
        });
        setGeneratedPrompt('');
    }, []);

    const handleNavClick = (page: string) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    //i have to change the handleInspireMe function if i change the API --
    const handleInspireMe = useCallback(async (fieldName: keyof PromptData, prompt: string) => {
        setInspirationLoading(prev => ({ ...prev, [fieldName]: true }));
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    temperature: 0.9,
                    maxOutputTokens: 50,
                    thinkingConfig: { thinkingBudget: 0 }
                },
            });
            const text = response.text.trim().replace(/^"|"$/g, '').replace(/\.$/, '');
            setFormData(prev => ({ ...prev, [fieldName]: text }));
        } catch (error) {
            console.error(`Error fetching inspiration for ${fieldName}:`, error);
        } finally {
            setInspirationLoading(prev => ({ ...prev, [fieldName]: false }));
        }
    }, [ai.models]);
//i have to change this enhancePromptWithAI of  I change the API --
    const enhancePromptWithAI = useCallback(async () => {
        setIsGenerating(true);
        setGeneratedPrompt('');
        
        const userInputs = Object.entries(formData)
            .map(([key, value]) => {
                if (!value || key === 'negativePrompt' || key === 'aspectRatio') return null;
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                return `${formattedKey}: ${value}`;
            })
            .filter(Boolean)
            .join('\n');
            
        if (!userInputs) {
            setGeneratedPrompt("Please fill in at least one field to generate a prompt.");
            setIsGenerating(false);
            return;
        }

        const systemInstruction = `You are an expert prompt engineer for AI video generation. Your task is to convert user inputs into a structured JSON object that vividly describes a cinematic scene. Use the provided user inputs to populate the JSON fields. Creatively interpret the inputs to generate a cohesive scene. For the color palette, generate a descriptive name and a list of 3-5 representative hex color codes based on the user's color description.`;
        const generationPrompt = `Generate a JSON prompt based on the following user inputs:\n\n${userInputs}`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                scene_description: { type: Type.STRING, description: "A detailed, cinematic description of the scene, combining the primary subject, their actions, and quality details." },
                shot_composition: { type: Type.STRING, description: "The composition of the shot, e.g., 'medium shot', 'extreme close-up'." },
                camera_movement: { type: Type.STRING, description: "The movement of the camera, e.g., 'static shot', 'slow zoom in'." },
                visual_style: { type: Type.STRING, description: "The overall visual style, e.g., 'cinematic, photorealistic', 'anime'." },
                lighting: { type: Type.STRING, description: "The lighting of the scene, e.g., 'golden hour', 'neon-drenched'." },
                environment: { type: Type.STRING, description: "The setting or background, e.g., 'enchanted forest', 'futuristic cityscape'." },
                audio_cue: { type: Type.STRING, description: "Description of the sound or music, e.g., 'epic orchestral score', 'ambient nature sounds'." },
                dialogue: { type: Type.STRING, description: "Any spoken text in the scene. Can be an empty string." },
                color_palette: {
                    type: Type.OBJECT,
                    description: "A descriptive name and list of hex colors representing the scene's palette.",
                    properties: {
                        name: { type: Type.STRING, description: "A descriptive name for the color palette." },
                        colors: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING, description: "A hex color code string, e.g., '#DAA520'." }
                        }
                    },
                    required: ["name", "colors"]
                }
            },
            required: ["scene_description", "shot_composition", "camera_movement", "visual_style", "lighting", "environment", "audio_cue", "dialogue", "color_palette"]
        };
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: generationPrompt,
                config: { 
                    systemInstruction, 
                    temperature: 0.5,
                    responseMimeType: "application/json",
                    responseSchema: responseSchema
                }
            });
            
            const jsonResponse = JSON.parse(response.text);
            const formattedJson = JSON.stringify(jsonResponse, null, 2);
            setGeneratedPrompt(formattedJson);

        } catch (error) {
            console.error("Error generating JSON prompt with AI:", error);
            const errorJson = JSON.stringify({ 
                error: "Sorry, an error occurred while generating the JSON prompt.",
                details: "Please check your inputs and try again. The AI may have been unable to form a valid JSON structure from the provided details."
            }, null, 2);
            setGeneratedPrompt(errorJson);
        } finally {
            setIsGenerating(false);
        }
    }, [formData, ai.models]);

    const commonInputClass = "block w-full bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";
    
    const renderContent = () => {
        switch (currentPage) {
            case 'Generator':
                return (
                    <>
                        <header className="text-center mb-10">
                            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                                VEO 3 JSON Prompt Generator
                            </h1>
                            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
                                Craft the perfect prompt for your AI video masterpiece. Use presets and AI to enhance your ideas into a comprehensive superprompt.
                            </p>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 lg:items-start">
                            <div className="bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl shadow-indigo-900/20 border border-slate-700">
                                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); enhancePromptWithAI(); }}>
                                    <div className="space-y-8">
                                        <FormField 
                                            label="Primary Subject / Theme"
                                            name="primarySubject"
                                            value={formData.primarySubject}
                                            onChange={handleInputChange}
                                            placeholder="e.g., A majestic lion, a futuristic car"
                                        >
                                            <InspireButton fieldName="primary subject" isLoading={!!inspirationLoading.primarySubject} onClick={() => handleInspireMe('primarySubject', 'Suggest a compelling primary subject or theme for a short, cinematic AI video.')} />
                                        </FormField>
                                        
                                        <FormField 
                                            label="Action / Scene Description"
                                            name="sceneDescription"
                                            value={formData.sceneDescription}
                                            onChange={handleInputChange}
                                            placeholder="e.g., walking proudly across the Serengeti at sunrise"
                                            isTextarea={true}
                                        >
                                        <InspireButton fieldName="scene description" isLoading={!!inspirationLoading.sceneDescription} onClick={() => handleInspireMe('sceneDescription', 'Suggest a dynamic action or a vivid scene description for an AI video.')} isTextarea={true} />
                                        </FormField>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                                        <div className="space-y-3">
                                            <h3 className="text-base font-semibold text-slate-300">🎥 Shot Composition</h3>
                                            <PresetSelector label="Composition Style" name="shotComposition" value={formData.shotComposition} onChange={handleInputChange} options={shotCompositionPresets} />
                                            <p className="text-xs text-slate-500 px-1 pt-1">Or enter your own composition...</p>
                                            <input type="text" name="shotComposition" value={formData.shotComposition} onChange={handleInputChange} placeholder="e.g., Top-down symmetrical shot" className={commonInputClass} />
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-base font-semibold text-slate-300">🎬 Camera Movement</h3>
                                            <PresetSelector label="Movement Style" name="cameraMovement" value={formData.cameraMovement} onChange={handleInputChange} options={cameraMovementPresets} />
                                            <p className="text-xs text-slate-500 px-1 pt-1">Or enter your own movement...</p>
                                            <input type="text" name="cameraMovement" value={formData.cameraMovement} onChange={handleInputChange} placeholder="e.g., Slow arc around subject" className={commonInputClass} />
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <h3 className="text-base font-semibold text-slate-300">🎨 Visual Style</h3>
                                            <PresetSelector label="Style" name="visualStyle" value={formData.visualStyle} onChange={handleInputChange} options={visualStylePresets} />
                                            <p className="text-xs text-slate-500 px-1 pt-1">Or enter your own visual style...</p>
                                            <input type="text" name="visualStyle" value={formData.visualStyle} onChange={handleInputChange} placeholder="e.g., Psychedelic, watercolor" className={commonInputClass} />
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-base font-semibold text-slate-300">💡 Lighting</h3>
                                            <PresetSelector label="Lighting Style" name="lighting" value={formData.lighting} onChange={handleInputChange} options={lightingPresets} />
                                            <p className="text-xs text-slate-500 px-1 pt-1">Or enter your own lighting style...</p>
                                            <input type="text" name="lighting" value={formData.lighting} onChange={handleInputChange} placeholder="e.g., Volumetric crepuscular rays" className={commonInputClass} />
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-base font-semibold text-slate-300">🌍 Environment</h3>
                                            <PresetSelector label="Background Setting" name="environment" value={formData.environment} onChange={handleInputChange} options={environmentPresets} />
                                            <p className="text-xs text-slate-500 px-1 pt-1">Or enter your own background setting...</p>
                                            <input type="text" name="environment" value={formData.environment} onChange={handleInputChange} placeholder="e.g., Bioluminescent alien jungle" className={commonInputClass} />
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-base font-semibold text-slate-300">🔊 Audio</h3>
                                            <PresetSelector label="Audio Description" name="audioCue" value={formData.audioCue} onChange={handleInputChange} options={audioCuePresets} />
                                            <p className="text-xs text-slate-500 px-1 pt-1">Or enter your own audio description...</p>
                                            <input type="text" name="audioCue" value={formData.audioCue} onChange={handleInputChange} placeholder="e.g., The sound of distant thunder" className={commonInputClass} />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-base font-semibold text-slate-300">🌈 Color Palette</h3>
                                        <PresetSelector label="Color Style" name="colorPalette" value={formData.colorPalette} onChange={handleInputChange} options={colorPalettePresets} />
                                        <p className="text-xs text-slate-500 px-1 pt-1">Or enter your own color palette...</p>
                                        <input type="text" name="colorPalette" value={formData.colorPalette} onChange={handleInputChange} placeholder="e.g., Dominated by deep blues and electric pinks" className={commonInputClass} />
                                    </div>

                                    <div className="space-y-6">
                                        <FormField 
                                            label="💬 Dialogue (Spoken Text, optional)"
                                            name="dialogue"
                                            value={formData.dialogue}
                                            onChange={handleInputChange}
                                            placeholder="e.g., So that's the end of our guide, we hope you found it useful"
                                        />

                                        <AspectRatioSelector selectedRatio={formData.aspectRatio} onSelectRatio={handleAspectRatioChange} />
                                        
                                        <FormField 
                                            label="Quality & Details"
                                            name="qualityDetails"
                                            value={formData.qualityDetails}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Highly detailed, 4K, sharp focus"
                                        />
                                        <FormField 
                                            label="Negative Prompt (What to avoid)"
                                            name="negativePrompt"
                                            value={formData.negativePrompt}
                                            onChange={handleInputChange}
                                            placeholder="e.g., blurry, low quality, cartoonish, watermark"
                                        />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={isGenerating}
                                        className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-indigo-800 disabled:cursor-not-allowed disabled:scale-100"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <LoaderIcon />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <SparklesIcon />
                                                Generate Superprompt
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            <div className="mt-8 lg:mt-0 sticky top-8">
                                <OutputArea prompt={generatedPrompt} isLoading={isGenerating} onClearAll={handleClearAll} />
                            </div>
                        </div>
                        <SeoContent />
                    </>
                );
            case 'About':
                return <AboutPage />;
            case 'Contact':
                return <ContactPage />;
            case 'Terms':
                return <TermsPage />;
            default:
                return <h1>Page not found</h1>;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-900 text-slate-200 font-sans">
            <Header currentPage={currentPage} onNavClick={handleNavClick} />
            <main className="w-full max-w-7xl mx-auto px-4 py-8 flex-grow">
                {renderContent()}
            </main>
            <Footer onNavClick={handleNavClick} />
        </div>
    );
};

export default App;
