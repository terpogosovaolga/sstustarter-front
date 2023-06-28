import mysql from "mysql2/promise";
import { pool } from "../database.js";

export class Step {
  constructor(name, description, for_filters, next_id) {
    this.name = name;
    this.description = description;
    this.for_filters = for_filters;
    this.next_id = next_id;
  }

  static fullconstructor = (
    id,
    name,
    description,
    for_filters,
    next_id,
    created_date
  ) => {
    let p = new Step(name, description, for_filters, next_id);
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  fillDependencies = async () => {
    let next_step = null;
    if (this.next_id) {
      next_step = await Step.getStep(this.next_id);
    }
    this.next_step = next_step;
  };

  static getAllSteps = async function () {
    let data = await pool.query(`SELECT * from steps where for_filters = 1`);
    let res = [];
    for (const d of data[0]) {
      let step = Step.fullconstructor(...Object.values(d));
      res.push(step);
    }
    return res;
  };

  static getStep = async (id) => {
    let data = await pool.query(`SELECT * from steps WHERE id = ${id}`);
    return await Step.fullconstructor(
      ...Object.values(data[0][0])
    ).fillDependencies();
  };
}
