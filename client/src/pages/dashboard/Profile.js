
// import React, { useState } from "react";


// function Profile() {
//   const [experience, setExperience] = useState("");
//   const [photos, setPhotos] = useState([]);
//   const [files, setFiles] = useState([]);
//   const [link, setLink] = useState("");

//   const handleExperienceChange = (event) => {
//     setExperience(event.target.value);
//   };

//   const handlePhotoChange = (event) => {
//     const selectedPhotos = Array.from(event.target.files);
//     setPhotos(selectedPhotos);
//   };

//   const handleFileChange = (event) => {
//     const selectedFiles = Array.from(event.target.files);
//     setFiles(selectedFiles);
//   };

//   const handleLinkChange = (event) => {
//     setLink(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     // Perform any necessary actions with the collected data (e.g., save to a server)

//     // Reset form fields
//     setExperience("");
//     setPhotos([]);
//     setFiles([]);
//     setLink("");
//   };

//   return (
//     <div className="container">
//       <h1 className="title">Share Your Experience</h1>
//       <h2 className="subheading">Substance Abuse</h2>
//       <form className="form" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="experience">Experience:</label>
//           <textarea
//             id="experience"
//             value={experience}
//             onChange={handleExperienceChange}
//             required
//             className="textarea"
//           ></textarea>
//         </div>

//         <div className="form-group">
//           <label htmlFor="photos">Photos:</label>
//           <input
//             id="photos"
//             type="file"
//             accept="image/*"
//             multiple onChange={handlePhotoChange}
//             className="file-input"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="files">Files:</label>
//           <input
//             id="files"
//             type="file"
//             accept=".pdf,.doc,.docx"
//             multiple onChange={handleFileChange}
//             className="file-input"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="link">Link:</label>
//           <input
//             id="link"
//             type="text"
//             value={link}
//             onChange={handleLinkChange}
//             className="text-input"
//           />
//         </div>

//         <button type="submit" className="submit-button">Submit</button>
//       </form>
//     </div>


  


//   );
// }

// export default Profile;








import React, { useRef, useEffect, useState } from 'react';
import './article.css';


const articles = {
  'Mental Health': [
    {
      
      title: 'MHTTC Therapy',
      image: 'https://mhttcnetwork.org/sites/mhttc/files/inline-images/provider-well-b_cropped.png', //    require('./images/screen1.png').default,
      link: 'https://mhttcnetwork.org/centers/pacific-southwest-mhttc/event/workshop-1-mi-july-cognitive-behavioral-therapy-cbt',
      
    },
    {
      title: 'Fight Stigma',
      image: 'https://www.urban.org/sites/default/files/2019/05/20/shutterstock_320450978_cropped.jpg',
      link: 'https://www.urban.org/urban-wire/fighting-stigma-mental-health-among-asian-americans-and-pacific-islanders',
    },
    {
      title: 'Destigmatizing Mental Health',
      image: 'https://www.samhsa.gov/sites/default/files/400px-400px-SAMHSA-LOGO-THUMBNAIL-BLUE.jpg',
      link: 'https://www.samhsa.gov/blog/destigmatizing-mental-health-asian-american-pacific-islander-communities',
    },
    {
      title: 'Health Care Disparities',
      image: 'https://www.kff.org/wp-content/themes/kaiser-foundation-2016/static/images/kff-logo-black-feature.png',
      link: 'https://www.kff.org/racial-equity-and-health-policy/issue-brief/health-care-disparities-among-asian-native-hawaiian-and-other-pacific-islander-nhopi-people/',
    },
    {
      title: 'NAMI',
      image: 'https://www.opportunityhome.org/wp-content/uploads/2018/03/nami-logo-blue-002.jpg',
      link: 'https://www.nami.org/Your-Journey/Identity-and-Cultural-Dimensions/Asian-American-and-Pacific-Islander',
    },
    {
      title: 'NIMH',
      image: 'https://www.nimh.nih.gov/sites/default/files/images/about/strategic/nimh-sp-icon_2.png',
      link: 'https://www.nimh.nih.gov/',
    },
    // Add more articles as needed
  ],
  'Domestic Abuse': [
    {
      title: 'Asian Womens Shelter',
      image: 'https://images.squarespace-cdn.com/content/v1/5cd2610716b6402cb2bec715/1557300655095-DK9WF5EV4B3L5MYCFOMW/AWS+Protesting+Group.jpg?format=2500w',
      link: 'https://www.sfaws.org/',
    },
    {
      title: 'National Indigenous Womens Resource Center',
      image: 'https://www.niwrc.org/themes/niwrc/dist/images/mobile-logo.svg',
      link: 'https://www.niwrc.org/restoration-magazine/june-2019/pouhana-o-na-wahine-update',
    },
    // Add more articles as needed
  ],
  'Substance use': [
    {
      title: 'Barriers for Substance Use',
      image: 'https://v1.padlet.pics/1/image.webp?t=ar_1.4198047419804742%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F915d766cd8abb2601abc254e721815cd317bb964%2F5f325875208e23c742e780305e426458-h-368af621121eba4df2c6d9eb090695bd.png',
      link: 'https://ireta.org/barriers-to-substance-use-disorder-treatment-in-asian-americans-pacific-islanders/',
    },
    {
      title: 'NLM',
      image: 'https://v1.padlet.pics/1/image.webp?t=ar_1.9138755980861244%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F5bfe0f1df33a262c05996fa5e899fc336469cf70%2F7d96c86a86c7cc1a06ba89848b5303ce-h-b754e2fcc6a219bc2167db61d8c0f5bc.jpg',
      link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9783813/?report=classic',
    },
    {
      title: 'NAPAFASA',
      image: 'https://v1.padlet.pics/1/image.webp?t=ar_1.25%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F65acfd7c051ca56a629b851bd95c5f318a0389d0%2Fbhwebsnap-8c7e2cccd698cfb96b2dc2883a867c5947695d3a-h-efeed9207af4afab698ddbbee39f20a0.png',
      link: 'https://napafasa.org/',
    },
    {
      title: 'Recovery Dharma Online',
      image: 'https://v1.padlet.pics/1/image.webp?t=ar_1.6517549896765313%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2Fdab15b135b8d05868fe97a80b576129f0c0db5ba%2F1914dd1c2708b9a7059e1bca15679ed2-h-d30ef94028e7f87a3a3fa7c356ba92b3.png',
      link: 'https://recoverydharma.online/about/',
    },
    // Add more articles as needed
  ],
  'Native Hawaiians': [
    {
      title: '42 U.S. Code § 11701 - Findings',
      image: 'https://v1.padlet.pics/2/image.webp?t=ar_1.4591194968553458%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F6285c90758948e918f730a5255b75398067ebbfb%2Fc94120016edd8efcb66f64e286d8d230-h-065ff15f7e031a439f2ff33b77cc2f26.gif',
      link: 'https://www.law.cornell.edu/uscode/text/42/11701',
    },
    {
      title: '42 U.S. Code Chapter 122 - NATIVE HAWAIIAN HEALTH CARE',
      image: 'https://v1.padlet.pics/2/image.webp?t=ar_1.4591194968553458%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F6285c90758948e918f730a5255b75398067ebbfb%2Fc94120016edd8efcb66f64e286d8d230-h-065ff15f7e031a439f2ff33b77cc2f26.gif',
      link: 'https://www.law.cornell.edu/uscode/text/42/chapter-122',
    },
    // Add more articles as needed
  ],
  'Pacific Islanders': [
    {
      title: 'PIPCA',
      image: 'https://v1.padlet.pics/1/image.webp?t=ar_1.171875%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F748e575e4061975c906ec94e8ecd5d56bde5c87c%2F282e1edd1a5c6d08b4d81503a1913731-h-10d846cc8bf14dd8097a3d82aa9b35c9.png',
      link: 'https://pacificislandspca.org/members/',
    },
    {
      title: 'PIKO',
      image: 'https://piko.jabsom.hawaii.edu/wp-content/uploads/2022/03/Logo-Only-125-x-125-transparent.png',
      link: 'https://piko.jabsom.hawaii.edu/',
    },
    // Add more articles as needed
  ],
  'Asian Americans': [
    {
      title: 'APIAHF',
      image: 'https://v1.padlet.pics/1/image.webp?t=ar_1.9047619047619047%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F29ca61bbf25ef1f6fdb019b39d661e10bd155710%2F255b776b5cee1f9f9a188733eee8e2eb-h-3ea9bc1a11ba9cc5524033bb32be3d54.png',
      link: 'https://www.apiahf.org/',
    },
    {
      title: 'AACFMD',
      image: 'https://v1.padlet.pics/1/image.webp?t=ar_4%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F0e1c3b2bce1890efb66858dbaa2eef5f80ed40ac%2F9f69515f02f8cebe28d3b7fc4cac015f-h-cd001ef920bea0d233ae3ca4825ffa0e.jpg',
      link: 'https://aacfmd.org/contact-us/',
    },
    // Add more articles as needed
  ],
  'Government Orgs': [
    {
      title: 'CDC',
      image: 'https://v1.padlet.pics/1/image.webp?t=ar_1.9047619047619047%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2Fb47d02cb47dbc922d4ba71bb74dd455feebb2c95%2F2800e290da2b3a7d9d01c1a72143c815-h-01b0b5cd4aeb9d348953e6593c2f2f1c.png',
      link: 'https://www.cdc.gov/',
    },
    {
      title: 'Department of Education',
      image: 'https://v1.padlet.pics/1/image.webp?t=ar_1.6%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F6b59d697cf34735e1be9e83d7081ed79b3654903%2F07229a3853ab294ab717b8d139039e99-h-9f3e3389d94aa4b61c6ee2f5c77824a1.png',
      link: 'https://oese.ed.gov/offices/office-of-formula-grants/rural-insular-native-achievement-programs/native-hawaiian-education/',
    },
    {
      title: 'LIVESTRONG',
      image: 'https://v1.padlet.pics/1/image.webp?t=ar_1.3252747252747252%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F6e8db538bcfab55cd3010f2be5f563ef2166c6e7%2F5079a7ba65e59849d40628ec298a6843.png',
      link: 'https://www.livestrong.org/',
    },
    {
      title: 'NAOCHC',
      image: 'https://v1.padlet.pics/1/image.webp?t=ar_1.2414772727272727%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F219cb1bcf94e7a1778df15f7595097e54956d664%2F331b34214e9291a3aa51157b2ef7ac9e-h-db4cb32494b065a8cfc0238ddc94224c.png',
      link: 'https://www.nachc.org/',
    },
    {
      title: 'NIH',
      image: 'https://v1.padlet.pics/1/image.webp?t=ar_6.5%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F65bc282291b45b2f672658a9b9e37e4c06d65eb8%2F7f405fd0c4424e651f6cfb583c0b6657-h-0340c3c62cfd29cc699191e1b2a73d00.png',
      link: 'https://www.nih.gov/',
    },
    // Add more articles as needed
  ],
  'Other Behavioral Health': [
    {
      title: 'AHRQ',
      image: 'https://v1.padlet.pics/1/image.webp?t=ar_0.7722007722007722%2Cc_lfill%2Cdpr_2%2Cg_auto%2Cw_240&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F70bab868ac6adfba394391046410a21e78b39439%2F593682515d099482d348c2d0668b83db-h-960b695222e8f3f8a5dc9d929ef3d834.png',
      link: 'https://www.ahrq.gov/research/findings/nhqrdr/chartbooks/asian-nhpi/index.html',
    },
    {
      title: 'AAP',
      image: 'https://www.aap.org/contentassets/970c728e04fa4398982b9793c6c777c0/girl-hispanic-teen-thinking-ethnic-white-depressed-stressed-anxiety-worried.jpg',
      link: 'https://www.aap.org/en/news-room/campaigns-and-toolkits/suicide-prevention/',
    },
    // Add more articles as needed
  ],
};

const Section = ({ title, articles }) => {
  const articlesRef = useRef(null);
  const [startIndex, setStartIndex] = useState(0);
  const [isTop, setIsTop] = useState(true);
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (articlesRef.current) {
        setIsTop(articlesRef.current.scrollTop === 0);
        setIsBottom(
          articlesRef.current.scrollTop + articlesRef.current.clientHeight ===
            articlesRef.current.scrollHeight
        );
      }
    };

    if (articlesRef.current) {
      articlesRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (articlesRef.current) {
        articlesRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleScrollUp = () => {
    if (articlesRef.current) {
      setStartIndex((prevStartIndex) => Math.max(prevStartIndex - 2, 0));
      articlesRef.current.scrollTop -= 200;
      setIsBottom(false);
    }
  };

  const handleScrollDown = () => {
    if (articlesRef.current) {
      setStartIndex((prevStartIndex) =>
        Math.min(prevStartIndex + 2, articles.length - 2)
      );
      articlesRef.current.scrollTop += 200;
      setIsTop(false);
    }
  };



  return (
    <div className="section">
      <h2>{title}</h2>
      <div className="articles-container">
      <button
          className={`scroll-button scroll-up${isTop ? ' disabled' : ''}`}
          onClick={handleScrollUp}
          disabled={isTop}
        >&uarr;
        </button>
        <div className="articles" ref={articlesRef}>
          {articles
            .slice(startIndex, startIndex + 2)
            .map((article, index) => (
              <div
                key={index}
                className="article"
                style={{ display: 'block' }}
              >
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                 
                 <img src={article.image} alt={article.title} /> 
                <h3>{article.title}</h3>
                <p>{article.content}</p>
                </a>
              </div>
          ))}
        </div>
        <button
          className={`scroll-button scroll-down${isBottom ? ' disabled' : ''}`}
          onClick={handleScrollDown}
          disabled={isBottom}
        >
        &darr;
        </button>
      </div>
    </div>
  );
};

  

function Profile(){
  return (
    <div>
    <h1>AANHPI ‘Ohana Center of Excellence Resources</h1>
    <div className="sections-container">
      {Object.entries(articles).map(([section, sectionArticles]) => (
        <Section key={section} title={section} articles={sectionArticles} />
      ))}
    </div>
  </div>
  );
 }

export default Profile;