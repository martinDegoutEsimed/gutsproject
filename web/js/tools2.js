const Crypto = require('crypto');

module.exports = class tools2 {
    static reviveList(jsonArray, objectReviveCallback) {
        let rows = [];

        if (jsonArray === null || typeof jsonArray === "undefined") {
            return null;
        }
        if (typeof objectReviveCallback === "undefined") {
            throw "Callback can't undefined";
        }

        try {
            jsonArray.forEach((row) => {
                rows.push(objectReviveCallback(row));
            });
        } catch (e) {
            throw `Not an array - ${e}`;
        }

        return rows;
    }

    static sha256(secret, salt) {
        let hash = Crypto.createHmac('sha256', secret).update(salt).digest('hex');
        return hash;
    }

    static compareSha256(secret, encryptedSecret, salt) {
        return (encryptedSecret === tools.sha256(secret, salt));
    }

    static boolToInt(boolean) {
        return (boolean ? 1 : 0);
    };

    static intToBool(int) {
        return (!!int);
    }

    static dateToInt(date) {
        if (tools.empty(date)) {
            return null;
        }

        return date.getTime();
    }

    static intToDate(int) {
        return new Date(int);
    }

    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static empty(values) {
        if (typeof values === "undefined" || values === null) {
            return true;
        }

        if (!Array.isArray(values)) {
            if (values.length === 0) {
                return true;
            }
        }

        return false;
    }
};