class FollowerDto{
    id;
    user_id;
    first_name;
    last_name;
    email;
    username;
    is_email_verified;
    created_at;
    updated_at;

    constructor(follower){
        this.id = follower.id;
        this.user_id = follower.follower_id;
        this.first_name = follower.first_name;
        this.last_name = follower.last_name;
        this.email = follower.email;
        this.username = follower.username;
        this.is_email_verified = follower.is_email_verified;
        this.created_at = follower.created_at;
        this.updated_at = follower.updated_at;
    }

}

module.exports = FollowerDto;