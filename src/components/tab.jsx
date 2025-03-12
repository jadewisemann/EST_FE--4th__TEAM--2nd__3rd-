import { useState } from "react";

const Tab = () => {

  const categories = ["전체","모텔","호텔/리조트","팬션/풀빌라","해외숙소"];
  const contents = ["tab1","tab2","tab3","tab4","tab5"];
  const [activeTab, setActiveTab] = useState(0) //선택된 카테고리
  const [sort, setSort] = useState('asc') //asc: 오름차순, desc: 내림차순

  return (
    <>
      <div className="flex relative items-center mt-5 mx-5">
        <div className="flex gap-x-2 overflow-x-auto items-center pr-2">
          {
            categories.map((item, idx)=>{
              return(
                <button key={idx} 
                onClick={()=>{
                  setActiveTab(idx)
                }}
                className={`p-2 py-1.5 border-1 shrink-0 rounded-2xl text-xs
                  ${activeTab === idx ? "border-violet-600 text-violet-600 font-bold" : "border-neutral-300 text-black"}`}>{item}
                </button>
              )
            })
          }
        </div>
        <button 
          className="flex gap-x-1 items-center h-9 py-2 pl-3 flex-none border-l-1 border-neutral-300 bg -white text-xs"
          onClick={()=>{setSort(prev => (prev === 'asc' ? 'desc' : 'asc'))}}
        >
          <svg width="12" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.22468 9.67157L4.19997 12.8536C4.01436 13.0488 3.71342 13.0488 3.52781 12.8536L0.5031 9.67157C0.317489 9.47631 0.317489 9.15973 0.5031 8.96447C0.688712 8.7692 0.989647 8.7692 1.17526 8.96447L3.3886 11.2929L3.3886 0.5C3.3886 0.223858 3.6014 0 3.86389 0C4.12639 0 4.33918 0.223858 4.33918 0.5L4.33918 11.2929L6.55252 8.96447C6.73814 8.7692 7.03907 8.7692 7.22468 8.96447C7.41029 9.15973 7.41029 9.47631 7.22468 9.67157Z" fill="black"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.5031 3.32843L11.5278 0.146446C11.7134 -0.0488157 12.0144 -0.0488157 12.2 0.146446L15.2247 3.32843C15.4103 3.52369 15.4103 3.84027 15.2247 4.03553C15.0391 4.2308 14.7381 4.2308 14.5525 4.03553L12.3392 1.70711L12.3392 12.5C12.3392 12.7761 12.1264 13 11.8639 13C11.6014 13 11.3886 12.7761 11.3886 12.5L11.3886 1.70711L9.17526 4.03553C8.98965 4.2308 8.68871 4.2308 8.5031 4.03553C8.31749 3.84027 8.31749 3.52369 8.5031 3.32843Z" fill="black"/>
          </svg>
          <span className="sr-only"> 위아래 화살표 아이콘</span>정렬
        </button>
      </div>
      <div className='mt-5 mx-5'>{contents[activeTab]}</div>      
    </>
  );
};

export default Tab;