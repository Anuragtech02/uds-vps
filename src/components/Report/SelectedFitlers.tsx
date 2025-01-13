import React from 'react';

interface SelectedFiltersProps {
    industries: string[];
    geographies: string[];
    industriesData: {
        data: { 
            attributes: { 
                slug: string; 
                name: string; 
            }; 
        }[];
    };
    geographiesData: {
        data: { 
            attributes: { 
                slug: string; 
                name: string; 
            }; 
        }[];
    };
}

const SelectedFilters: React.FC<SelectedFiltersProps> = ({ 
    industries, 
    geographies, 
    industriesData,
    geographiesData 
}) => {
    // Get industry names from slugs
    const selectedIndustryNames = industries.map(slug => 
        industriesData?.data?.find(ind => ind.attributes.slug === slug)?.attributes.name || slug
    );

    // Get geography names from slugs
    const selectedGeographyNames = geographies.map(slug => 
        geographiesData?.data?.find(geo => geo.attributes.slug === slug)?.attributes.name || slug
    );

    // Combine all selected filters
    const allSelectedFilters = [
        ...selectedIndustryNames,
        ...selectedGeographyNames
    ];

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="overflow-hidden max-w-[220px] sm:max-w-[500px] xl:max-w-[700px]">
                    <p className="truncate">
                        {allSelectedFilters.length > 0 
                            ? allSelectedFilters.join(', ')
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