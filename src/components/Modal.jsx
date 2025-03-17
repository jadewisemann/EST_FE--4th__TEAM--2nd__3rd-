import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, header, content, bottom = '' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const style = bottom ? 'max-h-[70vh] overflow-y-auto' : '';

  return createPortal(
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
      <div className='max-h-screen w-full overflow-hidden bg-white'>
        <div className='p-4 text-xl font-medium'>{header}</div>
        <div className={`w-full ${style} p-4`}>{content}</div>
        {bottom && <div className='shadow-top p-4'>{bottom}</div>}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
