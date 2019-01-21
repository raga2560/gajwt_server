var Booking = require('../models/booking');

function convert(str)
{

   var hoursDotMinutes = str;
   var fieldArray = hoursDotMinutes.split(":");
   var minutes = Number(fieldArray[0]) + 60*Number(fieldArray[1]);
   return minutes;
}



exports.getBookings = function(req, res, next){
    console.log("User asking booking = " + JSON.stringify(req.user));

    Booking.find({},
        function(err, bookings) {

        if (err){
        	res.send(err);
        }

        res.json(bookings);

    });

}


exports.getRoomBookings = function(req, res, next){
    var room = req.body.room;
    console.log("User asking booking = " + JSON.stringify(req.user));

    Booking.find({"room": room},
        function(err, bookings) {

        if (err){
        	res.send(err);
        }

        res.json(bookings);

    });

}
function checkbooking(room,bookingdate, S, E, cb)
{
   Booking.find({"room": room,"bookingdate":bookingdate, "startminutes": {"$lt": convert(E)}, "endminutes": {"$gt": convert(S)}},  function(err, bookings) {

            if (err){
                cb(err, null);
            }
            else {
                cb(null, bookings);
            }

});
}

exports.createBooking = function(req, res ){
    var bookingdata = req.body;
    console.log("User asking booking = " + JSON.stringify(req.user));


    var S = bookingdata.starttime;
    var E = bookingdata.endtime;
    var bookingdate = bookingdata.bookingdate;
    var room = bookingdata.roomname;

    checkbooking(room, bookingdate, S, E, function(err, data) {

    if(err){
      res.json(err);
    }
  
    if(data.length > 0)
    {
      var error = {
        status: 101,
	reason: "Booking not available in that slot"
      };
      res.json(error);
    }
    else {
    var booking = new Booking({
        endtime : E,
        starttime : S,
        bookingdate : bookingdate,
        startminutes : convert(bookingdata.starttime),
        endminutes : convert(bookingdata.endtime),
        owner : bookingdata.requester,
        room : bookingdata.roomname,
        done : false
                });


 
    booking.save(function(err, booking1){

        console.log("err="+err);
        if (err){
        	res.send(err);
        }
        else { 
        Booking.find( {_id: booking1._id}, function(err, bookings) {

            if (err){
            	res.send(err);
            }
            else {
            res.json(bookings);
            }
            

        });
       }

    });
   }
   });

}

exports.deleteBooking = function(req, res, next){

    Booking.remove({
        _id : req.params.booking_id
    }, function(err, booking) {
        res.json(booking);
    });

}


exports.getBooking = function(req, res, next){

    Booking.find({
        _id : req.params.booking_id}, 
     function(err, booking) {
        if (err){
                res.send(err);
        }
        else {
        req.booking = booking[0]; // useful when we need to process booking in next call
        res.json(booking[0]);
        }
    });
}

