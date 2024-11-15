export const addToCart = (data: any, selectedLicense: any) => {
   let cart = JSON.parse(localStorage.getItem('cart') || '[]');

   const existingItem = cart.find((item) => item.report.id === data.id);

   if (!existingItem) {
      cart.push({ report: data, quantity: 1, selectedLicense });
      localStorage?.setItem('cart', JSON.stringify(cart));
   }
};
export const getCart = () => {
   return JSON.parse(localStorage?.getItem('cart') || '[]');
};
export const removeItemFromCart = (reportId: number) => {
   let cart = JSON.parse(localStorage.getItem('cart') || '[]');

   const existingItemIndex = cart.findIndex(
      (item) => item.report.id === reportId,
   );

   if (existingItemIndex !== -1) {
      cart.splice(existingItemIndex, 1);

      localStorage.setItem('cart', JSON.stringify(cart));
   }
};
export const changeQuantityOfItem = (reportId: number, quantity: number) => {
   let cart = JSON.parse(localStorage.getItem('cart') || '[]');

   const existingItemIndex = cart.findIndex(
      (item) => item.report.id === reportId,
   );

   if (existingItemIndex !== -1) {
      cart[existingItemIndex] = {
         ...cart[existingItemIndex],
         quantity,
      };

      localStorage.setItem('cart', JSON.stringify(cart));
   }
};
export const getLicenseOfReport = (reportId: number) => {
   const cart = JSON.parse(localStorage?.getItem('cart') || '[]');

   const item = cart.find((item) => item.report.id === reportId);

   return item ? item.selectedLicense : null;
};

export const setLicenseOfReport = (reportId: number, selectedLicense: any) => {
   let cart = JSON.parse(localStorage.getItem('cart') || '[]');

   const existingItemIndex = cart.findIndex(
      (item) => item.report.id === reportId,
   );

   if (existingItemIndex !== -1) {
      cart[existingItemIndex] = {
         ...cart[existingItemIndex],
         selectedLicense,
      };

      localStorage.setItem('cart', JSON.stringify(cart));
   }
};

export const removeFromCart = (reportId: number) => {
   let cart = JSON.parse(localStorage.getItem('cart') || '[]');

   const existingItemIndex = cart.findIndex(
      (item) => item.report.id === reportId,
   );

   if (existingItemIndex !== -1) {
      cart.splice(existingItemIndex, 1);

      localStorage.setItem('cart', JSON.stringify(cart));
   }
};

export const changeQuantityOfReport = (reportId: number, quantity: number) => {
   let cart = JSON.parse(localStorage.getItem('cart') || '[]');

   const existingItemIndex = cart.findIndex(
      (item) => item.report.id === reportId,
   );

   if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity = quantity;

      localStorage.setItem('cart', JSON.stringify(cart));
   }
};
