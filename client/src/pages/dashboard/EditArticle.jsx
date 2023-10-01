import React, { useState, useEffect } from 'react';
import './editarticle.css'
import { Link } from 'react-router-dom';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


function EditArticle() {




  const [data, setData] = useState([]);
  const [context, setContext] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [recentDocumentLoading, setRecentDocumentLoading] = useState(true);

  const [selectedType, setSelectedType] = useState('search');
  const [updateMessage, setUpdateMessage] = useState('');
  const [recentDocument, setRecentDocument] = useState(null);
  const [selectedFilterTopic, setSelectedFilterTopic] = useState('');
  const [isBrowseKnowledgeArticleClicked, setisBrowseKnowledgeArticleClicked] = useState(false);

  const POLLING_INTERVAL = 5000;

  // Function to handle resource topic change
  const handleResourceTopicChange = (event) => {
    const selectedFilterTopic = event.target.value;
    setSelectedFilterTopic(selectedFilterTopic);
  };
  const handleUpdate = async () => {
    try {
      setRecentDocumentLoading(true);
      const response = await fetch('/api/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: selectedType, value: context }),
      });
      const data = await response.json();
      setUpdateMessage(data.message);
      setSearchPerformed(true);


    } catch (error) {
      console.error('Error updating article:', error);
      setUpdateMessage('An error occurred while updating the article');
    }



  };

  const toggleArticleMode = () => {
    let toggleMode = !isBrowseKnowledgeArticleClicked
    setisBrowseKnowledgeArticleClicked(toggleMode);
  }


  useEffect(() => {
    let pollTimer;

    const pollForRecentDocument = async () => {
      try {
        const response = await fetch('/api/recent-document');
        const newData = await response.json();

        // Check if the new data matches the search criteria
        const matchingTopics = Object.keys(newData).filter(topic =>
          topic.toLowerCase().includes(context.toLowerCase())
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

  }, [searchPerformed, recentDocumentLoading, context]);



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

  const ArticleCard = ({ item }) => {
    //  const [expanded, setExpanded] = useState(false);
    // console.log(item)
    const imageUrl = item.thumbnails.startsWith('https://')
      ? item.thumbnails
      : `https://${item.thumbnails}`;


    return (
      <>
        <Card className='custom-card--container'>
          <Card.Img variant="top" src={imageUrl} height={200} className='border-bottom--075 min-height--50' />
          <Card.Body>
            <Card.Title>Title: {item.title}</Card.Title>
            <Card.Title>Topic: {item.topic}</Card.Title>
            <Card.Text className='custom-styled-card'>
              {item.summary}
            </Card.Text>
            <Button variant="primary"><Link to={`/details/${item.title}`}>Know More</Link></Button>
          </Card.Body>
        </Card>
        {/* <div className="article-card"> 
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          Source Link
        </a>
        
        <br />

        <h5>Title: {item.title}</h5>

        <br />
        
         <h5>Topic: {item.topic}</h5>

         <br />
        
         <img src={imageUrl} alt="thumbnail" width="250" height="170" />
         <br />

          <p>Summary: {item.summary} </p>

        <Link to={`/details/${item.title}`} className="button">Open Details</Link>
        
      </div> */}
      </>
    );
  };

  // console.log(recentDocument)
  return (

    <div className="App">
      <Stack className='custom-flex' gap={1}>
        {/* <div className="mb-2"><h2>WELCOME TO THE CURATED SEARCH AND FILTER RESOURCE CENTER!</h2></div> */}
        <div className="mb-2"><h2>Search and Filter Resources</h2></div>
        <div className=""><small>Please use below search option and provide the details of the topic of your search. Our application will match and display the top five resource for your needs.</small></div>
        <div className="mb-2"><small>You can also filter based on the resource topic below and check for available resources.</small></div>
      </Stack>
      {/* <h3>WELCOME TO THE CURATED SEARCH AND FILTER RESOURCE CENTER!</h3>  
        <p>Please use below search option and provide the details of the topic of your search. Our application will match and display the top five resource for your needs.</p> 
        <p>You can also filter based on the resource topic below and check for available resources.</p> */}
      <div className="filters">
        <Stack direction="horizontal" gap={3} className='align-items-center w-50 mt-2'>
          <Form.Label htmlFor="resourceTopic" className='text-nowrap m-0'>Resource Topic:</Form.Label>
          <Form.Select aria-label="Filter By Resource Topic" id="resourceTopic" onChange={handleResourceTopicChange}>
            <option value="">All</option>
            <option value="Mental Health">Mental Health</option>
            <option value="Substance Use">Substance Use</option>
            <option value="Domestic Violence">Domestic Violence</option>
            <option value="Native Hawaains">Native Hawaiians</option>
          </Form.Select>
        </Stack>
      </div>

      <InputGroup size="md" className='mt-2'>
        <InputGroup.Text id="search-input-group"><i className="bi bi-search"></i></InputGroup.Text>
        <Form.Control
          aria-label="Search Box"
          aria-describedby="inputGroup-sizing-sm"
          onChange={(e) => setContext(e.target.value)}
        />
        <Button variant="primary" id="search-button" className='z-0' onClick={handleUpdate}>
          Search
        </Button>
      </InputGroup>
      {/* <label>
        <input
          type="radio"
          value="search"
          checked={selectedType === 'search'}
          onChange={() => setSelectedType('search')}
        />
        Search
      </label>
      <input
        type="text"
        placeholder={`Enter ${selectedType === 'search' ? 'context' : 'URL'}`}
        value={context}
        onChange={(e) => setContext(e.target.value)}
      />
      <button onClick={handleUpdate}>Search</button> */}
      {/* <p>{updateMessage}</p> */}
      <div className='my-2'>
        {!recentDocumentLoading && searchPerformed ? (
          recentDocument ? (
            <>

              {Object.keys(recentDocument).map((topic, index) => {
                if (topic.toLowerCase().includes(context.toLowerCase())) {
                  return (
                    <div key={index} >
                      <h2>{topic}</h2>
                      {recentDocument[topic].map((item, subIndex) => (
                        <div key={subIndex} className='article-card'>
                          <h4>Title: {item.title}</h4>
                          <h3>Related topic: {item.topic}</h3>
                          <img src={item.thumbnails} alt="thumbnail" width="250" height="170" />
                          <p>Summary: {item.summary}</p>
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            Source Link
                          </a>
                          {item.questions && (

                            <div>
                              {Object.entries(item.questions).map(([questionText, answers], questionIndex) => (
                                <div key={questionIndex}>
                                  <p><strong>Question:</strong> {questionText}</p>
                                  {answers.length>1 && answers.map((answerObj, answerIndex) => (
                                    <div key={answerIndex} className="answers">
                                      <p><strong>Answer:</strong> {answerObj.answer}</p>

                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
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
          null
        )}
      </div>
      <Button variant='primary' className='mt-auto mb-4' onClick={(e)=>toggleArticleMode()}>{isBrowseKnowledgeArticleClicked!==true? 'Browse': 'Hide'} Knowledge Articles</Button>
      {isBrowseKnowledgeArticleClicked && <div className="results">
        {data
          .filter(item => !selectedFilterTopic || item.topic.toLowerCase().includes(selectedFilterTopic.toLowerCase()))
          .map((item, index) => (
            <ArticleCard key={index} item={item} />
          ))}
      </div>}
    </div>
  );
}

export default EditArticle;


