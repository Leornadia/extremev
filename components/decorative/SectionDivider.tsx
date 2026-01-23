interface SectionDividerProps {
  variant?: 'wave' | 'grass' | 'clouds' | 'hills';
  flip?: boolean;
  color?: string;
}

export function SectionDivider({
  variant = 'wave',
  flip = false,
  color = 'text-white',
}: SectionDividerProps) {
  const dividers = {
    wave: (
      <svg
        viewBox="0 0 1200 120"
        className={`w-full h-16 sm:h-20 ${color} ${flip ? 'rotate-180' : ''}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,80 350,80 600,50 C850,20 1050,80 1200,0 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    ),
    grass: (
      <svg
        viewBox="0 0 1200 120"
        className={`w-full h-16 sm:h-24 ${color} ${flip ? 'rotate-180' : ''}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 L50,80 L100,100 L150,70 L200,100 L250,85 L300,100 L350,75 L400,100 L450,80 L500,100 L550,70 L600,100 L650,85 L700,100 L750,75 L800,100 L850,80 L900,100 L950,70 L1000,100 L1050,85 L1100,100 L1150,75 L1200,100 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    ),
    clouds: (
      <svg
        viewBox="0 0 1200 120"
        className={`w-full h-20 sm:h-28 ${color} ${flip ? 'rotate-180' : ''}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 Q100,20 200,60 T400,60 Q500,20 600,60 T800,60 Q900,20 1000,60 T1200,60 L1200,120 L0,120 Z"
          fill="currentColor"
          opacity="0.3"
        />
        <path
          d="M0,80 Q150,40 300,80 T600,80 Q750,40 900,80 T1200,80 L1200,120 L0,120 Z"
          fill="currentColor"
          opacity="0.5"
        />
        <path
          d="M0,100 Q200,60 400,100 T800,100 Q1000,60 1200,100 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    ),
    hills: (
      <svg
        viewBox="0 0 1200 120"
        className={`w-full h-20 sm:h-32 ${color} ${flip ? 'rotate-180' : ''}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 Q300,0 600,100 T1200,100 L1200,120 L0,120 Z"
          fill="currentColor"
          opacity="0.5"
        />
        <path
          d="M0,110 Q400,30 800,110 T1200,110 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    ),
  };

  return (
    <div className="relative w-full overflow-hidden">{dividers[variant]}</div>
  );
}
