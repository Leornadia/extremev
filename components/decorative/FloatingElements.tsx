interface FloatingElementsProps {
  variant?: 'clouds' | 'birds' | 'butterflies' | 'leaves';
  count?: number;
}

export function FloatingElements({
  variant = 'clouds',
  count = 3,
}: FloatingElementsProps) {
  const elements = {
    clouds: (index: number) => (
      <div
        key={index}
        className="absolute opacity-20 animate-float"
        style={{
          top: `${20 + index * 25}%`,
          left: `${10 + index * 30}%`,
          animationDelay: `${index * 2}s`,
          animationDuration: `${15 + index * 5}s`,
        }}
      >
        <svg className="w-24 h-16 text-accent-sky" viewBox="0 0 100 60">
          <ellipse
            cx="25"
            cy="40"
            rx="20"
            ry="15"
            fill="currentColor"
            opacity="0.6"
          />
          <ellipse
            cx="50"
            cy="30"
            rx="25"
            ry="20"
            fill="currentColor"
            opacity="0.8"
          />
          <ellipse
            cx="70"
            cy="40"
            rx="20"
            ry="15"
            fill="currentColor"
            opacity="0.7"
          />
        </svg>
      </div>
    ),
    birds: (index: number) => (
      <div
        key={index}
        className="absolute opacity-30 animate-fly"
        style={{
          top: `${15 + index * 20}%`,
          right: `${5 + index * 25}%`,
          animationDelay: `${index * 1.5}s`,
          animationDuration: `${10 + index * 3}s`,
        }}
      >
        <svg
          className="w-8 h-6 text-neutral-700"
          viewBox="0 0 40 30"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M5,15 Q10,10 15,15 M25,15 Q30,10 35,15"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    butterflies: (index: number) => (
      <div
        key={index}
        className="absolute opacity-25 animate-flutter"
        style={{
          top: `${25 + index * 20}%`,
          left: `${15 + index * 30}%`,
          animationDelay: `${index * 1}s`,
          animationDuration: `${8 + index * 2}s`,
        }}
      >
        <svg
          className="w-6 h-6 text-accent-coral"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12,2C11.5,2 11,2.19 10.59,2.59L2.59,10.59C1.8,11.37 1.8,12.63 2.59,13.41L10.59,21.41C11.37,22.2 12.63,22.2 13.41,21.41L21.41,13.41C22.2,12.63 22.2,11.37 21.41,10.59L13.41,2.59C13,2.19 12.5,2 12,2M12,4L20,12L12,20L4,12L12,4M7.5,8A1.5,1.5 0 0,0 6,9.5A1.5,1.5 0 0,0 7.5,11A1.5,1.5 0 0,0 9,9.5A1.5,1.5 0 0,0 7.5,8M16.5,8A1.5,1.5 0 0,0 15,9.5A1.5,1.5 0 0,0 16.5,11A1.5,1.5 0 0,0 18,9.5A1.5,1.5 0 0,0 16.5,8Z" />
        </svg>
      </div>
    ),
    leaves: (index: number) => (
      <div
        key={index}
        className="absolute opacity-20 animate-fall"
        style={{
          top: `${-10 + index * 5}%`,
          left: `${20 + index * 25}%`,
          animationDelay: `${index * 2}s`,
          animationDuration: `${12 + index * 4}s`,
        }}
      >
        <svg
          className="w-5 h-5 text-primary-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      </div>
    ),
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) =>
        elements[variant](index)
      )}
    </>
  );
}
