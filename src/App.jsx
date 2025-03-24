import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './routes/ProtectedRoute';

import {
  DetailsPage,
  CheckoutPage,
  LoginPage,
  MainPage,
  NotFoundPage,
  PaymentPage,
  SearchPage,
  StayListpage,
  SignupPage,
  UserInfoPage,
  WishlistPage,
  OrderConfirm,
  ReservationDetailPage,
  TestPage,
  SearchPasswordPage,
} from './pages';
// @Testpage
import ModalTestPage from './pages/@test/ModalTestPage';
import ReservationTestPage from './pages/@test/ReservationTestPage';
import SearchTestPage from './pages/@test/SearchTestPage';

import ModalProvider from './components/modal/ModalProvider';
import ToastProvider from './components/ToastProvider';

// CSS
import './App.css';
import 'swiper/css';
import 'swiper/css/pagination';

const App = () => (
  <>
    <ModalProvider />
    <ToastProvider />
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path='/details/:hotelId' element={<DetailsPage />} />
      <Route path='/checkout/:roomId' element={<CheckoutPage />} />
      <Route path='/order-confirm' element={<OrderConfirm />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/payment' element={<PaymentPage />} />
      <Route path='/search' element={<SearchPage />} />
      <Route path='/result' element={<StayListpage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/userinfo' element={<UserInfoPage />} />
      <Route path='/wishlist' element={<WishlistPage />} />
      <Route path='/reservationdetail' element={<ReservationDetailPage />} />
      <Route path='/*' element={<NotFoundPage />} />
      <Route path='/test' element={<TestPage />} />
      <Route path='/searchpassword' element={<SearchPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        {/* 로그인 해야만 접근 가능한 페이지를 위치시킬 곳 */}
      </Route>
      {/* test pages */}
      <Route path='/test/search' element={<SearchTestPage />} />
      <Route path='/test/modal' element={<ModalTestPage />} />
      <Route path='/test/reservation' element={<ReservationTestPage />} />
    </Routes>
  </>
);

export default App;
