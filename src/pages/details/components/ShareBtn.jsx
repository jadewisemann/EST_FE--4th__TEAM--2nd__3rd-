import { useEffect } from 'react';
import Icon from '../../../components/Icon';
const { Kakao } = window;

const ShareBtn = ({ product }) => {
  const realUrl =
    'https://est-fe-4th-team-2nd-3rd-git-deploy-test-jadewisemanns-projects.vercel.app/';

  useEffect(() => {
    Kakao.cleanup();
    Kakao.init('983d34c88017f45446c8245032e3722e');
  }, []);

  const shareKakao = () => {
    Kakao.Share.sendDefault({
      objectType: 'location',
      address: product.location[0],
      content: {
        title: product.title,
        imageUrl: product.image[0],
        link: {
          mobileWebUrl: 'https://developers.kakao.com',
          webUrl: 'https://developers.kakao.com',
        },
      },
      buttons: [
        {
          title: '웹으로 보기',
          link: {
            mobileWebUrl: realUrl,
            webUrl: realUrl,
          },
        },
      ],
    });
  };

  return (
    <>
      <button
        type='button'
        className='absolute top-3 right-3 z-1 cursor-pointer'
        onClick={shareKakao}
      >
        <Icon name='share' color='white' size={30} />
        <span className='sr-only'>공유하기</span>
      </button>
    </>
  );
};

export default ShareBtn;
