import React from 'react';

const SeoContent: React.FC = () => {
  return (
    <div className="mt-20 py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-300 space-y-12">
        
        {/* Section 1: What is it? */}
        <section>
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-6">What is the AI Video Superprompt Generator?</h2>
          <p className="text-lg text-slate-400 leading-relaxed text-center">
            This tool is an advanced prompt engineering assistant designed to bridge the gap between your creative vision and the complex needs of AI video generation models like Google's VEO, OpenAI's Sora, and others. It transforms your simple ideas into a highly detailed, structured JSON "superprompt" that gives the AI precise instructions for creating stunning, cinematic video content.
          </p>
        </section>

        {/* Section 2: How to Use */}
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">How to Craft the Perfect Video Prompt</h2>
          <ol className="list-decimal list-inside space-y-3 text-slate-400">
            <li><strong>Describe Your Vision:</strong> Start by filling in the "Primary Subject" and "Action/Scene Description" fields. This is the core of your idea.</li>
            <li><strong>Refine with Presets:</strong> Use the dropdown menus for composition, lighting, style, and more to add professional cinematographic and artistic direction. You can always type in your own custom values.</li>
            <li><strong>Get Inspired:</strong> Click the ✨ icon on any field if you're feeling stuck, and our AI will suggest creative ideas.</li>
            <li><strong>Generate Superprompt:</strong> Click the "Generate Superprompt" button. Our AI will analyze your inputs and structure them into a clean, machine-readable JSON format.</li>
            <li><strong>Copy & Create:</strong> Use the "Copy Veo 3 Prompt" button and paste the result directly into your favorite AI video generation platform.</li>
          </ol>
        </section>
        
        {/* Section 3: Why Use It */}
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Why Use a Structured JSON Prompt?</h2>
          <p className="text-slate-400 mb-4">
            While a simple text prompt can work, a structured JSON prompt provides unparalleled control and consistency.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-indigo-400 font-bold mr-3">✓</span>
              <span className="text-slate-400"><strong>Precision & Control:</strong> By defining parameters like `camera_movement` and `lighting` separately, you leave less room for the AI to misinterpret your creative intent.</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 font-bold mr-3">✓</span>
              <span className="text-slate-400"><strong>Consistency:</strong> Re-using a structured prompt with minor changes allows you to create a series of shots with a consistent style, essential for storytelling.</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 font-bold mr-3">✓</span>
              <span className="text-slate-400"><strong>Unlocks Advanced Features:</strong> Some AI models can interpret JSON to control specific generation parameters that are not accessible through natural language alone.</span>
            </li>
          </ul>
        </section>

        {/* Section 4: FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-200">Which AI models can I use this with?</h3>
              <p className="text-slate-400">This generator is optimized for advanced models that can benefit from structured input, such as Google VEO. However, the generated `scene_description` is a high-quality prompt that can be used with any text-to-video model, including OpenAI's Sora, RunwayML, and Pika Labs.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">Is this tool free to use?</h3>
              <p className="text-slate-400">Yes, this Superprompt Generator is completely free to use. It leverages the Gemini API to provide AI-powered suggestions and JSON generation.</p>
            </div>
             <div>
              <h3 className="font-semibold text-slate-200">Why does it output JSON?</h3>
              <p className="text-slate-400">JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate. It provides a clear, unambiguous structure that helps AI models understand the specific components of your video request, leading to more accurate and controllable results.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SeoContent;
