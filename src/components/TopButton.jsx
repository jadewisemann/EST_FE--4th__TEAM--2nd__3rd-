import { useEffect, useState } from 'react';

import Icon from './Icon';

const TopButton = ({ bottom = 68 }) => {
  const [showTopButton, setShowTopButton] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY !== 0) setShowTopButton(true);
      else setShowTopButton(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {showTopButton && (
        <button
          className='fixed right-5 z-20 rounded-[50%] bg-white p-2 shadow-[1px_2px_2px_2px_rgba(0,0,0,0.1)] dark:bg-neutral-800 dark:shadow-[1px_1px_4px_1px_rgba(255,255,255,0.2)]'
          style={{ bottom: `${bottom}px` }}
          type='button'
          onClick={scrollToTop}
        >
          <Icon name='arrow_up' className='text-black dark:text-white'></Icon>
        </button>
      )}
    </>
  );
};

export default TopButton;
