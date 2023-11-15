import { ImHome,ImHistory,ImPushpin,ImUpload,ImSearch } from 'react-icons/im';
import { BsTranslate } from "react-icons/bs";


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
      id: 7,
      text: 'Dashboard',
      path: 'landing-page',
      icon: <ImHome />,
    }, 
    {
      id: 1,
      text: 'Find Centres',
      path: 'add-job',
      icon: <ImPushpin />,
    },    
    
    {
      id: 2,
      text: 'Search Resources',
      path: 'getcentre',
      icon: <ImSearch />,
    },
    {
      id: 3,
      text: 'Upload Articles ',
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
      path: 'user-history',
      icon: <ImHistory />,
    },
    {
      id: 6,
      text: 'Translation',
      path: 'translation',
      icon: <BsTranslate />,
    },
  ];
  
  export default links;