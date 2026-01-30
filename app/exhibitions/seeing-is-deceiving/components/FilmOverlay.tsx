'use client';

export function FilmOverlay() {
  return (
    <div className="film-overlay">
      {/* Traveling vertical scratches */}
      <div className="film-scratch scratch-1"></div>
      <div className="film-scratch scratch-2"></div>
      <div className="film-scratch scratch-3"></div>
      {/* Random dust specks */}
      <div className="film-dust dust-1"></div>
      <div className="film-dust dust-2"></div>
      <div className="film-dust dust-3"></div>
      <div className="film-dust dust-4"></div>
      <div className="film-dust dust-5"></div>
      <div className="film-dust dust-6"></div>
      {/* Vignette */}
      <div className="film-vignette"></div>
      {/* Sepia tint */}
      <div className="film-sepia"></div>
    </div>
  );
}
