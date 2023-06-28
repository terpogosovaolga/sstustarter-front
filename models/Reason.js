import mysql from "mysql2/promise";
import { pool } from "../database.js";

export class Reason {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  static fullconstructor = (id, name, description, created_date) => {
    let p = new Reason(name, description);
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  static getAllReasons = async function () {
    let data = await pool.query(`SELECT * from reasons`);
    let res = data[0].map((d) => Reason.fullconstructor(...d));
    // fillDependencies
    return res;
  };

  static getReason = async (id) => {
    let data = await pool.query(`SELECT * from reasons WHERE id = ${id}`);
    return Reason.fullconstructor(...data[0]);
  };
}
