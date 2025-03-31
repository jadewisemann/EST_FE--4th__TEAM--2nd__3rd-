import Button from './Button';

const FooterButton = ({ name = '', ...props }) => (
  <>
    <div className='shadow-top bottom-0 flex h-28 w-full items-center justify-center bg-white p-5 dark:bg-black'>
      <Button {...props}>{name}</Button>
    </div>
  </>
);

export default FooterButton;
