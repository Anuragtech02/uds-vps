'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface Industry {
  attributes: {
    slug: string;
    name: string;
  };
}

interface ReportStoreFiltersProps {
  industries: Industry[];
  filters: string[];
}

const ReportStoreFilters: React.FC<ReportStoreFiltersProps> = ({ industries, filters }) => {
  const router = useRouter();

  const handleToggleFilter = (industrySlug: string) => {
    const newFilters = filters.includes(industrySlug)
      ? filters.filter(slug => slug !== industrySlug)
      : [...filters, industrySlug];

    router.push(`/report-store?filter=${newFilters.join(',')}&page=1`);
  };

  return (
    <div className="sticky top-48 flex-[0.3] space-y-4 rounded-xl bg-white p-6">
      <h2 className="text-[1.625rem] font-medium">Reports by industry</h2>

      <div className="mt-2 space-y-4">
        {industries.map(({ attributes: { slug, name } }) => (
          <div className="flex items-center gap-4" key={slug}>
            <input
              type="checkbox"
              id={name}
              checked={filters?.includes(slug)}
              onChange={() => handleToggleFilter(slug)}
            />
            <label htmlFor={name} className="block cursor-pointer">
              {name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportStoreFilters;