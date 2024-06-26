// libraries
import express from 'express';
import cors from 'cors';

// routes
import userRoutes from '../routes/userRoutes.js';
import channelRoutes from '../routes/channelRoutes.js';
import musicRoutes from '../routes/musicRoutes.js';
import authRoutes from '../routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;

// cors 커스텀
app.use(cors());
app.use(express.json());

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
