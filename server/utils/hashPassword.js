const bcrypt = require("bcrypt");

async function generateHash() {

    const password = "admin123";

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("\nHashed Password:\n");
    console.log(hashedPassword);

}

generateHash();