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
        // custom commands
        let checkMessage = message.content.split(" ");
        if (checkMessage[0] === '~createcommand') {
            try {
                let commandName = checkMessage[1];
                if (commandName === '~commands' || commandName === '~help') {
                    message.channel.send("You can't do that.");
                    return null;
                }
                let commandText = message.content.split('|', 2);
                if (commandText[1] === undefined) {
                    message.channel.send("You forgot to use '|'");
                    return null;
                }
                if (commandName.charAt(0) === '~') {
                    checkExistingCommand(commandText[1], commandName);
                } else {
                    checkExistingCommand(commandText[1], '~' + commandName);
                }
                message.channel.send("Command " + commandName + " has been created.");

            } catch (error) {
                console.log("Error\nAuthor: " + message.author.username + "\nMessage: " + message.content);
            }
        }

        fs.readFile('./commands/commands.txt', 'utf8', function (err, f) {
            let com = f.toString().split(";");
            for (i = 0; i < com.length; i++) {
                if (message.content === com[i]) {
                    if (com[i] === "~commands") {
                        message.author.send(com);
                        break;
                    }
                    if (com[i] === "~help") {
                        message.channel.send("How to create commands:\n~createcommand ~NameOfCommand | Type whatever you want here");
                        break;
                    }
                    let command = "./commands/" + com[i] + ".txt";
                    fs.readFile(command, 'utf8', function (err, f) {
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

function checkExistingCommand(commandText, commandName) {
    let commandExists = false;
    fs.readFile('./commands/commands.txt', 'utf8', function (err, f) {
        let findCommands = f.toString().split(";");
        for (i = 0; i < findCommands.length; i++) {
            if (commandName === findCommands[i]) {
                commandExists = true;
            }
        }
        if (commandExists === true) {
            createCommand(commandText, true, commandName);
        } else if (commandExists === false) {
            createCommand(commandText, false, commandName);
        }
    });

}

function createCommand(commandText, commandExists, commandName) {
    let fileName = "./commands/" + commandName + ".txt";
    if (commandExists === true) {
        fs.writeFile(fileName, commandText, function (err) {
            if (err) {
                return console.error(err);
            }
        });
    } else if (commandExists === false) {
        fs.appendFile('./commands/commands.txt', commandName + ';', (err) => {
            if (err) throw err;
        });

        fs.writeFile(fileName, commandText.trim(), function (err) {
            if (err) {
                return console.error(err);
            }
        });
    }
}

// hack into the database B)
bot.login(token);
