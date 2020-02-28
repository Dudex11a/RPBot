"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var session_1 = require("../build/session");
// DISCORD CLASS
// ----------------------------------------------------------------------------
var DiscordTS = /** @class */ (function () {
    function DiscordTS() {
        this.client = new discord_js_1.Client();
        this.config = require('./json/config.json');
        this.sessions = [];
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
                var split_msg = message.content.split(" ");
                var msg_prefix = split_msg[0].slice(0, _this.config.prefix.length);
                var msg_command = split_msg[0].slice(_this.config.prefix.length);
                if (msg_prefix === _this.config.prefix) {
                    var session_index = _this.has_channel(message.guild.id, message.channel.id);
                    switch (msg_command) {
                        case "start":
                            var users = split_msg.slice(1, split_msg.length);
                            if (users.length > 1) {
                                var session = new session_1.Session(message.guild, message.channel, _this.client, users, _this.config);
                                if (session.players.length > 1) {
                                    if (session_index > -1) {
                                        var old_session = _this.sessions.splice(session_index, 1)[0];
                                        old_session.active = false;
                                        _this.sessions.push(session);
                                        message.channel.send("Session updated.");
                                    }
                                    else {
                                        _this.sessions.push(session);
                                        message.channel.send("New session created.");
                                    }
                                    session.current_turn();
                                }
                                else {
                                    message.channel.send("Not enough players in session, no session will be created.");
                                }
                            }
                            else {
                                message.channel.send("You have no users stated. At least two people are required.");
                            }
                            break;
                        case "end":
                            if (session_index > -1) {
                                var session = _this.sessions.splice(session_index, 1)[0];
                                session.active = false;
                                message.channel.send("The session has been ended.");
                            }
                            else {
                                message.channel.send("There is no session in this channel.");
                            }
                            break;
                        // case "sessions":
                        //     if (this.sessions.length > 0) {
                        //         message.channel.send(this.sessions.toString());
                        //     } else {
                        //         message.channel.send("There are currently no sessions.");
                        //     }
                        //     break;
                    }
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
    DiscordTS.prototype.has_channel = function (guild_id, channel_id) {
        var index = -1;
        for (var i = 0; i < this.sessions.length; i++) {
            var value = this.sessions[i];
            if (value.guild.id == guild_id && value.channel.id == channel_id) {
                index = i;
            }
        }
        return index;
    };
    return DiscordTS;
}());
exports.DiscordTS = DiscordTS;
