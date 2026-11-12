import React from 'react';
import { PythonCodeExporter } from '../components/PythonCodeExporter';
import { solveEulerLagrangePath } from '../utils/calculusMath';

export const CodePage: React.FC = () => {
  const samplePath = solveEulerLagrangePath({ x: 1.0, y: 4.5 }, { x: 8.5, y: 1.5 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PythonCodeExporter calculatedPath={samplePath} />
    </div>
  );
};
