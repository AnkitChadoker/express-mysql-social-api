const FollowerDto = require("../dtos/followers-dto");
const UserDto = require("../dtos/user-dto");
const BlockDto = require("../dtos/block-dto");

const Follower = require("../models/follower-model");
const BlockList = require("../models/blocklist-model");
const User = require("../models/user-model");

const  userFactory = async (userdata, req) => {

    if(typeof(req) !== 'undefined'){
        const { user: loggedInUser } = req.body;
        
        // for following flag
        try {            
            const result = await Follower.selectDoubleClouse({ user_id: userdata.id }, { follower_id: loggedInUser.id });
            if(result.length) userdata.following = true;
        } catch (error) {
            userdata.following = false;
        }

        // for block flag
        try {            
            const result = await BlockList.selectDoubleClouse({ to_user: userdata.id }, { from_user: loggedInUser.id });
            if(result.length) userdata.block = true;
        } catch (error) {
            userdata.block = false;
        }
    }

    // for followers
    try {
        const response = await User.followers(userdata.id);
        const followers = [];
        for (let index = 0; index < response.length; index++) {
            followers.push(new FollowerDto(response[index]));
        }
        userdata.followers = followers;
    } catch (error) {
        userdata.followers = [];
    }

    // for followings
    try {
        const response = await User.followings(userdata.id);
        const followings = [];
        for (let index = 0; index < response.length; index++) {
            followings.push(new FollowerDto(response[index]));
        }
        userdata.followings = followings;
    } catch (error) {
        userdata.followings = [];
    }

    // for blocklist
    try {
        const response = await User.blocklist(userdata.id);
        const blocklist = [];
        for (let index = 0; index < response.length; index++) {
            blocklist.push(new BlockDto(response[index]));
        }
        userdata.blocklist = blocklist;
    } catch (error) {
        userdata.blocklist = [];
    }

    return new UserDto(userdata);
}

module.exports = userFactory;