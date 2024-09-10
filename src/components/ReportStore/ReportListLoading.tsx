import React from 'react';

const ReportListLoading: React.FC = () => {
  return (
    <div className="flex-[0.7] space-y-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-1/4 bg-gray-300 rounded mb-2"></div>
          <div className="h-20 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default ReportListLoading;