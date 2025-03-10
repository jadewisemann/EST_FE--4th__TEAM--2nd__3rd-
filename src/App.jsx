// components
import { 
  DetailsPage,
  LoginPage,
  MainPage,
  NotFoundPage,
  PaymentPage,
  SearchPage,
  SearchResultPage,
  SignupPage,  
  UserInfoPage,
  WishlistPage,
  TestPage
} from './pages'

// css
import './App.css'

// library
import { Routes, Route } from 'react-router-dom'


const App = () => (
  <Routes>
    <Route path="/" element={<MainPage />}/>
    <Route path="/details" element={<DetailsPage />}/>
    <Route path="/login" element={<LoginPage />}/>
    <Route path="/payment" element={<PaymentPage />}/>
    <Route path="/search" element={<SearchPage />}/>
    <Route path="/result" element={<SearchResultPage />}/>
    <Route path="/signup" element={<SignupPage />}/>
    <Route path="/userinfo" element={<UserInfoPage />}/>
    <Route path="/wishlist" element={<WishlistPage />}/>
    <Route path="/*" element={<NotFoundPage />}/>
    <Route path="/test" element={<TestPage />}/>
  </Routes>
)

export default App
