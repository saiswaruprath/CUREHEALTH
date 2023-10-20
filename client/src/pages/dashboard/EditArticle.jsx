import React, { useState, useEffect } from 'react';
import './editarticle.css'
import { Link } from 'react-router-dom';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import noimg from '../../assets/images/no-img.png';


function EditArticle() {




  const [data, setData] = useState([]);
  const [context, setContext] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [recentDocumentLoading, setRecentDocumentLoading] = useState(true);

  // eslint-disable-next-line no-unused-vars
  const [selectedType, setSelectedType] = useState('search');
  // eslint-disable-next-line no-unused-vars
  const [updateMessage, setUpdateMessage] = useState('');
  const [recentDocument, setRecentDocument] = useState(null);
  const [selectedFilterTopic, setSelectedFilterTopic] = useState('');
  const [isBrowseKnowledgeArticleClicked, setisBrowseKnowledgeArticleClicked] = useState(false);
  const [searchString, setSearchString] = useState('');
  const POLLING_INTERVAL = 5000;

  // Function to handle resource topic change
  const handleResourceTopicChange = (event) => {
    const selectedFilterTopic = event.target.value;
    setSelectedFilterTopic(selectedFilterTopic);
  };

  const handleUpdate = async () => {
    try {
      setRecentDocumentLoading(true);
      setSearchString(context)
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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleUpdate();
    }
  }

  function compareByRank(a, b) {
    return a.rank - b.rank;
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
    const imageUrl = item.thumbnails.startsWith('https://')
      ? item.thumbnails
      : `https://${item.thumbnails}`;


    return (
      <>
        <Card className='custom-card--container'>
          <div className="custom-card-image-container border-bottom--075 min-height--50">
            {imageUrl !== 'https://' ? <Card.Img variant="top" src={imageUrl} height={200} /> :
              <Card.Img variant="top" src={noimg} height={200} className='width-100' />
            }
          </div>
          <Card.Body>
            <Card.Title>{item.title}
              {item.url && <a target='_blank' rel="noreferrer" href={item.url}><i className="bi bi-box-arrow-up-right ms-2"></i></a>}
            </Card.Title>
            <Card.Subtitle>{item.topic}</Card.Subtitle>
            <Card.Text className='custom-styled-card'>
              {item.summary}
            </Card.Text>
            <Button variant="primary"><Link to={`/details/${item.title}`} onClick={() => localStorage.setItem('article-title', item.title)}>Know More</Link></Button>

            {item.url && <a className='custom-link' target='_blank' rel="noreferrer" href={item.url}> <Button variant="primary"><i className="bi bi-box-arrow-up-right me-1"></i>Source</Button></a>}

          </Card.Body>
        </Card>
        {/* 
        <div className="article-card"> 
          <a href={item.url} target="_blank" rel="noopener noreferrer"> Source Link </a>
          <h5>Title: {item.title}</h5>
          <h5>Topic: {item.topic}</h5>
          <img src={imageUrl} alt="thumbnail" width="250" height="170" />
          <p>Summary: {item.summary} </p>
          <Link to={`/details/${item.title}`} className="button">Open Details</Link>
        </div> 
        */}
      </>
    );
  };
  return (

    <div className="App">
      <div className="mb-2"><h2>Search and Filter Resources</h2></div>
      <div className='container'>
        <Stack className='custom-flex' gap={1}>
          {/* <div className="mb-2"><h2>WELCOME TO THE CURATED SEARCH AND FILTER RESOURCE CENTER!</h2></div> */}
          <div className=""><small>Please use below search option and provide the details of the topic of your search. Our application will match and display the top five resource for your needs.</small></div>
          <div className="mb-2"><small>You can also filter based on the resource topic below and check for available resources.</small></div>
        </Stack>
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
            onKeyDown={handleKeyDown}
          />
          <Button size='lg' variant="primary" id="search-button" className='z-0' onClick={handleUpdate}>
            Search
          </Button>
        </InputGroup>
        {/* <p>{updateMessage}</p> */}
        {(searchPerformed && recentDocumentLoading) && <h5 className='my-2 search-caption slide-top loading-dots'>We are checking the knowledge base for related articles</h5>}
        {(searchPerformed && !recentDocumentLoading) && <h5 className='my-2 search-caption slide-top'>Here is list of the top 5 ranked articles based on your query!</h5>}
        <div className='my-2 search-results'>
          {!recentDocumentLoading && searchPerformed ? (
            recentDocument ? (
              <>
                {data
                  .filter(item => !selectedFilterTopic || item.topic.toLowerCase().includes(selectedFilterTopic.toLowerCase()))
                  .filter(item => {
                    const lowerSearch = searchString.toLowerCase()
                    if (recentDocument[lowerSearch].includes(item.title)) {
                      for (const EACH_DOCUMENT in recentDocument[lowerSearch]) {
                        if (recentDocument[lowerSearch][EACH_DOCUMENT] === item.title)
                          item.rank = EACH_DOCUMENT
                      }
                      return item
                    }
                    return null
                  })
                  .sort(compareByRank)
                  .map((item, index) => {
                    const imageUrl = item.thumbnails.startsWith('https://')
                      ? item.thumbnails
                      : `https://${item.thumbnails}`;
                    return (
                      // <ArticleCard key={index} item={item} />
                      <>
                        <div className="p-0 card-position slide-right" key={index}>
                          <div className="card flex-row min-height-100">
                            <div className="card-header border-0 p-0 search-card--img">
                              {imageUrl !== 'https://' ? <Card.Img variant="top" src={imageUrl} height={100} /> :
                                <Card.Img variant="top" src={noimg} height={100} />
                              }
                            </div>
                            <div className="card-block p-0 w-100">
                              <Card.Title className='px-2'>
                              {item.url && <a target='_blank' rel="noreferrer" href={item.url}>{item.title}<i className="bi bi-box-arrow-up-right ms-2"></i></a>}
                                </Card.Title>
                              <Card.Subtitle className="px-2 mb-2 text-muted">{item.topic}</Card.Subtitle>
                              <Link to={`/details/${item.title}`} onClick={() => localStorage.setItem('article-title', item.title)}><button className="btn btn-primary btn-sm flex flex-row search-more-btn"><i className="bi bi-info-circle mx-1"></i> Know More</button></Link>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  })}
                {/* {Object.keys(recentDocument).map((topic, index) => {
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
                                    {answers.length > 1 && answers.map((answerObj, answerIndex) => (
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
                })} */}
              </>

            ) : (
              <p>No matching documents found.</p>
            )
          ) : (
            null
          )}
        </div>
        <Button variant='primary' className='mt-auto mb-4' onClick={(e) => toggleArticleMode()}>{isBrowseKnowledgeArticleClicked !== true ? 'Browse' : 'Hide'} Knowledge Articles</Button>
        {isBrowseKnowledgeArticleClicked && <div className="results">
          {data
            .filter(item => !selectedFilterTopic || item.topic.toLowerCase().includes(selectedFilterTopic.toLowerCase()))
            .map((item, index) => (
              <ArticleCard key={index} item={item} />
            ))}
        </div>}
      </div>
    </div>
  );
}

export default EditArticle;