import { Client, Message } from 'discord.js'
import { Session } from '../src/session'

// DISCORD CLASS
// ----------------------------------------------------------------------------
export class DiscordTS {
    private client: Client
    private config: any
    private sessions: Array<Session>

    constructor() {
        this.client = new Client();
        this.config = require('./json/config.json');
        this.sessions = [];
    }

    public start(): void {
        console.log('Starting bot...');

        // => Bot is ready...
            this.client.on('ready', () => {
                console.log(`[${ this.config.nameBot }] Connected.`);
                console.log(`Logged in as ${ this.client.user.tag }`);
                this.client.user.setActivity(this.config.activity);
            });

        // => Message handler
            this.client.on('message', (message: Message) => {
                // => Prevent message from the bot
                    if (message.author.id !== this.client.user.id) {
                        let split_msg: Array<String> = message.content.split(" ")
                        let msg_prefix: String = split_msg[0].slice(0, this.config.prefix.length)
                        let msg_command: String = split_msg[0].slice(this.config.prefix.length)
                        if (msg_prefix === this.config.prefix) {
                            switch(msg_command) {
                                case "start":
                                    let session_index: number = this.has_channel(message.guild.id, message.channel.id);
                                    let users: Array<String> = split_msg.slice(1, split_msg.length)
                                    if (session_index > -1) {
                                        this.sessions = this.sessions.splice(session_index);
                                        this.sessions.push(new Session(message.guild.id, message.channel.id, users));
                                        message.channel.send("Session updated");
                                    } else {
                                        this.sessions.push(new Session(message.guild.id, message.channel.id, users))
                                        message.channel.send("New session created");
                                    }
                                    break;
                                case "end":
                                    break;
                                case "sessions":
                                    message.channel.send(this.sessions.toString());
                                    break;
                            }
                        }
                    }
            });


        // => Process handler
            process.on('exit', () => {
                console.log(`[${ this.config.nameBot }] Process exit.`);
                    this.client.destroy();
                });
            process.on('uncaughtException', (err: Error) => {
                    const errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
                    console.log(errorMsg);
                });

        // => Login
            this.client.login(this.config.token);
    }

    public has_channel(guild_id: String, channel_id: String): number {
        let index: number = -1;
        for (let i = 0; i < this.sessions.length; i++) {
            let value: Session = this.sessions[i];
            if (value.guild_id == guild_id && value.channel_id == channel_id) {
                index = i;
            }
        }
        return index;
    }
}