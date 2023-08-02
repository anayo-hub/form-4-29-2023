
import express from 'express';
import os from 'os'
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';

const app = express();

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors()); // Allow requests from all origins. Replace with allowedOrigins configuration if needed.
app.use(morgan('tiny'));
app.disable('x-powered-by');

// CORS setup
const allowedOrigins = ['http://localhost:3000']; // Add your frontend origin here
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
};

app.use(cors(corsOptions));

// HTTP GET Request
app.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

// API routes
app.use('/api', router);


console.log(os.platform());
console.log(os.arch());

const port = 8080;

// Connect to the database and start the server
connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server connected to http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Invalid database connection...!");
  });


// import express from 'express';
// import cors from 'cors';
// import morgan from 'morgan';
// import connect from './database/conn.js';
// import router from './router/route.js';

// const app = express();

// /** middlewares */
// app.use(express.json());
// app.use(cors());
// app.use(morgan('tiny'));
// app.disable('x-powered-by'); // less hackers know about our stack




// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');


//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });

// // Define the allowed origins (domains) in an array
// const allowedOrigins = ['http://localhost:3000'];

// // CORS options with a custom function to check if the origin is allowed
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Check if the origin is in the allowed origins list or if it's undefined (which happens on direct API calls)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true); // Allow the request
//     } else {
//       callback(new Error('Not allowed by CORS')); // Block the request
//     }
//   },
// };


// // Increase the file size limit to 10MB (or any size you need)
// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// const port = 8080;

// /** HTTP GET Request */
// app.get('/', (req, res) => {
//     res.status(201).json("Home GET Request");
// });


// /** api routes */
// app.use('/api', router)

// /** start server only when we have valid connection */
// // connect().then(() => {
// //     try {
// //         app.listen(port, () => {
// //             console.log(`Server connected to http://localhost:${port}`);
// //         })
// //     } catch (error) {
// //         console.log('Cannot connect to the server')
// //     }
// // }).catch(error => {
// //     console.log("Invalid database connection...!");
// // })

// connect()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server connected to http://localhost:${port}`);
//     });
//   })
//   .catch((error) => {
//     console.log("Invalid database connection...!");
//   });
