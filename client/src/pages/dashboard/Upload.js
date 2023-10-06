import React, { useState, useRef } from "react";
import "./upload.css";
import axios from "axios";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

function ResourceUploadForm() {
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  let imageUploadBtn = useRef();
  let pdfUploadBtn = useRef();
  let videoUploadBtn = useRef();
  let documentUploadBtn = useRef();

  const handleSearchInputChange = (event) => {
    setSearchEmail(event.target.value);
  };

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

  const [resourceData, setResourceData] = useState({
    topic: "",
    type: "",
    subject: "",
    content: "",
    userid: "",
    images: [],
    pdfs: [],
    videos: [],
    documents: [],
    urls: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setResourceData((prevData) => ({
      ...prevData,
      [name]: value,
      date: new Date().toLocaleDateString(), // Capture the current date
      time: new Date().toLocaleTimeString(), // Capture the current time
    }));
  };

  const handleFileChange = (event, fileType) => {
    if (fileType === "urls") {
      const urls = event.target.value.split(",").map((url) => url.trim());
      setResourceData((prevData) => ({
        ...prevData,
        urls: urls,
      }));
    } else {
      const files = Array.from(event.target.files);
      const newUploadedFiles = files.map((file) => ({
        type: fileType,
        name: file.name,
      }));
      setUploadedFiles((prevFiles) => [...prevFiles, ...newUploadedFiles]);

      // Convert each file to an object with necessary details
      const processedFiles = files.map((file) => ({
        name: file.name,
        type: fileType,
        file: file,
      }));

      setResourceData((prevData) => ({
        ...prevData,
        [fileType]: [...prevData[fileType], ...processedFiles],
      }));
    }
  };

  const handleClear = () => {
    setResourceData({
      topic: "",
      type: "",
      subject: "",
      content: "",
      userid: "",
      images: [],
      pdfs: [],
      videos: [],
      documents: [],
      urls: [],
    });
    setMessage("");
    setUploadedFiles([]);
  };

  const handleSubmit = async () => {
    try {
      await fetch("api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resourceData),
      });

      if (resourceData.urls.length > 0) {
        const urlData = {
          topic: resourceData.topic,
          type: resourceData.type,
          urls: resourceData.urls,
        };
        await axios.post("/updateUrls", urlData);
      }

      handleClear();
      setMessage(
        "Thank you for contributing! Your data was uploaded successfully!"
      );
      console.log("JSON data uploaded successfully.");
    } catch (error) {
      console.error("Error uploading JSON data:", error);
      setMessage("Error uploading data!");
    }
  };

  return (
    <div className="upload-resource-page">
      <h2>Want to Contribute? You have come to the right place!</h2>
      <div className="container mb-4 height-unset">
        <p>
          Please provide the details for the options below and click on publish
          to add your resource.
          <br />
          You can also search for your resource with your user ID below and
          check the details.
        </p>

        <div className="row g-3 mb-3">
          <div className="form-floating col">
            <input
              type="text"
              className="form-control"
              id="formGroupResourceTopic"
              placeholder="Enter Resource Topic"
              aria-label="Resource Topic"
              name="topic"
              value={resourceData.topic}
              onChange={handleInputChange}
            />
            <label htmlFor="formGroupResourceTopic" className="">
              Resource Topic
            </label>
          </div>
          <div className="form-floating col">
            <input
              type="text"
              className="form-control"
              id="formGroupResourceType"
              placeholder="Enter Resource Type"
              aria-label="Resource Type"
              name="type"
              value={resourceData.type}
              onChange={handleInputChange}
            />
            <label htmlFor="formGroupResourceType" className="">
              Resource Type
            </label>
          </div>
        </div>
        <div className="form-floating col-12 mb-3">
          <input
            type="text"
            className="form-control"
            id="formGroupSubject"
            placeholder="Enter Subject Here"
            name="subject"
            value={resourceData.subject}
            onChange={handleInputChange}
          />
          <label htmlFor="formGroupSubject" className="">
            Subject
          </label>
        </div>
        <div className="form-floating col-12 mb-3">
          <textarea
            className="min-height--75 form-control"
            id="formGroupContent"
            placeholder="Enter Content Here"
            name="content"
            value={resourceData.content}
            onChange={handleInputChange}
          />
          <label htmlFor="formGroupContent" className="form-label">
            Content
          </label>
        </div>
        <div className="form-floating col-12 mb-3">
          <input
            type="text"
            className="form-control"
            id="formGroupUser"
            placeholder="Enter User ID Here"
            name="userid"
            value={resourceData.userid}
            onChange={handleInputChange}
          />
          <label htmlFor="formGroupUser" className="">
            User ID / Email
          </label>
        </div>

        <InputGroup size="md" className="mt-2 mb-3">
          <InputGroup.Text id="search-input-group">
            <i className="bi bi-upload"></i>
          </InputGroup.Text>
          <Form.Control
            aria-label="Upload box"
            aria-describedby="inputGroup-sizing-sm"
            disabled={true}
            placeholder="Select File Type to Upload:"
          />
          <Button
            variant="outline-primary"
            id="upload-image-button"
            className="z-0"
            onClick={(e) => imageUploadBtn.current?.click()}
          >
            <i className="far fa-image"></i> Images
          </Button>
          <Button
            variant="outline-primary"
            id="upload-pdf-button"
            className="z-0"
            onClick={(e) => pdfUploadBtn.current?.click()}
          >
            <i className="far fa-file-alt"></i> PDF's
          </Button>
          <Button
            variant="outline-primary"
            id="upload-video-button"
            className="z-0"
            onClick={(e) => videoUploadBtn.current?.click()}
          >
            <i className="far fa-file-video"></i> Videos
          </Button>
          <Button
            variant="outline-primary"
            id="upload-doc-button"
            className="z-0"
            onClick={(e) => documentUploadBtn.current?.click()}
          >
            <i className="far fa-file"></i> Documents
          </Button>
        </InputGroup>

        <div className="form-floating col-12 mb-4">
          <textarea
            className="form-control"
            id="formGroupUrl"
            placeholder="Enter URL Here"
            name="url"
            onChange={(e) => handleFileChange(e, "urls")}
          />
          <label htmlFor="formGroupContent" className="form-label">
            URL's (multiple URL's to separated by commas)
          </label>
        </div>

        <div className="form-group">
          <div className="file-upload-icons d-none">
            <label htmlFor="imageInput" className="file-type-icon">
              <i className="far fa-image"></i>
              <input
                ref={imageUploadBtn}
                type="file"
                id="imageInput"
                multiple
                accept=".jpg, .jpeg, .png"
                onChange={(e) => handleFileChange(e, "images")}
                style={{ display: "none" }}
              />
              <span>Images</span>
            </label>
            <label htmlFor="pdfInput" className="file-type-icon">
              <i className="far fa-file-pdf"></i>
              <input
                ref={pdfUploadBtn}
                type="file"
                id="pdfInput"
                multiple
                accept=".pdf"
                onChange={(e) => handleFileChange(e, "pdfs")}
                style={{ display: "none" }}
              />
              <span>PDFs</span>
            </label>
            <label htmlFor="videoInput" className="file-type-icon">
              <i className="far fa-file-video"></i>
              <input
                ref={videoUploadBtn}
                type="file"
                id="videoInput"
                multiple
                accept=".mp4"
                onChange={(e) => handleFileChange(e, "videos")}
                style={{ display: "none" }}
              />
              <span>Videos</span>
            </label>
            <label htmlFor="docInput" className="file-type-icon">
              <i className="far fa-file-alt"></i>
              <input
                ref={documentUploadBtn}
                type="file"
                id="docInput"
                multiple
                accept=".doc, .docx"
                onChange={(e) => handleFileChange(e, "documents")}
                style={{ display: "none" }}
              />
              <span>Documents</span>
            </label>
            <label htmlFor="urlInput" className="file-type-icon">
              <i className="fas fa-link"></i>
              <input
                type="url"
                id="urlInput"
                onChange={(e) => handleFileChange(e, "urls")}
                placeholder="Enter URLs separated by commas"
              />
              <span>URLs</span>
            </label>
          </div>
          <div className="uploaded-files">
            {uploadedFiles.length != 0 && (
              <>
                <h4>Uploaded Files:</h4>
              </>
            )}
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index}>{`${file.type}: ${file.name}`}</li>
              ))}
            </ul>
          </div>
          <Stack className="my-4" direction="horizontal" gap={3}>
            <Button size="lg" variant="primary ms-auto" onClick={handleSubmit}>
              Publish
            </Button>
            <Button size="lg" variant="primary " onClick={handleClear}>
              Clear
            </Button>
          </Stack>

          {message && <p>{message}</p>}
        </div>
      </div>
        <div className="search-section">
          <h2>User's History</h2>
          <div className="container mb-4">
          {/* <label htmlFor="searchEmail">Enter UserID and click on Search</label>
        <input
          type="email"
          id="searchEmail"
          value={searchEmail}
          onChange={handleSearchInputChange}
        />
        <button onClick={handleSearchSubmit}>Search</button> */}
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
            <h3>Search Results:</h3>
            <ul>
              {searchResults.map((result) => (
                <li key={result.userid} className="search-results-card">
                  <h3>
                    <strong>User ID:</strong> {result.userid}
                  </h3>
                  <h3>
                    <strong>Topic:</strong> {result.topic}
                  </h3>
                  <h3>
                    <strong>Type:</strong> {result.type}
                  </h3>
                  <p>
                    <strong>Subject:</strong> {result.subject}
                  </p>
                  <p>
                    <strong>Content:</strong> {result.content}
                  </p>
                  <p>
                    <strong>Date:</strong> {result.date}
                  </p>
                  <p>
                    <strong>Timestamp:</strong> {result.time}
                  </p>

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
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default ResourceUploadForm;
