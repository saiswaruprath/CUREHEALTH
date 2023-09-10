import { IoBarChartSharp } from 'react-icons/io5';
import { MdQueryStats } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';

const links = [
    // {
    //   id: 1,
    //   text: 'home',
    //   path: 'add-job',     // '/'
    //   icon: <IoBarChartSharp />,
    // },
    // {
    //   id: 2,
    //   text: 'about',
    //   path: 'all-jobs',
    //   icon: <MdQueryStats />,
    // },
    {
      id: 1,
      text: 'Find Treatment Centre',
      path: 'add-job',
      icon: <FaWpforms />,
    },
    // {
    //   id: 4,
    //   text: 'resources',
    //   path: 'profile',
    //   icon: <ImProfile />,
    // },
    // {
    //   id: 5,
    //   text: 'contact',
    //   path: 'profile',
    //   icon: <ImProfile />,
    // },
    {
      id: 2,
      text: 'Search/Filter Resources',
      path: 'getcentre',
      icon: <ImProfile />,
    },
    {
      id: 3,
      text: 'Upload Resources',
      path: 'upload',
      icon: <ImProfile />,
    },
  ];
  
  export default links;