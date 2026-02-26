import { useEffect, useState } from 'react';

type Mode = 'focus' | 'break' | 'stopped';

export default function App() {
  const [mode, setMode] = useState<Mode>('stopped');
  const [timeLeft, setTimeLeft] = useState(0);
  const [focusTime, setFocusTime] = useState(3600);

  const playAlarm = () => {
    const audio = new Audio('/alarm.mp3');
    audio.play();
  };

  useEffect(() => {
    if (mode === 'stopped') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  useEffect(() => {
    if (timeLeft > 0) return;

    if (mode === 'focus') {
      playAlarm();
      setMode('break');
      setTimeLeft(300);
    } else if (mode === 'break') {
      playAlarm();
      setMode('focus');
      setTimeLeft(focusTime);
    }
  }, [timeLeft, mode, focusTime]);

  const formatTime = (sec: number) => {
    if (sec <= 0) return '--:--';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const ringColor =
    mode === 'focus'
      ? 'border-red-400'
      : mode === 'break'
        ? 'border-green-400'
        : 'border-gray-300';

  const badgeColor =
    mode === 'focus'
      ? 'bg-red-100 text-red-600'
      : mode === 'break'
        ? 'bg-green-100 text-green-600'
        : 'bg-gray-100 text-gray-500';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center px-6">
      {/* メインカード */}
      <div className="w-full max-w-3xl rounded-3xl bg-white/80 backdrop-blur shadow-2xl ring-1 ring-black/5 px-10 py-14 text-center transition-all">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-gray-800">
          Pomodoro Timer
        </h1>

        {/* 状態バッジ */}
        <div className="mb-10 flex justify-center">
          <span
            className={`rounded-full px-6 py-2 text-sm font-semibold transition ${badgeColor}`}
          >
            {mode === 'focus' && '集中時間'}
            {mode === 'break' && '休憩時間'}
            {mode === 'stopped' && 'スタンバイ'}
          </span>
        </div>

        {/* タイマー */}
        <div
          className={`mx-auto mb-14 flex h-[280px] w-[280px] items-center justify-center rounded-full border-[14px] bg-white shadow-inner transition-all duration-300 ${ringColor}`}
        >
          <p className="text-6xl font-bold tabular-nums tracking-wider text-gray-800">
            {formatTime(timeLeft)}
          </p>
        </div>

        {/* 時間設定 */}
        <div className="mb-12 flex justify-center gap-6">
          {[3600, 1800].map((t) => (
            <button
              key={t}
              onClick={() => setFocusTime(t)}
              className={`rounded-xl px-8 py-4 text-lg font-medium transition
                ${
                  focusTime === t
                    ? 'bg-gray-800 text-white shadow'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
              {t / 60}分
            </button>
          ))}
        </div>

        {/* 操作ボタン */}
        <div className="flex justify-center gap-8">
          <button
            disabled={mode !== 'stopped'}
            onClick={() => {
              setMode('focus');
              setTimeLeft(focusTime);
            }}
            className="rounded-full bg-red-500 px-12 py-5 text-xl font-semibold text-white shadow-lg transition
              hover:bg-red-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ▶ 集中開始
          </button>

          <button
            onClick={() => {
              setMode('stopped');
              setTimeLeft(0);
            }}
            className="rounded-full bg-gray-400 px-12 py-5 text-xl font-semibold text-white shadow-lg transition
              hover:bg-gray-500 active:scale-95"
          >
            ⏹ 停止
          </button>
        </div>

        {/* フッター */}
        {mode === 'stopped' && (
          <p className="mt-14 text-lg text-gray-500 leading-relaxed animate-fade-in">
            お疲れさまでした ☕<br />
            今日の集中も、ちゃんと積み上がっています
          </p>
        )}
      </div>
    </div>
  );
}
