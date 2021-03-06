const bodyParser = require('body-parser'), 
      methodOverride = require('method-override'),
      expressSanitizer = require('express-sanitizer'),
      mongoose = require('mongoose'),
      express = require('express'), 
      app = express(), 
      Workout = require('./models/workout'),
      Comment = require('./models/comment'),
      User = require('./models/user'),
      passport = require('passport'), 
      LocalStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      flash = require('connect-flash')

// requiring routes 
const workoutsRoutes = require('./routes/workouts'),
      commentRoutes = require('./routes/comments'),
      indexRoutes = require('./routes/index')

//================
// APP CONFIG 
//=================

mongoose.connect(process.env.DATABASE_URL, 
{ 
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => console.log('Database Connected'))
.catch(err => console.log(err));

mongoose.set('useFindAndModify', false); 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); 
app.use(methodOverride('_method')); 
app.use(flash()); 

//================
// PASSPORT CONFIG 
//=================

app.use(require('cookie-session')({
    secret: "I love bebecito", 
    resave: false,
    saveUninitialized: false
}))

passport.use(new LocalStrategy(User.authenticate())); 
app.use(passport.initialize());
app.use(passport.session()); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

//================
// ADD VARS TO EVERY TEMPLATE
//=================

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success'); 
    next(); 
})

//================
// USE ROUTES 
//=================

app.use(indexRoutes);
app.use(workoutsRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, ()=> {
    console.log('Server is running');
})