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

  let imageUploadBtn = useRef();
  let pdfUploadBtn = useRef();
  let videoUploadBtn = useRef();
  let documentUploadBtn = useRef();
  const [filesToUpload, setFilesToUpload] = useState([]);
  

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
        file: file
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
    setMessage("All fields have been cleared.");
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
    setTimeout(() => { setMessage(""); }, 5000)
    setUploadedFiles([]);
  };

  const handleSubmit = async () => {
    // Upload File
    if (resourceData.type === "files") {
      try {
        let public_url = [];
        let isLastFileUploaded = false;
        let fileUploadCount = 0;
        for (const file of uploadedFiles) {
          let formData = new FormData();
          formData.append('file', file.file);
    
          const response = await fetch("upload-file", {
            method: 'POST', // Explicitly set the method to POST
            body: formData
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          if (response.ok) {
            fileUploadCount += 1;
          }

          if(fileUploadCount === uploadedFiles.length) {
            isLastFileUploaded=true;
            setMessage(
              "Thank you for contributing! Your data was uploaded successfully!"
            );
          }
    
          // Assuming the server sends back JSON data
          const responseWithBody = await response.json(); 
          // console.log(responseWithBody['publicUrl']);
          public_url.push(responseWithBody['publicUrl']);
          if (isLastFileUploaded) {
            console.log(public_url);
            const FileData = {
              topic: resourceData.topic,
              type: "url", // Firestore accepts URL type to parse into ML model
              urls: public_url,
            };
            await axios.post("/updateUrls", FileData);
          }
        }
      } catch (error) {
        console.error("Error uploading file data:", error);
        setMessage("Error uploading file data!");
      }
    }    

    // Upload URL
    if (resourceData.type === "url") {
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
    }
  };

  return (
    <div className="upload-resource-page">
      <h2>Want to Contribute? You have come to the right place!</h2>
      <div className="container mb-4 height-unset">
        <p>
          Please provide the details for the options below and click on publish
          to add your resource.
        </p>
        <div className="row g-3 mb-3">
          <div className="form-floating col">
            <select className="form-select" id="formGroupResourceTopic" aria-label="Resource Topic"
              name="topic" value={resourceData.topic} onChange={handleInputChange}>
              <option value="0" disabled>Choose the Resource Topic from below:</option>
              <option value="0" hidden>Choose a Resource Topic</option>
              <option value="Resource Guides">Resource Guides</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Domestic Violence">Domestic Violence</option>
              <option value="Substance Use">Substance Use</option>
              <option value="Native Hawaiians">Native Hawaiians</option>
              <option value="Pacific Islanders">Pacific Islanders</option>
              <option value="Asian Americans">Asian Americans</option>
              <option value="Government Orgs">Government Orgs</option>
              <option value="Other Behavioral Health">Other Behavioral Health</option>
              <option value="Multi-Language or Translation">Multi-Language or Translation</option>
              <option value="Other">Other</option>
            </select>
            <label htmlFor="formGroupResourceTopic1" className="left--unset">Resource Topic</label>
          </div>
          <div className="form-floating col">
            <select className="form-select" id="formGroupResourceTopic" aria-label="Resource Type"
              name="type" value={resourceData.type} onChange={handleInputChange}>
              <option value="0" disabled>Choose the Resource Type from below:</option>
              <option value="0" hidden>Choose a Resource Type</option>
              <option value="url">URL's</option>
              <option value="files">File Upload</option>
              <option value="content">Tags & Content</option>
            </select>
            <label htmlFor="formGroupResourceTopic1" className="left--unset">Upload Type</label>
          </div>
        </div>
        {resourceData.type === "content" && <>
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
              Tags
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
          </div></>}
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

        {resourceData.type === "files" && <>
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
        </>}

        {resourceData.type === "url" && <>
          <div className="form-floating col-12 mb-4">
            <textarea
              className="form-control"
              id="formGroupUrl"
              placeholder="Enter URL Here"
              name="url"
              onChange={(e) => handleFileChange(e, "urls")}
            />
            <label htmlFor="formGroupContent" className="form-label">
              URL's (separated by commas)
            </label>
          </div></>}

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
            {uploadedFiles.length !== 0 && (
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

          {message && <p className="toaster-btm slide-in-bottom-then-hide">{message}</p>}
        </div>
      </div>
    </div >
  );
}

export default ResourceUploadForm;
