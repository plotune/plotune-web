import React, { useMemo, useState } from 'react';
import { localeCountryCode, resolveCountry, suggestCountries } from '../utils/countryMatch';

// A plain text field that suggests countries as you type -- not a long dropdown to scroll through.
// "uk", "England" or "Britain" find United Kingdom; "Turkey" or "turkiye" find Türkiye. On focus it
// already offers the visitor's own country (from the browser language) and the common ones, so most
// people pick with one tap. Keyboard: arrows move, Enter picks, Escape closes (ARIA combobox pattern).
//
// The parent owns `value` (the text) and validates it with resolveCountry() on submit; leaving the
// field also snaps an exact or single match to the proper name.
const CountryField = ({ id, value, onChange, inputRef, invalid, describedBy }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const localeCode = useMemo(() => localeCountryCode(), []);
  const suggestions = useMemo(() => suggestCountries(value, { localeCode }), [value, localeCode]);
  const listId = `${id}-suggestions`;
  const shown = open && suggestions.length > 0;

  const pick = (name) => {
    onChange(name);
    setOpen(false);
    setActive(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) { setOpen(true); setActive(0); return; }
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && shown && active >= 0) {
      e.preventDefault(); // pick, don't submit the form
      pick(suggestions[active]);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      setOpen(false);
    }
  };

  const handleBlur = () => {
    setOpen(false);
    setActive(-1);
    if (!value.trim()) return;
    const exact = resolveCountry(value);
    if (exact) { if (exact !== value) onChange(exact); return; }
    const matches = suggestCountries(value, { localeCode });
    if (matches.length === 1) onChange(matches[0]);
  };

  return (
    <div className="country-field">
      <input
        id={id}
        ref={inputRef}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={shown}
        aria-controls={listId}
        aria-activedescendant={shown && active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="country-name"
        autoCapitalize="words"
        spellCheck={false}
        placeholder="Start typing, e.g. Germany"
        value={value}
        maxLength={80}
        onFocus={() => setOpen(true)}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(e.target.value.trim() ? 0 : -1); }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        aria-invalid={invalid ? 'true' : undefined}
        aria-describedby={describedBy}
      />
      <ul id={listId} role="listbox" aria-label="Countries" className="country-suggestions" hidden={!shown}>
        {suggestions.map((name, i) => (
          <li
            key={name}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === active}
            className={i === active ? 'is-active' : undefined}
            // mousedown, not click: picking must happen before the input's blur closes the list
            onMouseDown={(e) => { e.preventDefault(); pick(name); }}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryField;
