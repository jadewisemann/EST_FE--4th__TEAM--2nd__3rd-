import { Routes, Route, useLocation } from 'react-router-dom';

import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

import {
  DetailsPage,
  CheckoutPage,
  LoginPage,
  MainPage,
  NotFoundPage,
  PaymentPage,
  SignupPage,
  UserInfoPage,
  WishlistPage,
  OrderConfirm,
  ReservationDetailPage,
  SearchResultPage,
  MyPage,
  FindPasswordPage,
} from './pages';

import ModalProvider from './components/modal/ModalProvider';
import ToastProvider from './components/ToastProvider';

import './App.css';
import 'swiper/css';
import 'swiper/css/pagination';

import TopButton from './components/TopButton';

const App = () => {
  const location = useLocation();

  // 페이지별로 bottom 값 설정
  const bottomValue = () => {
    if (location.pathname.startsWith('/details/')) return 16;
    if (location.pathname.startsWith('/checkout/')) return 144;
    if (location.pathname.startsWith('/reservation-detail/')) return 108;
  };

  return (
    <>
      <ModalProvider />
      <ToastProvider />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/details/:hotelId' element={<DetailsPage />} />

        <Route path='/order-confirm' element={<OrderConfirm />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/user-info' element={<UserInfoPage />} />
        <Route path='/wishlist' element={<WishlistPage />} />
        <Route
          path='/reservation-detail/:roomId/:reservationId'
          element={<ReservationDetailPage />}
        />
        <Route path='/test' element={<TestPage />} />
        <Route path='/search-result' element={<SearchResultPage />} />

      <Route element={<PublicRoute />}>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/find-password' element={<FindPasswordPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path='/mypage' element={<MyPage />} />
        <Route path='/checkout/:roomId' element={<CheckoutPage />} />
      </Route>

      <Route path='/*' element={<NotFoundPage />} />
    </Routes>
  </>
);

export default App;
