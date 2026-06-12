import { useState } from 'react';

const Toast = ({ title, message, onClose }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="fixed bottom-5 right-5 z-50 bg-[#d9534f] text-white px-4 py-3 rounded-xl shadow-lg max-w-xs w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-sm">{title}</p>
          <p className="text-sm mt-0.5">{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`shrink-0 mt-0.5 text-white/70 hover:text-white transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Dismiss"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
