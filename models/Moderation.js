import mysql from "mysql2/promise";
import { pool } from "../database.js";
import { Project } from "./Project.js";
// import { User } from "./User.js";
import { Status } from "./Status.js";
import { User } from "./User.js";

export class Moderation {
  constructor(project_id, moderator_id, status_id, message) {
    this.project_id = project_id;
    this.moderator_id = moderator_id;
    this.status_id = status_id;
    this.message = message;
  }

  static fullconstructor = (
    id,
    project_id,
    moderator_id,
    status_id,
    message,
    created_date
  ) => {
    let p = new Moderation(project_id, moderator_id, status_id, message);
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  fillDependencies = async function () {
    this.project = await Project.getProject(this.project_id);
    this.status = await Status.getStatus(this.status_id);
    this.moderator = await User.getUser(this.moderator_id);
    return this;
  };

  createModeration = async function () {
    await pool.query(
      "INSERT INTO `moderations`(`project_id`, `moderator_id`, `status_id`, `message`) VALUES (" +
        this.project_id +
        "," +
        this.moderator_id +
        "," +
        this.status_id +
        ",'" +
        this.message +
        "')"
    );

    await pool.query(
      "UPDATE `projects` SET `status_id`=" +
        this.status_id +
        " WHERE id=" +
        this.project_id
    );
    return true;
  };

  static getModerationsOfProject = async (id) => {
    let data = await pool.query(
      `SELECT * from moderations WHERE project_id = ${id}`
    );
    let res = [];
    for (const d of data[0]) {
      let newd = Moderation.fullconstructor(...Object.values(d));
      await newd.fillDependencies();
      res.push(newd);
    }
    return res;
  };

  static getModerationsOfModerator = async (id) => {
    let data = await pool.query(
      `SELECT * from moderations WHERE moderator_id = ${id} ORDER BY created_date DESC`
    );
    let res = [];
    for (const d of data[0]) {
      let newd = Moderation.fullconstructor(...Object.values(d));
      await newd.fillDependencies();
      res.push(newd);
    }
    return res;
  };

  static filter = async (moderator_id, status_id, sort) => {
    let where = " WHERE moderator_id = " + moderator_id;

    if (status_id != 0) {
      where += " AND m.status_id = " + status_id;
    }

    let [field, dir] = sort.split("-");

    const sql =
      "SELECT m.id, m.project_id, m.moderator_id, m.status_id, message, m.created_date FROM `moderations` as m JOIN `projects` as p ON m.project_id = p.id " +
      where +
      " ORDER by " +
      field +
      " " +
      dir;
    const data = await pool.query(sql);
    let res = [];
    for (const d of data[0]) {
      let newd = Moderation.fullconstructor(...Object.values(d));
      await newd.fillDependencies();

      res.push(newd);
    }
    return res;
  };

  static getLastModerationOfProject = async (project_id) => {
    let data = await pool.query(
      "select * from moderations where project_id = " +
        project_id +
        " order by created_date DESC LIMIT 1"
    );
    let res = [];
    for (const d of data[0]) {
      let newd = Moderation.fullconstructor(...Object.values(d));
      await newd.fillDependencies();
      res.push(newd);
    }
    return res[0];
  };
}
