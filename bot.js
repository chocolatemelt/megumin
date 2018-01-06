const discord = require("discord.js")
const auth = require("./auth.json")

const bot = new discord.Client();

// auth.json shouldn't be public
const token = auth.token;

bot.on("ready", () => {
    console.log("我が名はめぐみん！");
});

bot.on("message", message => {
    if (message.author.bot) return;

    if (message.content.indexOf("!") === 0) {
        var text = message.content.substring(1);

        message.reply(reversed).then(function (message) {
            message.react("398962296967397376")
            message.react("398962692347396099")
        }).catch(function() {
        });
    }
});

bot.login(token);
