// Constants
const DAYLIGHT_REQUIRED_IN_SECONDS = 50400;
const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY || '';
const MAKER_KEY = process.env.MAKER_KEY || '';
// imports
const schedule = require('node-schedule');
const axios = require('axios');

// this next bit seems hacky but the schedule library won't keep 
// things running even while items are scheduled
const net = require('net');
const server = net.createServer();
server.on('connection', (conn) => { });
server.listen(8080);
server.on('listening', () => { });

const getWeather = async (location='39.696570,-84.315624') => {
    return axios.get(
        `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${location}`
    )
    .then(response => response.data);
}

const emitEvent = (event='') => {
    console.log(`Running event: ${event}`)
    return axios.get(`https://maker.ifttt.com/trigger/${event}/with/key/${MAKER_KEY}`).then(result => {
        // exit for the day if the lights are done
        if (event === 'lights_off') {
            console.log('emitEvent, lights _off')
        }
        return result;
    })
};

// 
// Optimal light exposure time for laying chichens is 14 hours, 
// I want the natrual sunset to be the end of day so they return
// to their roost.
// 

// cron this script at 4am
const lightSchedule = async () => {
    console.log(`*************`);
    console.log(`************* Running on ${(new Date()).toLocaleDateString()}`);
    console.log(`*************`);
    const newWeather = await getWeather();
    const {sunsetTime, sunriseTime} = newWeather.daily.data[1];
    const naturalDay = sunsetTime - sunriseTime;
    const lightNeeded = DAYLIGHT_REQUIRED_IN_SECONDS - naturalDay; // constant 14 hours in seconds

    if (lightNeeded > 0) {
        // low/warm light for 30 minutes
        console.log(`Extra light required, ${lightNeeded/60/60} hours`)
        const lightsOn = sunriseTime-lightNeeded;
        const lightOnAt = new Date(lightsOn*1000); // to milliseconds

        console.log(`Turn Lights on, set intesity to 25 with a warm color at `, lightOnAt.toLocaleString());
        
        schedule.scheduleJob(lightOnAt, emitEvent.bind(null,'lights_dawn'));
        //schedule.scheduleJob(lightUpAt, emitEvent.bind(null,'lights_on'));

        if (lightNeeded > 60*60) {
            const lightsUp = sunriseTime-lightNeeded+60*30;
            const lightUpAt = new Date(lightsUp*1000); // to milliseconds
        
            console.log(`Turn Lights up to 75% intesity with a cool color at `, lightUpAt.toLocaleString());
        
            schedule.scheduleJob(lightUpAt, emitEvent.bind(null,'lights_75'));
        }

        const lightsOff = sunriseTime + 60*30;
        const lightsOffAt = new Date(lightsOff*1000); // to milliseconds
        
        console.log(`Turn lights off at ${lightsOffAt.toLocaleTimeString()}`) 
        
        schedule.scheduleJob(lightsOffAt, emitEvent.bind(null,'lights_off'));
    }
}

lightSchedule();
