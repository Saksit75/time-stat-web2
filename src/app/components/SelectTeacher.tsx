'use client'
import { useState } from "react";
import { CircleX, ChevronDown } from "lucide-react";

const SelectTeacher = () => {
    const teachers = ["Crimson", "Amber", "Velvet"];
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const filteredTeachers = teachers.filter((t) =>
        t.toLowerCase().includes(search.toLowerCase())
    );

    const clearSearch = () => {
        setSearch("");
        setSelected("");
    };

    return (
        <div className="flex items-center justify-center gap-4">
            <label htmlFor="teacher" className="font-medium">
                คุณครู :
            </label>
            <div className="relative xs:w-full md:w-1/2">

                <div className="relative">
                    <input
                        id="teacher"
                        type="text"
                        placeholder="เลือก"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
                        className="input input-bordered w-full rounded-lg focus:ring focus:ring-blue-300 pr-10"
                    />

                    {/* Clear button */}
                    {search && (
                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()} // ป้องกัน input blur
                            onClick={clearSearch}
                            className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                        >
                            <CircleX size={18} />
                        </button>
                    )}

                    {/* Dropdown icon */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 z-10 cursor-pointer">
                        <ChevronDown size={18} />
                    </div>
                </div>

                {/* Dropdown list */}
                {isOpen && (
                    <ul className="absolute z-20 w-full border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-auto mt-2 ">
                        {filteredTeachers.length > 0 ? (
                            filteredTeachers.map((t) => (
                                <li
                                    key={t}
                                    className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer transition-colors"
                                    onClick={() => {
                                        setSelected(t);
                                        setSearch(t);
                                        setIsOpen(false);
                                    }}
                                >
                                    {t}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-400">No results</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SelectTeacher;
