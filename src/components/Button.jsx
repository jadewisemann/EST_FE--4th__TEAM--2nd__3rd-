import { useEffect, useState } from 'react';

import Icon from './Icon';

const Button = ({
  children,
  color = 'prime',
  size = 'full',
  type = 'button',
  icon = '',
  iconSize = '',
  childrenClassName = '',
  onClick,
  disabled = false,
  className,
  content = '',
  ...props
}) => {
  const [hasIcon, setHasIcon] = useState(false);

  useEffect(() => {
    if (icon) {
      setHasIcon(true);
    }
  }, [icon]);

  const cx = (...classes) => classes.filter(Boolean).join(' ');

  const defaultStyle =
    'inline-flex cursor-pointer items-center gap-2 text-base font-medium transition-colors duration-200';
  const focusedStyle = '';
  // const focusedStyle = 'focus:outline-none focus:ring-2 focus:ring-violet-300';

  const colors = {
    prime: 'bg-violet-600 text-white hover:bg-violet-700',
    invert:
      'bg-white text-violet-500 border border-violet-200 hover:border-violet-300',
    line: 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400',
    alt: 'bg-blue-100 text-gray-800 hover:bg-blue-200',
  };

  const sizes = {
    full: `${color === 'invert' || color === 'line' ? 'rounded-3xl' : 'rounded-xl'} w-full h-12.5 py-3 px-4 text-base `,
    square: 'rounded-sm w-12 h-12 flex items-center justify-center',
    small: 'rounded-md py-2 px-4 w-fit text-sm',
    xSmall: 'rounded-md py-1.5 px-4 w-fit text-sm',
  };

  const disabledStyle = 'opacity-50 cursor-not-allowed';

  const buttonClasses = cx(
    defaultStyle,
    focusedStyle,
    colors[color],
    sizes[size],
    disabled && disabledStyle,
    className,
  );

  const childrenStyle = hasIcon ? `text-left ` : `text-center justify-center`;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {hasIcon && <Icon name={icon} size={iconSize} />}
      <span
        className={`flex grow items-center gap-1 ${childrenStyle} ${childrenClassName ? childrenClassName : ''}`}
      >
        {!children && content ? content : children}
      </span>
    </button>
  );
};

export default Button;
