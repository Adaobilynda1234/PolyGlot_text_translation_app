import React, { useState } from "react";
import OpenAI from "openai";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isTranslated, setIsTranslated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputError, setInputError] = useState("");
  const [languageError, setLanguageError] = useState("");

  const languageOptions = [
    { id: "french", name: "French", flag: "/fr-flag.png" },
    { id: "spanish", name: "Spanish", flag: "/sp-flag.png" },
    { id: "japanese", name: "Japanese", flag: "/jpn-flag.png" },
  ];

  const validateForm = () => {
    let isValid = true;

    // Reset all errors
    setInputError("");
    setLanguageError("");
    setError("");

    // Validate text input
    if (!inputText.trim()) {
      setInputError("Please enter some text to translate");
      isValid = false;
    } else if (inputText.length > 500) {
      setInputError("Text is too long. Please limit to 500 characters");
      isValid = false;
    }

    // Validate language selection
    if (!selectedLanguage) {
      setLanguageError("Please select a language");
      isValid = false;
    }

    return isValid;
  };

  const translateText = async () => {
    // Validate the form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true, // Note: This is needed for client-side usage
      });

      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error("API key not configured");
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a translator. Translate the given text to ${selectedLanguage}. Only provide the translation, no explanations.`,
          },
          {
            role: "user",
            content: inputText,
          },
        ],
        max_tokens: 100,
      });

      const translatedText = response.choices[0].message.content.trim();
      setTranslatedText(translatedText);
      setIsTranslated(true);
    } catch (error) {
      console.error("Translation error:", error);
      setError(
        error.message === "API key not configured"
          ? "API key not configured. Please check your environment variables."
          : "Failed to translate. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetTranslation = () => {
    setTranslatedText("");
    setIsTranslated(false);
    setError("");
    setInputError("");
    setLanguageError("");
    setInputText("");
  };

  const headerStyle = {
    backgroundImage: "url(/worldmap.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gray-100">
      <div className="flex justify-center items-center p-4 flex-grow">
        <div className="w-full max-w-lg">
          <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-950 p-4 text-center" style={headerStyle}>
              <div className="flex items-center justify-center gap-2">
                <img src="/parrot.png" alt="PollyGlot Logo" className="h-10" />
                <h1 className="text-2xl font-bold text-green-400">PollyGlot</h1>
              </div>
              <p className="text-white text-sm">
                Perfect Translation Every Time
              </p>
            </div>

            {!isTranslated ? (
              <div className="p-4">
                <h2 className="text-blue-500 font-semibold mb-2 flex items-center">
                  Text to translate <span className="ml-1">👇</span>
                </h2>

                <textarea
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (e.target.value.trim()) setInputError("");
                  }}
                  className={`w-full h-24 p-3 bg-gray-100 rounded-md mb-1 resize-none ${
                    inputError ? "border-2 border-red-500" : ""
                  }`}
                  placeholder="Enter text to translate..."
                  required
                />

                {inputError && (
                  <div className="mb-2 text-sm text-red-500">{inputError}</div>
                )}

                {inputText && !inputError && (
                  <p
                    className={`text-sm mb-2 ${
                      inputText.length > 500 ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {inputText.length}/500 characters
                  </p>
                )}

                <h2 className="text-blue-500 font-semibold mb-2 flex items-center">
                  Select language <span className="ml-1">👇</span>
                </h2>

                <div
                  className={`space-y-2 mb-2 ${
                    languageError
                      ? "border-2 border-red-500 p-2 rounded-md"
                      : ""
                  }`}
                >
                  {languageOptions.map((lang) => (
                    <label key={lang.id} className="flex items-center">
                      <input
                        type="radio"
                        name="language"
                        checked={selectedLanguage === lang.name}
                        onChange={() => {
                          setSelectedLanguage(lang.name);
                          setLanguageError("");
                        }}
                        className="mr-2"
                      />
                      <span className="flex items-center">
                        <span className="mr-2">{lang.name}</span>
                        <img
                          src={lang.flag}
                          alt={`${lang.name} flag`}
                          className="w-6 h-4"
                        />
                      </span>
                    </label>
                  ))}
                </div>

                {languageError && (
                  <div className="mb-2 text-sm text-red-500">
                    {languageError}
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <button
                  onClick={translateText}
                  disabled={isLoading}
                  className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-800 transition disabled:opacity-50"
                >
                  {isLoading ? "Translating..." : "Translate"}
                </button>
              </div>
            ) : (
              <div className="p-4">
                <h2 className="text-blue-500 font-semibold mb-2 flex items-center">
                  Original text <span className="ml-1">👇</span>
                </h2>

                <div className="w-full h-24 p-3 bg-gray-100 rounded-md mb-4 overflow-auto">
                  {inputText}
                </div>

                <h2 className="text-blue-500 font-semibold mb-2 flex items-center">
                  The translation <span className="ml-1">👇</span>
                </h2>

                <div className="w-full h-24 p-3 bg-gray-100 rounded-md mb-4 overflow-auto">
                  {translatedText}
                </div>

                {error && (
                  <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <button
                  onClick={resetTranslation}
                  className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-800 transition"
                >
                  Start Over
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className=" text-center py-3">
        <p className="text-blue-500 text-sm">
          Developed by Adaobi Okwuosa as part of Scrimba solo project
        </p>
      </footer>
    </div>
  );
};

export default App;
