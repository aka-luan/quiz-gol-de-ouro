type ProgressProps = {
  max: number;
  value: number;
};

function Progress({ max, value }: ProgressProps) {
  return <progress className="w-full" value={value} max={max}></progress>;
}

export default Progress;
