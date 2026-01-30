'use client';

type LineByLineProps = {
  items: string[];
  color: string;
};

export function LineByLine({ items, color }: LineByLineProps) {
  return (
    <div className="line-by-line-container">
      {items.map((item, i) => (
        <p
          key={i}
          className="line-fade"
          style={{
            animationDelay: `${i * 0.4}s`,
            color
          }}
        >
          {item}
        </p>
      ))}
    </div>
  );
}
