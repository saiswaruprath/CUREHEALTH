import {useEffect, useState} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { Error, Landing, Register, ProtectedRoute} from './pages'
import {AddJob, AllJobs, Profile, Stats, SharedLayout, Upload, ArticleUpdate, EditArticle, FetchArticles, ArticleDetails} from './pages/dashboard'



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
            <Route path="details/:itemTitle" element={<ArticleDetails data={data}  />} />
              

        </Route>
         <Route path='/register' element={<Register />} />
         <Route path='/landing' element={<Landing/>} />
         <Route path='*' element={<Error />} />
      </Routes>
       
    </BrowserRouter>
     
     
    
  );
}

export default App;

//replace ArticleUpdate with GetCentre
