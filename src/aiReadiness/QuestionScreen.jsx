import React, { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { OTHER_ID } from './questions';

// One question, one screen (Chunking / Cognitive Load). The *card* is the touch target
// (Fitts: full-width, >= 56px tall, 12px apart) and the checkbox/radio glyph is purely visual.
// Selected state is carried by three redundant cues -- thicker border, tinted fill and a
// filled check glyph -- so it never relies on colour alone.

const Indicator = ({ type, selected }) => (
  <span
    aria-hidden="true"
    className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 transition-colors duration-100 ${
      type === 'single' ? 'rounded-full' : 'rounded-md'
    } ${selected ? 'border-primary bg-primary text-dark-bg' : 'border-white/25 bg-transparent'}`}
  >
    {selected && <FiCheck className="text-sm" strokeWidth={3.5} />}
  </span>
);

const OptionCard = ({ option, type, selected, disabled, onSelect }) => (
  <button
    type="button"
    role={type === 'single' ? 'radio' : 'checkbox'}
    aria-checked={selected}
    aria-disabled={disabled || undefined}
    onClick={() => { if (!disabled) onSelect(option.id); }}
    className={`flex min-h-[56px] w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg ${
      selected
        ? 'border-primary bg-primary/15 text-light-text'
        : disabled
          ? 'cursor-not-allowed border-white/5 bg-dark-card/40 text-gray-text/50'
          : 'border-white/10 bg-dark-card text-dark-text hover:border-primary/50 active:bg-primary/10'
    }`}
  >
    <span className="min-w-0">
      <span className={`block text-base leading-snug ${selected ? 'font-semibold' : 'font-medium'}`}>{option.label}</span>
      {option.description && (
        <span className={`mt-1 block text-sm leading-snug ${disabled ? 'text-gray-text/50' : 'text-gray-text'}`}>{option.description}</span>
      )}
    </span>
    <Indicator type={type} selected={selected} />
  </button>
);

const QuestionScreen = ({
  question,
  value,
  otherText,
  advancing,
  isLast,
  onSelect,
  onOtherText,
  onContinue,
  headingRef,
}) => {
  const isSingle = question.type === 'single';
  const selected = isSingle ? (value ? [value] : []) : value;
  const count = selected.length;
  const atLimit = Boolean(question.max) && count >= question.max;
  const otherSelected = !isSingle && selected.includes(OTHER_ID);
  const [inputFocused, setInputFocused] = useState(false);
  const otherInputRef = useRef(null);
  const blurTimerRef = useRef(null);
  useEffect(() => () => window.clearTimeout(blurTimerRef.current), []);

  // While the Other field has focus the bar sits in normal flow (so the on-screen keyboard can't
  // float it over the field). Switching back to sticky is delayed: tapping Continue blurs the field
  // first, and an instant switch would move the button out from under the finger mid-tap.
  const handleInputFocus = () => {
    window.clearTimeout(blurTimerRef.current);
    setInputFocused(true);
  };
  const handleInputBlur = () => {
    window.clearTimeout(blurTimerRef.current);
    blurTimerRef.current = window.setTimeout(() => setInputFocused(false), 250);
  };

  // When "Other" is revealed, bring the field into view without stealing focus: auto-focus
  // would pop the keyboard on a question the visitor may be able to answer from the cards alone.
  useEffect(() => {
    if (otherSelected && otherInputRef.current) {
      otherInputRef.current.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
    }
  }, [otherSelected]);

  const showBar = !isSingle || (count > 0 && !advancing);
  const status = isSingle
    ? ''
    : question.max
      ? `${count} of ${question.max} selected`
      : count ? `${count} selected` : 'Select at least one';

  return (
    <div className="flex flex-1 flex-col">
      {/* Bottom padding reserves room for the fixed action bar, so it never covers the last option. */}
      <div className={`ai-step flex-1 ${showBar && !inputFocused ? 'pb-44' : 'pb-8'}`}>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-semibold leading-snug text-light-text outline-none sm:text-3xl"
        >
          {question.title}
        </h1>
        <p className="mt-2 text-base text-gray-text">{question.subtitle}</p>

        <div
          role={isSingle ? 'radiogroup' : 'group'}
          onKeyDown={isSingle ? (e) => {
            const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
            if (!(e.key in keys)) return;
            const radios = [...e.currentTarget.querySelectorAll('[role="radio"]')];
            const at = radios.indexOf(document.activeElement);
            if (at === -1) return;
            e.preventDefault();
            radios[(at + keys[e.key] + radios.length) % radios.length].focus();
          } : undefined}
          aria-label={question.title}
          className={`mt-6 grid gap-3 ${question.layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}
        >
          {question.options.map((option) => {
            const isSelected = selected.includes(option.id);
            return (
              <OptionCard
                key={option.id}
                option={option}
                type={question.type}
                selected={isSelected}
                // The 2-selection limit is communicated up front (counter + dimmed cards)
                // rather than punished with an error after a third tap.
                disabled={atLimit && !isSelected}
                onSelect={onSelect}
              />
            );
          })}
        </div>

        {atLimit && question.max && (
          <p className="mt-3 text-sm text-primary" role="status">
            That’s {question.max}. Tap a selected one to swap it.
          </p>
        )}

        {otherSelected && question.other && (
          <div className="mt-4 rounded-xl border border-white/10 bg-dark-card/60 p-4">
            <label htmlFor={`other-${question.id}`} className="block text-sm font-medium text-light-text">
              {question.other.label} <span className="font-normal text-gray-text">(optional)</span>
            </label>
            <input
              id={`other-${question.id}`}
              ref={otherInputRef}
              type="text"
              value={otherText}
              maxLength={120}
              enterKeyHint="done"
              autoComplete="off"
              placeholder={question.other.placeholder}
              onChange={(e) => onOtherText(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
              // 16px minimum: anything smaller makes iOS Safari zoom the page on focus.
              className="mt-2 h-12 w-full rounded-lg border border-white/15 bg-dark-bg px-3 text-base text-light-text placeholder:text-gray-text/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="mt-2 text-xs leading-5 text-gray-text">{question.other.hint}</p>
          </div>
        )}
      </div>

      {showBar && (
        // Thumb zone: the primary action is pinned to the bottom of the screen.
        //  - position: FIXED, not sticky. Site-wide CSS (src/research/Research.css, loaded on every
        //    page) sets overflow-x:hidden on html/body/#root/.app below 800px, which turns them into
        //    scroll containers; a sticky bar then never pins on phones.
        //  - Rendered outside the .ai-step wrapper: that wrapper animates `transform`, which would
        //    make it the containing block of a fixed child during the step transition.
        //  - While the Other text field has focus the bar drops back into normal flow, so the
        //    on-screen keyboard can never leave it floating over the field.
        <div
          className={`${inputFocused ? 'relative -mx-5' : 'fixed inset-x-0 bottom-0 z-20'} border-t border-white/10 bg-dark-bg/95 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur`}
        >
          <div className="mx-auto w-full max-w-xl px-5">
            {status && (
              <p aria-live="polite" className={`mb-2 text-center text-sm ${atLimit ? 'font-medium text-primary' : 'text-gray-text'}`}>{status}</p>
            )}
            <button
              type="button"
              onClick={onContinue}
              disabled={count === 0}
              className={`flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg ${
                count === 0
                  ? 'cursor-not-allowed bg-white/10 text-gray-text'
                  : 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark'
              }`}
            >
              {isLast ? 'See my score' : 'Continue'}
              <FiArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionScreen;
