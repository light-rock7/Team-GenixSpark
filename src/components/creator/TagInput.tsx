import React, { useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  helperText?: string;
  maxTags?: number;
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Type and press Enter',
  suggestions = [],
  helperText,
  maxTags = 12,
}) => {
  const [draft, setDraft] = useState('');

  const normalized = useMemo(
    () => new Set(value.map((item) => item.toLowerCase())),
    [value]
  );

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/^,+|,+$/g, '');
    if (!tag || normalized.has(tag.toLowerCase()) || value.length >= maxTags) return;
    onChange([...value, tag]);
    setDraft('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag));
  };

  const availableSuggestions = suggestions.filter(
    (item) => !normalized.has(item.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-3 mb-2">
        <label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-700">
          {label}
        </label>
        <span className="text-[10px] font-medium text-slate-400">{value.length}/{maxTags}</span>
      </div>

      <div className="rounded-xl border border-slate-300 bg-white p-2.5 shadow-sm focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
        <div className="flex flex-wrap gap-1.5 mb-2 empty:hidden">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded p-0.5 text-violet-500 hover:bg-violet-100 hover:text-violet-800"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ',') {
                event.preventDefault();
                addTag(draft);
              }
              if (event.key === 'Backspace' && !draft && value.length > 0) {
                onChange(value.slice(0, -1));
              }
            }}
            placeholder={value.length >= maxTags ? 'Tag limit reached' : placeholder}
            disabled={value.length >= maxTags}
            className="min-w-[160px] flex-1 bg-transparent px-1 py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => addTag(draft)}
            disabled={!draft.trim() || value.length >= maxTags}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label={`Add ${label}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {helperText && <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{helperText}</p>}

      {availableSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {availableSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-colors"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
