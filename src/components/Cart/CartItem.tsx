import { FC } from 'react';
import { IoCloseCircle } from 'react-icons/io5';

interface CartItemProps {
   name: string;
   price: number;
   img?: string;
   quantity: number;
   selectedLicense: any;
   report: any;
   handleRemoveItem: (id: number) => void;
   handleChangeQuantity: (id: number, quantity: number) => void;
   handleChangeLicense: (id: number, license: any) => void;
}

const CartItem: FC<CartItemProps> = ({
   report,
   quantity,
   selectedLicense,
   handleRemoveItem,
   handleChangeQuantity,
   handleChangeLicense,
}) => {
   let name = report?.title,
      price = selectedLicense?.price?.amount,
      img = report?.highlightImage?.data?.attributes?.url || "/api/placeholder/64/64";

   return (
      <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-200 py-4 mt-2 first:pt-0 last:border-0 last:pb-0">
         {/* Left section with delete, image, and title */}
         <div className="flex items-center gap-4 w-full sm:w-2/5">
            <button
               title='Remove item'
               onClick={() => handleRemoveItem(report?.id)}
               className="text-gray-500 hover:text-gray-700 transition-colors"
            >
               <IoCloseCircle className="w-5 h-5" />
            </button>
            
            <img
               src={img}
               alt={name}
               className="w-16 h-16 object-cover rounded border border-gray-300"
            />
            
            <h5 className="text-gray-900 font-medium flex-1 line-clamp-2">
               {name}
            </h5>
         </div>

         {/* Middle section with license selection */}
         <div className="w-full sm:w-1/5">
            <select
               aria-label="Select license type"
               value={selectedLicense?.title}
               onChange={(e) => {
                  const newLicense = report.variants.find(
                     (variant: any) => variant.title === e.target.value
                  );
                  handleChangeLicense(report.id, newLicense);
               }}
               className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        text-gray-700 text-sm"
            >
               {report.variants.map((variant: any) => (
                  <option key={variant.id} value={variant.title}>
                     {variant.title} - ${variant.price.amount.toLocaleString()}
                  </option>
               ))}
            </select>
         </div>

         {/* Right section with price and subtotal */}
         <div className="flex items-center justify-end gap-8 w-full sm:w-2/5">
            <div className="text-gray-900 font-medium">
               ${price?.toFixed(2)}
            </div>

            <div className="text-gray-900 font-medium text-right min-w-[80px]">
               ${(price * quantity).toFixed(2)}
            </div>
         </div>
      </div>
   );
};

export default CartItem;