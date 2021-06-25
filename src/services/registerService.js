const DBConnection = require("./../configs/DBConnection");
const bcrypt = require("bcryptjs");

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        // check email is exist or not
        let isEmailExist = await checkExistEmail(data.email);
        if (isEmailExist) {
            reject(`This email "${data.email}" has already exist. Please choose an other email`);
        } else {
            // hash password
            let salt = bcrypt.genSaltSync(10);
            let userItem = {
                enrid: parseInt(data.enrid),
                fullname: data.fullname,
                email: data.email,
                branch: data.branch,
                role: data.role,
                password: bcrypt.hashSync(data.password, salt)
            };

            //create a new account
            DBConnection.query(
                ' INSERT INTO faculty set ? ', userItem,
                function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Create a new user successful");
                }
            );
        }
    });
};


let checkExistEmail = (email) => {
    return new Promise( (resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `faculty` WHERE `email` = ?  ', email,
                function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    if (rows.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};


module.exports = {
    createNewUser: createNewUser
};
