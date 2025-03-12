import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaMinus,
  FaPlus,
  FaArrowRight,
  FaSwimmingPool,
  FaSmoking,
  FaCheck,
} from 'react-icons/fa';
import { FaChildReaching, FaBanSmoking } from 'react-icons/fa6';
import {
  MdOutlinePerson,
  MdAlternateEmail,
  MdOutlineDining,
  MdPerson,
} from 'react-icons/md';
import { CiLock, CiCalendar, CiSearch } from 'react-icons/ci';
import { PiHouse } from 'react-icons/pi';
import { IoIosWifi, IoIosFitness } from 'react-icons/io';
import {
  IoClose,
  IoShareSocialOutline,
  IoBedSharp,
  IoLocationSharp,
} from 'react-icons/io5';
import { BsFillDoorOpenFill } from 'react-icons/bs';
import { LuArrowDownUp } from 'react-icons/lu';

const Icon = ({ name, color = '#8E51FF', size = 24, className = '' }) => {
  const icons = {
    // common
    home: PiHouse,
    search: CiSearch,
    email: MdAlternateEmail,
    lock: CiLock,
    profile: MdOutlinePerson,
    close: IoClose,
    sort: LuArrowDownUp,
    // calendar
    calendar: CiCalendar,
    arrow_right: FaArrowRight,
    // heart
    heart: FaRegHeart,
    heart_fill: FaHeart,
    // star
    star: FaRegStar,
    star_half: FaStarHalfAlt,
    star_fill: FaStar,
    // counter
    minus: FaMinus,
    plus: FaPlus,
    // detail
    share: IoShareSocialOutline,
    wifi: IoIosWifi,
    fitness: IoIosFitness,
    dining: MdOutlineDining,
    swimmingpool: FaSwimmingPool,
    door: BsFillDoorOpenFill,
    person: MdPerson,
    Children: FaChildReaching,
    bed: IoBedSharp,
    smoke: FaSmoking,
    smoke_non: FaBanSmoking,
    location: IoLocationSharp,
    check: FaCheck,
  };

  const IconName = icons[name];

  return <IconName color={color} size={size} className={className} />;
};

export default Icon;

// 사용법

// default
// 기본 컬러 : #8E51FF(primary Color), 기본 사이즈 : 24
// ex) <Icon name="profile"/>

// color 변경 시
// color 속성 추가
// ex) <Icon name="profile" color="#8E51FF"/>

// size 변경 시
// size 속성 추가
// ex) <Icon name="profile" size={18}/>

// tailwind css 추가 시
// ex) <Icon name="profile" color="#8E51FF" size={24} className='bg-red-100'/>
