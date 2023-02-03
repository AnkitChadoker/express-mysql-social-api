const connection = require('../connection');

class RefreshToken {

    insert(data){
        return new Promise((resolve, reject)=>{
            connection.query('insert into refresh_tokens set ?', [data],  (error, result)=>{
                if(error){
                    return reject(error);
                }
                return resolve(result);
            });
        });
    }

    select(where){
        return new Promise( (resolve, reject) => {
            connection.query('select * from refresh_tokens where ?', [where], (err, result) => {
                if(err) return reject(err)
                return resolve(result)
            })
        })
    }

    update(data, where){
        return new Promise( (resolve, reject) => {
            connection.query('update refresh_tokens set ? where ?', [data, where], (err, result) => {
                if(err) return reject(err)
                return resolve(result)
            })
        })
    }

    delete(where){
        return new Promise( (resolve, reject) => {
            connection.query('delete from refresh_tokens where ?', [where], (err, result) => {
                if(err) return reject(err)
                return resolve(result)
            })
        })
    }

}

module.exports = new RefreshToken();