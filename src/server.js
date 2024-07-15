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

// cors 커스텀
app.use(
  cors({
    origin: [
      'http://localhost:3000', // dev
      'https://lets-listen-together.link', // prod
    ],
    credentials: true,
  }),
);
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
