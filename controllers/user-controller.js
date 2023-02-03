const Follower = require("../models/follower-model");
const User = require("../models/user-model");
const BlockList = require("../models/blocklist-model");

const userFactory = require('../factory/user-factory');

class UserController {
    async index(req, res){
        try {
            const { id } = req.params;
            if(!id) return res.status(400).json({ message: "id field is required."});

            const user = await User.select({ id });
            if(!user.length) return res.status(404).json({ message: "No user found." });

            const userData = await userFactory(user[0], req);
            return res.status(200).json({ data: userData });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async follow(req, res){
        try {
            const { userId, user: loggedInUser } = req.body;
            if(!userId) return res.status(400).json({ message: "userId field is required." });

            const user = await User.select({ id: userId });            
            if(!user.length) return res.status(404).json({ message: "No user found." });

            // check if already follow
            const check = await Follower.selectDoubleClouse({ user_id: userId }, { follower_id: loggedInUser.id });
            if(check.length) return res.status(400).json({ message: "already following the user." });

            const follwerData = {
                user_id: userId,
                follower_id: loggedInUser.id,
                created_at: new Date(),
                updated_at: new Date(),
            }

            await Follower.insert(follwerData);

            return res.status(200).json({ message: "user followed successfully." })
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async unfollow(req, res){
        try {
            const { userId, user: loggedInUser} = req.body;
             if(!userId) return res.status(400).json({ message: "userId field is required." });

             const user  = await User.select({ id: userId });
             if(!user.length) return res.status(404).json({ message: "User not found." })

             // check if user follows the given user
             const check = await Follower.selectDoubleClouse({ user_id: userId }, { follower_id: loggedInUser.id });

             if(!check.length) return res.status(400).json({ message: "you do not follow the user." });

             await Follower.deleteDoubleClouse({ user_id: userId}, {follower_id: loggedInUser.id });

             return res.status(200).json({ message: "user unfollowed successfully." });
        } catch (error) {
            return res.status(500).json(error);
        }
    }    

    async block(req, res){
        try {
            const { userId, user: loggedInUser } = req.body;
            if(!userId) return res.status(400).json({ message: "userId field is required."});

            const user = await User.select({ id: userId });
            if(!user.length) return res.status(404).json({ message: "User not found." });

            // check if user is already blocked
            const check = await BlockList.selectDoubleClouse({ from_user: loggedInUser.id}, { to_user: userId});
            if(check.length) return res.status(400).json({ message: "user is already blocked" });

            const blockData = {
                to_user: userId,
                from_user: loggedInUser.id,
                created_at: new Date(),
                updated_at: new Date(),
            }

            await BlockList.insert(blockData);
            return res.status(200).json({ message: "user blocked successfully." });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async unblock(req, res){
        try {
            const { userId, user: loggedInUser } = req.body;
            if(!userId) return res.status(400).json({ message: "userId field is required."});

            const user = await User.select({ id: userId });
            if(!user.length) return res.status(404).json({ message: "User not found." });

            // check if user is already unblocked
            const check = await BlockList.selectDoubleClouse({ from_user: loggedInUser.id}, { to_user: userId});
            if(!check.length) return res.status(400).json({ message: "user is not in the blocklist" });

            await BlockList.deleteDoubleClouse({ to_user: userId }, { from_user: loggedInUser.id });
            return res.status(200).json({ message: "user unblocked successfully." });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    
}

module.exports = new UserController();