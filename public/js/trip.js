'use strict';
/* global $ dayModule */

/**
 * A module for managing multiple days & application state.
 * Days are held in a `days` array, with a reference to the `currentDay`.
 * Clicking the "add" (+) button builds a new day object (see `day.js`)
 * and switches to displaying it. Clicking the "remove" button (x) performs
 * the relatively involved logic of reassigning all day numbers and splicing
 * the day out of the collection.
 *
 * This module has four public methods: `.load()`, which currently just
 * adds a single day (assuming a priori no days); `switchTo`, which manages
 * hiding and showing the proper days; and `addToCurrent`/`removeFromCurrent`,
 * which take `attraction` objects and pass them to `currentDay`.
 */

var tripModule = (function () {

  // application state

  var days = [],
      currentDay;



  // jQuery selections

  var $addButton, $removeButton;
  $(function () {
    $addButton = $('#day-add');
    $removeButton = $('#day-title > button.remove');
  });

  // method used both internally and externally

  function switchTo (newCurrentDay) {
    if (currentDay) currentDay.hide();
    currentDay = newCurrentDay;
    currentDay.show();
  }

 // ~~~~~~~~~~~~~~~~~~~~~~~
    // before calling `addDay` or `deleteCurrentDay` that update the frontend (the UI), we need to make sure that it happened successfully on the server
  // ~~~~~~~~~~~~~~~~~~~~~~~
  $(function () {
    $addButton.on('click', function(){
      addDay()
      var id = days.length + 1
      $.ajax({
        method: 'POST',
        url: '/api/days/' + id
    })
        .then(()=>{console.log('Post response data: ')})
        .catch(console.error.bind(console));

    });
    $removeButton.on('click', deleteCurrentDay);
  });



  // ~~~~~~~~~~~~~~~~~~~~~~~
    // `addDay` may need to take information now that we can persist days -- we want to display what is being sent from the DB
  // ~~~~~~~~~~~~~~~~~~~~~~~
  function addDay (data) {
    if (this && this.blur) this.blur(); // removes focus box from buttons
    var newDay = dayModule.create(data); // dayModule

    console.log(newDay);
      // console.log('typeof',typeof id, 'id', id)

    days.push(newDay);
    if (days.length === 1) {
      currentDay = newDay;
    }
    switchTo(newDay);
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~
    // Do not delete a day until it has already been deleted from the DB
  // ~~~~~~~~~~~~~~~~~~~~~~~
  function deleteCurrentDay () {
    // prevent deleting last day
    if (days.length < 2 || !currentDay) return;
    // remove from the collection
    var index = days.indexOf(currentDay);

    var dayNum = index+1;
    console.log('day to delet', typeof dayNum, dayNum);
        $.ajax({
          method: 'DELETE',
          url: '/api/days/'+dayNum
         })
          .then((response)=>{
          console.log('deleted from the backend',response)
        });

      // $.delete('/api/days/'+dayNum)



    var  previousDay = days.splice(index, 1)[0],
      newCurrent = days[index] || days[index - 1];
    // fix the remaining day numbers
    days.forEach(function (day, i) {
      day.setNumber(i + 1);
    });
    switchTo(newCurrent);
    previousDay.hideButton();
  }

  // globally accessible module methods

  var publicAPI = {

    load: function () {
      $.ajax({
        method: 'GET',
        url: '/api/days/'
       })
        .then((respond)=>{
          respond.forEach((day)=>{
            $(addDay(day));
            console.log('each day ---',day);

            // var attraction = attractionsModule.getByTypeAndId('hotel',day.hotelId);
            // publicAPI.addToCurrent(attraction);
            // day.restaurants.forEach((restaurant)=>{
            //     var attraction = attractionsModule.getByTypeAndId('restaurant',restaurant.id);
            //    publicAPI.addToCurrent(attraction);
            //   });
            // day.activities.forEach((activity)=>{
            //     var attraction = attractionsModule.getByTypeAndId('activity',activity.id);
            //      publicAPI.addToCurrent(attraction);
            // });
          })
          // console.log('respond:', respond)
          // respond.forEach((day)=>{
          //   console.log('each day ---', day);
          //   return dayModule.create(
          //       {   number: day.number,
          //           hotel : day.hotel,
          //           restaurants : day.restaurants,
          //           activities : day.activities
          //       })
          //       .then(function(newDay){
          //         days.push(newDay)
          //         console.log('newDay', newDay)
          //       })
          // console.log('newDay ',newDay);
          // days.push(newDay);
          // console.log('all days in dayarr',days);
        })
      .catch(console.error.bind(console));
      // ~~~~~~~~~~~~~~~~~~~~~~~
        //If we are trying to load existing Days, then let's make a request to the server for the day. Remember this is async. For each day we get back what do we need to do to it?
      // ~~~~~~~~~~~~~~~~~~~~~~~

    },

    switchTo: switchTo,

    addToCurrent: function (attraction) {
      currentDay.addAttraction(attraction);
    },

    removeFromCurrent: function (attraction) {
      currentDay.removeAttraction(attraction);
    }

  };

  return publicAPI;

}());
