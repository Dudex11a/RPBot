"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var Session = /** @class */ (function () {
    function Session(guild, channel, client, players, config) {
        var _this = this;
        this.guild = guild;
        this.channel = channel;
        this.active = true;
        var fixed_players = [];
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            var regex_result = player.match(/(\d)+/g);
            if (regex_result instanceof Array) {
                fixed_players.push(regex_result[0]);
            }
            else {
                this.channel.send(player + " is not in the correct format.");
            }
        }
        this.players = fixed_players;
        client.on('message', function (message) {
            // On message in channel
            if (message.channel.id == _this.channel.id && message.guild.id == _this.guild.id && message.author.id !== client.user.id && _this.active) {
                var split_msg = message.content.split(" ");
                var msg_prefix = split_msg[0].slice(0, config.prefix.length);
                var msg_command = split_msg[0].slice(config.prefix.length);
                if (msg_prefix === config.prefix) {
                    switch (msg_command) {
                        case "order":
                            var order = "";
                            for (var i = 0; i < _this.players.length; i++) {
                                var player = _this.players[i];
                                order = "" + order + _this.create_at(player) + " => ";
                            }
                            channel.send(order);
                            break;
                    }
                }
                else {
                    if (message.author.id === _this.players[0]) {
                        _this.next_turn(message);
                    }
                }
            }
        });
    }
    Session.prototype.next_turn = function (message) {
        // Move the current player to the end of the list
        var c_player = this.players.splice(0, 1)[0];
        this.players.splice(this.players.length, 0, c_player);
        this.current_turn();
    };
    Session.prototype.current_turn = function () {
        var _this = this;
        this.channel.send("It's " + this.create_at(this.players[0]) + "'s turn.").then(function (sent) {
            if (_this.last_message instanceof discord_js_1.Message) {
                _this.last_message.delete();
            }
            _this.last_message = sent;
        });
    };
    Session.prototype.create_at = function (id) {
        return "<@!" + id + ">";
    };
    Session.prototype.toString = function () {
        return "Server ID: " + this.guild + "\nTextChannel ID: " + this.channel.id + "\nPlayers: " + this.players;
    };
    return Session;
}());
exports.Session = Session;
