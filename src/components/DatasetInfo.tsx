import React from 'react';
import { Database, Plane, Globe2, Brain } from 'lucide-react';

const stats = [
  {
    icon: Plane,
    label: 'Drone Images',
    value: '25,000+',
  },
  {
    icon: Globe2,
    label: 'Satellite Images',
    value: '50,000+',
  },
  {
    icon: Database,
    label: 'Total Dataset Size',
    value: '100GB+',
  },
  {
    icon: Brain,
    label: 'AI Model Parameters',
    value: '1.5B+',
  },
];

export default function DatasetInfo() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-7xl">
      {stats.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <Icon className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">{value}</h3>
          <p className="text-sm text-gray-600 text-center">{label}</p>
        </div>
      ))}
    </div>
  );
}