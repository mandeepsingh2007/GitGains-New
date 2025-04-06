import React, { useState } from "react";

const AISuggestions = () => {
  const [codeSnippet, setCodeSnippet] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateSuggestions = async () => {
    if (!codeSnippet.trim()) {
      alert("Please enter a code snippet!");
      return;
    }

    setLoading(true);
    setSuggestions("");

    try {
      const response = await fetch("http://localhost:5000/api/ai-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codeSnippet }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions("Failed to fetch suggestions. Try again.");
    }

    setLoading(false);
  };

  // Function to highlight AI suggestions
  const highlightSuggestions = () => {
    if (!suggestions) return codeSnippet; // If no suggestions, return original code

    const suggestionLines = suggestions.split("\n").map((line, index) => {
      if (line.includes("Line") && line.includes("Suggestion")) {
        return `<span style="color: red; font-weight: bold;">${line}</span>`;
      }
      return line;
    });

    return suggestionLines.join("\n");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>💡 AI Code Suggestions</h2>

      <textarea
        value={codeSnippet}
        onChange={(e) => setCodeSnippet(e.target.value)}
        placeholder="Paste your code here..."
        style={styles.textarea}
      ></textarea>

      <button onClick={handleGenerateSuggestions} style={styles.button} disabled={loading}>
        {loading ? "Generating..." : "Get AI Suggestions"}
      </button>

      {suggestions && (
        <div style={styles.resultBox}>
          <h3>🔍 AI Suggestions:</h3>
          <pre style={styles.pre} dangerouslySetInnerHTML={{ __html: highlightSuggestions() }}></pre>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#f3f4f6",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    translate: "375px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  textarea: {
    width: "100%",
    height: "150px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    fontFamily: "monospace",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "20px",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  pre: {
    textAlign: "left",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    fontSize: "14px",
    fontFamily: "monospace",
    backgroundColor: "#f0f0f0",
    padding: "10px",
    borderRadius: "5px",
  },
};

export default AISuggestions;

