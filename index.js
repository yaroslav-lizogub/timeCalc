import 'dotenv/config'
import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';

import {timeStringToArray, timeObjToString, clear, MINUTES_IN_HOUR} from './helper.js';

const TOKEN = process.env.TOKEN;
const BOT_IMAGE = process.env.BOT_IMAGE;


const COMMANDS = {
    start: '/start',
    add: '/add',
    calc: '/calc',
    clear: 'clear',
    view_data: '/view_data'
}

const bot = new TelegramBot(TOKEN, {polling: true});

const state = {
    command: ''
}

const keyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: "Ввести время",
                    callback_data: COMMANDS.add
                },
                {
                    text: "Посчитать введенное время",
                    callback_data: COMMANDS.calc
                },
            ],
            [
                {
                    text: "Сбросить введенное время",
                    callback_data: COMMANDS.clear
                },
                {
                    text: "Показать введенное время",
                    callback_data: COMMANDS.view_data
                }
            ]
        ]
    }
}

// bot.on('callback_query', async ({data, message}) => {
//     const chatId = message.chat.id;
//
//     if (data === COMMANDS.add) {
//         state.command = COMMANDS.add;
//         await bot.sendMessage(chatId, 'Напиши время в формате чч:мм-чч:мм или выбери другой пункт', keyboard);
//     }
//
//     if (data === COMMANDS.view_data) {
//         state.command = COMMANDS.view_data;
//         fs.readFile(`.chat-${chatId}`, async (err, data) => {
//             if (err) throw err;
//
//             const dataToView = JSON.parse(`[${data.toString()}]`);
//             dataToView.shift();
//             const viewString = dataToView.reduce((prev, current) => {
//                 return `${prev} ${current['hours']}ч:${current['minutes']}м;`
//             }, 'Вы ввели: ');
//
//             await bot.sendMessage(chatId, viewString, keyboard);
//         });
//     }
//
//     if (data === COMMANDS.clear) {
//         state.command = COMMANDS.clear;
//         clear(chatId);
//
//         await bot.sendMessage(chatId, 'Все почистил :-)', keyboard);
//     }
//
//     if (data === COMMANDS.calc) {
//         state.command = COMMANDS.calc;
//
//         fs.readFile(`.chat-${chatId}`, async (err, data) => {
//             if (err) throw err;
//
//             const timeToCalc = JSON.parse(`[${data.toString()}]`);
//
//             const totalInMinutes = timeToCalc.reduce((prev, current) => {
//
//                 return current['hours'] * 60 + current['minutes'] + prev
//             }, 0);
//
//             const timeObj = {
//                 hours: Math.floor(totalInMinutes / MINUTES_IN_HOUR),
//                 minutes: totalInMinutes % MINUTES_IN_HOUR
//             };
//
//             await bot.sendMessage(chatId, 'Всего: ' + timeObjToString(timeObj), keyboard);
//         });
//     }
// });
//
// bot.on('message', async (msg) => {
//     const chatId = msg.chat.id;
//     const text = msg.text.toLowerCase();
//
//     if (state.command === COMMANDS.add) {
//         //сначала нужна валидация
//         // await bot.sendMessage(chatId, 'Напиши время в формате чч:мм-чч:мм или выбери другой пункт', keyboard);
//
//         const userTime = text;
//
//         const timeArray = timeStringToArray(userTime);
//
//         const timeDiffInMinutes = timeArray[1] - timeArray[0];
//
//         const timeObj = {
//             hours: Math.floor(timeDiffInMinutes / MINUTES_IN_HOUR),
//             minutes: timeDiffInMinutes % MINUTES_IN_HOUR
//         };
//
//         fs.appendFile(`.chat-${chatId}`, `,${JSON.stringify(timeObj)}`, async (err) => {
//             if (err) throw err;
//         });
//
//         await bot.sendMessage(chatId, `Добавлено: ${timeObjToString(timeObj)}`, keyboard);
//
//         return;
//     }
//
//     switch (text) {
//         case COMMANDS.start:
//             clear(chatId);
//             state.command = COMMANDS.add
//             await bot.sendSticker(chatId, BOT_IMAGE);
//             await bot.sendMessage(chatId, 'Привет, я помогу тебе посчитать часы и минуты. Напиши время в формате чч:мм-чч:мм');
//
//             break;
//
//         default:
//
//             break;
//     }
// });
