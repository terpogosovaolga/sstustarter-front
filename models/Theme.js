import mysql from "mysql2/promise";
import { pool } from "../database.js";

export class Theme {
  constructor(name, description, path, parent_id) {
    this.name = name;
    this.description = description;
    this.path = path;
    this.parent_id = parent_id;
  }

  static fullconstructor = (
    id,
    name,
    description,
    path,
    parent_id,
    created_date
  ) => {
    let p = new Theme(name, description, path, parent_id);
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  fillDependencies = async () => {
    let next_step = null;
    let parents = null;
    if (this.parent_id) {
      next_step = await Theme.getTheme(this.parent_id);
      parents = await Theme.getSetOfThemes(this.parent_id);
    }
    this.next_step = next_step;
    this.parents = parents;
  };

  static getAllThemes = async function () {
    let data = await pool.query(`SELECT * from themes`);
    let res = [];
    for (const d of data[0]) {
      let theme = Theme.fullconstructor(...Object.values(d));
      await theme.fillDependencies();
      res.push(theme);
    }
    return res;
  };

  static getMainThemes = async function () {
    let data = await pool.query(`SELECT * from themes WHERE parent_id IS NULL`);
    let res = [];
    for (const d of data[0]) {
      res.push(Theme.fullconstructor(...Object.values(d)));
    }
    return res;
  };

  static getTheme = async (id) => {
    let data = await pool.query(`SELECT * from themes WHERE id = ${id}`);
    return Theme.fullconstructor(...Object.values(data[0][0]));
  };

  static getSetOfThemes = async (id) => {
    let first = await Theme.getTheme(id);
    let result = [];
    result.push(first);

    while (true) {
      if (!result[result.length - 1].parent_id) {
        break;
      }
      result.push(await Theme.getTheme(result[result.length - 1].parent_id));
    }

    return result;
  };
}
