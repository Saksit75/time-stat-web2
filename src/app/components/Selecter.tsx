'use client'
import { useEffect, useState } from 'react';

interface SelecterProps {
    id: string;
    options: { value: string; label: string }[];
    defaultValue?: { value: string; label: string }[];
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export default function Selecter({
    id = 'selecter',
    options=[],
    defaultValue,
    value,
    onChange,
    disabled = false
}: SelecterProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <select
            value={value || "เลือก"}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="select w-full md:w-1/2 px-4 !rounded-box !text-black dark:!text-white disabled:opacity-70" 
            id={id}
            required
            disabled={disabled}
        >
            <option value="">เลือก</option>
            {
                options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))
            }
        </select>
    );
}
