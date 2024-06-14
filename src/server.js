// libraries
import express from 'express';
import cors from 'cors';

// routes
import userRoutes from '../routes/userRoutes.js';
import channelRoutes from '../routes/channelRoutes.js';
import musicRoutes from '../routes/musicRoutes.js';

const app = express();

app.use(express.json());
app.use(cors());

// api routes
app.use('/api/users', userRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/musics', musicRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log('Server is running on port 8080');
});
