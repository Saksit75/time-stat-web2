'use client'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useEffect, useState } from 'react';

const animatedComponents = makeAnimated();

interface SelecterProps {
    id: string; // id แบบ string ใช้กับ label
    options: { value: string; label: string }[];
    defaultValue?: { value: string; label: string }[];
    isMulti?: boolean;
    [key: string]: any;
}

export default function Selecter({
    id,
    options,
    defaultValue,
    isMulti = false,
    ...props
}: SelecterProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <Select
            inputId={id} // 👈 ตรงนี้สำคัญ! ให้ label bind กับ input
            instanceId={id} // 👈 internal ของ react-select
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={options}
            // defaultValue={defaultValue}
            isMulti={isMulti}
            className="text-base font-semibold w-full"
            menuPlacement="top"
            {...props}
        />
    );
}
