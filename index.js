const fs = require('fs/promises');
const rfxcom = require('rfxcom');

const express = require('express');
const app = express();
const port = 4000;
let blyss;

const rfxtrx = new rfxcom.RfxCom("/dev/ttyUSB0", {debug: true});

// Your blinds codes go here
const blinds = {
	livingroom: '0xAAAA/E/1',
	bathroom: '0xBBBB/E/3'
}

rfxtrx.initialise(async () => {
    blyss = new rfxcom.Lighting6(rfxtrx, rfxcom.lighting6.BLYSS);
});

app.listen(port, () => {
	console.log(`Success! Your application is running on port ${port}.`);
});

app.get('/livingroom/down', (req, res) => {
	blyss.switchOff(blinds.livingroom);
	blyss.switchOff(blinds.livingroom);
	blyss.switchOff(blinds.livingroom);
	fs.writeFile(`livingroom.direction.txt`, 'down', 'utf-8');
	res.status(200).json();
});

app.get('/livingroom/up', (req, res) => {
	blyss.switchOn(blinds.livingroom);
	blyss.switchOn(blinds.livingroom);
	blyss.switchOn(blinds.livingroom);
	fs.writeFile(`livingroom.direction.txt`, 'up', 'utf-8');
	res.status(200).json();
});

app.get('/livingroom/stop', (req, res) => {
	fs.readFile('livingroom.direction.txt', 'utf-8').then(direction => {
		if (direction === 'up') blyss.switchOff(blinds.livingroom);
		if (direction === 'down') blyss.switchOn(blinds.livingroom);
	});
});

app.get('/bathroom/down', (req, res) => {
	blyss.switchOn(blinds.bathroom);
	blyss.switchOn(blinds.bathroom);
	blyss.switchOn(blinds.bathroom);
	fs.writeFile(`bathroom.direction.txt`, 'down', 'utf-8');
	res.status(200).json();
});

app.get('/bathroom/up', (req, res) => {
	blyss.switchOff(blinds.bathroom);
	blyss.switchOff(blinds.bathroom);
	blyss.switchOff(blinds.bathroom);
	fs.writeFile(`bathroom.direction.txt`, 'up', 'utf-8');
	res.status(200).json();
});

app.get('/bathroom/stop', (req, res) => {
	fs.readFile('bathroom.direction.txt', 'utf-8').then(direction => {
		if (direction === 'up') blyss.switchOff(blinds.bathroom);
		if (direction === 'down') blyss.switchOn(blinds.bathroom);
	});
});
