const Tab = ({ categories = [], activeTab = 0, setActiveTab, children }) => (
  <>
    <div className='relative mx-5 mt-5 flex items-center dark:text-amber-50'>
      <div
        className='flex items-center gap-x-2 overflow-x-auto pr-2'
        style={{ scrollbarWidth: 'none' }}
      >
        {categories.map((item, idx) => (
          <button
            type='button'
            key={idx}
            onClick={() => {
              setActiveTab(idx);
            }}
            className={`shrink-0 cursor-pointer rounded-2xl border-1 p-2 py-1.5 text-xs ${activeTab === idx ? 'border-violet-600 font-bold text-violet-600 dark:border-violet-400 dark:text-violet-400' : 'border-neutral-300 text-black dark:border-neutral-400 dark:text-neutral-50'}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
    <div className='mx-5 pb-[80px]'>{children}</div>
  </>
);
export default Tab;
