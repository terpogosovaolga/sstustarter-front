import mysql from "mysql2/promise";
import { pool } from "../database.js";

export class Post {
  constructor(title, text, tags, imageUrl, userId) {
    this.title = title;
    this.text = text;
    this.tags = tags;
    this.imageUrl = imageUrl;
    this.userId = userId;
  }

  static getPosts = async function () {
    let data = await pool.query(`SELECT * from posts`);
    return data[0];
  };

  static create = async function (post) {
    if (!post.imageUrl) {
      post.imageUrl = "";
    }
    let q =
      "INSERT INTO posts (title, text, tags, imageUrl, user_id) VALUES('" +
      post.title +
      "','" +
      post.text +
      "','" +
      post.tags +
      "','" +
      post.imageUrl +
      "'," +
      post.userId +
      ")";
    // return q;
    let data = await pool.query(q);

    return Post.getLastPostId();
  };

  static getPostById = async function (id) {
    let data = await pool.query("SELECT * FROM posts WHERE id = " + id);
    return data[0];
  };

  static getLastPostId = async function () {
    let data = await pool.query(
      "SELECT id FROM posts ORDER BY id DESC LIMIT 1"
    );

    return data[0][0]["id"];
  };

  static getAllPosts = async function () {
    let data = await pool.query("SELECT * FROM posts");

    return data[0];
  };

  see = async function () {
    let data = await pool.query(
      "UPDATE posts SET views = " + this.views + 1 + " WHERE id = " + this.id
    );
    this.views++;
    return data;
    // let data = await pool.query("");
  };

  static remove = async function (id) {
    let data = await pool.query("DELETE FROM posts WHERE id = " + id);
    return data;
  };

  static update = async function (id, post) {
    if (!post.imageUrl) {
      post.imageUrl = "";
    }
    let res = await pool.query(
      "UPDATE `posts` SET `title`='" +
        post.title +
        "',`text`='" +
        post.text +
        "',`tags`='" +
        post.tags +
        "',`imageUrl`='" +
        post.imageUrl +
        "' WHERE id = " +
        id
    );
    let res2 = await Post.getPostById(id);
    return res2;
  };
}
