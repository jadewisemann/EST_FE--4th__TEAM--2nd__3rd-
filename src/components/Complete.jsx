import Icon from './Icon';

const Complete = ({ type, message, description, children }) => (
  <>
    <div className='flex flex-col items-center gap-5.5 text-center'>
      <Icon name='check'></Icon>
      <strong className='text-lg'>{message}</strong>
      <div>
        {type === 'done'
          ? description.map(item => <p className='px-10 text-sm'>{item}</p>)
          : null}
      </div>
      {type === 'notYet' ? children : null}
    </div>
  </>
);
export default Complete;

// 사용방법

// 예약 완료
/* <Complete
    type='done'
    message='예약이 완료되었어요!'
    description={[
        '예약이 확정 되면',
        '입력하신 이메일로 바우처를 보내드립니다.',
        '(평일, 최대 12시간 내)',
    ]}
    ></Complete> */

// 예약 없음
//   <Complete type='notYet' message='아직 예약 된 숙소가 없습니다!'>
//     <button>숙소 검색하기</button>
//   </Complete>
