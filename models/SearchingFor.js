import mysql from "mysql2/promise";
import { pool } from "../database.js";

export class SearchingFor {
  constructor(project_id, text) {
    this.project_id = project_id;
    this.text = text;
  }

  static fullconstructor = (id, project_id, text, created_date) => {
    let p = new SearchingFor(project_id, text);
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  static getAllSearchingFor = async function () {
    let data = await pool.query(`SELECT * from searching_for`);
    let res = data[0].map((d) => SearchingFor.fullconstructor(...d));
    // fillDependencies
    return res;
  };

  static getSearchingFor = async (id) => {
    let data = await pool.query(`SELECT * from searching_for WHERE id = ${id}`);
    return SearchingFor.fullconstructor(...data[0]);
  };

  static getAllSearchingForOfProject = async (project_id) => {
    let data = await pool.query(
      `SELECT * from searching_for WHERE project_id = ${project_id}`
    );
    let res = [];
    for (const d of data[0]) {
      res.push(SearchingFor.fullconstructor(...Object.values(d)));
    }
    return res;
  };

  addSearchingFor = async function () {
    console.log("adding");
    let data = pool.query(
      `INSERT INTO  searching_for ( project_id ,  text ) VALUES (${this.project_id}, '${this.text}')`
    );
    let id = await SearchingFor.getIdOfLastSearchingFor();
    this.id = id;
    return id;
  };

  static getIdOfLastSearchingFor = async () => {
    let data = await pool.query(
      `select id from searching_for order by id desc LIMIT 1`
    );
    return data[0][0]["id"];
  };
}
