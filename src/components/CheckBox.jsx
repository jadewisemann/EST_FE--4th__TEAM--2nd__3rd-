const CheckBox = ({ name, txt, disabled }) => (
  <div className='flex items-center gap-1'>
    <input
      id={name}
      type='checkbox'
      disabled={disabled}
      className='peer aspect-square w-[0.875rem] accent-violet-600'
    />
    <label
      htmlFor={name}
      className={`text-sm font-medium peer-checked:text-black ${disabled ? 'text-neutral-400' : ''}`}
    >
      {txt}
    </label>
  </div>
);

export default CheckBox;
