import React, { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Check, Palette } from 'lucide-react';
import { PRESET_COLORS } from '../constants/colors';

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onChange }) => {
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const handleCustomColorClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Prevent event bubbling
    setShowCustomPicker(!showCustomPicker);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button" // Prevent form submission
            onClick={() => {
              onChange(color);
              setShowCustomPicker(false);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            style={{ backgroundColor: color }}
          >
            {selectedColor === color && (
              <Check className="w-4 h-4 text-white" />
            )}
          </button>
        ))}
        <button
          type="button" // Prevent form submission
          onClick={handleCustomColorClick}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ${
            showCustomPicker ? 'bg-indigo-500' : 'bg-gray-700'
          }`}
        >
          <Palette className="w-4 h-4 text-white" />
        </button>
      </div>
      
      {showCustomPicker && (
        <div 
          className="p-2 bg-gray-700 rounded-lg"
          onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
        >
          <HexColorPicker
            color={selectedColor}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
};