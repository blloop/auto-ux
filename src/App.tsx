import { useState } from 'react';
import OpenAI from "openai";

function App() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState('');

  const generateCode = async () => {
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    try {
      const response = await openai.responses.create({
        model: "gpt-4.1-nano-2025-04-14", // Or another suitable model
        input: `Generate a React component for: ${prompt}`,
        max_output_tokens: 500,
      });
      console.log("output is", response.output_text)
    } catch (error) {
      console.error("Error generating code:", error);
      setGeneratedCode("Error generating code. See console for details.");
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    generateCode();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Generate Code</button>
      </form>
      <div>
        <h2>Generated Code:</h2>
        <pre>{generatedCode}</pre>
        {/* WARNING: Using eval() to render generated code can be a security risk! */}
        {/* Consider using a safer alternative like a sandboxed iframe. */}
        {/* {eval(generatedCode)} */}
      </div>
    </div>
  );
}

export default App
