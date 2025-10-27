type ButtonProps = {
  variant: 'primary' | 'transparent';
  children: React.ReactNode;
  onClick: () => void;
};

function Button({ variant, children, onClick }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded';
  const variantStyles =
    variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black';

  return (
    <button
      className={`${baseStyles} ${variantStyles} cursor-pointer`}
      onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
