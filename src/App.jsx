// components
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
  ReservationDetailPage,
  TestPage,
} from './pages';

import ProtectedRoute from './routes/ProtectedRoute';

// css
import './App.css';
import 'swiper/css';
import 'swiper/css/pagination';

// library
import { Routes, Route } from 'react-router-dom';

const App = () => (
  <Routes>
    <Route path='/' element={<MainPage />} />
    <Route path='/details' element={<DetailsPage />} />
    <Route path='/checkout' element={<CheckoutPage />} />
    <Route path='/login' element={<LoginPage />} />
    <Route path='/payment' element={<PaymentPage />} />
    <Route path='/search' element={<SearchPage />} />
    <Route path='/result' element={<StayListpage />} />
    <Route path='/signup' element={<SignupPage />} />
    <Route path='/userinfo' element={<UserInfoPage />} />
    <Route path='/wishlist' element={<WishlistPage />} />
    <Route path='/order-confirm' element={<OrderConfirm />} />
    <Route path='/reservationdetail' element={<ReservationDetailPage />} />
    <Route path='/*' element={<NotFoundPage />} />
    <Route path='/test' element={<TestPage />} />
    <Route element={<ProtectedRoute />}>
      {/* 로그인 해야만 접근 가능한 페이지를 위치시킬 곳 */}
    </Route>
  </Routes>
);

export default App;
