import React from 'react';

const SelectedFilters = ({ industries, industriesData }: {
    industries: string[];
    industriesData: {data: { attributes: { slug: string; name: string; }; }[]};
}) => {
  console.log(industriesData)
  // Get industry names from slugs using industriesData
  const selectedIndustryNames = industries.map(slug => 
    industriesData.data.find(ind => ind.attributes.slug === slug)?.attributes.name || slug
  );

  return (
    <div>
      <div className="flex items-center">
        <div className="overflow-hidden">
          <p className="truncate max-w-[220px] sm:max-w-[500px]">
            {selectedIndustryNames.length > 0 
              ? selectedIndustryNames.join(', ')
              : 'All'}
          </p>
          <span>Reports</span>
        </div>
      </div>
    </div>
  );
};

export default SelectedFilters;