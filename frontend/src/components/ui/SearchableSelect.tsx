import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface SearchableSelectOption {
  value: string;
  label: string;
  subtitle?: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  emptyMessage?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Seleccionar opción",
  disabled = false,
  className = "",
  required = false,
  emptyMessage = "No se encontraron opciones",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update filtered options when search term or options change
  useEffect(() => {
    if (!searchTerm) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus on input when opening
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm('');
    }
  };

  const handleSelectOption = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter' && filteredOptions.length === 1) {
      e.preventDefault();
      handleSelectOption(filteredOptions[0].value);
    } else if (e.key === 'ArrowDown' && filteredOptions.length > 0) {
      e.preventDefault();
      // Could implement keyboard navigation here
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm cursor-pointer
          focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
          ${isOpen ? 'border-indigo-500' : 'border-gray-300'}
          transition-colors duration-200
        `}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Buscar..."
              className="flex-1 outline-none bg-transparent text-sm"
              disabled={disabled}
            />
          ) : (
            <div className="flex-1 min-h-[20px] flex items-center">
              {selectedOption ? (
                <div>
                  <span className="text-gray-900 text-sm">{selectedOption.label}</span>
                  {selectedOption.subtitle && (
                    <span className="text-gray-500 text-xs ml-2">({selectedOption.subtitle})</span>
                  )}
                </div>
              ) : (
                <span className="text-gray-400 text-sm">{placeholder}</span>
              )}
            </div>
          )}

          <div className="flex items-center space-x-1">
            {selectedOption && !disabled && !isOpen && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
            <button type="button" className="text-gray-400 p-1">
              {isOpen ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 text-sm">
              {searchTerm ? `No se encontraron resultados para "${searchTerm}"` : emptyMessage}
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
                className={`
                  px-3 py-2 cursor-pointer hover:bg-indigo-50 hover:text-indigo-900
                  ${option.value === value ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}
                  border-b border-gray-100 last:border-b-0
                `}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{option.label}</span>
                  {option.subtitle && (
                    <span className="text-xs text-gray-500 mt-0.5">{option.subtitle}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {required && !value && (
        <input
          type="hidden"
          value=""
          required
          className="absolute inset-0 opacity-0 pointer-events-none"
        />
      )}
    </div>
  );
};

export default SearchableSelect;