import { useNavigate } from 'react-router-dom';

import Icon from './Icon';

const SubHeader = ({
  leftButton = `arrow`,
  callback = () => {},
  rightButton = true,
  title = '',
  hasShadow = true,
  fixed = true,
  zIndex = null,
}) => {
  const Title = <h2 className='grow text-lg'>{title}</h2>;
  const Home = <Icon name='home' className='dark:font-white font-black' />;
  const ArrowLong = (
    <Icon name='arrow_left_long' className='dark:font-white font-black' />
  );
  const Arrow = (
    <Icon name='arrow_left' className='dark:font-white font-black' />
  );
  const Close = <Icon name='close' className='dark:font-white font-black' />;

  const navigate = useNavigate();
  const navigateHome = () => navigate('/', { replace: true });

  const leftButtonHandler = () => {
    if (callback && typeof callback === 'function') {
      callback();
    }
    if (leftButton === 'arrow' || leftButton === 'arrow-short') {
      navigate(-1);
    }
  };

  const LeftButton = (
    <button onClick={leftButtonHandler} className='cursor-pointer p-4'>
      {leftButton === 'close'
        ? Close
        : leftButton === 'arrow'
          ? ArrowLong
          : leftButton === 'arrow-short'
            ? Arrow
            : ''}
    </button>
  );

  const homeButtonHandler = () => navigateHome();

  const defaultStyle =
    'flex h-18 items-center justify-between py-4 gap-3 w-full bg-white dark:bg-neutral-800 top-0 left-0';

  let zIndexStyle = '';
  if (zIndex !== null && !isNaN(Number(zIndex))) {
    zIndexStyle = ` z-${zIndex}`;
  }

  const style =
    defaultStyle
    + (hasShadow
      ? ' shadow-bottom dark:bg-neutral-800 dark:shadow-[0_-4px_20px_rgba(255,255,255,0.25)]'
      : '')
    + (fixed ? ' fixed' : '')
    + zIndexStyle;

  return (
    <>
      <div className={style}>
        {LeftButton}
        {title && Title}
        {rightButton && (
          <button onClick={homeButtonHandler} className='cursor-pointer p-4'>
            {Home}
          </button>
        )}
      </div>
    </>
  );
};

export default SubHeader;
