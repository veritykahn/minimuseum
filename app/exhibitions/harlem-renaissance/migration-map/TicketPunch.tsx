'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { Celebration } from '@/components/games/feedback/FeedbackKit';
import { srOnly } from '@/lib/a11y';
import { TICKET_QUESTIONS, questionFor, stampCount, ticketComplete, type TicketState } from './ticket';

/** The short names printed on the ticket's stamps. */
export const STAMP_NAMES: Record<string, string> = {
  delta: 'Delta',
  'new-orleans': 'New Orleans',
  memphis: 'Memphis',
  'st-louis': 'St. Louis',
  chicago: 'Chicago',
  harlem: 'Harlem',
};

type Colors = { main: string; light: string; bg: string };

/**
 * The ticket: one stamp for each stop, filling up as the train goes north.
 * Harlem is the last stamp.
 */
export function TicketStrip({ ticket, colors, justStamped }: { ticket: TicketState; colors: readonly Colors[]; justStamped?: string | null }) {
  const n = stampCount(ticket);
  return (
    <div className="mg-ticket-strip">
      <p className="mg-ticket-strip-title">
        Your ticket <span className="mg-ticket-strip-count">{n} of {TICKET_QUESTIONS.length} stamps</span>
      </p>
      <ol className="mg-stamps" aria-label="Your ticket">
        {TICKET_QUESTIONS.map((q, i) => {
          const on = !!ticket.stamps[q.cityId];
          return (
            <li
              key={q.cityId}
              className={`mg-stamp ${on ? 'on' : ''} ${justStamped === q.cityId ? 'fresh' : ''}`}
              style={{ '--stamp': colors[i]?.main, '--stamp-light': colors[i]?.light } as CSSProperties}
              data-stamped={on ? 'true' : 'false'}
            >
              <span className="mg-stamp-mark" aria-hidden="true">{on ? '★' : i + 1}</span>
              <span className="mg-stamp-name">{STAMP_NAMES[q.cityId]}</span>
              <span style={srOnly}>{on ? ': stamped' : ': not yet stamped'}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * At each stop: the question from this city's panel. A right answer punches
 * the stamp; a wrong one is set aside and the student tries again.
 */
export default function TicketPunch({
  cityId,
  ticket,
  colors,
  justStamped,
  lastWrong,
  onAnswer,
}: {
  cityId: string;
  ticket: TicketState;
  colors: readonly Colors[];
  /** The city stamped by the latest answer, for its arrival animation. */
  justStamped: string | null;
  /** The latest wrong answer here, for the message. */
  lastWrong: string | null;
  onAnswer: (choice: string) => void;
}) {
  const q = questionFor(cityId);
  const stamped = !!ticket.stamps[cityId];
  const tried = ticket.misses[cityId] ?? [];
  const complete = ticketComplete(ticket);

  // After a stamp, the buttons go: keep keyboard focus on the result.
  const doneRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (justStamped === cityId) doneRef.current?.focus({ preventScroll: true });
  }, [justStamped, cityId]);

  if (!q) return null;
  const titleId = `mg-punch-title-${cityId}`;

  return (
    <section className="mg-punch" aria-labelledby={titleId}>
      <h3 className="mg-punch-label" id={titleId}>Punch your ticket</h3>
      <TicketStrip ticket={ticket} colors={colors} justStamped={justStamped} />

      {stamped ? (
        <p className="mg-punch-done" ref={doneRef} tabIndex={-1}>
          <span className="mg-punch-done-mark" aria-hidden="true">{'★'}</span>{' '}
          {complete
            ? 'Ticket complete: all six stamps, from the Delta to Harlem!'
            : `Stamped! ${q.answer} is right. ${STAMP_NAMES[cityId]} is on your ticket.`}
        </p>
      ) : (
        <>
          <p className="mg-punch-q" id={`${titleId}-q`}>{q.question}</p>
          <p className="mg-punch-hint">The answer is in this stop&rsquo;s story.</p>
          <div className="mg-punch-options" role="group" aria-labelledby={`${titleId}-q`}>
            {q.options.map((o) => {
              const missed = tried.includes(o);
              return (
                <button
                  key={o}
                  type="button"
                  className={`mg-punch-option ${missed ? 'missed' : ''}`}
                  aria-disabled={missed || undefined}
                  onClick={() => {
                    if (!missed) onAnswer(o);
                  }}
                >
                  {o}
                  {missed && <span style={srOnly}> (not this one)</span>}
                </button>
              );
            })}
          </div>
        </>
      )}

      <div style={srOnly} role="status" aria-live="polite">
        {stamped && justStamped === cityId
          ? complete
            ? 'Stamped. Your ticket is complete.'
            : `Stamped. ${stampCount(ticket)} of ${TICKET_QUESTIONS.length} stamps.`
          : !stamped && lastWrong
            ? `Not ${lastWrong}. Read the story again and try another.`
            : ''}
      </div>
      {!stamped && lastWrong && (
        <p className="mg-punch-miss" aria-hidden="true">
          Not quite. Read the story again and try another.
        </p>
      )}
      {complete && justStamped === cityId && <Celebration />}
    </section>
  );
}
