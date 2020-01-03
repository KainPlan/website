const bcrypt = require('bcrypt');

let pass = process.argv[2] ? process.argv[2] : 'test1234',
	rounds = process.argv[3] ? +process.argv[3] : 12;
let stime = Date.now();

bcrypt.genSalt(rounds, (err, salt) => {
	if (err) throw err;
	bcrypt.hash(pass, salt, (err, h) => {
		if (err) throw err;
		console.log(`[+] Hashed "${pass}": ${h} ... `);
		console.log(`[i] Total time: ${Date.now() - stime}ms ... `);
		console.log();

		stime = Date.now();
		bcrypt.compare(pass, h, (err, res) => {
			if (err) throw err;
			console.log(`[i] Password match? ${res}`);
			console.log(`[i] Total time: ${Date.now() - stime}ms ...`);
		});
	});
});
