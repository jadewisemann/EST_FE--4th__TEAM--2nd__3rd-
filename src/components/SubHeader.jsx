import Icon from './Icon';

const SubHeader = ({
  leftButton = `arrow`,
  callback = () => {},
  rightButton = true,
  title = '',
  hasShadow = true,
}) => {
  const SubHeader = <h2 className='grow text-lg'>{title}</h2>;

  const Home = <Icon name='home' />;
  const Arrow = <Icon name='arrow_right' />;
  const Close = <Icon name='close' />;

  const LeftButton = (
    <button onClick={callback}>
      {leftButton === 'close' ? Close : leftButton === 'arrow' ? Arrow : ''}
    </button>
  );

  const homeButtonHandler = () => {};
  const defaultStyle = 'flex h-18 items-center justify-between p-4 gap-2';
  const style = defaultStyle + (hasShadow ? ' shadow-bottom' : '');

  return (
    <>
      <div className={style}>
        {LeftButton}
        {title && SubHeader}
        {rightButton && <button onClick={homeButtonHandler}>{Home}</button>}
      </div>
    </>
  );
};

export default SubHeader;
