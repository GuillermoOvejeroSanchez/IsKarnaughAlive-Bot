console.log('Is Karnaugh Alive?');

var Twit = require('twit');
var moment = require('moment');
var T = new Twit(require('./config')); //Config file with tokens
var request = require("request");

var alreadyDead = false;
var diedOn = "DD/MM/YYYY";
var status = '';
var statusIndex = 0;
tweetKarnaughStatus();
//setInterval(tweetKarnaughStatus, 1000 * 60 * 60 * 12); //tweets every 12 hours

function tweetKarnaughStatus() {
    var isDead = getKarnaughStatus();
    if (!isDead){
        status = `YES at ${moment().format('MMMM Do YYYY, h:mm:ss a')}`; //Diferent status, else throws error
        alreadyDead = false;
    }
    else if (isDead) {
        if (!alreadyDead) {
            diedOn = moment().format("DD/MM/YYYY");
        }
        status = `REST IN PEPPERONI KARNAUGH ${diedOn}`;
        alreadyDead = true;
    }
    statusIndex++;
    console.log(status);
    
/*
    T.post('statuses/update', {
        status: status
    }, function (err, data, response) {
        if (err) console.log(err);
    })
*/
}


async function getKarnaughStatus() {

    //Maurice Karnaugh infocard
    var url = "https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=Maurice%20Karnaugh&rvsection=0";

    await request({
        url: url,
        json: false
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
           // console.log(body) // Print the json response
            var parsed = JSON.parse(body);
            var infobox = parsed.query.pages[12748221].revisions[0]["*"].split('|');

            console.log(`${infobox[14]}${infobox[15]}${infobox[16]}${infobox[17]}${infobox[18]}${infobox[19]}${infobox[20]}`); //Print death_date

            if (infobox[14] != ' death_date  =   <!--{{death date and age ') {
                //console.log('rip');
                return true;
            } else if (infobox[14] === ' death_date         = {{dda') {
                //infoboxes 15 16 17 = deat_date (YYYY/MM/DD)
                //console.log('rip');
                return true;
            } else {
                //console.log('still alive');
                return false;
            }
        }
    })
}