import mysql from "mysql2/promise";
import { pool } from "../database.js";

export class View {
  constructor(project_id, user_id) {
    this.project_id = project_id;
    this.user_id = user_id;
  }

  static fullconstructor = (id, project_id, user_id, created_date) => {
    let p = new View(project_id, user_id);
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  static getAllViews = async function () {
    let data = await pool.query(`SELECT * from views`);
    let res = data[0].map((d) => View.fullconstructor(...d));

    return res;
  };

  static getView = async (id) => {
    let data = await pool.query(`SELECT * from views WHERE id = ${id}`);
    return View.fullconstructor(...data[0]);
  };

  static getCountOfViewsOfProject = async (project_id) => {
    let data = await pool.query(
      `SELECT COUNT(id) FROM views WHERE project_id = ${project_id}`
    );
    return data[0][0]; //check
  };

  addView = async function () {
    let data = await pool.query(
      `INSERT INTO views(project_id, user_id) VALUES(${this.project_id}, ${this.user_id})`
    );
    return true;
  };

  static getIdsOfMostViewProjects = async (count = 6) => {
    let data = await pool.query(
      "SELECT p.id, count(v.id) as count FROM `projects` as p LEFT JOIN views as v on p.id = v.project_id GROUP BY p.id ORDER BY count DESC LIMIT " +
        count
    );
    return data[0];
  };
}
