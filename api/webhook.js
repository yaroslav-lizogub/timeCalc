// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fixes an error with Promise cancellation
process.env.NTBA_FIX_319 = 'test';

// Require our Telegram helper package
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');

const { timeStringToArray, timeObjToString, clear, MINUTES_IN_HOUR } = require('../helper');

const TOKEN = '6217059583:AAGiIn7Kx4_A5Qvl8HHhBWKUT4JjK1tgFc8';
const BOT_IMAGE = 'https://tlgrm.eu/_/stickers/a4c/e36/a4ce36f5-6ade-31f1-bd80-bae383e1c466/1.webp';


const COMMANDS = {
    start: '/start',
    add: '/add',
    calc: '/calc',
    clear: 'clear',
    view_data: '/view_data'
}

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

// Export as an asynchronous function
// We'll wait until we've responded to the user
module.exports = async (request, response) => {
    try {
        // Create our new bot handler with the token
        // that the Botfather gave us
        // Use an environment variable so we don't expose it in our code
        const bot = new TelegramBot(TOKEN);

        // Retrieve the POST request body that gets sent from Telegram
        const { body } = request;

        // Ensure that this is a message being sent
        if (body.message) {
            // Retrieve the ID for this chat
            // and the text that the user sent
            const { chat: { id }, text } = body.message;

            switch (text) {
                case COMMANDS.start:
                    // clear(id);
                    state.command = COMMANDS.add
                    await bot.sendSticker(id, BOT_IMAGE);
                    await bot.sendMessage(id, 'Привет, я помогу тебе посчитать часы и минуты. Напиши время в формате чч:мм-чч:мм');

                    break;

                default:

                    break;
            }

            //await bot.sendMessage(id, JSON.stringify(body), {parse_mode: 'Markdown'});
        }
    }
    catch(error) {
        // If there was an error sending our message then we
        // can log it into the Vercel console
        console.error('Error sending message');
        console.log(error.toString());
    }

    // Acknowledge the message with Telegram
    // by sending a 200 HTTP status code
    // The message here doesn't matter.
    response.send('OK');
};
