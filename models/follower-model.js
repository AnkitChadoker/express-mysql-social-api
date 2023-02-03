const connection = require('../connection');

class Follower {
    insert(data){
        return new Promise( (resolve, reject) => {
            const sql = "insert into followers set ?";
            connection.query(sql, [data], (err, result) => {
                if(err) return reject(err);
                return resolve(result)
            })
        })
    }

    select(where){
        return new Promise( (resolve, reject) => {
            const sql = "select * from followers where ?";
            connection.query(sql, [where], (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            })
        })
    }

    selectDoubleClouse(where1, where2){
        return new Promise( (resolve, reject) => {
            const sql = "select * from followers where ? and ?";
            connection.query(sql, [where1, where2], (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            })
        })
    }

    updateDoubleClouse(data, where1, where2){
        return new Promise( (resolve, reject) => {
            const sql = "update followers set ? where ? and ?";
            connection.query(sql, [data, where1, where2], (err, result) => {
                if(err) return reject(err)
                return resolve(result);
            })
        })
    }

    deleteDoubleClouse(where1, where2){
        return new Promise( (resolve, reject) => {
            const sql = "delete * from followers where ? and ?";
            connection.query(sql, [where1, where2], (err, result) => {
                if(err) return reject(err)
                return resolve(result);
            })
        })
    }
}

module.exports = new Follower();