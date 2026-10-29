'use client';

import { forwardRef, useMemo, useState, type ReactNode, type UIEvent } from 'react';
import { nibPath, SIG_ASPECT, type Stroke } from './signing';
import {
  DECLARATION_BODY,
  DECLARATION_HEAD,
  DECLARATION_SIGNERS,
  DECLARATION_SOURCE,
  DECLARATION_TITLE,
  OWN_DECLARATIONS,
  WORDING_COMING_SOON,
} from './declaration';

/*
 * The parchment the visitor signs, set in type at a size to read: the
 * Declaration in the National Archives' words, or the owner's own
 * declarations for a class and for a student. It scrolls inside itself (the
 * page stays still), and the line to sign on is at its foot, under the
 * signers of 1776. A class's parchment takes many names; a student's, one.
 * The same parchment, without its scrolling or its inputs, is what prints.
 */

export type Doc = 'declaration' | 'class' | 'mine';

/** A signature as signed: drawn with the quill, or typed; and where the signer is from. */
export type Signer = { strokes: Stroke[]; typed: string; address: string };

export const hasSigned = (s: Signer) => s.strokes.length > 0 || s.typed.trim().length > 0;

const SIG_W = 700;

type Props = {
  doc: Doc;
  /** The names signed on it so far. */
  signers: Signer[];
  /** The line to sign on (the quill's canvas), while signing. */
  pad?: ReactNode;
  /** While typing a name, it is set on the line as it is typed. */
  typing?: string;
  address?: string;
  /** What the class or the student has written. */
  written?: string;
  onWritten?: (text: string) => void;
  /** The class's name, set under its declaration. */
  classLine?: string;
  /** For the printer: no scrolling, no inputs. */
  print?: boolean;
};

const Parchment = forwardRef<HTMLDivElement, Props>(function Parchment(
  { doc, signers, pad, typing = '', address = '', written = '', onWritten, classLine = '', print = false },
  ref,
) {
  const [atFoot, setAtFoot] = useState(false);
  const own = doc === 'declaration' ? null : OWN_DECLARATIONS[doc];
  const title = own ? (own.title ?? own.name) : DECLARATION_TITLE;

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setAtFoot(el.scrollTop + el.clientHeight >= el.scrollHeight - 160);
  };

  const label =
    doc === 'declaration'
      ? 'The Declaration of Independence, in the National Archives’ transcription. Scroll inside the parchment to read it; the line to sign on is at its foot.'
      : `${own!.name}. Write on the parchment, and sign at its foot.`;

  return (
    <div className="aps-parch" data-doc={doc} data-print={print || undefined}>
      <div
        ref={ref}
        className="aps-parch-scroll"
        role={print ? undefined : 'region'}
        aria-label={print ? undefined : label}
        tabIndex={print ? undefined : 0}
        onScroll={print ? undefined : onScroll}
      >
        {doc === 'declaration' ? (
          <>
            <p className="aps-parch-head">{DECLARATION_HEAD}</p>
            <h2 className="aps-parch-title">{title}</h2>
            {DECLARATION_BODY.map((p, i) => (
              <p key={i} className={/^(He has|He is|For )/.test(p) ? 'aps-parch-p aps-parch-grievance' : 'aps-parch-p'}>
                {p}
              </p>
            ))}
            <ol className="aps-parch-signers" aria-label="The signers of 1776, by state">
              {DECLARATION_SIGNERS.map((col, i) => (
                <li key={i} className="aps-parch-col">
                  <span className="aps-parch-state">{col.state}</span>
                  {col.names.map((n) => (
                    <span key={n} className="aps-parch-name">{n}</span>
                  ))}
                </li>
              ))}
            </ol>
          </>
        ) : (
          <>
            <h2 className="aps-parch-title aps-parch-title-own">{title}</h2>
            {own!.wording ? (
              own!.wording.map((p, i) => (
                <p key={i} className="aps-parch-p">{p}</p>
              ))
            ) : (
              <p className="aps-parch-soon">{WORDING_COMING_SOON}</p>
            )}
            {print ? (
              written.trim() && written.split(/\n+/).map((p, i) => <p key={i} className="aps-parch-p aps-parch-written">{p}</p>)
            ) : (
              <label className="aps-parch-write">
                <span className="aps-parch-write-label">{doc === 'class' ? 'Write your class’s own declaration' : 'Write your own declaration'}</span>
                <textarea value={written} onChange={(e) => onWritten?.(e.target.value)} rows={6} maxLength={1600} spellCheck />
              </label>
            )}
            {doc === 'class' && classLine.trim() && <p className="aps-parch-class">{classLine}</p>}
          </>
        )}

        <div className="aps-parch-foot">
          {signers.length > 0 && (
            <ul className="aps-parch-sigs" aria-label={doc === 'class' ? 'Signed by the class' : 'Signed'}>
              {signers.map((s, i) => (
                <li key={i}>
                  <SignatureMark signer={s} />
                </li>
              ))}
            </ul>
          )}
          {pad !== undefined && (
            <div className="aps-parch-line">
              {pad}
              {typing.trim() && (
                <svg className="aps-parch-typing" viewBox={`0 0 ${SIG_W} ${SIG_W * SIG_ASPECT}`} aria-hidden="true">
                  <text x="10" y="150" className="ap-sheet-script" fontSize="132" fill="#2b1d14">
                    {typing}
                  </text>
                </svg>
              )}
              {address.trim() && <span className="aps-parch-of">of {address.trim()}</span>}
            </div>
          )}
        </div>

        {print && doc === 'declaration' && (
          <p className="aps-parch-credit">The text: {DECLARATION_SOURCE.label}, {DECLARATION_SOURCE.href}</p>
        )}
      </div>
      {!print && pad !== undefined && !atFoot && (
        <span className="aps-parch-more" aria-hidden="true">
          Sign at the foot <span>↓</span>
        </span>
      )}
    </div>
  );
});

export default Parchment;

/** A signature on the parchment: the quill's marks, or a typed name in a flowing hand, and where the signer is from. */
export function SignatureMark({ signer }: { signer: Signer }) {
  const d = useMemo(() => nibPath(signer.strokes, SIG_W), [signer.strokes]);
  const typed = signer.typed.trim();
  const name = typed || 'A signature';
  return (
    <figure className="aps-parch-sig">
      <svg viewBox={`0 0 ${SIG_W} ${SIG_W * SIG_ASPECT}`} role="img" aria-label={typed ? `Signed: ${typed}` : 'A signature, written with the quill'}>
        {typed && !signer.strokes.length ? (
          <text x="10" y="150" className="ap-sheet-script" fontSize="132" fill="#2b1d14">
            {name}
          </text>
        ) : (
          <path d={d} fill="#2b1d14" stroke="#2b1d14" strokeWidth="1.1" />
        )}
      </svg>
      {signer.address.trim() && <figcaption className="aps-parch-of">of {signer.address.trim()}</figcaption>}
    </figure>
  );
}
