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

router.post('/:id', function(req,res,next){
    // MAKE NEW DAY
    console.log(req.params.id);
    Day.create({number:+req.params.id})
        .then(()=>{res.send('database add one more day')})
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
    console.log('delete id:', typeof req.params.id,req.params.id);
    console.log('work please');
    var numberToDestroy = parseInt(req.params.id);
  Day.destroy(
    {
      where: {number: numberToDestroy},
    }
  )
  .then((respond) => {
    res.send('Hope you meant to destroy that, because it\'s gone!')
      // console.log('it did delete');
  })
})

//
// router.post('/:id/:options', function(req,res,next){
//   Day.findOne(
//     {
//       where: {id: req.params.id},
//     }
//     .then((respond) => {
//       if (req.params.options === 'hotel'){
//         return Hotel.
//         return setHotel(hotelId)
//       }
//     })
// })

module.exports = router;
