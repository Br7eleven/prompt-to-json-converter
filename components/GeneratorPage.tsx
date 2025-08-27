import React, { useState, useCallback } from "react";
import { GoogleGenAI, Type } from "@google/genai";


import { PromptData } from "../types";
import {
  shotCompositionPresets,
  cameraMovementPresets,
  visualStylePresets,
  lightingPresets,
  environmentPresets,
  audioCuePresets,
  colorPalettePresets,
} from "../presets";

import FormField from "./FormField";
import OutputArea from "./OutputArea";
import AspectRatioSelector from "./AspectRatioSelector";
import InspireButton from "./InspireButton";
import PresetSelector from "./PresetSelector";
import { SparklesIcon } from "./icons/SparklesIcon";
import { LoaderIcon } from "./icons/LoaderIcon";
import SeoContent from "./SeoContent";

const GeneratorPage: React.FC = () => {
  const [formData, setFormData] = useState<PromptData>({
    primarySubject: "",
    sceneDescription: "",
    shotComposition: "",
    cameraMovement: "",
    visualStyle: "",
    lighting: "",
    environment: "",
    audioCue: "",
    dialogue: "",
    colorPalette: "",
    qualityDetails: "",
    negativePrompt: "",
    aspectRatio: "16:9",
  });
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [inspirationLoading, setInspirationLoading] = useState<
    Partial<Record<keyof Omit<PromptData, "aspectRatio">, boolean>>
  >({});
  
  // --- 1. NEW STATE ADDED ---
  // State to track loading for the automatic scene description generation
  const [isSceneGenerating, setIsSceneGenerating] = useState(false);

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

  const handleInputChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleAspectRatioChange = useCallback((ratio: string) => {
    setFormData((prev) => ({ ...prev, aspectRatio: ratio }));
  }, []);

  const handleClearAll = useCallback(() => {
    setFormData({
      primarySubject: "",
      sceneDescription: "",
      shotComposition: "",
      cameraMovement: "",
      visualStyle: "",
      lighting: "",
      environment: "",
      audioCue: "",
      dialogue: "",
      colorPalette: "",
      qualityDetails: "",
      negativePrompt: "",
      aspectRatio: "16:9",
    });
    setGeneratedPrompt("");
  }, []);

  const handleInspireMe = useCallback(
    async (fieldName: keyof PromptData, prompt: string) => {
      setInspirationLoading((prev) => ({ ...prev, [fieldName]: true }));
      try {
        let finalPrompt;
        if (!prompt || prompt.trim() === "") {
          finalPrompt =
            "Generate a single, complete, and creative AI video prompt idea. The prompt must be descriptive and evocative, without a time frame or style. Do not include any introductory text, titles, or labels (e.g., 'Prompt:'). Output only the raw text of the prompt itself.";
        } else {
          finalPrompt = `You are a creative assistant for an AI video generator. Your task is to refine a user's prompt by adding more descriptive and cinematic details. Do not change the core subject or theme. The output must be only the enhanced phrase, with no conversational text, headings, or formatting. The user's prompt is: "${prompt}"`;
        }
        
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: finalPrompt,
          config: {
            temperature: 0.9,
            maxOutputTokens: 200,
            thinkingConfig: { thinkingBudget: 0 },
          },
        });

        const text = response.text.trim().replace(/^"|"$/g, "").replace(/\.$/, "");
        setFormData((prev) => ({ ...prev, [fieldName]: text }));
      } catch (error) {
        console.error(`Error fetching inspiration for ${fieldName}:`, error);
      } finally {
        setInspirationLoading((prev) => ({ ...prev, [fieldName]: false }));
      }
    },
    [ai.models]
  );

  // --- 2. NEW FUNCTION ADDED ---
  // Generates a scene description based on the primary subject
  const generateSceneDescription = useCallback(async (subject: string) => {
    // Only run if there's a subject AND the scene description is empty
    if (!subject || formData.sceneDescription) {
        return;
    }

    setIsSceneGenerating(true);
    try {
        const prompt = `Based on the primary subject "${subject}", generate a short, creative, and cinematic action or scene description. This should describe what the subject is doing or what is happening to it. Do not repeat the subject in your response. For example, if the subject is "A majestic lion", a good description would be "walking proudly across the Serengeti at sunrise". Output only the generated description text, with no titles, labels, or quotation marks.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.8,
                maxOutputTokens: 100,
            },
        });

        const text = response.text.trim().replace(/^"|"$/g, "").replace(/\.$/, "");
        setFormData((prev) => ({ ...prev, sceneDescription: text }));

    } catch (error) {
        console.error("Error generating scene description:", error);
    } finally {
        setIsSceneGenerating(false);
    }
  }, [ai.models, formData.sceneDescription]);

  const enhancePromptWithAI = useCallback(async () => {
    setIsGenerating(true);
    setGeneratedPrompt("");

    const userInputs = Object.entries(formData)
      .map(([key, value]) => {
        if (!value || key === "negativePrompt" || key === "aspectRatio") return null;
        const formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        return `${formattedKey}: ${value}`;
      })
      .filter(Boolean)
      .join("\n");

    if (!userInputs) {
      setGeneratedPrompt("Please fill in at least one field to generate a prompt.");
      setIsGenerating(false);
      return;
    }

    const systemInstruction =
      "You are an expert prompt engineer for AI video generation. Convert user inputs into a structured JSON object that vividly describes a cinematic scene.";
    const generationPrompt = `Generate a JSON prompt based on the following user inputs:\n\n${userInputs}`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        scene_description: { type: Type.STRING },
        shot_composition: { type: Type.STRING },
        camera_movement: { type: Type.STRING },
        visual_style: { type: Type.STRING },
        lighting: { type: Type.STRING },
        environment: { type: Type.STRING },
        audio_cue: { type: Type.STRING },
        dialogue: { type: Type.STRING },
        color_palette: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            colors: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["name", "colors"],
        },
      },
      required: [
        "scene_description",
        "shot_composition",
        "camera_movement",
        "visual_style",
        "lighting",
        "environment",
        "audio_cue",
        "dialogue",
        "color_palette",
      ],
    };

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: generationPrompt,
        config: {
          systemInstruction,
          temperature: 0.5,
          responseMimeType: "application/json",
          responseSchema,
        },
      });

      const jsonResponse = JSON.parse(response.text);
      const formattedJson = JSON.stringify(jsonResponse, null, 2);
      setGeneratedPrompt(formattedJson);
    } catch (error) {
      console.error("Error generating JSON prompt with AI:", error);
      setGeneratedPrompt(
        JSON.stringify(
          {
            error: "Error generating JSON prompt",
            details: "Please check your inputs and try again.",
          },
          null,
          2
        )
      );
    } finally {
      setIsGenerating(false);
    }
  }, [formData, ai.models]);

  const commonInputClass =
    "block w-full bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";

  return (
    <>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
          VEO 3 JSON Prompt Generator
        </h1>
        <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
          Craft the perfect prompt for your AI video masterpiece. Use presets and AI to
          enhance your ideas into a comprehensive superprompt.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 lg:items-start">
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl shadow-indigo-900/20 border border-slate-700">
          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              enhancePromptWithAI();
            }}
          >
            <div className="space-y-8">
              {/* --- 3. JSX MODIFICATIONS APPLIED HERE --- */}
              <FormField 
                label="Primary Subject / Theme"
                name="primarySubject"
                value={formData.primarySubject}
                onChange={handleInputChange}
                onBlur={() => generateSceneDescription(formData.primarySubject)}
                placeholder="e.g., A majestic lion, a futuristic car"
              >
                <InspireButton 
                  fieldName="primary subject" 
                  isLoading={!!inspirationLoading.primarySubject} 
                  onClick={() => handleInspireMe('primarySubject', formData.primarySubject)} 
                />
              </FormField>
              
              <FormField 
                label="Action / Scene Description"
                name="sceneDescription"
                value={formData.sceneDescription}
                onChange={handleInputChange}
                placeholder={isSceneGenerating ? "AI is generating a description..." : "e.g., walking proudly across the Serengeti at sunrise"}
                isTextarea={true}
                disabled={isSceneGenerating}
              >
                {isSceneGenerating ? (
                  <div className="absolute top-11 right-3.5 text-slate-400">
                    <LoaderIcon />
                  </div>
                ) : (
                  <InspireButton 
                    fieldName="scene description" 
                    isLoading={!!inspirationLoading.sceneDescription} 
                    onClick={() => handleInspireMe('sceneDescription', formData.sceneDescription)} 
                    isTextarea={true} 
                  />
                )}
              </FormField>
            </div>

            {/* --- The rest of your form remains unchanged --- */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-slate-300">🎥 Shot Composition</h3>
                <PresetSelector 
                  label="Composition Style" 
                  name="shotComposition" 
                  value={formData.shotComposition} 
                  onChange={handleInputChange} 
                  options={shotCompositionPresets} 
                />
                <p className="text-xs text-slate-500 px-1 pt-1">Or enter your own composition...</p>
                <input 
                  type="text" 
                  name="shotComposition" 
                  value={formData.shotComposition} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Top-down symmetrical shot" 
                  className={commonInputClass} 
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-slate-300">🎬 Camera Movement</h3>
                <PresetSelector 
                  label="Movement Style" 
                  name="cameraMovement" 
                  value={formData.cameraMovement} 
                  onChange={handleInputChange} 
                  options={cameraMovementPresets} 
                />
                <p className="text-xs text-slate-500 px-1 pt-1">Or enter your own movement...</p>
                <input 
                  type="text" 
                  name="cameraMovement" 
                  value={formData.cameraMovement} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Slow arc around subject" 
                  className={commonInputClass} 
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-slate-300">🎨 Visual Style</h3>
                <PresetSelector 
                  label="Style" 
                  name="visualStyle" 
                  value={formData.visualStyle} 
                  onChange={handleInputChange} 
                  options={visualStylePresets} 
                />
                <p className="text-xs text-slate-500 px-1 pt-1">Or enter your own visual style...</p>
                <input 
                  type="text" 
                  name="visualStyle" 
                  value={formData.visualStyle} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Psychedelic, watercolor" 
                  className={commonInputClass} 
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-slate-300">💡 Lighting</h3>
                <PresetSelector 
                  label="Lighting Style" 
                  name="lighting" 
                  value={formData.lighting} 
                  onChange={handleInputChange} 
                  options={lightingPresets} 
                />
                <p className="text-xs text-slate-500 px-1 pt-1">Or enter your own lighting style...</p>
                <input 
                  type="text" 
                  name="lighting" 
                  value={formData.lighting} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Volumetric crepuscular rays" 
                  className={commonInputClass} 
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-slate-300">🌍 Environment</h3>
                <PresetSelector 
                  label="Background Setting" 
                  name="environment" 
                  value={formData.environment} 
                  onChange={handleInputChange} 
                  options={environmentPresets} 
                />
                <p className="text-xs text-slate-500 px-1 pt-1">Or enter your own background setting...</p>
                <input 
                  type="text" 
                  name="environment" 
                  value={formData.environment} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Bioluminescent alien jungle" 
                  className={commonInputClass} 
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-slate-300">🔊 Audio</h3>
                <PresetSelector 
                  label="Audio Description" 
                  name="audioCue" 
                  value={formData.audioCue} 
                  onChange={handleInputChange} 
                  options={audioCuePresets} 
                />
                <p className="text-xs text-slate-500 px-1 pt-1">Or enter your own audio description...</p>
                <input 
                  type="text" 
                  name="audioCue" 
                  value={formData.audioCue} 
                  onChange={handleInputChange} 
                  placeholder="e.g., The sound of distant thunder" 
                  className={commonInputClass} 
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-slate-300">🌈 Color Palette</h3>
              <PresetSelector 
                label="Color Style" 
                name="colorPalette" 
                value={formData.colorPalette} 
                onChange={handleInputChange} 
                options={colorPalettePresets} 
              />
              <p className="text-xs text-slate-500 px-1 pt-1">Or enter your own color palette...</p>
              <input 
                type="text" 
                name="colorPalette" 
                value={formData.colorPalette} 
                onChange={handleInputChange} 
                placeholder="e.g., Dominated by deep blues and electric pinks" 
                className={commonInputClass} 
              />
            </div>

            <div className="space-y-6">
              <FormField 
                label="💬 Dialogue (Spoken Text, optional)"
                name="dialogue"
                value={formData.dialogue}
                onChange={handleInputChange}
                placeholder="e.g., So that's the end of our guide, we hope you found it useful"
              />

              <AspectRatioSelector 
                selectedRatio={formData.aspectRatio} 
                onSelectRatio={handleAspectRatioChange} 
              />
              
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
          <OutputArea
            prompt={generatedPrompt}
            isLoading={isGenerating}
            onClearAll={handleClearAll}
          />
        </div>
      </div>
      <SeoContent />
    </>
  );
};

export default GeneratorPage;
