import { useState } from 'react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState("");

  return (
    <div>
      <input value={prompt} onSubmit={() => console.log("ee")} onChange={(e) => setPrompt(e.target.value)} />
    </div>
  )
}

export default App
