class UserDto{
    id;
    first_name;
    last_name;
    email;
    username;
    is_email_verified;
    created_at;
    updated_at;
    followers;
    followings;
    blocklist;
    following;
    block;

    constructor(user){
        this.id = user.id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.username = user.username;
        this.is_email_verified = user.is_email_verified;
        this.created_at = user.created_at;
        this.updated_at = user.updated_at;        
        this.followers = user.followers ? user.followers : [];
        this.followings = user.followings ? user.followings : [];
        this.blocklist = user.blocklist ? user.blocklist : [];
        this.following = user.following ? user.following : false;
        this.block = user.block ? user.block : false;
    }

}

module.exports = UserDto;