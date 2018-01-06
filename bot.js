const discord = require("discord.js")
const auth = require("./auth.json")
const fs = require('fs');
const random = require("random-js")();
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
    } else {
        // custom memes, borrowed heavily from https://github.com/iArePJ/CommandBot
        let checkMessage = message.content.split(" ");
        if (checkMessage[0] === '^creatememe') {
            try {
                let memeName = checkMessage[1];
                if (memeName === '^memes' || memeName === '^help') {
                    message.channel.send("You can't do that.");
                    return null;
                }
                let memeText = message.content.split('|', 2);
                if (memeText[1] === undefined) {
                    message.channel.send("You forgot to use '|'");
                    return null;
                }
                if (memeName.charAt(0) === '^') {
                    checkExistingMeme(memeText[1], memeName);
                } else {
                    checkExistingMeme(memeText[1], '^' + memeName);
                }
                message.channel.send("Meme " + memeName + " has been created.");

            } catch (error) {
                console.log("Error\nAuthor: " + message.author.username + "\nMessage: " + message.content);
            }
        }

        fs.readFile('./memes/memes.txt', 'utf8', function (err, f) {
            let com = f.toString().split(";");
            for (i = 0; i < com.length; i++) {
                if (message.content === com[i]) {
                    if (com[i] === "^memes") {
                        message.author.send(com);
                        break;
                    }
                    if (com[i] === "^help") {
                        message.channel.send("How to create memes:\n^creatememe ^NameOfMeme | Type whatever you want here");
                        break;
                    }
                    let meme = "./memes/" + com[i] + ".txt";
                    fs.readFile(meme, 'utf8', function (err, f) {
                        try {
                            let com2 = f.toString().split(";");
                            let num = random.integer(0, com2.length - 1);
                            message.channel.send(com2[Math.floor(num)]);
                        }
                        catch (err) {
                            console.error("", err);
                        }
                    });
                }
            }
        });
    }
});

function checkExistingMeme(memeText, memeName) {
    let memeExists = false;
    fs.readFile('./memes/memes.txt', 'utf8', function (err, f) {
        let findMemes = f.toString().split(";");
        for (i = 0; i < findMemes.length; i++) {
            if (memeName === findMemes[i]) {
                memeExists = true;
            }
        }
        if (memeExists === true) {
            createMeme(memeText, true, memeName);
        } else if (memeExists === false) {
            createMeme(memeText, false, memeName);
        }
    });

}

function createMeme(memeText, memeExists, memeName) {
    let fileName = "./memes/" + memeName + ".txt";
    if (memeExists === true) {
        fs.writeFile(fileName, memeText, function (err) {
            if (err) {
                return console.error(err);
            }
        });
    } else if (memeExists === false) {
        fs.appendFile('./memes/memes.txt', memeName + ';', (err) => {
            if (err) throw err;
        });

        fs.writeFile(fileName, memeText.trim(), function (err) {
            if (err) {
                return console.error(err);
            }
        });
    }
}

// hack into the database B)
bot.login(token);
