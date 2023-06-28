import mysql from "mysql2/promise";
import { pool } from "../database.js";

export class Structure {
  constructor(abbreviation, decoding, description, parent_id) {
    this.abbreviation = abbreviation;
    this.decoding = decoding;
    this.description = description;
    this.parent_id = parent_id;
  }

  static fullconstructor = (
    id,
    abbreviation,
    decoding,
    description,
    parent_id,
    created_date
  ) => {
    let p = new Structure(abbreviation, decoding, description, parent_id);
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  fillDependencies = async function () {
    let parent_structure = null;
    let parents = null;
    if (this.parent_id) {
      parent_structure = await Structure.getStructure(this.parent_id);
      parents = await Structure.getSetOfStructure(this.parent_id);
    }
    this.parent_structure = parent_structure;
    this.parents = parents;
  };

  static getAllStructures = async function () {
    let data = await pool.query(`SELECT * from structures`);
    let res = [];
    for (const d of data[0]) {
      let str = Structure.fullconstructor(...Object.values(d));
      await str.fillDependencies();
      res.push(str);
    }
    return res;
  };

  static getStructure = async (id) => {
    let data = await pool.query(`SELECT * from structures WHERE id = ${id}`);
    let str = Structure.fullconstructor(...Object.values(data[0][0]));
    return str;
  };

  // массив "последовательности" стуктур от ребенка до родителя: Сектор вирт.тех., ЦИТиДО, ИнПИТ и тд
  static getSetOfStructure = async (id) => {
    let first = await Structure.getStructure(id);
    let result = [];
    result.push(first);

    while (true) {
      if (!result[result.length - 1].parent_id) {
        break;
      }
      result.push(
        await Structure.getStructure(result[result.length - 1].parent_id)
      );
    }

    return result;
  };
}
