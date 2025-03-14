const DetailSection = ({ title, type, /*onMoreClick,*/ contents = [] }) => (
  <>
    <div className='flex flex-col gap-2.5 text-lg font-bold'>
      <h3>{title}</h3>
      <div>
        {type === 'list-left' &&
          contents.map((item, idx) => (
            <ul key={idx} className='text-xs'>
              <li className='py-0.5 font-normal text-neutral-600'>{item}</li>
            </ul>
          ))}

        {type === 'list-left-dot' &&
          contents.map((item, idx) => (
            <ul key={idx} className='list-disc text-xs'>
              <li className='ml-5 py-0.5 font-normal text-neutral-600'>
                {item}
              </li>
            </ul>
          ))}

        {type === 'list-left-dot-title' &&
          contents.map((item, idx) => (
            <div key={idx}>
              <h4 className='my-1 text-sm font-bold'>{item.subTitle}</h4>
              <ul className='mb-2.5 list-disc text-xs'>
                {item.subContents.map((content, i) => (
                  <li
                    key={i}
                    className='ml-5 py-0.5 font-normal text-neutral-600'
                  >
                    {content}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        {type === 'table-left' &&
          contents.map((item, idx) => (
            <div
              key={idx}
              className='flex flex-col gap-1.5 text-sm font-normal'
            >
              {Object.entries(item.labels).map(([key, label]) => (
                <div key={key} className='flex items-center'>
                  <div className='basis-1/5 text-neutral-500'>{label}</div>
                  <div>{item[key]}</div>
                </div>
              ))}
            </div>
          ))}

        {type === 'table-spacebetween' && (
          <div className='flex flex-col gap-1.5'>
            {contents.map((item, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between text-sm font-normal text-neutral-500'
              >
                <div
                  className={`${item.label === '최종 결제금액' ? 'text-base text-black' : null}`}
                >
                  {item.label}
                </div>
                <div
                  className={`${item.label === '최종 결제금액' ? 'text-lg font-bold text-violet-600' : null}`}
                >
                  {item.showMore ? (
                    <button
                      className='cursor-pointer'
                      // onClick={onMoreClick(item.label)}
                    >
                      더보기 &gt;
                    </button>
                  ) : (
                    item.value
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </>
);

export default DetailSection;
