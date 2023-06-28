import mysql from "mysql2/promise";
import { pool } from "../database.js";

export class ApplicationStatus {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  static fullconstructor = (id, name, description, created_date) => {
    let p = new ApplicationStatus(name, description);
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  static getAllApplicationStatuses = async () => {
    let data = await pool.query(`SELECT * from application_statuses`);
    let res = data[0].map((d) =>
      ApplicationStatus.fullconstructor(...Object.values(d))
    );
    return res;
  };

  static getApplicationStatus = async (id) => {
    let data = await pool.query(
      `SELECT * from application_statuses WHERE id = ${id} LIMIT 1`
    );

    // console.log("aappstatus");
    // console.log(data[0]);
    return ApplicationStatus.fullconstructor(...Object.values(data[0][0]));
  };
}
