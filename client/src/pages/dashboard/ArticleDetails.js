import { Link} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
function ArticleDetails({ data }) {
      

      const location = useLocation();
      const [customQuestion, setCustomQuestion] = useState('');
      const [recentDocumentLoading, setRecentDocumentLoading] = useState(true);
      const [updateMessage, setUpdateMessage] = useState('');
      const [recentDocument, setRecentDocument] = useState(null);
      const [searchPerformed, setSearchPerformed] = useState(false);
      const POLLING_INTERVAL = 1000;
 

      useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top on navigation
      }, [location]);

      const handleUpdate = async () => {
        try {
            setRecentDocumentLoading(true);
            const response = await fetch('/api/question-update', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: itemTitle, type: 'answer', value: customQuestion }),
              });
              const data = await response.json();
              setUpdateMessage(data.message);
              setSearchPerformed(true);
    
      
            } catch (error) {
              console.error('Error updating article:', error);
              setUpdateMessage('An error occurred while updating the article');
            }        
          };


          useEffect(() => {
            let pollTimer;
           
            const pollForRecentDocument = async () => {
              try {
                const response = await fetch('/api/question-document');
                const newData = await response.json();
          
                // Check if the new data matches the search criteria
                const matchingTopics = Object.keys(newData).filter(topic =>
                  topic.toLowerCase().includes(customQuestion.toLowerCase())
                );

                if (matchingTopics.length > 0) {
                  setRecentDocument(newData);
                  setRecentDocumentLoading(false); // Data has been fetched, loading complete
                  clearInterval(pollTimer); // Stop polling once data is available
                }
              } catch (error) {
                console.error('Error polling for recent documents:', error);
              }
            };
            
            if (searchPerformed && recentDocumentLoading) {
              pollTimer = setInterval(pollForRecentDocument, POLLING_INTERVAL);
            }
          
            return () => {
              clearInterval(pollTimer); // Clean up the interval when component unmounts
            };
            
          }, [searchPerformed, recentDocumentLoading, customQuestion]);


      const { itemTitle } = useParams();
     
      const newitem = data.find(item => item.title.includes(itemTitle));
    
      if (!newitem) {
        return <div>Article not found</div>;
      }
       
        const imageUrl = newitem.thumbnails.startsWith('https://')
        ? newitem.thumbnails
        : `https://${newitem.thumbnails}`;
    

        return (
      
    
              <div className="details">
                <Link to="/getcentre" className="button">Go Back</Link>
                <h4>Topic: {newitem.topic}</h4>
                <img src={imageUrl} alt="thumbnail" width="250" height="170" />
                <p><strong>Context:</strong> {newitem.context}</p>
                <p><strong>Summary:</strong> {newitem.summary}</p>
                <p>{newitem.questions && Object.keys(newitem.questions).map((question, index) => (
                  <div key={index}>
                    <p><strong>Question:</strong>{question}</p>
                    <ul>
                      {newitem.questions[question].map((answer, answerIndex) => (
                        <li key={answerIndex}>Answer:{answer.answer}</li>
                      ))}
                    </ul>
                  </div>
                ))}</p>

              <input
                type="text"
                placeholder="Enter your own question"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
               />
               <button onClick={handleUpdate}>Get Answers</button>
               

        <div className='Context-Search-Display'>
        {!recentDocumentLoading && searchPerformed ? (
          recentDocument ? (
           <>
          
              {Object.keys(recentDocument).map((topic, index) => {
                if (topic.toLowerCase().includes(customQuestion.toLowerCase())) {
                  return (
                    <div key={index} >
                
                      {recentDocument[topic].map((item, subIndex) => (
                        <div key={subIndex} className='article-card'>
        
                                  <ul>
                                     <li>Answer: {item.answer}</li>
                                  </ul>
                         </div>
            
                      ))}
                      </div>
                  );
                }
                return null;
              })}
          </>  
         
          ) : (
            <p>No matching documents found.</p>
          )
        ) : (
          <p>Please wait while we fetch the best possible match for your search...</p>
        )}
   </div>
</div>
);


}



export default ArticleDetails
