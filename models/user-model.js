const connection = require('../connection');

class User {

    insert(data){
        return new Promise((resolve, reject)=>{
            connection.query('insert into users set ?', [data],  (error, result)=>{
                if(error){
                    return reject(error);
                }
                return resolve(result);
            });
        });
    }

    select(where){
        return new Promise( (resolve, reject) => {
            connection.query('select * from users where ?', [where], (err, result) => {
                if(err) return reject(err)
                return resolve(result)
            })
        })
    }

    update(data, where){
        return new Promise( (resolve, reject) => {
            connection.query('update users set ? where ?', [data, where], (err, result) => {
                if(err) return reject(err)
                return resolve(result)
            })
        })
    }

    delete(where){
        return new Promise( (resolve, reject) => {
            connection.query('delete from users where ?', [where], (err, result) => {
                if(err) return reject(err)
                return resolve(result)
            })
        })
    }

    followers(userId){
        return new Promise( (resolve, reject) => {
            const sql = "select * from followers left join users on users.id = followers.follower_id where followers.user_id = ? order by followers.id desc";
            connection.query(sql, [userId], (err, result) => {
                if(err) return reject(err)
                return resolve(result) 
            })
        })
    }

    followings(userId){
        return new Promise( (resolve, reject) => {
            const sql = "select * from followers left join users on users.id = followers.user_id where followers.follower_id = ? order by followers.id desc";
            connection.query(sql, [userId], (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            })
        })
    }

    blocklist(userId){
        return new Promise( (resolve, reject) => {
            const sql = "select * from blocklist left join users on users.id = blocklist.to_user where blocklist.from_user = ? order by blocklist.id desc";
            connection.query(sql, [userId], (err, result) => {
                if(err) return reject(err)
                return resolve(result)
            })
        })
    }

}

module.exports = new User();