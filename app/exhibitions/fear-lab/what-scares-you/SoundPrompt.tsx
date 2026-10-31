'use client';

/*
 * Before an experiment starts: a nudge to turn the sound on first, since
 * each one is better heard. One button turns it on; the experiment still
 * works without it.
 */
export default function SoundPrompt({ soundOn, onSoundOn, why }: { soundOn: boolean; onSoundOn: () => void; why: string }) {
  if (soundOn) return <p className="fl-lab-sound-ok">Sound is on.</p>;
  return (
    <div className="fl-lab-sound-prompt">
      <p>
        <strong>Turn the sound on first.</strong> {why}
      </p>
      <button type="button" className="fl-lab-button fl-lab-button-quiet" onClick={onSoundOn}>
        Turn sound on
      </button>
    </div>
  );
}
