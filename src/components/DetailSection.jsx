import React from 'react';
const DetailSection = ({
  title,
  type,
  color = 'text-neutral-600',
  size = 'sm',
  weight = 'font-normal',
  contents = [],
}) => {
  const cx = (...classes) => classes.filter(Boolean).join(' ');
  const sizes = {
    xxs: 'text-xxs',
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    xxl: 'text-2xl',
    xxxl: 'text-3xl',
  };
  const colors = {
    neutral300: 'text-neutral-300',
    neutral400: 'text-neutral-400',
    neutral500: 'text-neutral-500',
    neutral600: 'text-neutral-600',
    black: 'text-black',
    white: 'text-white',
    violet: 'text-violet-600',
    red: 'text-red-500',
  };
  const weights = {
    bold: 'font-bold',
    normal: 'font-normal',
  };
  const fontStyleClasses = cx(sizes[size], colors[color], weights[weight]);

  return (
    <>
      <div className='text-m flex flex-col gap-2.5 font-bold'>
        <h3>{title}</h3>
        <div>
          {type === 'list-left' &&
            contents.map((item, idx) => (
              <ul key={idx} className={fontStyleClasses}>
                <li className='py-0.5'>{item}</li>
              </ul>
            ))}

          {type === 'list-left-dot' &&
            contents.map((item, idx) => (
              <ul key={idx} className={`list-disc ${fontStyleClasses}`}>
                <li className='ml-5 py-0.5'>{item}</li>
              </ul>
            ))}

          {type === 'list-left-dot-title' &&
            contents.map((item, idx) => (
              <div key={idx}>
                <h4 className='my-1 text-sm font-bold'>{item.subTitle}</h4>
                <ul className={`mb-2.5 list-disc ${fontStyleClasses}`}>
                  {item.subContents.map((content, i) => (
                    <li key={i} className='ml-5 py-0.5'>
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
                className={`flex flex-col gap-1.5 ${fontStyleClasses}`}
              >
                {Object.entries(item.labels).map(([key, label]) => (
                  <div key={key} className='flex items-start'>
                    <div className='basis-1/5 text-neutral-500'>{label}</div>
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
};
export default DetailSection;
