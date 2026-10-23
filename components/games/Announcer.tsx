'use client';

import { srOnly } from '@/lib/a11y';

/**
 * A polite live region that is always in the page, so changes to `message`
 * are announced (a region that mounts together with its text often is not).
 */
export default function Announcer({ message }: { message: string }) {
  return (
    <div style={srOnly} role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}
