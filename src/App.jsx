import React, { useState } from "react";
import OpenAI from "openai";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("French");
  const [isTranslated, setIsTranslated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const languageOptions = [
    { id: "french", name: "French", flag: "/fr-flag.png" },
    { id: "spanish", name: "Spanish", flag: "/sp-flag.png" },
    { id: "japanese", name: "Japanese", flag: "/jpn-flag.png" },
  ];

  const translateText = async () => {
    if (!inputText) return;

    setIsLoading(true);

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true, // Note: This is needed for client-side usage
      });

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
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };
  const resetTranslation = () => {
    setTranslatedText("");
    setIsTranslated(false);
  };

  const headerStyle = {
    backgroundImage: "url(/worldmap.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg">
        <div className="w-full  bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-950 p-4 text-center" style={headerStyle}>
            <div className="flex items-center justify-center gap-2">
              <img src="/parrot.png" alt="PollyGlot Logo" className="h-10" />
              <h1 className="text-2xl font-bold text-green-400">PollyGlot</h1>
            </div>
            <p className="text-white text-sm">Perfect Translation Every Time</p>
          </div>

          {!isTranslated ? (
            <div className="p-4">
              <h2 className="text-blue-500 font-semibold mb-2 flex items-center">
                Text to translate <span className="ml-1">👇</span>
              </h2>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-24 p-3 bg-gray-100 rounded-md mb-4 resize-none"
                placeholder="Enter text to translate..."
                required
              />

              <h2 className="text-blue-500 font-semibold mb-2 flex items-center">
                Select language <span className="ml-1">👇</span>
              </h2>

              <div className="space-y-2 mb-4">
                {languageOptions.map((lang) => (
                  <label key={lang.id} className="flex items-center">
                    <input
                      type="radio"
                      name="language"
                      checked={selectedLanguage === lang.name}
                      onChange={() => setSelectedLanguage(lang.name)}
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

              <button
                onClick={translateText}
                disabled={isLoading || !inputText}
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

              <div className="w-full h-24 p-3 bg-gray-100 rounded-md mb-4">
                {inputText}
              </div>

              <h2 className="text-blue-500 font-semibold mb-2 flex items-center">
                The translation <span className="ml-1">👇</span>
              </h2>

              <div className="w-full h-24 p-3 bg-gray-100 rounded-md mb-4">
                {translatedText}
              </div>

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
  );
};

export default App;
