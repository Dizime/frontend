import React from "react";

export default function TextBox({ placeholder, value, onChange, label, id, type, required, error }: { placeholder?: string, value: string, onChange: (value: unknown) => void, label?: string, id: string, type?: JSX.IntrinsicElements["input"]["type"], required?: boolean, error?: string | null }) {
  return (
    <div className="mb-2 mt-2 flex flex-col">
      {label && <label htmlFor={id} className={`text-${error ? "danger":"white"} font-medium`}>{label} <span className="text-danger text-sm italic">- {error}</span></label>}
      <input type={type || "text"} placeholder={placeholder} value={value} onChange={onChange} id={id} className={`bg-gray-50 border border-gray-300 text-${error ? "red":"gray"}-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-${error ? "red":"white"} dark:focus:ring-blue-500 dark:focus:border-blue-500`} required={required} />
    </div>
  )
}