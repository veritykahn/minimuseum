'use client';

import { useEffect, useState } from 'react';
import { countdownParts } from '@/app/exhibitions/great-war/memorial/TwoMinuteSilence';
import { LIBERATION_LINE } from '../holocaust';

/*
 * The days to International Holocaust Remembrance Day, January 27, in the
 * visitor's own time: the Great War's countdown to 11:00 on November 11,
 * set quietly under the room's title. It counts to the start of the day;
 * on January 27 itself it gives way to one line, poster 1's own, that the
 * date marks the liberation of Auschwitz-Birkenau. No sound.
 */

/** True on January 27, local time. */
export function isRemembranceDay(d: Date): boolean {
  return d.getMonth() === 0 && d.getDate() === 27;
}

/** The start of the next January 27, local time, from `d` (next year's, once this year's has begun). */
export function nextRemembrance(d: Date): Date {
  const at = new Date(d.getFullYear(), 0, 27, 0, 0, 0, 0);
  if (d.getTime() >= at.getTime()) at.setFullYear(at.getFullYear() + 1);
  return at;
}

export default function Countdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (now && isRemembranceDay(now)) {
    return (
      <p className="hos-today">
        <span className="hos-today-day">Today is International Holocaust Remembrance Day.</span> {LIBERATION_LINE}
      </p>
    );
  }

  const target = now ? nextRemembrance(now) : null;
  const left = countdownParts(target && now ? target.getTime() - now.getTime() : 0);
  const units = [
    { n: left.days, label: left.days === 1 ? 'day' : 'days' },
    { n: left.hours, label: left.hours === 1 ? 'hour' : 'hours' },
    { n: left.minutes, label: left.minutes === 1 ? 'minute' : 'minutes' },
    { n: left.seconds, label: left.seconds === 1 ? 'second' : 'seconds' },
  ];
  // The spoken label changes once a minute, not every second.
  const spoken = target
    ? `${left.days} ${units[0].label}, ${left.hours} ${units[1].label} and ${left.minutes} ${units[2].label} until International Holocaust Remembrance Day, January 27, ${target.getFullYear()}`
    : undefined;

  return (
    <div className="hos-countdown">
      <div className="hos-countdown-units" role="timer" aria-label={spoken}>
        {units.map((u, i) => (
          <span key={i} className="hos-countdown-unit" aria-hidden="true">
            <span className="hos-countdown-n" suppressHydrationWarning>{now ? String(u.n).padStart(i === 0 ? 1 : 2, '0') : '–'}</span>
            <span className="hos-countdown-label">{u.label}</span>
          </span>
        ))}
      </div>
      <p className="hos-countdown-note" aria-hidden="true" suppressHydrationWarning>
        until International Holocaust Remembrance Day{target ? `, January 27, ${target.getFullYear()}` : ''}
      </p>
    </div>
  );
}
