import { Client, Message, TextChannel, DMChannel, GroupDMChannel, Guild } from 'discord.js'
import { create } from 'domain';

export class Session {
    public guild: Guild;
    public channel: TextChannel | DMChannel | GroupDMChannel;
    public players: Array<String>;
    public active: boolean;
    public last_message: Message | Message[] | undefined;

    constructor(guild: Guild, channel: TextChannel | DMChannel | GroupDMChannel, client: Client, players: Array<String>, config: any) {
        this.guild = guild;
        this.channel = channel;
        this.active = true;

        let fixed_players: Array<String> = []
        for(let i = 0; i < players.length; i++) {
            let player: String = players[i];
            let regex_result: Array<String> | null = player.match(/(\d)+/g)
            if (regex_result instanceof Array) {
                fixed_players.push(regex_result[0]);
            } else {
                this.channel.send(player + " is not in the correct format.");
            }
        }
        this.players = fixed_players;

        client.on('message', (message: Message) => {
            // On message in channel
            if (message.channel.id == this.channel.id && message.guild.id == this.guild.id && message.author.id !== client.user.id && this.active) {

                let split_msg: Array<String> = message.content.split(" ")
                let msg_prefix: String = split_msg[0].slice(0, config.prefix.length)
                let msg_command: String = split_msg[0].slice(config.prefix.length)

                if (msg_prefix === config.prefix) {
                    switch(msg_command) {
                        case "order":
                            let order: String = "";
                            for (let i = 0; i < this.players.length; i++) {
                                let player: String = this.players[i];
                                order = "" + order + this.create_at(player) + " => ";
                            }
                            channel.send(order);
                            break;
                    }
                } else {
                    if (message.author.id === this.players[0]) {
                        this.next_turn(message);
                    }
                }
            }
        });
    }

    public next_turn(message: Message): void {
        // Move the current player to the end of the list
        let c_player: String = this.players.splice(0, 1)[0];
        this.players.splice(this.players.length, 0, c_player);
        
        this.current_turn();
    }

    public current_turn(): void {
        this.channel.send("It's " + this.create_at(this.players[0]) + "'s turn.").then(sent => {
            if (this.last_message instanceof Message) {
                this.last_message.delete();
            }
            this.last_message = sent;
        });
    }

    public create_at(id: String): String {
        return "<@!" + id + ">";
    }

    public toString(): String {
        return "Server ID: " + this.guild + "\nTextChannel ID: " + this.channel.id + "\nPlayers: " + this.players;
    }
}