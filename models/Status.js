import mysql from "mysql2/promise";
import { pool } from "../database.js";

export class Status {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  static fullconstructor = (id, name, description, created_date) => {
    let p = new Status(name, description);
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  static getAllStatuses = async function () {
    let data = await pool.query(`SELECT * from statuses`);
    let res = data[0].map((d) => Status.fullconstructor(...Object.values(d)));
    return res;
  };

  static getStatus = async (id) => {
    let data = await pool.query(`SELECT * from statuses WHERE id = ${id}`);
    return Status.fullconstructor(...Object.values(data[0][0]));
  };
}
