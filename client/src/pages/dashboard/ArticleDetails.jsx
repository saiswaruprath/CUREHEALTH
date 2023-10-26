import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './articledetails.css';
import Accordion from 'react-bootstrap/Accordion';
import noimg from '../../assets/images/no-img.png';

function ArticleDetails({ data }) {
  const location = useLocation();
  const [customQuestion, setCustomQuestion] = useState('');
  const [recentDocumentLoading, setRecentDocumentLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [updateMessage, setUpdateMessage] = useState('');
  const [recentDocument, setRecentDocument] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const POLLING_INTERVAL = 3000;


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
      // reloadData();
      // setnewitem(data.find(item => item.title.includes(itemTitle)));

    } catch (error) {
      console.error('Error updating article:', error);
      setUpdateMessage('An error occurred while updating the article');
    }
  };

  const reloadData = async () => {
    fetch('/api/data')
      .then(response => response.json())
      .then(jsonData => {
        data = jsonData
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
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

  const itemTitle = localStorage.getItem('article-title');;

  const newitem = data.find(item => item.title.includes(itemTitle));

  // const [newitem,setnewitem] = useState(data.find(item => item.title.includes(itemTitle)));
  // console.log(newitem);

  if (!newitem) {
    return <div>Article not found</div>;
  }

  const imageUrl = newitem.thumbnails.startsWith('https://')
    ? newitem.thumbnails
    : `https://${newitem.thumbnails}`;


  return (
    <>
      <h2 className='details-header'>Article: {itemTitle}</h2>
      <div className="container details--container">
        <div className="details-header--container">
          <Link to="/getcentre" className="btn btn-primary"><i class="bi bi-arrow-left-circle"></i> Back</Link>
        </div>
        <div className="details-image--container" >
          {imageUrl !== 'https://' ? <img src={imageUrl} alt="thumbnail" /> :
            <img variant="top" src={noimg} height={200} className='min-height--50' />
          }
        </div>
        <div className="details-content--container">
          <Accordion defaultActiveKey={['0']} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Summary:</Accordion.Header>
              <Accordion.Body>
                <p><strong>Topic:  {newitem.topic}</strong></p>
                <p>{newitem.summary}</p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Context:</Accordion.Header>
              <Accordion.Body>
                <p>{newitem.context}</p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Frequently Asked Questions:</Accordion.Header>
              <Accordion.Body>
                <div className="details-answers--container">
                  <div>{newitem.questions && Object.keys(newitem.questions).map((question, index) => (
                    <div className="bb-1 details-answers--single" key={index}>
                      <p className='mb-0 max-width--unset'><strong>{question}</strong></p>
                      <ul>
                        {newitem.questions[question].map((answer, answerIndex) => (
                          <li key={answerIndex}><strong>Answer:</strong> {answer.answer}</li>
                        ))}
                      </ul>
                    </div>
                  ))}</div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="form-floating col-12 mt-3">
            <input
              type="text"
              className="form-control"
              id="question-form-control"
              placeholder="Enter your question here"
              name="Question"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
            />
            <label htmlFor="formGroupSubject" className="">
              Enter your question here
            </label>
            <button className='btn btn-primary mt-2' onClick={handleUpdate}>Check Answer</button>
          </div>
          

        </div>

        <div className='details-questions--container'>
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
                              <li>Answer Para: {item.answer_paragraph}</li>
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
            <p>{searchPerformed && <>Please wait while we fetch the best possible match for your search...</>}</p>
          )}
        </div>
      </div>
    </>
  );

}



export default ArticleDetails
