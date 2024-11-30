import React, { useId } from 'react';

function Select({ options, label, placeholder = "Select an option", error, className, ...props }, ref) {
    const id = useId();
    
    return (
        <div className="w-full space-y-2">
            {label && (
                <label htmlFor={id} className="block text-sm font-semibold text-white">
                    {label}
                </label>
            )}
            <select
                {...props}
                id={id}
                ref={ref}
                defaultValue=""
                className={`px-4 py-2 rounded-lg bg-white text-gray-800 border w-full outline-none transition duration-200 ease-in-out
                    ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'} ${className}`}
            >
                <option value="" disabled hidden>{placeholder}</option>
                {options?.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
    );
}

export default React.forwardRef(Select);
