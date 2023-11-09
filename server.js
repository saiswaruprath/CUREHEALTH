
import axios from 'axios'
import express from 'express';
import fetch from 'node-fetch';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors'
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

///fetcharticle change
import { Firestore  } from '@google-cloud/firestore';

import {Storage } from '@google-cloud/storage';
import Multer from "multer";
import { format } from "util";


const app = express();
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan';


import connectDB from './db/connect.js';

import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'


import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js';

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  
  

const __dirname = dirname(fileURLToPath(import.meta.url));  
app.use(express.static(path.join(__dirname, 'newimages')));
app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(cors({
  origin: '*'
}));
app.use(express.json())

app.use(helmet());
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    // ...
  })
);

app.use(xss());
app.use(mongoSanitize());

app.use((req, res, next) => {
  res.header('Content-Security-Policy', "script-src 'self' https://maps.googleapis.com 'unsafe-inline'");
  res.header('Access-Control-Allow-Origin', '*');
  res.removeHeader("Cross-Origin-Embedder-Policy");
  next();
});

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

// /// CODE FOR ARTICLE FETCH FROM DIRECT FIRESTORE BEGINS


// // Replace with the path to your service account JSON key file
// import serviceAccountKey from './newimages/sjsu-rf-ohana-c748b70be079.json' assert { type: "json" };
import { title } from 'process';

const serviceAccountKey = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
// // Initialize Firestore
 const firestore = new Firestore({ projectId: serviceAccountKey.project_id, credentials: serviceAccountKey });

// Define API endpoint for creating documents
app.post('/api/update', async (req, res) => {
  try {
    const { type, value } = req.body;
    const collectionRef = firestore.collection('transaction_request');

    // Create a new document with appropriate fields based on the type
    if (type === 'search') {
      await collectionRef.add({ context: value, type: 'search' });
    } else if (type === 'url') {
      await collectionRef.add({ url: value, type: 'url' });
    }

    res.status(200).json({ message: 'Here are your search results:' });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'An error occurred while creating document' });
  }
});

app.get('/api/recent-document', async(req, res) => {
  try {
    const docRef = firestore.collection('transaction_response').doc('Rdgs8sKw1myPCXyaM89V');
    const doc = await docRef.get();
    if (!doc.exists) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    const data = doc.data();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Define API endpoint for creating documents
app.post('/api/question-update', async (req, res) => {
  try {
    const { title, type, value } = req.body;

    const collectionRef = firestore.collection('transaction_request');

    // Create a new document with appropriate fields based on the type
    if (type === 'answer') {
      await collectionRef.add({ title: title, question: value, type: 'answer' });
    } 

    res.status(200).json({ message: 'Here are your search results:' });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'An error occurred while creating document' });
  }
});

app.get('/api/question-document', async(req, res) => {
  try {
    const docRef = firestore.collection('transaction_response').doc('HmXHpAThCX9VVjxwn29U');
    const doc = await docRef.get();
    if (!doc.exists) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    const data = doc.data();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/updateUrls', async (req, res) => {
  const { topic, type, urls } = req.body;

  // Update another Firestore collection with the provided URL data
  const urlsData = {
    topic: topic,
    type: type,
    urls: urls,
  };

  // Use the Firestore SDK to update the collection
  // ...

    // Create a new document in your Firestore collection
    await firestore.collection('transaction_request').add({
      topic,
      type,
      urls,
    });

  res.send('Uploaded successfully.');
});


app.post('/translate', async (req, res) => {
  const { source, target, text, type } = req.body;

  await firestore.collection('transaction_request').add({
    source,
    target,
    text,
    type
  });

  res.send('Uploaded successfully.');
});

app.get('/api/translation-results', async(req, res) => {
  try {
    const docRef = firestore.collection('transaction_response').doc('Qvx7ymoQaNiUNgxgxKfJ');
    const doc = await docRef.get();
    if (!doc.exists) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    const data = doc.data();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Load the Google Cloud Storage service account credentials
const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS
const projectID = process.env.GCS_PROJECT_ID;

const storage = new Storage({
  projectID, // Your project ID
  credentials: JSON.parse(keyFile), // Path to your service account JSON key file
});

// Endpoint to fetch data from the Google Cloud Storage JSON file
app.get('/api/data', async (req, res) => {
  try {
    const bucketName = 'context_data1'; // Replace with your bucket name
    const fileName = 'article_data.json'; // Replace with your JSON file name

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const data = await file.download();
    const jsonContent = data.toString();
    const jsonData = JSON.parse(jsonContent);

    res.json(jsonData);
    // console.log(jsonData);
  } catch (error) {
    console.error('Error fetching JSON data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.post('/api/upload', async (req, res) => {
    const { topic, type, subject, content, userid, images, pdfs, videos, documents, urls, date, time} = req.body;


  // Create a new document in your Firestore collection
  await firestore.collection('uploadresource').add({
    topic,
    type,
    subject,
    content,
    userid,
    images,
    pdfs,
    videos,
    documents,
    urls,
    date,
    time
  });

  res.status(201).send('Resource uploaded successfully.');
});

app.get('/search', async (req, res) => {
  const searchUserId = req.query.userid;
  console.log('Search user ID:', searchUserId)
  try {
    // Fetch data from Firestore based on email
    // Use the Firestore SDK to query the collection
    const querySnapshotNew =  await firestore.collection('uploadresource')
      .where('userid', '==', searchUserId)
      .get();
    
    const searchResults = [];
    querySnapshotNew.forEach((doc) => {
      // searchResults.push(doc.data());
      const data = doc.data();
      searchResults.push({
        ...data,
        date: data.date,
        time: data.time,
      });
    });
    
    console.log(searchResults)
    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).send('Error fetching search results');
  }
});

app.get('/api/treatment-centers', async (req, res) => {
  const { lat, lng } = req.query;
  const radius = 5000; // Specify the radius within which to search for treatment centers (in meters)
  const apiKey = 'AIzaSyBIQlGq1fABBG_lC0dqDGVJ68fITqF1QLU';
  res.set('Access-Control-Allow-Origin','*');
  try {
   
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=health&keyword=treatment&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    // Extract the treatment center details from the response
        const treatmentCenters = data.results.map((result) => ({
          place_id: result.place_id,
          name: result.name,
          vicinity: result.vicinity,
          geometry: result.geometry,
          openingHours: result.opening_hours ? result.opening_hours.open_now : null,
          photos: result.photos || [],
          business_status: result.business_status || null,
          types: result.types || null,
        }));
      res.json({ results: treatmentCenters });
      console.log(treatmentCenters)

  } catch (error) {
    console.error('Error retrieving treatment centers:', error);
    res.status(500).json({ error: 'Failed to retrieve treatment centers' });
  }
});

app.get('/api/know-more-details', async (req, res) => {
  const { lat, lng } = req.query;
  const { user_input } = req.query;
  res.set('Access-Control-Allow-Origin', '*');
  const radius = 5000; // Specify the radius within which to search for treatment centers (in meters)
  const apiKey = 'AIzaSyBIQlGq1fABBG_lC0dqDGVJ68fITqF1QLU';
  try {
    let url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&input=${user_input}&inputtype=textquery&locationbias=circle%3A${radius}%40${lat}%2C${lng}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    // Extract the treatment center details from the response
    const singleTreatmentCenter = data;
    res.json({ results: singleTreatmentCenter });
    console.log(singleTreatmentCenter)
  } catch (error) {
    console.error('Error retrieving specific treatment centers:', error);
    res.status(500).json({ error: 'Failed to retrieve treatment centers details' });
  }
});


const bucketName = "ohana-website-storage";
const bucket = storage.bucket(bucketName);
app.post("/upload-file", multer.single("file"), function (req, res, next) {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();
  blobStream.on("error", (err) => {
    next(err);
  });
  blobStream.on("finish", () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(`https://storage.cloud.google.com/${bucket.name}/${encodeURIComponent(blob.name)}`);
    res.status(200).json({ publicUrl });
  });
  blobStream.end(req.file.buffer);
  console.log(req.file);
});
 


app.get('/', (req, res) => {
  res.json({msg: 'Welcome!'});
});

app.get('/api/v1', (req, res) => {
    res.json({msg: 'API'});
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs',authenticateUser, jobsRouter);

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000;

const start =  async () =>{
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
        console.log(`Server is listening on port ${port}...`)
    });
    } catch (error){
        console.log(error)

    }
}


start()
