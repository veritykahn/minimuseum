'use client';

import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { nibPath, SIG_ASPECT, type Stroke } from './signing';
import {
  DECLARATION_BODY,
  DECLARATION_HEAD,
  DECLARATION_SIGNERS,
  DECLARATION_SOURCE,
  DECLARATION_TITLE,
  OWN_DECLARATIONS,
  ownTitle,
  ownWording,
  PRINT_SIGNATURE_LINES,
  type OwnFill,
  type VersionId,
} from './declaration';

/*
 * The parchment the visitor signs, set in type at a size to read: the
 * Declaration in the National Archives' words, or the owner's own
 * declarations for a class and for a student. It scrolls inside itself (the
 * page stays still), and the line to sign on is at its foot, under the
 * signers of 1776. A class's parchment takes many names; a student's, one.
 * The owner's declarations open with their blanks to fill in (the teacher,
 * the grade and the school; the student's name and grade), and the heading
 * and her words take them up as they are typed. The same parchment, without
 * its scrolling or its inputs, is what prints: a class's with the teacher's
 * line and 25 lines to sign on, the names signed so far set on them.
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
  /** Which of the owner's versions, and what has been typed into its blanks. */
  version?: VersionId;
  fill?: OwnFill;
  onFill?: (change: OwnFill) => void;
  /** For the printer: no scrolling, no inputs. */
  print?: boolean;
};

const Parchment = forwardRef<HTMLDivElement, Props>(function Parchment(
  { doc, signers, pad, typing = '', address = '', version = 'classroom', fill = {}, onFill, print = false },
  ref,
) {
  const [atFoot, setAtFoot] = useState(false);
  const own = doc === 'declaration' ? null : OWN_DECLARATIONS[doc];
  const title = doc === 'declaration' ? DECLARATION_TITLE : ownTitle(doc, fill);

  // Is the line to sign on in sight? Asked as it scrolls, and whenever the parchment or what is on it changes size,
  // so a short parchment, its foot already showing, never points down to it.
  const inner = useRef<HTMLDivElement | null>(null);
  const setScroll = useCallback(
    (el: HTMLDivElement | null) => {
      inner.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );
  const onScroll = useCallback(() => {
    const el = inner.current;
    if (el) setAtFoot(el.scrollTop + el.clientHeight >= el.scrollHeight - 160);
  }, []);
  useEffect(onScroll);
  useEffect(() => {
    const el = inner.current;
    if (!el || print || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onScroll, print]);

  const label =
    doc === 'declaration'
      ? 'The Declaration of Independence, in the National Archives’ transcription. Scroll inside the parchment to read it; the line to sign on is at its foot.'
      : `${own!.name}. Fill in its blanks at the head of the parchment, read it, and sign at its foot.`;

  return (
    <div className="aps-parch" data-doc={doc} data-print={print || undefined}>
      <div
        ref={setScroll}
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
            {!print && (
              <div className="aps-parch-fill" role="group" aria-label="Fill in the blanks">
                {doc === 'class' ? (
                  <>
                    <Blank label="Teacher" value={fill.teacher} onChange={(v) => onFill?.({ teacher: v })} max={40} hint="your teacher’s name" />
                    <Blank label="Grade" value={fill.grade} onChange={(v) => onFill?.({ grade: v })} max={24} hint="e.g. 4th grade" />
                  </>
                ) : (
                  <>
                    <Blank label="Name" value={fill.name} onChange={(v) => onFill?.({ name: v })} max={40} hint="optional" />
                    <Blank label="Grade" value={fill.grade} onChange={(v) => onFill?.({ grade: v })} max={24} hint="optional" />
                  </>
                )}
              </div>
            )}
            <h2 className="aps-parch-title aps-parch-title-own">{title}</h2>
            {doc === 'class' &&
              (print ? (
                fill.school?.trim() && <p className="aps-parch-school">{fill.school.trim()}</p>
              ) : (
                <input
                  type="text"
                  className="aps-parch-school aps-parch-school-blank"
                  aria-label="School, place and year (optional)"
                  value={fill.school ?? ''}
                  onChange={(e) => onFill?.({ school: e.target.value })}
                  maxLength={80}
                  placeholder="school, place and year (optional)"
                  autoComplete="off"
                />
              ))}
            {ownWording(doc, version, fill).map((p, i) => (
              <p key={i} className="aps-parch-p aps-parch-own">{p}</p>
            ))}
          </>
        )}

        <div className="aps-parch-foot">
          {doc === 'class' && (
            <p className="aps-parch-teacher">
              <span>Teacher:</span>
              <span className="aps-parch-teacher-line" aria-hidden="true" />
            </p>
          )}
          {print && doc === 'class' ? (
            // In print, 25 lines to sign on (more, if more have signed), the names signed so far set on the first.
            <ol className="aps-parch-sigs aps-parch-slots" aria-label="Signed by the class">
              {Array.from({ length: Math.max(PRINT_SIGNATURE_LINES, signers.length) }, (_, i) => (
                <li key={i}>{signers[i] ? <SignatureMark signer={signers[i]} /> : <span className="aps-parch-slot" />}</li>
              ))}
            </ol>
          ) : signers.length > 0 && (
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

/** A blank at the head of the owner's declarations, to fill in: the teacher, the grade, the name. */
function Blank({ label, value = '', onChange, max, hint }: { label: string; value?: string; onChange: (v: string) => void; max: number; hint: string }) {
  return (
    <label className="aps-parch-blank">
      <span>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} maxLength={max} placeholder={hint} autoComplete="off" spellCheck={false} />
    </label>
  );
}
