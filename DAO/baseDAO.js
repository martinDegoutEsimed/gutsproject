module.exports = class BaseDAO {
    constructor(db) {
        this.db = db;
    }

    run(sql, param = [], callbackSuccess, callbackError) {
        let stmt = this.db.prepare(sql);
        stmt.run(
            param,
            function (err) {
                if (err == null && callbackSuccess) {
                    callbackSuccess(this);
                    return;
                }

                if (callbackError) {
                    callbackError(err);
                }
            }
        );
        stmt.finalize();
    }

    each(sql, param, callbackEachLine, callbackSuccess, callbackError) {
        let result = [];
        this.db.each(
            sql,
            param,
            (err, row) => {
                if (err == null) {
                    callbackEachLine(row, result);
                    return;
                }

                if (callbackError) {
                    callbackError(err);
                }
            },
            (err) => {
                if (err == null && callbackSuccess) {
                    callbackSuccess(result);
                    return;
                }

                if (callbackError) {
                    callbackError(err);
                }
            }
        );
    }
};