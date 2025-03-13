import Icon from './Icon';

// 상세페이지 평점
export default function ReviewRating({ rate }) {
  // 평점이 들어갈 배열 선언 (기본 값 0)
  const arr = [0, 0, 0, 0, 0];

  // 가득 채울 별 개수 (평점에서 소수점 버림 정수 값만 출력)
  const fill = Math.floor(rate);

  // rate가 0점이 아니면 실행
  if (rate !== 0) {
    // 평점 배열 중 위에서 구한 정수 값 까지 1로 변경
    arr.fill(1, 0, fill);
    // rate가 정수 값이 아니라면
    if (rate % 1 !== 0) {
      // 정수값이 끝난 index 부터 +1 개까지 정수로 나눈 나머지를 넣음 (0도 아닌 1도 아닌 값)
      arr.fill(rate % 1, fill, fill + 1);
    }
  }

  return (
    <div className='flex'>
      {/* 평점 배열 */}
      {arr.map((val, index) => (
        <span key={index}>
          {/* 값이 1이면 꽉찬 별, 값이 0이면 빈 별, 값이 0도 1도 아니면 반 채워진 별*/}
          {val === 1 ? (
            <Icon name='star_fill' size={14} />
          ) : val === 0 ? (
            <Icon name='star' size={14} />
          ) : (
            <Icon name='star_half' size={14} />
          )}
        </span>
      ))}
    </div>
  );
}

// 사용법
// <ReviewRating rate={3.2}></ReviewRating>;
