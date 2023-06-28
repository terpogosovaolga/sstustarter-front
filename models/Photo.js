import mysql from "mysql2/promise";
import { pool } from "../database.js";

export class Photo {
  constructor(project_id, path, is_main) {
    this.project_id = project_id;
    this.path = path;
    this.is_main = is_main;
  }

  static fullconstructor = (id, project_id, path, is_main, created_date) => {
    let p = new Photo(project_id, path, is_main);
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  static getAllPhotos = async function () {
    let data = await pool.query(`SELECT * from photos`);
    let res = data[0].map((d) => Photo.fullconstructor(...d));
    // fillDependencies
    return res;
  };

  static getPhoto = async (id) => {
    let data = await pool.query(`SELECT * from photos WHERE id = ${id}`);
    return Photo.fullconstructor(...Object.values(data[0][0]));
  };

  static getMainPhotoOfProject = async (project_id) => {
    let data = await pool.query(
      `SELECT * from photos WHERE project_id = ${project_id} AND is_main = 1`
    );
    // CHECK
    if (data[0].length != 0) {
      return Photo.fullconstructor(...Object.values(data[0][0]));
    } else return { id: 0, project_id: 0, path: "" };
  };

  static getAllPhotosOfProject = async (project_id) => {
    let data = await pool.query(
      `SELECT * from photos WHERE project_id = ${project_id}`
    );
    let res = [];
    for (const d of data[0]) {
      res.push(Photo.fullconstructor(...Object.values(d)));
    }
    return res;
  };

  addPhoto = async function () {
    let data = pool.query(
      `INSERT INTO  photos ( project_id ,  path ,  is_main ) VALUES (${this.project_id}, '${this.path}', ${this.is_main})`
    );

    let id = await Photo.getIdOfLastPhoto();
    this.id = id;
    return id;
  };

  static getIdOfLastPhoto = async function () {
    let data = await pool.query(
      `select id from photos order by id desc LIMIT 1`
    );
    return data[0][0]["id"];
  };
}
