import { Message } from 'discord.js'

export class Session {
    public guild_id: String;
    public channel_id: String;
    public players: Array<String>;

    constructor(guild_id: String, channel_id: String, players: Array<String>) {
        this.guild_id = guild_id;
        this.channel_id = channel_id;
        this.players = players;
    }

    public toString(): String {
        return "Server ID: " + this.guild_id + "\nChannel ID: " + this.channel_id + "\nPlayers: " + this.players;
    }
}