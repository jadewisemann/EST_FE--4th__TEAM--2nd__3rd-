import { useReservationWithAuth } from '../../store/reservationStore';

const ReservationTestPage = () => {
  const { reservations, loading, error } = useReservationWithAuth();
  console.log(reservations);

  if (loading) return <div className='text-center'>로딩 중</div>;
  if (error) return <div className='text-center'>오류: {error}</div>;

  const formatDate = timestamp => {
    if (!timestamp) return '날짜 없음';

    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }

    if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    }

    return String(timestamp);
  };

  return (
    <div className='mx-auto flex w-fit flex-col items-center gap-3 p-5'>
      <h2 className='text-4xl'>예약</h2>
      {reservations.length === 0 ? (
        <p>예약 정보 없음</p>
      ) : (
        <div className='flex flex-col items-center justify-center gap-2'>
          {reservations.map(reservation => (
            <ul className='list-disc' key={reservation.id}>
              <li>금액: {reservation.amount}</li>
              <li>체크인: {formatDate(reservation.checkIn)}</li>
              <li>체크아웃: {formatDate(reservation.checkOut)}</li>
              <li>생성 시간: {formatDate(reservation.createAt)}</li>
              <li>인원 수: {reservation.guestCount}</li>
              <li>호텔 ID: {reservation.hotelId}</li>
              <li>호텔 이름: {reservation.hotelName}</li>
              <li>결제일: {formatDate(reservation.paymentDate)}</li>
              <li>예약일: {formatDate(reservation.reservedAt)}</li>
              <li>상태: {reservation.status}</li>
              <li>사용자 ID: {reservation.userId}</li>
            </ul>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationTestPage;
