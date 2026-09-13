import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true,
    trim: true
  },
  options: { 
    type: [String], 
    required: true,
    validate: [val => val.length === 4, 'A question must have exactly 4 options']
  },
  correctAnswerIndex: { 
    type: Number, 
    required: true,
    min: 0,
    max: 3
  },
  category: { 
    type: String, 
    enum: [
      'Grammar', 'Vocabulary', 'Idioms', 'Sentence Correction', 'Business English', 'Prepositions',
      'Beginner English', 'Computer Basics', 'Coding Basics', 'Web Development', 'Tech Skills', 'General'
    ],
    default: 'Beginner English' 
  },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'intermediate' 
  },
  explanation: { 
    type: String, 
    default: '' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Production Indexes for Rapid Question Shuffling and Topic Partitioning
questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ createdAt: -1 });

export const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);
export default Question;

