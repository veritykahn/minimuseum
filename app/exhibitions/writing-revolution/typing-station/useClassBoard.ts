'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { REFUSALS, checkMessage, formatCode, normalizeCode, type BoardMessage, type Machine } from '@/lib/classBoard';

/*
 * The class board's messages, wherever they live.
 *
 * By default the board is one sitting: the messages are held in this page
 * only, nothing is sent anywhere, and refreshing clears them (the browser
 * asks first). "Save with a class code" sends them to app/api/class-board,
 * which keeps the board under a short random code for 30 days after its
 * last new message; from then on each post goes there, and the board
 * refreshes itself while it is open. Whoever made the board gets a teacher
 * key, shown once and kept in this browser, which deletes messages or the
 * whole board.
 */

export type BoardMode = { kind: 'local' } | { kind: 'saved'; code: string; teacherKey: string | null };

const API = '/api/class-board';
/* How often an open saved board looks for new messages. */
const POLL_MS = 30_000;
const keyName = (code: string) => `mm-class-board-teacher:${code}`;

function readKey(code: string): string | null {
  try {
    return window.localStorage.getItem(keyName(code));
  } catch {
    return null;
  }
}
function writeKey(code: string, key: string | null) {
  try {
    if (key) window.localStorage.setItem(keyName(code), key);
    else window.localStorage.removeItem(keyName(code));
  } catch {
    // Private windows: the key is still shown, to copy.
  }
}

/*
 * The open saved board is named in the address (?board=<code>), so a refresh
 * comes back to it; leaving or deleting the board takes it out again, so a
 * refresh doesn't look for a board that's gone.
 */
function boardInAddress(code: string | null) {
  const url = new URL(window.location.href);
  if (code) url.searchParams.set('board', code);
  else url.searchParams.delete('board');
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}

/** Every message the station can say about a failed request. */
const ERRORS: Record<string, string> = {
  ...REFUSALS,
  'rate-limited': 'The board is busy. Wait a moment and try again.',
  full: 'This board is full: it holds 200 messages.',
  'not-found': 'No board has that code. Check it and try again; boards are deleted 30 days after their last new message.',
  forbidden: 'That teacher key isn’t this board’s.',
  unavailable: 'Saving boards isn’t available right now. The board on screen still works.',
};
const errorText = (e: string) => ERRORS[e] ?? ERRORS.unavailable;

async function call(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; body: Record<string, unknown> }> {
  try {
    const res = await fetch(`${API}${path}`, { ...init, headers: { 'content-type': 'application/json', ...init?.headers }, cache: 'no-store' });
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { ok: res.ok, status: res.status, body };
  } catch {
    return { ok: false, status: 0, body: { error: 'unavailable' } };
  }
}

let localId = 0;

export function useClassBoard() {
  const [messages, setMessages] = useState<BoardMessage[]>([]);
  const [mode, setMode] = useState<BoardMode>({ kind: 'local' });
  /** Whether saving is possible here: null until asked. */
  const [available, setAvailable] = useState<boolean | null>(null);
  /** A teacher key just made, to show once. */
  const [newKey, setNewKey] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    let live = true;
    void call('').then((r) => live && setAvailable(r.ok && r.body.available === true));
    return () => {
      live = false;
    };
  }, []);

  // One sitting: the browser asks before a refresh or a closed tab clears the board.
  useEffect(() => {
    if (mode.kind !== 'local' || messages.length === 0) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [mode.kind, messages.length]);

  const load = useCallback(async (code: string, quiet = false) => {
    const r = await call(`/${code}`);
    if (!r.ok) {
      if (!quiet) setStatus(errorText(String(r.body.error)));
      return false;
    }
    setMessages(r.body.messages as BoardMessage[]);
    return true;
  }, []);

  /** Open a saved board by its code. */
  const open = useCallback(
    async (raw: string) => {
      const code = normalizeCode(raw);
      if (!code) {
        setStatus('A class code is eight letters and numbers, like K7M3-QX9P.');
        return false;
      }
      setBusy(true);
      const ok = await load(code);
      setBusy(false);
      if (!ok) return false;
      setMode({ kind: 'saved', code, teacherKey: readKey(code) });
      boardInAddress(code);
      setStatus(`Board ${formatCode(code)} is open.`);
      return true;
    },
    [load],
  );

  // An open saved board keeps up with the class.
  useEffect(() => {
    if (mode.kind !== 'saved') return;
    const t = setInterval(() => {
      if (document.visibilityState === 'visible') void load(mode.code, true);
    }, POLL_MS);
    return () => clearInterval(t);
  }, [mode, load]);

  /**
   * Post a message. The rules are checked here first; a refusal is returned
   * as text to say, or null once it is on the board (or on its way).
   */
  const post = useCallback(
    (raw: string, machine: Machine, font?: string): string | null => {
      const checked = checkMessage(raw);
      if (!checked.ok) return REFUSALS[checked.reason];
      const m = modeRef.current;
      if (m.kind === 'local') {
        setMessages((ms) => {
          if (ms.length >= 200) return ms;
          return [...ms, { id: `local-${++localId}`, text: checked.text, machine, ...(machine === 'imac' && font ? { font } : {}), at: Date.now() }];
        });
        setStatus('Posted to the board.');
        return null;
      }
      setStatus('Posting…');
      void call(`/${m.code}/messages`, { method: 'POST', body: JSON.stringify({ text: checked.text, machine, font }) }).then((r) => {
        if (!r.ok) return setStatus(errorText(String(r.body.error)));
        setMessages((ms) => [...ms, r.body.message as BoardMessage]);
        setStatus(`Posted to board ${formatCode(m.code)}.`);
      });
      return null;
    },
    [],
  );

  /** Save the board on screen under a new class code. */
  const save = useCallback(async () => {
    setBusy(true);
    const r = await call('', { method: 'POST', body: JSON.stringify({ messages: messages.map(({ text, machine, font }) => ({ text, machine, font })) }) });
    setBusy(false);
    if (!r.ok) return setStatus(errorText(String(r.body.error)));
    const code = String(r.body.code);
    const key = String(r.body.teacherKey);
    writeKey(code, key);
    setMessages(r.body.messages as BoardMessage[]);
    setMode({ kind: 'saved', code, teacherKey: key });
    boardInAddress(code);
    setNewKey(key);
    setStatus(`Saved. The class code is ${formatCode(code)}.`);
  }, [messages]);

  /*
   * A key the board turns down is forgotten, here and in this browser, so
   * the delete buttons go and "Teacher key" is offered again to try another.
   */
  const refuse = useCallback((m: Extract<BoardMode, { kind: 'saved' }>, error: string) => {
    if (error === 'forbidden') {
      writeKey(m.code, null);
      setMode({ ...m, teacherKey: null });
    }
    setStatus(errorText(error));
  }, []);

  /** Delete a message: on screen in one sitting, on the server with the teacher key. */
  const remove = useCallback(async (id: string) => {
    const m = modeRef.current;
    if (m.kind === 'saved') {
      if (!m.teacherKey) return;
      const r = await call(`/${m.code}/messages/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'x-teacher-key': m.teacherKey } });
      if (!r.ok && r.status !== 404) return refuse(m, String(r.body.error));
    }
    setMessages((ms) => ms.filter((x) => x.id !== id));
    setStatus('Message deleted.');
  }, [refuse]);

  /** Delete the whole saved board (teacher key), or clear the one sitting. */
  const removeBoard = useCallback(async () => {
    const m = modeRef.current;
    if (m.kind === 'saved') {
      if (!m.teacherKey) return;
      const r = await call(`/${m.code}`, { method: 'DELETE', headers: { 'x-teacher-key': m.teacherKey } });
      if (!r.ok && r.status !== 404) return refuse(m, String(r.body.error));
      writeKey(m.code, null);
      setStatus(`Board ${formatCode(m.code)} is deleted.`);
    } else setStatus('The board is cleared.');
    setMessages([]);
    setMode({ kind: 'local' });
    boardInAddress(null);
    setNewKey(null);
  }, [refuse]);

  /** Leave a saved board (it stays saved) for a fresh one-sitting board. */
  const leave = useCallback(() => {
    setMessages([]);
    setMode({ kind: 'local' });
    boardInAddress(null);
    setNewKey(null);
    setStatus('Back to a one-sitting board. The saved board is still there under its code.');
  }, []);

  /** A teacher on another computer types the key in; it is checked on first use. */
  const setTeacherKey = useCallback((key: string) => {
    const m = modeRef.current;
    if (m.kind !== 'saved') return;
    const k = key.trim();
    writeKey(m.code, k || null);
    setMode({ ...m, teacherKey: k || null });
    setStatus(k ? 'Teacher key kept in this browser.' : '');
  }, []);

  const refresh = useCallback(async () => {
    const m = modeRef.current;
    if (m.kind !== 'saved') return;
    if (await load(m.code)) setStatus('The board is up to date.');
  }, [load]);

  return { messages, mode, available, newKey, dismissKey: () => setNewKey(null), status, busy, post, save, open, remove, removeBoard, leave, setTeacherKey, refresh };
}

export type ClassBoardState = ReturnType<typeof useClassBoard>;
