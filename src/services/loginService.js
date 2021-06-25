const DBConnection = require("./../configs/DBConnection");
const bcrypt = require("bcryptjs");

let handleLogin = (enrid, password) => {
    return new Promise(async (resolve, reject) => {
        //check enrid is exist or not
        let user = await findUserByEnrid(enrid);
       
        if (user) {
            //compare password
            await bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    resolve(true);
                } else {
                    reject(`The password that you've entered is incorrect`);
                }
            });
        } else {
            reject(`This users enrollment-id "${enrid}" doesn't exist`);
        } 
    });
};


let findUserByEnrid = (enrid) => {
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `faculty` WHERE `enrid` = ?  ', enrid,
                function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let user = rows[0];
                    resolve(user);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
 

let findUserById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `faculty` WHERE `id` = ?  ', id,
                function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let user = rows[0];
                    resolve(user);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let comparePassword = (password, userObject) => {
    return new Promise(async (resolve, reject) => {
        try {
            await bcrypt.compare(password, userObject.password).then((isMatch) => {
                if (isMatch) {
                    resolve(true);
                } else {
                    resolve(`The password that you've entered is incorrect`);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleLogin: handleLogin,
    findUserByEnrid: findUserByEnrid,
    findUserById: findUserById,
    comparePassword: comparePassword
};