import Icon from '../Icon';
import SubHeader from '../SubHeader';

import Modal from './Modal';

const filterList = ['낮은 요금순', '높은 요금순', '평점순'];

const FilterModal = ({ isOpen, title, onClose, onConfirm, selected }) => {
  const handleClick = value => {
    if (onConfirm) onConfirm(value); // 부모에게 값 전달
    if (onClose) onClose(); // 모달 닫기
  };

  return (
    <Modal isOpen={isOpen} isFull={false}>
      <SubHeader
        title={title}
        leftButton='close'
        callback={onClose}
        rightButton={false}
        fixed={false}
      />
      <div className='flex flex-col gap-2'>
        <ul className=''>
          {filterList.map((item, idx) => (
            <li
              key={idx}
              className='border-b-1 border-neutral-300 px-5 dark:bg-neutral-800'
            >
              <button
                className={`flex w-full cursor-pointer items-center justify-between py-4 text-left ${
                  selected === item
                    ? 'font-bold text-violet-600 dark:text-violet-400'
                    : 'text-black dark:text-neutral-50'
                }`}
                onClick={() => handleClick(item)}
              >
                {item}
                {selected === item ? <Icon name='check' size={16} /> : ''}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default FilterModal;
