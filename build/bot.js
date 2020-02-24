"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
// DISCORD CLASS
// ----------------------------------------------------------------------------
var DiscordTS = /** @class */ (function () {
    function DiscordTS() {
        this.client = new discord_js_1.Client();
        this.config = require('./config.json');
    }
    DiscordTS.prototype.start = function () {
        var _this = this;
        console.log('Starting bot...');
        // => Bot is ready...
        this.client.on('ready', function () {
            console.log("[" + _this.config.nameBot + "] Connected.");
            console.log("Logged in as " + _this.client.user.tag);
            _this.client.user.setActivity(_this.config.activity);
        });
        // => Message handler
        this.client.on('message', function (message) {
            // => Prevent message from the bot
            if (message.author.id !== _this.client.user.id) {
                // => Test command
                if (message.content === _this.config.prefix + 'ping') {
                    message.reply('Pong !');
                }
            }
        });
        // => Process handler
        process.on('exit', function () {
            console.log("[" + _this.config.nameBot + "] Process exit.");
            _this.client.destroy();
        });
        process.on('uncaughtException', function (err) {
            var errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(__dirname + "/", 'g'), './');
            console.log(errorMsg);
        });
        // => Login
        this.client.login(this.config.token);
    };
    return DiscordTS;
}());
exports.DiscordTS = DiscordTS;
