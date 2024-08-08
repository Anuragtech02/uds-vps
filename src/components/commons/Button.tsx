import { FC } from 'react';

const variantStyles = {
   primary: 'bg-white text-blue-2',
   secondary: 'bg-blue-2 text-white',
   light: 'bg-white border border-blue-1 text-blue-1 ',
   danger: 'bg-red-500 hover:bg-red-600 text-white',
   success: 'bg-green-500 hover:bg-green-600 text-white',
};

const sizeStyles = {
   small: 'px-3 py-2 text-xs md:text-sm ',
   medium: 'px-4 py-2  md:text-lg',
   large: 'px-6 py-3 md:text-lg',
};

interface ButtonProps {
   children: React.ReactNode;
   variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'light';
   size?: 'small' | 'medium' | 'large';
   icon?: React.ReactNode;
   className?: string;
   onClick?: () => void;
}

const Button: FC<ButtonProps> = ({
   children,
   variant = 'primary',
   size = 'medium',
   icon,
   className,
   ...props
}) => {
   return (
      <button
         className={`rounded-md font-medium transition-colors duration-200 ${
            variantStyles[variant]
         } ${sizeStyles[size]} ${className}`}
         {...props}
      >
         <span className='flex items-center justify-center'>
            {children}
            {icon && <span className='ml-4'>{icon}</span>}
         </span>
      </button>
   );
};

export default Button;
