const discord = require("discord.js")
const auth = require("./auth.json")
const bot = new discord.Client();

// auth.json shouldn't be public
const token = auth.token;

// explosions
bot.on("ready", () => {
    console.log("我が名はめぐみん！");
});

// asynchronously respond and react to messages
bot.on("message", async message => {
    // obviously don't want to infinite combo
    if(message.author.bot) return;

    // standard poe prefix
    if(message.content.startsWith("Rarity: Rare")) {
        await message.react("398962296967397376")
        await message.react("398962692347396099")
    }
});

// hack into the database B)
bot.login(token);
