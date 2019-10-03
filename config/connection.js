const mongoose = require('mongoose');
// require('dotenv').config();
mongoose.Promise=global.Promise;
// console.log(process.env.MONGOURI);
mongoose.connect('mongodb://dhiraj:dhiraj123@ds163745.mlab.com:63745/neweventsdb',{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(()=>console.log('connected successfully'))
  .catch(err=>console.log(err))