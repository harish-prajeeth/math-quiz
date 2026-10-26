export function Chest({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} disabled={open} aria-label={open ? "Chest opened" : "Open chest"} className="mx-auto block cursor-pointer">
      <svg viewBox="0 0 160 130" className="w-56">
        {open && <circle cx="80" cy="50" r="38" fill="var(--world-glow)" opacity="0.45" />}
        <rect x="20" y="60" width="120" height="60" rx="10" fill="#FFB627" stroke="#1B1F4B" strokeWidth="3" />
        <g style={{ transformOrigin: "20px 60px", transformBox: "view-box", transform: open ? "rotate(-70deg)" : "none", transition: "transform 500ms" }}>
          <path d="M20 60 Q20 20 80 20 Q140 20 140 60 Z" fill="#E08A00" stroke="#1B1F4B" strokeWidth="3" />
        </g>
        <rect x="70" y="58" width="20" height="22" rx="4" fill="#fff" stroke="#1B1F4B" strokeWidth="3" />
      </svg>
    </button>
  );
}
