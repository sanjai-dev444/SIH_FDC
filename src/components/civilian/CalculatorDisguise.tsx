import React, { useState } from 'react';
import { triggerHapticTap } from '../../services/native/hapticsService';

interface CalculatorDisguiseProps {
  onDeactivate: () => void;
}

export const CalculatorDisguise: React.FC<CalculatorDisguiseProps> = ({ onDeactivate }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [secretCounter, setSecretCounter] = useState(0);

  const handleNum = (n: string) => {
    triggerHapticTap();
    setDisplay(prev => prev === '0' ? n : prev + n);
  };

  const handleOp = (op: string) => {
    triggerHapticTap();
    setEquation(`${display} ${op} `);
    setDisplay('0');
  };

  const handleEquals = () => {
    triggerHapticTap();
    try {
      const fullEq = `${equation}${display}`;
      // Safe simple math evaluation
      const sanitized = fullEq.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      setDisplay(String(result));
      setEquation('');
    } catch {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    triggerHapticTap();
    setDisplay('0');
    setEquation('');
    setSecretCounter(prev => {
      const next = prev + 1;
      if (next >= 3) {
        onDeactivate();
        return 0;
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col p-4 select-none animate-fade-in">
      {/* Discreet stealth exit banner */}
      <div className="flex justify-between items-center text-[11px] text-zinc-600 font-mono py-1">
        <span>Calculator</span>
        <button
          onClick={onDeactivate}
          className="text-zinc-700 hover:text-zinc-400 p-1"
          title="Exit Stealth"
        >
          [Exit Disguise]
        </button>
      </div>

      {/* Screen */}
      <div className="flex-1 flex flex-col justify-end p-4 text-right">
        <div className="text-zinc-500 font-mono text-sm h-6">{equation}</div>
        <div className="text-5xl font-light font-mono truncate">{display}</div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto w-full pb-safe">
        <button onClick={handleClear} className="h-16 rounded-full bg-zinc-700 text-xl font-bold active:bg-zinc-600">AC</button>
        <button onClick={() => handleNum('+/-')} className="h-16 rounded-full bg-zinc-700 text-xl font-bold active:bg-zinc-600">+/-</button>
        <button onClick={() => handleOp('%')} className="h-16 rounded-full bg-zinc-700 text-xl font-bold active:bg-zinc-600">%</button>
        <button onClick={() => handleOp('÷')} className="h-16 rounded-full bg-amber-600 text-2xl font-bold active:bg-amber-500">÷</button>

        <button onClick={() => handleNum('7')} className="h-16 rounded-full bg-zinc-800 text-2xl font-medium active:bg-zinc-700">7</button>
        <button onClick={() => handleNum('8')} className="h-16 rounded-full bg-zinc-800 text-2xl font-medium active:bg-zinc-700">8</button>
        <button onClick={() => handleNum('9')} className="h-16 rounded-full bg-zinc-800 text-2xl font-medium active:bg-zinc-700">9</button>
        <button onClick={() => handleOp('×')} className="h-16 rounded-full bg-amber-600 text-2xl font-bold active:bg-amber-500">×</button>

        <button onClick={() => handleNum('4')} className="h-16 rounded-full bg-zinc-800 text-2xl font-medium active:bg-zinc-700">4</button>
        <button onClick={() => handleNum('5')} className="h-16 rounded-full bg-zinc-800 text-2xl font-medium active:bg-zinc-700">5</button>
        <button onClick={() => handleNum('6')} className="h-16 rounded-full bg-zinc-800 text-2xl font-medium active:bg-zinc-700">6</button>
        <button onClick={() => handleOp('-')} className="h-16 rounded-full bg-amber-600 text-2xl font-bold active:bg-amber-500">-</button>

        <button onClick={() => handleNum('1')} className="h-16 rounded-full bg-zinc-800 text-2xl font-medium active:bg-zinc-700">1</button>
        <button onClick={() => handleNum('2')} className="h-16 rounded-full bg-zinc-800 text-2xl font-medium active:bg-zinc-700">2</button>
        <button onClick={() => handleNum('3')} className="h-16 rounded-full bg-zinc-800 text-2xl font-medium active:bg-zinc-700">3</button>
        <button onClick={() => handleOp('+')} className="h-16 rounded-full bg-amber-600 text-2xl font-bold active:bg-amber-500">+</button>

        <button onClick={() => handleNum('0')} className="h-16 rounded-full bg-zinc-800 text-2xl font-medium col-span-2 text-left pl-8 active:bg-zinc-700">0</button>
        <button onClick={() => handleNum('.')} className="h-16 rounded-full bg-zinc-800 text-2xl font-medium active:bg-zinc-700">.</button>
        <button onClick={handleEquals} className="h-16 rounded-full bg-amber-600 text-2xl font-bold active:bg-amber-500">=</button>
      </div>
    </div>
  );
};
