const fetch = require("node-fetch");
const Discord = require("discord.js");
const manastack = require("./../../config/manastack.json");
const moment = require("moment");

class Status
{
	constructor(client)
	{
		this.channel = client.channels.find("name", "development");
	}

	async check()
	{
		await fetch(manastack.status)
			.then(res => res.json())
			.then(json => {
				let keys = Object.keys(json);
				keys.forEach((key) => {
					let post = new Discord.RichEmbed();
					post.setTitle("ManaStack Status Alert");
					let body = "";
					if (json[key].status !== 200) {
						body += "Service '" + key + "' not returning HTTP 200\n";
					}
					if (json[key].response_time > 2000) {
						body += "Service '" + key + "' taking longer than 2000ms to respond\n";
					}
					if (json[key].error) {
						body += "Service '" + key + "' can not be reached with error: " + json[key].error
					}
					if (body.length > 0) {
						post.setDescription(body);
						post.setFooter(moment().format("HH:mm:ss dddd, MMMM Do YYYY"));
						this.channel.send(post);
					}
				});				
			}).catch(err => console.error(err));
	}
}

module.exports = Status;
