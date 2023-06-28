
import {Post} from '../models/Post.js';
import {User} from '../models/User.js';


export const create = async (req, res) => {
    try {
        
        let title = req.body.title;
        let text = req.body.text;
        let tags = req.body.tags.join(" "); // из массива в стркоу
        let imageUrl = req.body.imageUrl ? req.body.imageUrl : null;
        let user = req.userId;
        const newPost = new Post(title, text, tags, imageUrl, user);
        await Post.create(newPost);
        
        res.json({
            succes: true,
            post: newPost
        })
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: "не удалось создать статью"})
    }
}

export const getAll = async (req, res) => {
    try {
        let posts = await Post.getAllPosts();
        console.log(posts);
        let posts_arr = [];
        for (const post of posts) {
            let new_post = new Post(post.title, post.text, post.tags, post.imageUrl, post.user_id);
            new_post.id = post.id;
            new_post.views = post.id;
            let user = await User.getUserById(post.user_id);
            user.password = undefined;
            new_post.user = user;
            posts_arr.push(new_post);
        }
        console.log(posts_arr);
        if (posts) {
            return res.json(posts_arr)
        } else {
            return res.json({message: "Ни одной статьи не найдено"});
        }
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({message: "Не удалось получить статьи"})
    }
}

export const getPostById = async (req, res) => {
    try {
        // console.log(req.);
        let data = await Post.getPostById(req.params.id);
        let post = new Post(data[0].title, data[0].text, data[0].tags, data[0].imageUrl, data[0].user_id);
        post.user = await User.getUserById(post.userId);
        post.id = data[0].id;
        post.views = data[0].views;

        post.see();
        return res.json(post);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении статьи"});
    }
}

export const remove = async (req, res) => {
    try {
        Post.remove(req.params.id);
        res.json({success: true});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при удалении статьи"});
    }
}

export const update = async (req, res) => {
    try {
        
        let title = req.body.title;
        let text = req.body.text;
        let tags = req.body.tags.join(" "); // из массива в стркоу
        let imageUrl = req.body.imageUrl ? req.body.imageUrl : null;
        let user = req.userId;
        const updatingPost = new Post(title, text, tags, imageUrl, user);
        let data = await Post.update(req.params.id, updatingPost);
        let post = new Post(data[0].title, data[0].text, data[0].tags, data[0].imageUrl, data[0].user_id);
        post.user = await User.getUserById(post.userId);
        post.id = data[0].id;
        post.views = data[0].views;
        res.json({
            succes: true,
            post: post
        })

    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при обновлении статьи"});
    }
}