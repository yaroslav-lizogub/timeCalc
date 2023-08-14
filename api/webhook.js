// Export as an asynchronous function
// We'll wait until we've responded to the user
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');

const { timeStringToArray, timeObjToString, clear, MINUTES_IN_HOUR } = require('../helper');

const COMMANDS = {
    start: '/start',
    add: '/add',
    calc: '/calc',
    clear: 'clear',
    view_data: '/view_data'
}

module.exports = async (request, response) => {

    try {
        // Create our new bot handler with the token
        // that the Botfather gave us
        // Use an environment variable so we don't expose it in our code
        const bot = new TelegramBot('6217059583:AAGiIn7Kx4_A5Qvl8HHhBWKUT4JjK1tgFc8', {polling: true});

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

        // Retrieve the POST request body that gets sent from Telegram
        const { body } = request;

        // Ensure that this is a message being sent
        if (body.message) {
            const chatId = body.message.chat.id;
            const text = body.message.text.toLowerCase();

            if (state.command === COMMANDS.add) {
                //сначала нужна валидация
                // await bot.sendMessage(chatId, 'Напиши время в формате чч:мм-чч:мм или выбери другой пункт', keyboard);

                const userTime = text;

                const timeArray = timeStringToArray(userTime);

                const timeDiffInMinutes = timeArray[1] - timeArray[0];

                const timeObj = {
                    hours: Math.floor(timeDiffInMinutes / MINUTES_IN_HOUR),
                    minutes: timeDiffInMinutes % MINUTES_IN_HOUR
                };

                fs.appendFile(`.chat-${chatId}`, `,${JSON.stringify(timeObj)}`, async (err) => {
                    if (err) throw err;
                });

                await bot.sendMessage(chatId, `Добавлено: ${timeObjToString(timeObj)}`, keyboard);

                return;
            }

            switch (text) {
                case COMMANDS.start:
                    clear(chatId);
                    state.command = COMMANDS.add
                    await bot.sendSticker(chatId, BOT_IMAGE);
                    await bot.sendMessage(chatId, 'Привет, я помогу тебе посчитать часы и минуты. Напиши время в формате чч:мм-чч:мм');

                    break;

                default:

                    break;
            }
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
