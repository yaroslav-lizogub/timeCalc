import fs from 'fs';

function timeStringToArray (timeString) {
    return timeString.split('-')
    .map(el => el.split(':'))
    .map(el => Number(el[0]) * MINUTES_IN_HOUR + Number(el[1]))
}

function timeObjToString (timeObj) {
    return `${timeObj.hours}ч:${timeObj.minutes}м`
}

function clear (chatId) {
    fs.writeFile(`.chat-${chatId}`, JSON.stringify({"hours":0,"minutes":0}), async (err) => {
        if (err) throw err;
    });
}

const MINUTES_IN_HOUR = 60;

export {timeStringToArray, timeObjToString, clear, MINUTES_IN_HOUR};
