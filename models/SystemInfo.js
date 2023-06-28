import mysql from "mysql2/promise";
import { pool } from "../database.js";

export class SystemInfo {
  constructor(name, slogan, header_description, header_image, isActive) {
    this.name = name;
    this.slogan = slogan;
    this.header_description = header_description;
    this.header_image = header_image;
    this.isActive = isActive;
  }

  static fullconstructor = (
    id,
    name,
    slogan,
    header_description,
    header_image,
    isActive,
    created_date
  ) => {
    let info = new SystemInfo(
      name,
      slogan,
      header_description,
      header_image,
      isActive
    );
    info.id = id;
    info.created_date = created_date;
    return info;
  };

  static getAllSystemInfo = async function () {
    let data = await pool.query(
      `SELECT * from system_info ORDER BY isActive DESC`
    );
    let res = [];
    for (const d of data[0]) {
      let info = SystemInfo.fullconstructor(...Object.values(d));
      res.push(info);
    }
    return res;
  };

  static getSystemInfo = async (id) => {
    let data = await pool.query(`SELECT * from system_info WHERE id = ${id}`);
    return SystemInfo.fullconstructor(...Object.values(data[0][0]));
  };

  static getActiveSystemInfo = async () => {
    let data = await pool.query(
      `SELECT * from system_info WHERE isActive = 1 LIMIT 1`
    );
    return SystemInfo.fullconstructor(...Object.values(data[0][0]));
  };

  static editSystemInfo = async (info) => {
    await pool.query(
      "UPDATE `system_info` SET `name`='" +
        info.name +
        "',`slogan`='" +
        info.slogan +
        "',`header_description`='" +
        info.header_description +
        "' WHERE id=" +
        info.id
    );
    return true;
  };

  static setActive = async (id) => {
    await pool.query(
      "UPDATE `system_info` SET `isActive` = 1 WHERE `id` = " + id
    );
    await pool.query(
      "UPDATE `system_info` SET `isActive` = 0 WHERE `id` != " + id
    );
    return true;
  };
}
