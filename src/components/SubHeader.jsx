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
  const Home = <Icon name='home' color='black' />;
  const ArrowLong = <Icon name='arrow_left_long' color='black' />;
  const Arrow = <Icon name='arrow_left' color='black' />;
  const Close = <Icon name='close' color='black' />;

  const navigate = useNavigate();
  const navigateHome = () => navigate('/', { replace: true });

  const leftButtonHandler = () => {
    if (callback && typeof callback === 'function') {
      callback();
    } else if (leftButton === 'arrow' || leftButton === 'arrow-short') {
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

  const homeButtonHandler = navigateHome();

  const defaultStyle =
    'flex h-18 items-center justify-between py-4 gap-3 w-full bg-white top-0 left-0';

  let zIndexStyle = '';
  if (zIndex !== null && !isNaN(Number(zIndex))) {
    zIndexStyle = ` z-${zIndex}`;
  }

  const style =
    defaultStyle
    + (hasShadow ? ' shadow-bottom' : '')
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
