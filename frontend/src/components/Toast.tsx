type ToastProps = { open: boolean; title: string; message: string; };

function SitcomScienceBadge() {
  return (
    <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true">
      <circle cx="32" cy="18" r="8" fill="#0f172a" />
      <path d="M20 48c3-9 8-13 12-13s9 4 12 13" fill="#0f172a" />
      <path d="M32 4l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#7c3aed" />
      <circle cx="28" cy="18" r="1.2" fill="#f8fafc" />
      <circle cx="36" cy="18" r="1.2" fill="#f8fafc" />
    </svg>
  );
}

export default function Toast({ open, title, message }: ToastProps) {
  if (!open) return null;
  return (
    <div className="toast-host" role="status" aria-live="polite">
      <div className="toast-card">
        <div className="toast-visual"><SitcomScienceBadge /></div>
        <div>
          <div className="toast-title">{title}</div>
          <div className="toast-message">{message}</div>
        </div>
      </div>
    </div>
  );
}
