const discord = require("discord.js")
const auth = require("./auth.json")

const bot = new discord.Client();

// auth.json shouldn't be public
const token = auth.token;

bot.on("ready", () => {
    console.log("我が名はめぐみん！");
});

bot.on("message", async message => {
    if(message.author.bot) return;

    if(message.content.startsWith("Rarity: Rare")) {
        await message.react("398962296967397376")
        await message.react("398962692347396099")
    }
});

bot.login(token);
