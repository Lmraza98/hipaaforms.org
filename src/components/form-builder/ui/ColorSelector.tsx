'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';

interface ColorSelectorProps {
    label?: string;
    /** Current colour value in HEX format (e.g. #561ecb) */
    value: string;
    /** Callback fired when the user picks a new colour. Receives HEX string. */
    onChange: (hex: string) => void;
    /** Optional class names for the wrapper */
    className?: string;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ label, value, onChange, className }) => {
    // The typings for `useColor` are a bit loose; passing a single hex string keeps TS happy.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [color, setColor] = useColor(value || '#000000');

    const handleChange = (newColor: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setColor(newColor);
        onChange(newColor.hex);
    };

    return (
        <div className={className}>
            {label && (
                <label className="block mb-1.5 font-medium text-gray-700 text-sm">
                    {label}
                </label>
            )}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore – library type definitions may not include these props but they exist at runtime */}
            <ColorPicker
                hideInput={['hex', 'hsv', 'rgb', 'rgb']}
                color={color} onChange={handleChange}
            />
        </div>
    );
};

export default ColorSelector; 