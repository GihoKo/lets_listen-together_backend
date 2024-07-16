// libraries
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// routes
import userRoutes from '../routes/userRoutes.js';
import channelRoutes from '../routes/channelRoutes.js';
import musicRoutes from '../routes/musicRoutes.js';
import authRoutes from '../routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: ['https://lets-listen-together.link', 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization,x-requested-with,Accept,Origin',
  exposedHeaders: 'cache-control,content-language,content-type,expires,last-modified,pragma',
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight 요청 처리
app.use(express.json());
app.use(cookieParser());

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/musics', musicRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log('Server is running on port 8080');
});
