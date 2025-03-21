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
  const SubHeader = <h2 className='grow text-lg'>{title}</h2>;
  const Home = <Icon name='home' color='black' />;
  const ArrowLong = <Icon name='arrow_left_long' color='black' />;
  const Arrow = <Icon name='arrow_left' color='black' />;
  const Close = <Icon name='close' color='black' />;

  const LeftButton = (
    <button onClick={callback} className='cursor-pointer p-4'>
      {leftButton === 'close'
        ? Close
        : leftButton === 'arrow'
          ? ArrowLong
          : leftButton === 'arrow-short'
            ? Arrow
            : ''}
    </button>
  );

  // TODO: 홈으로 가는 핸들러 추가 필요
  const homeButtonHandler = () => {};

  const defaultStyle =
    'flex h-18 items-center justify-between py-4 gap-3 w-full bg-white top-0 left-0';

  let zIndexStyle = '';
  if (zIndex !== null && !isNaN(Number(zIndex))) {
    zIndexStyle = ` z-${zIndex}`;
  }

  const style =
    defaultStyle +
    (hasShadow ? ' shadow-bottom' : '') +
    (fixed ? ' fixed' : '') +
    zIndexStyle;

  return (
    <>
      <div className={style}>
        {LeftButton}
        {title && SubHeader}
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
