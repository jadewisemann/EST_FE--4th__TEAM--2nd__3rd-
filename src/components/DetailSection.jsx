import React from 'react';
const DetailSection = ({
  title,
  type,
  size = 'text-sm',
  weight = 'font-normal',
  contents = [],
  onclick = () => {},
}) => (
  // const cx = (...classes) => classes.filter(Boolean).join(' ');
  <>
    <div className='text-m flex flex-col gap-2.5 font-bold'>
      <h3 className='dark:text-neutral-50'>{title}</h3>
      <div>
        {type === 'list-left'
          && contents.map((item, idx) => (
            <ul
              key={idx}
              className={`${size} ${weight} text-neutral-600 dark:text-neutral-400`}
            >
              <li className='py-0.5'>{item}</li>
            </ul>
          ))}
        {type === 'list-left-dot'
          && contents.map((item, idx) => (
            <ul
              key={idx}
              className={`ml-5 list-disc ${size} ${weight} text-neutral-600 dark:text-neutral-400`}
            >
              <li
                className={`py-0.5 ${item.isHighlighted ? 'font-bold text-red-500' : ''}`}
              >
                {item.text}
              </li>
            </ul>
          ))}
        {type === 'list-left-dot-title'
          && contents.map((item, idx) => (
            <div key={idx}>
              <h4 className='my-1 text-sm font-bold dark:text-neutral-300'>
                {item.subTitle}
              </h4>
              <ul
                key={idx}
                className={`mb-2.5 list-disc ${size} ${weight} text-neutral-600 dark:text-neutral-400`}
              >
                {item.subContents.map((content, i) => (
                  <li key={i} className='ml-5 py-0.5'>
                    {content}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        {type === 'table-left'
          && contents.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col gap-2 ${size} ${weight} text-neutral-600 dark:text-neutral-400`}
            >
              {Object.entries(item.labels).map(([key, label]) => (
                <div key={key} className='flex items-start'>
                  <div className='min-w-18 shrink-0 text-neutral-500 dark:text-neutral-300'>
                    {label}
                  </div>
                  <div>
                    {Array.isArray(item[key])
                      ? item[key].map((line, subIdx) => (
                          <React.Fragment key={subIdx}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))
                      : item[key]}
                  </div>
                </div>
              ))}
            </div>
          ))}
        {type === 'table-spacebetween' && (
          <div className='flex flex-col gap-2'>
            {contents.map((item, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between text-sm font-normal text-neutral-500 dark:text-neutral-300'
              >
                <div
                  className={`${item.label === '최종 결제금액' ? 'text-base text-black dark:text-neutral-50' : ''}`}
                >
                  {item.label}
                </div>
                <div
                  className={`text-neutral-800 dark:text-neutral-50 ${item.label === '최종 결제금액' ? 'text-lg font-bold text-violet-600 dark:text-violet-400' : ''}`}
                >
                  {item.showMore ? (
                    <button
                      className='cursor-pointer'
                      onClick={() => onclick(item)} // 여기서 item 정보와 함께 콜백 실행
                    >
                      {item.showMoreText || '더보기'} &gt;
                    </button>
                  ) : item.anchor ? (
                    <button
                      className='cursor-pointer underline'
                      onClick={() => onclick(item)} // anchor 버튼도 콜백 실행
                    >
                      {item.anchorText || '적용하기'}
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
