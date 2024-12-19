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
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <div className="overflow-hidden max-w-[220px] sm:max-w-[500px] xl:max-w-[700px]">
          <p className="truncate">
            {selectedIndustryNames.length > 0 
              ? selectedIndustryNames.join(', ')
              : 'All'}
            <span className="ml-1">Reports</span>
          </p>
        </div>
        <p className='block sm:hidden'>Reports</p>
      </div>
    </div>
  );
};

export default SelectedFilters;