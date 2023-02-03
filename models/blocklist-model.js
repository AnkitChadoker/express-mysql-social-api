const connection = require("../connection");

class BlockList{
    insert(data){
        return new Promise( (resolve, reject) => {
            const sql = "insert into blocklist set ?";
            connection.query(sql, [data], (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            })
        })
    }

    selectDoubleClouse(where1, where2){
        return new Promise( (resolve, reject) => {
            const sql = "select * from blocklist where ? and ?";
            connection.query(sql, [where1, where2], (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            })
        })
    }

    updateDoubleClouse(data, where1, where2){
        return new Promise( (resolve, reject) => {
                const sql = "update blocklist set ? where ? and ?";
                connection.query(sql, [data, where1, where2], (err, result) => {
                    if(err) return reject(err);
                    return resolve(result);
                })
        })
    }

    deleteDoubleClouse(where1, where2){
        return new Promise( (resolve, reject) => {
                const sql = "delete from blocklist where ? and ?";
                connection.query(sql, [where1, where2], (err, result) => {
                    if(err) return reject(err);
                    return resolve(result);
                })
        })
    }
}

module.exports = new BlockList();