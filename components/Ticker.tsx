const items = [
  'Saying Sorry',
  'Asking for Directions',
  'Setting Boundaries',
  'Confronting a Friend',
  'Ordering Food',
  'Standing Your Ground',
  'Making Small Talk',
  'Speaking Up at Work',
];

const separator = '\u25C6';

export default function Ticker() {
  const doubled = [...items, ...items];

  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((item, index) => (
          <div className="ticker-item" key={`${item}-${index}`}>
            {item} <span className="tsep">{separator}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
