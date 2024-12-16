export interface License {
   title: string;
   description: string;
   price: {
      amount: number;
      currency: string;
   };
}

interface Report {
   id: number;
   title: string;
   description: string;
   name: string;
   price: number;
   report: Report;
   selectedLicense: License;
   quantity: number;
}

export interface ICartItem {
   report: Report;
   quantity: number;
   selectedLicense: License | null;
}

// Utility Functions
export const addToCart = (
   data: Report,
   selectedLicense: License | null,
): void => {
   const cart: ICartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

   const existingItem = cart.find((item) => item.report.id === data.id);

   if (!existingItem) {
      cart.push({ report: data, quantity: 1, selectedLicense });
      localStorage.setItem('cart', JSON.stringify(cart));
   }
};

export const getCart = (): ICartItem[] => {
   return JSON.parse(localStorage.getItem('cart') || '[]');
};

export const changeLicenseOfReport = (reportId: number, newLicense: any) => {
   const cart = getCart();
   const updatedCart = cart.map((item: any) =>
     item?.report?.id === reportId ? { ...item, selectedLicense: newLicense } : item
   );
   localStorage.setItem('cart', JSON.stringify(updatedCart));
   return updatedCart;
 };

export const removeItemFromCart = (reportId: number): void => {
   let cart: ICartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

   cart = cart.filter((item) => item.report.id !== reportId);

   localStorage.setItem('cart', JSON.stringify(cart));
};

export const changeQuantityOfItem = (
   reportId: number,
   quantity: number,
): void => {
   const cart: ICartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

   const existingItemIndex = cart.findIndex(
      (item) => item.report.id === reportId,
   );

   if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
   }
};

export const getLicenseOfReport = (reportId: number): License | null => {
   const cart: ICartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

   const item = cart.find((item) => item.report.id === reportId);

   return item ? item.selectedLicense : null;
};

export const setLicenseOfReport = (
   reportId: number,
   selectedLicense: License,
): void => {
   const cart: ICartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

   const existingItemIndex = cart.findIndex(
      (item) => item.report.id === reportId,
   );

   if (existingItemIndex !== -1) {
      cart[existingItemIndex].selectedLicense = selectedLicense;
      localStorage.setItem('cart', JSON.stringify(cart));
   }
};

export const removeFromCart = (reportId: number): void => {
   let cart: ICartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

   cart = cart.filter((item) => item.report.id !== reportId);

   localStorage.setItem('cart', JSON.stringify(cart));
};

export const changeQuantityOfReport = (
   reportId: number,
   quantity: number,
): void => {
   const cart: ICartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

   const existingItemIndex = cart.findIndex(
      (item) => item.report.id === reportId,
   );

   if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
   }
};

export const resetCart = (): void => {
   localStorage.removeItem('cart');
};
