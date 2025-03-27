import loadingGif from '../assets/img/bg_loading.gif';
import darkLoadingGif from '../assets/img/bg_loading_dark.gif';

const Loading = () => (
  <div className='flex h-screen flex-col items-center justify-center dark:bg-neutral-800'>
    <img src={loadingGif} alt='' className='block dark:hidden' />
    <img src={darkLoadingGif} alt='' className='hidden dark:block' />
    <p className='text-xl font-bold dark:text-neutral-50'>
      잠시만 기다려주세요 ..{' '}
    </p>
  </div>
);

export default Loading;
