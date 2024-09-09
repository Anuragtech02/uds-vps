import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
}

const CustomPhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label = 'Mobile Number',
  required = false,
  error,
}) => {
  return (
    <div className="space-y-1 w-full h-full">
      <label htmlFor="phone-input" className="block text-sm font-medium text-gray-700">
        {label}{required && '*'}
      </label>
      <PhoneInput
        country={'us'}
        value={value}
        onChange={phone => onChange(phone)}
        inputProps={{
          id: 'phone-input',
          required: required,
        }}
        containerClass="w-full"
        inputClass="!w-full rounded-md border border-s-300 p-3 py-5 pl-12 h-full"
        buttonClass="rounded-l-md border border-s-300"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default CustomPhoneInput;