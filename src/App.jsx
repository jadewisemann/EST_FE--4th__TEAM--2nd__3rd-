// components
import {
  DetailsPage,
  LoginPage,
  MainPage,
  NotFoundPage,
  PaymentPage,
  SearchPage,
  StayListpage,
  SignupPage,
  UserInfoPage,
  WishlistPage,
  TestPage,
} from './pages';

import ProtectedRoute from './routes/ProtectedRoute';

// css
import './App.css';

// library
import { Routes, Route } from 'react-router-dom';

const App = () => (
  <Routes>
    <Route path='/' element={<MainPage />} />
    <Route path='/details' element={<DetailsPage />} />
    <Route path='/login' element={<LoginPage />} />
    <Route path='/payment' element={<PaymentPage />} />
    <Route path='/search' element={<SearchPage />} />
    <Route path='/result' element={<StayListpage />} />
    <Route path='/signup' element={<SignupPage />} />
    <Route path='/userinfo' element={<UserInfoPage />} />
    <Route path='/wishlist' element={<WishlistPage />} />
    <Route path='/*' element={<NotFoundPage />} />
    <Route path='/test' element={<TestPage />} />
    <Route element={<ProtectedRoute />}>
      {/* 로그인 해야만 접근 가능한 페이지를 위치시킬 곳 */}
    </Route>
  </Routes>
);

export default App;
