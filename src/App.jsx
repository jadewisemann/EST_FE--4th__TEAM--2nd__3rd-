import { Routes, Route } from 'react-router-dom';

import ProtectedAuthRoute from './routes/ProtectedAuthRoute';
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
// @ test page
import LoginTestPage from './pages/@test/LoginTestPage';
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
      <Route path='/payment' element={<PaymentPage />} />
      <Route path='/userinfo' element={<UserInfoPage />} />
      <Route path='/wishlist' element={<WishlistPage />} />
      <Route path='/reservationdetail' element={<ReservationDetailPage />} />
      <Route path='/*' element={<NotFoundPage />} />
      <Route path='/test' element={<TestPage />} />
      <Route path='/result' element={<StayListpage />} />
      <Route path='/search' element={<SearchPage />} />

      {/* 로그인이 되어 있으면 접근 방지할 페이지*/}
      <Route element={<ProtectedAuthRoute />}>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/searchpassword' element={<SearchPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        {/* 로그인 해야만 접근 가능한 페이지를 위치시킬 곳 */}
      </Route>
      {/* test pages */}
      <Route path='/test/search' element={<SearchTestPage />} />
      <Route path='/test/modal' element={<ModalTestPage />} />
      <Route path='/test/reservation' element={<ReservationTestPage />} />
      <Route path='/test/login' element={<LoginTestPage />} />
    </Routes>
  </>
);

export default App;
