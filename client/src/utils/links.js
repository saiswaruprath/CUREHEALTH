import { ImHistory,ImPushpin,ImUpload,ImSearch } from 'react-icons/im';

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
      icon: <ImPushpin />,
    },    
    
    {
      id: 2,
      text: 'Search/Filter Resources',
      path: 'getcentre',
      icon: <ImSearch />,
    },
    {
      id: 3,
      text: 'Upload Resources',
      path: 'upload',
      icon: <ImUpload />,
    },
    // {
    //   id: 4,
    //   text: 'resources',
    //   path: 'profile',
    //   icon: <ImProfile />,
    // },
    {
      id: 5,
      text: 'User History',
      path: 'user-profile',
      icon: <ImHistory />,
    },
  ];
  
  export default links;