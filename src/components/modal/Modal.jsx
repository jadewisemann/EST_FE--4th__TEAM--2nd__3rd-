import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ children, isOpen, isFull = true }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/50'>
      <div
        className={`mt-0 max-h-screen w-full overflow-hidden bg-white ${
          isFull ? 'h-screen' : 'max-h-[70vh] overflow-y-auto'
        }`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
