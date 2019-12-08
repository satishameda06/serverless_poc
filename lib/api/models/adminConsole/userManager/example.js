const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = Schema({
  _id: Number,
  name: String,
  age: Number,
  stories: [{ type: Number, ref: 'Story' }]
});

const storySchema = Schema({
  author: { type: Number, ref: 'Person' },
  title: String,
});

const Story = mongoose.model('Story', storySchema);
const Person = mongoose.model('Person', personSchema);

const hotel = new Person({
    _id: 2,
    name: 'Ian Fleming1',
    age: 50
  });
  
  hotel.save(function (err) {
    if (err){
     return  console.log("err while saving author",err);
    } 
  
    const story1 = new Story({
       title: 'Casino Royale1',
       author: hotel._id    // assign the _id from the person
    });
  
    story1.save(function (err) {
      if (err) return console.log("satish ameda",err);
      // thats it!
    });
  });

  Story.
  find().
  populate('author').
  exec(function (err, story) {
    if (err) return console.log(err);
    console.log('The author is %s', JSON.stringify(story));
    // prints "The author is Ian Fleming"
  });
