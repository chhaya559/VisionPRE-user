import './ProgressDots.scss';

type Props = {
  total: number;
  current: number;
};

export default function ProgressDots({ total, current }: Readonly<Props>) {
  return (
    <div className="progress-dots">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`dot ${i === current ? 'dot--active' : 'dot--inactive'}`}
        />
      ))}
    </div>
  );
}
