class BlockDto{
    id;
    user_id;
    first_name;
    last_name;
    email;
    username;
    is_email_verified;
    created_at;
    updated_at;

    constructor(user){
        this.id = user.id;
        this.user_id = user.to_user;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.username = user.username;
        this.is_email_verified = user.is_email_verified;
        this.created_at = user.created_at;
        this.updated_at = user.updated_at;
    }

}

module.exports = BlockDto;