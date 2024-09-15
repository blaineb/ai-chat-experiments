interface WeatherCardProps {
  location?: string;
  time?: string;
  date?: string;
  temperature?: number;
}

const defaultProps: WeatherCardProps = {
  location: "Unknown Location",
  time: "--:--",
  date: "--/--",
  temperature: 0
}

export default function WeatherCard(props: WeatherCardProps = defaultProps) {
  const { location, time, date, temperature } = { ...defaultProps, ...props };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-1">{location}</h2>
          <p className="text-lg text-gray-600">{time} • {date}</p>
        </div>
        <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="30" fill="#FFD700" />
          <path d="M70 65 Q 80 55, 90 65 Q 100 75, 90 85 Q 80 95, 70 85 Q 60 75, 70 65 Z" fill="#E0E0E0" />
        </svg>
      </div>
      <div className="text-6xl font-bold">
        {temperature}°C
      </div>
    </div>
  )
}