export const cacheRecentReports = (report: Report) => {
   const recentReports = JSON.parse(
      localStorage.getItem('recentReports') || '[]',
   );
   const existingIndex = recentReports?.findIndex(
      // @ts-ignore
      (item: any) => item?.slug === report?.slug,
   );
   if (existingIndex === -1) {
      recentReports.unshift(report);
      recentReports.splice(5);
      localStorage.setItem('recentReports', JSON.stringify(recentReports));
   }
};
export const getRecentReports = () => {
   const recentReports = localStorage.getItem('recentReports');
   return recentReports ? JSON.parse(recentReports) : [];
};
