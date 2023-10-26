import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Error, Landing, Register, ProtectedRoute } from './pages'
import { AddJob, AllJobs, Profile, SharedLayout, Upload, EditArticle, ArticleDetails, UserHistory, Translation, UserProfile, LandingPage } from './pages/dashboard'
// import { Stats, ArticleUpdate, FetchArticles } from './pages/dashboard'
import { LoadScript } from '@react-google-maps/api';


function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData);
      })

      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  return (


    // <Chat />
    <LoadScript googleMapsApiKey='AIzaSyBIQlGq1fABBG_lC0dqDGVJ68fITqF1QLU' libraries={['places']}>
      <BrowserRouter>
        <Routes>
          <Route path='/'
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>} >
            {/* <Route index element={<Stats />} /> */}
            <Route path='all-jobs' element={<AllJobs />} />
            <Route path='add-job' element={<AddJob />} />
            <Route path='profile' element={<Profile />} />
            <Route path='getcentre' element={<EditArticle />} />
            <Route path='upload' element={<Upload />} />
            <Route path="details/:itemTitle" element={<ArticleDetails data={data} />} />
            <Route path='user-history' element={<UserHistory />} />
            <Route path='user-profile' element={<UserProfile />} />
            <Route path='translation' element={<Translation />} />
            <Route path='landing-page' element={<LandingPage />} />

          </Route>
          <Route path='/register' element={<Register />} />
          <Route path='/landing' element={<Landing />} />
          <Route path='*' element={<Error />} />
        </Routes>

      </BrowserRouter>
    </LoadScript>


  );
}

export default App;

//replace ArticleUpdate with GetCentre
