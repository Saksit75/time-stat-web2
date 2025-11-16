"use client";

import { useState, useRef, useEffect } from "react";
import { CircleX } from "lucide-react";

interface OptionType {
    label: string;
    value: string;
}

interface AutocompleteXProps {
    label?: string;
    placeholder?: string;
    options?: OptionType[];
    onInputChange?: (query: string) => void;
    onSelect?: (option: OptionType) => void;
}

export default function AutocompleteX({
    label,
    placeholder = "ค้นหา...",
    options = [],
    onInputChange,
    onSelect,
}: AutocompleteXProps) {
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFocus = () => {
        setShowSuggestions(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        onInputChange?.(value);
        setShowSuggestions(true);
    };

    const handleSelect = (option: OptionType) => {
        // setInputValue(option.label);
        // setShowSuggestions(false);
        onSelect?.(option);
    };

    const handleClear = () => {
        setInputValue("");
        onInputChange?.("");
    };

    // ✅ กรองเฉพาะตอนที่มี input เท่านั้น
    const filteredOptions = inputValue 
        ? options.filter(option =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
          )
        : options;

    return (
        <div ref={wrapperRef} className="relative w-full md:w-1/2">
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}
            
            <div className="flex items-center gap-2 border rounded-box p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 bg-base-100">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    className="grow outline-none bg-transparent"
                />
                {inputValue && (
                    <CircleX
                        className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-500 transition-colors"
                        onClick={handleClear}
                    />
                )}
            </div>

            {/* ✅ แสดง dropdown เมื่อ focus และมีข้อมูลหรือไม่มีข้อมูล */}
            {showSuggestions && (
                <ul className="absolute z-40 w-full mt-1 bg-base-200 border rounded-box shadow-lg max-h-56 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <li
                                key={`${option.value}-${index}`}
                                className="p-2 hover:bg-base-100 cursor-pointer transition-colors"
                                onClick={() => handleSelect(option)}
                            >
                                {option.label}
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-center text-gray-500">
                            ไม่พบข้อมูล
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}