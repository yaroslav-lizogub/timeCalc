module.exports = async (request, response) => {

    try {
        // Create our new bot handler with the token
        // that the Botfather gave us
        // Use an environment variable so we don't expose it in our code
        const bot = new TelegramBot('6217059583:AAGiIn7Kx4_A5Qvl8HHhBWKUT4JjK1tgFc8', {polling: true});

        // Retrieve the POST request body that gets sent from Telegram
        const { body } = request;

        // Ensure that this is a message being sent
        if (body.message) {
            const chatId = body.message.chat.id;
            const text = body.message.text.toLowerCase();

            await bot.sendMessage(chatId, 'Привет, я помогу тебе посчитать часы и минуты. Напиши время в формате чч:мм-чч:мм');
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
