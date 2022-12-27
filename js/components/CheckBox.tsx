import React from "react";

export default function CheckBox({ checked, onChange, label, id, required, error }: { checked: boolean, onChange: (value: unknown) => void, label: string, id: string, required?: boolean, error?: string | null }) {
  return (
    <div className="mb-2 mt-2 flex items-start">
      <div className="flex items-center h-5">
        <input type="checkbox" checked={checked} onChange={onChange} id={id} className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" />
      </div>
      <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 select-none">{label}{error && <><br /><span className="text-danger italic">{error}</span></>}</label>
    </div>
  )
}