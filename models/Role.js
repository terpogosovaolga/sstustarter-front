import mysql from "mysql2/promise";
import { pool } from "../database.js";

export class Role {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  static fullconstructor = (id, name, description, created_date) => {
    let p = new Role(name, description);
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  static getAllRoles = async function () {
    let data = await pool.query(`SELECT * from roles`);
    let res = data[0].map((d) => Role.fullconstructor(...Object.values(d)));
    return res;
  };

  static getRole = async (id) => {
    let data = await pool.query(`SELECT * from roles WHERE id = ${id}`);
    let role = data[0][0];
    let role2 = Role.fullconstructor(...Object.values(role));
    return role2;
  };
}
