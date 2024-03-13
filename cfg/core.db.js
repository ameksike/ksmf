require("dotenv").config();
const config = {
	"development": {
		"host": process.env.DB_HOST,
		"port": process.env.DB_PORT,
		"database": process.env.DB_NAME,
		"username": process.env.DB_USER,
		"password": process.env.DB_PASS,
		"dialect": "mysql",
		"protocol": "mysql"
	},
	"production": {
		"url": process.env.DB_URL,
		"dialect": "mysql",
		"dialectOptions": {
			"ssl": {
				"rejectUnauthorized": false
			}
		}
	},
	"local": {
		"dialect": "sqlite",
		"storage": "./db/data/storage.db",
		"logging": false
	},
	"test": {
		"dialect": "sqlite",
		"storage": ":memory:",
		"logging": false
	}
};

module.exports = config;