var Promise = require('bluebird');
var router = require('express').Router();
var Hotel = require('../models').Hotel;
var Restaurant = require('../models').Restaurant;
var Activity = require('../models').Activity;
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.get('/', function(req, res, next) {
  Promise.all([
    Hotel.findAll(),
    Restaurant.findAll(),
    Activity.findAll()
  ])
  .spread(function(dbHotels, dbRestaurants, dbActivities) {
    res.render('index', {
      templateHotels: dbHotels,
      templateRestaurants: dbRestaurants,
      templateActivities: dbActivities
    });
  })
  .catch(next);
});

// router.use('/api/:options');
router.get('/api/:options', function(req,res,next){
  var item = req.params.options;
  item = item[0].toUpperCase()+item.substring(1)
    console.log(item);
  if (item === 'Hotel')
      Hotel.findAll()
      .then((respond)=>{
        res.json(respond);
        })
      .catch(next);
    if (item === 'Restaurant')
        Restaurant.findAll()
            .then((respond)=>{
            res.json(respond);
    })
    .catch(next);
    if (item === 'Activity')
        Activity.findAll()
            .then((respond)=>{
            res.json(respond);
})
.catch(next);

})

module.exports = router;
