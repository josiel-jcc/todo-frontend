interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 100, className = '' }: LogoProps) => {
  // Generate unique IDs for gradients to avoid conflicts when multiple logos are rendered
  const gradientId = `blueGradient-${size}`;
  const greenGradientId = `greenGradient-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-sm ${className}`}
      aria-label="Logo do App de Tarefas"
      role="img"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4facfe" />
          <stop offset="100%" stopColor="#0033ad" />
        </linearGradient>
        <linearGradient id={greenGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>

      {/* Estrutura da Casa/Container */}
      <path
        d="M20 45V80H80V45M10 50L50 15L90 50"
        stroke={`url(#${gradientId})`}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Checkmark Integrado */}
      <path
        d="M35 55L45 65L75 35"
        stroke={`url(#${greenGradientId})`}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
