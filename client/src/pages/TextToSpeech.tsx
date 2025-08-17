import React, { useState, useRef } from 'react';

const TextToSpeech = () => {
  // Your Google Cloud API Key
  const API_KEY = 'AIzaSyC4Wh88O0uchdhUcQQBLVULQX9YEiKF6Bo'; 
  const API_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`; 

  // State management
  const [text, setText] = useState('Hello world. မင်္ဂလာပါ။');
  const [language, setLanguage] = useState('en-US'); // 'en-US' or 'my-MM'
  const [audioSrc, setAudioSrc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef(null);

  // Function to handle the API call
  const handleSynthesize = async () => {
    if (!text.trim()) {
      setError('Please enter some text.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAudioSrc('');

    // Select voice based on language
    const voiceConfig = language === 'en-US'
      ? { name: 'en-US-Wavenet-D', languageCode: 'en-US' }
      : { name: 'my-MM-Standard-A', languageCode: 'my-MM' };

    const requestBody = {
      input: {
        text: text,
      },
      voice: voiceConfig,
      audioConfig: {
        audioEncoding: 'MP3',
      },
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Something went wrong');
      }

      const data = await response.json();
      
      // The audio content is returned as a base64 string
      if (data.audioContent) {
        const audioDataUri = `data:audio/mp3;base64,${data.audioContent}`;
        setAudioSrc(audioDataUri);
        // Automatically play the audio once it's loaded
        if (audioRef.current) {
            audioRef.current.src = audioDataUri;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
      }

    } catch (err) {
      console.error('Error synthesizing speech:', err);
      setError(`Failed to synthesize speech. Please check your API key and network. Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '500px', margin: 'auto', padding: '20px' }}>
      <h2>Text to Speech (English & Burmese)</h2>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="5"
        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
        placeholder="Enter text to speak..."
      />

      <div style={{ margin: '15px 0' }}>
        <label htmlFor="language-select">Language: </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="en-US">English (US)</option>
          <option value="my-MM">Burmese (Myanmar)</option>
        </select>
      </div>

      <button
        onClick={handleSynthesize}
        disabled={isLoading}
        style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '16px' }}
      >
        {isLoading ? 'Synthesizing...' : 'Speak 🗣️'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {audioSrc && (
        <div style={{ marginTop: '20px' }}>
          <audio ref={audioRef} controls style={{ width: '100%' }}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
