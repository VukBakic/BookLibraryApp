import mongoose from 'mongoose';

const GenreSchema = new mongoose.Schema({
  name: String,
});

const Genre = mongoose.model('Genre', GenreSchema);

export default Genre;
