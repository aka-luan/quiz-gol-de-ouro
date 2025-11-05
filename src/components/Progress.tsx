type ProgressProps = {
  max: number;
  value: number;
};

function Progress({ max, value }: ProgressProps) {
  return (
    <div className="w-full rounded-full">
      <div
        className="bg-gradient-progress h-2 rounded-full"
        style={{ width: `${(value / max) * 100}%` }}></div>
    </div>
  );
}

export default Progress;
