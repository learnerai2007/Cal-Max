import React from 'react';
import { CalculatorDef, CalculatorInput } from '../types';
import { TextField, SliderField } from './ui/Input';

interface CalculatorFormProps {
  calculator: CalculatorDef;
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ calculator, values, onChange }) => {
  const renderInput = (input: CalculatorInput) => {
    switch (input.type) {
      case 'slider':
        return (
          <SliderField
            key={input.id}
            label={input.label}
            min={input.min || 0}
            max={input.max || 100}
            step={input.step || 1}
            unit={input.unit}
            value={values[input.id] ?? input.defaultValue}
            onChange={(e) => onChange(input.id, Number(e.target.value))}
          />
        );
      case 'select':
        return (
          <div key={input.id} className="flex flex-col space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-0.5">{input.label}</label>
            <select
              value={values[input.id] ?? input.defaultValue}
              onChange={(e) => onChange(input.id, e.target.value)}
              className="block w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
            >
              {input.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        );
      case 'date':
        return (
          <TextField
            key={input.id}
            label={input.label}
            type="date"
            value={values[input.id] ?? input.defaultValue}
            onChange={(e) => onChange(input.id, e.target.value)}
          />
        );
      default:
        // Text, Number, Currency handled by TextField
        return (
          <TextField
            key={input.id}
            label={input.label}
            type={input.type === 'number' || input.type === 'currency' ? 'number' : 'text'}
            unit={input.unit}
            value={values[input.id] ?? input.defaultValue}
            onChange={(e) => onChange(input.id, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {calculator.inputs.map(renderInput)}
      </div>
    </div>
  );
};