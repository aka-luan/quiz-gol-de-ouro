type ButtonProps = {
  className: string;
  children: React.ReactNode;
  onClick: () => void;
};

function Button({ className, children, onClick }: ButtonProps) {
  const baseStyles = "px-4 py-4 rounded-2xl";
  return (
    <button
      className={`${baseStyles} cursor-pointer w-full ${className} `}
      onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
