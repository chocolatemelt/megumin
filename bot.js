const discord = require("discord.js")
const auth = require("./auth.json")
const fs = require("fs");
const random = require("random-js")();
const bot = new discord.Client();

// auth.json shouldn't be public
const token = auth.token;

// explosions
bot.on("ready", () => {
    console.log("我が名はめぐみん！");
    // clean up memes file
    fs.readFile('./memes/memes.txt', 'utf8', function (err, f) {
        f = f.replace(/(\r\n|\n|\r)/gm, "");
        fs.writeFile('./memes/memes.txt', f, "", function (err) {
            if (err) {
                console.err(err);
            }
        });
    });
});

// asynchronously respond and react to messages
bot.on("message", async message => {
    // obviously don't want to infinite combo
    if (message.author.bot) return;

    // standard poe prefix
    if (message.content.startsWith("Rarity: Rare")) {
        await message.react("398962296967397376")
        await message.react("398962692347396099")
    } else {
        // custom memes, borrowed heavily from https://github.com/iArePJ/CommandBot
        let checkMessage = message.content.split(" ");
        if (checkMessage[0] === "^addmeme") {
            try {
                let memeName = checkMessage[1];
                if (checkMessage[1] === undefined) {
                    message.channel.send("`^addmeme <command> <text>`");
                    return null;
                }
                if (memeName.indexOf(0) != "^") {
                    memeName = "^" + memeName;
                }
                if (memeName === "^delmeme" || memeName === "^memes" || memeName === "^help" || memeName === "^addmeme") {
                    message.channel.send("idiot");
                    return null;
                }
                if (message.content.split(" ").length < 3) {
                    message.channel.send("`^addmeme <command> <text>`");
                    return null;
                }
                const pivot = message.content.indexOf(" ", message.content.indexOf(" ") + 1);
                let memeText = new Array(2);
                memeText[0] = message.content.split(" ")[1];
                memeText[1] = message.content.substring(pivot);
                if (memeText[1] === undefined) {
                    message.channel.send("`^addmeme <command> <text>`");
                    return null;
                }
                if (memeName.charAt(0) === "^") {
                    checkExistingMeme(memeText[1], memeName);
                } else {
                    checkExistingMeme(memeText[1], "^" + memeName);
                }
                message.channel.send("custom meme successfully added");

            } catch (error) {
                console.log("Error: " + error + "\nAuthor: " + message.author.username + "\nMessage: " + message.content);
            }
        } else if (checkMessage[0] === "^delmeme" && message.author.tag === "kev#4712") {
            let memeName = checkMessage[1];
            if (memeName === undefined) {
                message.channel.send("`^delmeme <command>`");
                return null;
            }
            if (memeName.indexOf(0) != "^") memeName = "^" + memeName;
            if (memeName === "^delmeme" || memeName === "^memes" || memeName === "^help" || memeName === "^addmeme") {
                message.channel.send("idiot");
                return null;
            }
            let memeIdx = -1;
            let findMemes = "";
            fs.readFile("./memes/memes.txt", "utf8", function (err, f) {
                findMemes = f.toString().split(";");
                for (i = 0; i < findMemes.length; i++) {
                    if (memeName === findMemes[i]) {
                        memeIdx = i;
                    }
                }
                if (memeIdx > -1) {
                    findMemes.splice(memeIdx, 1);
                    fs.unlinkSync("./memes/" + memeName + ".txt");
                    fs.writeFile("./memes/memes.txt", findMemes.join(";"), function (err) {
                        if (err) {
                            return console.err(err);
                        }
                    });
                    message.channel.send("successfully deleted " + checkMessage[1]);
                } else {
                    message.channel.send("not found");
                }
            });
        }

        fs.readFile("./memes/memes.txt", "utf8", function (err, f) {
            let com = f.toString().split(";");
            for (i = 0; i < com.length; i++) {
                if (message.content === com[i]) {
                    if (com[i] === "^memes") {
                        message.author.send(com);
                        break;
                    }
                    if (com[i] === "^help") {
                        message.channel.send("^addmeme ^delmeme ^help ^memes");
                        break;
                    }
                    let meme = "./memes/" + com[i] + ".txt";
                    fs.readFile(meme, "utf8", function (err, f) {
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
    fs.readFile("./memes/memes.txt", "utf8", function (err, f) {
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
        fs.appendFile("./memes/memes.txt", memeName + ";", (err) => {
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
