import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import './editarticle.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const UserHistory = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchEmail, setSearchEmail] = useState("");

    const handleSearchSubmit = async () => {
        try {
            const response = await fetch(`/search?userid=${searchEmail}`);
            const data = await response.json();
            setSearchResults(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleSearchInputChange = (event) => {
        setSearchEmail(event.target.value);
    };

    return (
        <>
            <div className="search-section">
                <h2 className="text-center">User's History</h2>
                <div className="container mb-4">
                    <InputGroup size="md" className="mt-2">
                        <InputGroup.Text id="search-input-group font-weight-bold">
                            User ID / Email :
                        </InputGroup.Text>
                        <Form.Control
                            aria-label="Search Box"
                            aria-describedby="inputGroup-sizing-sm"
                            value={searchEmail}
                            onChange={handleSearchInputChange}
                        />
                        <Button
                            size="lg"
                            variant="primary"
                            id="search-button"
                            className="z-0"
                            onClick={handleSearchSubmit}
                        >
                            Search
                        </Button>
                    </InputGroup>
                    {searchResults.length > 0 && (
                        <div classname="search-results-container">
                            <h4 className="text-center my-2">Search Results:</h4>
                            <ul>
                                {searchResults.map((result) => (
                                    <li key={result.userid} className="search-results-card mb-4">
                                        <Card>
                                            <Card.Header className="text-center"><strong>{result.subject}</strong></Card.Header>
                                            <ListGroup className="list-group-flush">
                                                <ListGroup.Item><strong>Topic:</strong> {result.topic}</ListGroup.Item>
                                                <ListGroup.Item><strong>Type:</strong> {result.type}</ListGroup.Item>
                                            </ListGroup>
                                            <Card.Body>
                                                <blockquote className="blockquote mb-1">
                                                    <p>
                                                        <strong>Content:</strong> {result.content}
                                                    </p>
                                                    <footer className="mt-1 blockquote-footer">
                                                        Published by: <cite title="user">{result.userid}</cite> on <cite title="time-stamp">{result.date} {result.time}</cite>
                                                    </footer>
                                                </blockquote>
                                            </Card.Body>
                                            <ListGroup className="list-group-flush">
                                                {result.urls.length > 0 && (
                                                    <>
                                                        <ListGroup.Item>
                                                            <strong>URL's:</strong>
                                                            <ul>
                                                                {result.urls.map((url) => (
                                                                    <li key={url}>{url}</li>
                                                                ))}
                                                            </ul>
                                                        </ListGroup.Item>
                                                    </>
                                                )}

                                                {result.images.length > 0 && (<>
                                                    <ListGroup.Item>
                                                        <strong>Images:</strong>
                                                        <ul>
                                                            {result.images.map((image) => (
                                                                <li key={image.name}>{image.name}</li>
                                                            ))}
                                                        </ul>
                                                    </ListGroup.Item>
                                                </>
                                                )}

                                                {result.pdfs.length > 0 && (<>
                                                    <ListGroup.Item>
                                                        <strong>PDF's:</strong>
                                                        <ul>
                                                            {result.pdfs.map((pdfs) => (
                                                                <li key={pdfs.name}>{pdfs.name}</li>
                                                            ))}
                                                        </ul>
                                                    </ListGroup.Item>
                                                </>
                                                )}

                                                {result.videos.length > 0 && (<>
                                                    <ListGroup.Item>
                                                        <strong>Videos:</strong>
                                                        <ul>
                                                            {result.videos.map((videos) => (
                                                                <li key={videos.name}>{videos.name}</li>
                                                            ))}
                                                        </ul>
                                                    </ListGroup.Item>
                                                </>
                                                )}

                                                {result.documents.length > 0 && (<>
                                                    <ListGroup.Item>
                                                        <strong>Documents:</strong>
                                                        <ul>
                                                            {result.documents.map((documents) => (
                                                                <li key={documents.name}>{documents.name}</li>
                                                            ))}
                                                        </ul>
                                                    </ListGroup.Item>
                                                </>
                                                )}

                                            </ListGroup>
                                        </Card>


                                        {/* <h3><strong>User ID:</strong> {result.userid}</h3>
                                        <h3><strong>Topic:</strong> {result.topic}</h3>
                                        <h3><strong>Type:</strong> {result.type}</h3>
                                        <p><strong>Subject:</strong> {result.subject}</p>
                                        <p><strong>Content:</strong> {result.content}</p>
                                        <p><strong>Date:</strong> {result.date}</p>
                                        <p><strong>Timestamp:</strong> {result.time}</p>

                                        {result.urls.length > 0 && (
                                            <div>
                                                <p>
                                                    <strong>URLs:</strong>
                                                </p>
                                                <ul>
                                                    {result.urls.map((url) => (
                                                        <li key={url}>{url}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {result.images.length > 0 && (
                                            <div>
                                                <p>
                                                    <strong>Images:</strong>
                                                </p>
                                                <ul>
                                                    {result.images.map((image) => (
                                                        <li key={image.name}>{image.name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {result.pdfs.length > 0 && (
                                            <div>
                                                <p>
                                                    <strong>PDFs:</strong>
                                                </p>
                                                <ul>
                                                    {result.pdfs.map((pdf) => (
                                                        <li key={pdf.name}>{pdf.name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {result.videos.length > 0 && (
                                            <div>
                                                <p>
                                                    <strong>Videos:</strong>
                                                </p>
                                                <ul>
                                                    {result.videos.map((video) => (
                                                        <li key={video.name}>{video.name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )} 

                                        {result.documents.length > 0 && (
                                            <div>
                                                <p>
                                                    <strong>Documents:</strong>
                                                </p>
                                                <ul>
                                                    {result.documents.map((document) => (
                                                        <li key={document.name}>{document.name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )} */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserHistory;