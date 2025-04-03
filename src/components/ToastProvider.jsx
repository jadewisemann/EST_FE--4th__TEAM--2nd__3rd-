import useToastStore from '../store/toastStore';

const ToastProvider = () => {
  const { message, className } = useToastStore();

  return (
    <div
      role='alert'
      className={`fixed top-10 left-1/2 z-[1000] -translate-x-1/2 rounded-2xl bg-gray-800 px-4 py-3 text-white shadow-md transition-transform duration-500 ${message ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${className}`}
    >
      {message}
    </div>
  );
};

export default ToastProvider;

// 토스트 메세지를 전역에서 이용 할 수 있도록 컴포넌트 단위로 수정했습니다
// 사용법
// useToastStore 에서  showToast 함수를 호출하고
//ex)  const { showToast } = useToastStore();
// 호출과 showToast() 안에 출력 메세지를 넣으면 됩니다
//ex) const handleClick = () => {
// showToast('토스트 메시지가 표시됩니다!');
// showToast('스타일 변경','bg-red-500')
// };
