import React from 'react';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import type { DiscoveryFilters, DiscoveryOptions } from '../../types/discovery';

interface DiscoveryFiltersPanelProps {
  filters: DiscoveryFilters;
  options: DiscoveryOptions;
  activeCount: number;
  onChange: (filters: DiscoveryFilters) => void;
  onReset: () => void;
}

type ArrayFilterKey = 'aiTools' | 'skills' | 'specializations';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[11px] font-semibold text-slate-700">{children}</p>
);

export const DiscoveryFiltersPanel: React.FC<DiscoveryFiltersPanelProps> = ({
  filters,
  options,
  activeCount,
  onChange,
  onReset,
}) => {
  const toggleValue = (key: ArrayFilterKey, value: string) => {
    const current = filters[key];
    const exists = current.includes(value);
    onChange({
      ...filters,
      [key]: exists ? current.filter((item) => item !== value) : [...current, value],
    });
  };

  const renderOptions = (key: ArrayFilterKey, values: string[]) => {
    if (values.length === 0) {
      return <p className="mt-2 text-[10px] leading-4 text-slate-400">Options appear as creators complete their profiles.</p>;
    }

    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {values.slice(0, 12).map((value) => {
          const selected = filters[key].includes(value);
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggleValue(key, value)}
              className={`rounded-full border px-2.5 py-1.5 text-[10px] font-semibold transition-all ${
                selected
                  ? 'border-violet-300 bg-violet-50 text-violet-700 ring-2 ring-violet-50'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Filters</p>
            <p className="mt-0.5 text-[10px] text-slate-400">{activeCount > 0 ? `${activeCount} criteria active` : 'Refine creator signals'}</p>
          </div>
        </div>
        {activeCount > 0 && (
          <button type="button" onClick={onReset} className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-slate-800">
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <SectionTitle>Availability</SectionTitle>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {([
            ['all', 'Any status'],
            ['available', 'Available'],
            ['busy', 'Limited'],
            ['unavailable', 'Unavailable'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...filters, availability: value })}
              className={`rounded-xl border px-3 py-2 text-[10px] font-semibold transition-colors ${
                filters.availability === value
                  ? 'border-violet-300 bg-violet-50 text-violet-700'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <SectionTitle>Minimum experience</SectionTitle>
        <select
          value={filters.minExperience ?? ''}
          onChange={(event) => onChange({ ...filters, minExperience: event.target.value === '' ? null : Number(event.target.value) })}
          className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
        >
          <option value="">Any experience</option>
          <option value="1">1+ years</option>
          <option value="3">3+ years</option>
          <option value="5">5+ years</option>
          <option value="8">8+ years</option>
        </select>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <SectionTitle>AI tools</SectionTitle>
        {renderOptions('aiTools', options.aiTools)}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <SectionTitle>Skills</SectionTitle>
        {renderOptions('skills', options.skills)}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <SectionTitle>Specializations</SectionTitle>
        {renderOptions('specializations', options.specializations)}
      </div>
    </div>
  );
};
