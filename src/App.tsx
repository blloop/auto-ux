import { useState } from 'react';
import OpenAI from "openai";
import * as Babel from '@babel/standalone';
import traverse from '@babel/traverse';

const validateHTMLCode = (code: string): boolean => {
  try {
    const ast = Babel.transform(code, { ast: true, presets: ['react'] }).ast;
    if (!ast) {
      return false;
    }

    // Walk the AST and check for unsafe nodes
    let isSafe = true;
    traverse(ast, {
      Identifier(path) {
        const name = path.node.name;
        if (['window', 'document', 'eval', 'Function'].includes(name)) {
          isSafe = false;
          path.stop();
        }
      },
    });

    return isSafe;
  } catch (err) {
    console.error('Babel parsing error:', err);
    return false;
  }
};

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const generateCode = async () => {
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    try {
      const response = await openai.responses.create({
        model: "gpt-4.1-nano-2025-04-14", // Or another suitable model
        input: `${import.meta.env.VITE_PROMPT}${prompt}`,
        max_output_tokens: 500,
      });
      console.log("prompt is", `${import.meta.env.VITE_PROMPT}${prompt}`)
      console.log("output is", response.output_text);
      setCode(response.output_text);
      setShowPreview(true);
    } catch (error) {
      console.error("Error generating code:", error);
      setCode("Error generating code. See console for details.");
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    generateCode();
  };

  return (
    <div>
      <button onClick={() => setShowPreview(!showPreview)}>{showPreview ? "Back to Prompt" : "Preview"}</button>
      <form className={showPreview ? "hidden" : ""} onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Generate Code</button>
      </form>
      <h2>Generated Code:</h2>
      {showPreview && (code.length > 0 && validateHTMLCode(code) ?
        <div id="dynamic-content" dangerouslySetInnerHTML={{ __html: code }} /> :
        code
      )}
    </div>
  );
}
