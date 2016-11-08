let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//определение схемы книги
let BookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    pages: { type: Number, required: true, min: 1 },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false
  }
);

// установить параметр createdAt равным текущему времени
BookSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

// экспорт модели для последующего использования.
module.exports = mongoose.model('book', BookSchema);
