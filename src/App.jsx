import { useState, useEffect } from 'react';

const MODES = {
  Focus: { duration: 25 * 60, bg: 'bg-emerald-950' },
  'Short Break': { duration: 5 * 60, bg: 'bg-sky-950' },
  'Long Break': { duration: 15 * 60, bg: 'bg-indigo-950' },
};

function App() {
  // 1. State: Mode, time remaining, and timer active status
  const [mode, setMode] = useState('Focus');
  const [timeLeft, setTimeLeft] = useState(MODES.Focus.duration);
  const [isActive, setIsActive] = useState(false);

  // 2. The Engine: Runs every time 'isActive' or 'timeLeft' changes
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      // If active, subtract 1 second every 1000 milliseconds
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else {
      // If paused or hit 0, stop the clock
      clearInterval(interval);
    }
    // Cleanup function prevents memory leaks when the component re-renders
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // 3. Formatting Math: Convert raw seconds into mm:ss layout
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(MODES[newMode].duration);
  };

  // 4. Dynamic browser tab title: Updates document.title based on timer state
  useEffect(() => {
    if (isActive) {
      document.title = `(${displayTime}) Focus!`;
    } else {
      document.title = 'Pomodoro Tracker';
    }
  }, [isActive, displayTime]);

  return (
    <div className={`${MODES[mode].bg} min-h-screen text-emerald-50 flex flex-col items-center justify-center transition-colors duration-500`}>
      <h1 className="text-4xl font-bold mb-8">Focus Session</h1>

      {/* Mode toggle buttons */}
      <div className="flex gap-2 mb-8 bg-black/20 p-1.5 rounded-xl">
        {Object.keys(MODES).map((modeName) => (
          <button
            key={modeName}
            onClick={() => handleModeChange(modeName)}
            className={`px-5 py-2 rounded-lg font-medium transition-all ${
              mode === modeName
                ? 'bg-white/20 text-white font-bold shadow'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {modeName}
          </button>
        ))}
      </div>

      <div className="text-8xl font-mono mb-12">
        {displayTime}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold text-xl hover:bg-emerald-500 transition-colors"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>

        <button
          onClick={() => { setIsActive(false); setTimeLeft(MODES[mode].duration); }}
          className="bg-emerald-900 border border-emerald-700 px-8 py-3 rounded-lg font-bold text-xl hover:bg-emerald-800 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;