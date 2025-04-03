import DateModal from './DateModal';
import GuestModal from './GuestModal';
import PasswordChangeModal from './PasswordChangeModal';
import SearchModal from './SearchModal';

const ModalProvider = () => (
  <>
    <DateModal />
    <GuestModal />
    <SearchModal />
    <PasswordChangeModal />
  </>
);

export default ModalProvider;
