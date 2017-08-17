var Promise = require('bluebird');
var router = require('express').Router();
var Hotel = require('../../models').Hotel;
var Restaurant = require('../../models').Restaurant;
var Activity = require('../../models').Activity;
var Day = require('../../models').Day;
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));



router.get('/', function(req,res,next){
    Day.findAll(
      {
        include: [{model: Hotel}, {model: Restaurant}, {model: Activity}]
      }
    )
    .then((respond) => {
      res.json(respond);
    })
})

router.post('/', function(req,res,next){
  // MAKE NEW DAY
  Day.create()
})

router.get('/:id', function(req, res, next){
  Day.findOne(
    {
      where: {id: req.params.id},
      include: [{model: Hotel}, {model: Restaurant}, {model: Activity}]
    }
  )
  .then((respond) => {
    res.json(respond)
  })
})

router.delete('/:id', function(req, res, next){
  Day.destroy(
    {
      where: {id: req.params.id},
    }
  )
  .then((respond) => {
    res.send('Hope you meant to destroy that, because it\'s gone!')
  })
})


router.post('/:id/:options', function(req,res,next){
  Day.findOne(
    {
      where: {id: req.params.id},
    }
    .then((respond) => {
      if (req.params.options === 'hotel'){
        return Hotel.
        return setHotel(hotelId)
      }
    })
})

module.exports = router;
