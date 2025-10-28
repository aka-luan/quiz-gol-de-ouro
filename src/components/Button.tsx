type ButtonProps = {
  className: string; 
  variant: 'primary' | 'transparent';
  children: React.ReactNode;
  onClick: () => void;
};

function Button({ className, variant, children, onClick }: ButtonProps) {
  const baseStyles = 'px-4 py-3 rounded-2xl';
  const variantStyles =
    variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black';

  return (
    <button
      className={`${baseStyles} ${variantStyles} cursor-pointer w-full ${className} `}
      onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
