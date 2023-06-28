import mysql from "mysql2/promise";
import { pool } from "../database.js";
import { Photo } from "./Photo.js";

export class NetsIcon {
  constructor(net, link, path, archive) {
    this.net = net;
    this.link = link;
    this.path = path;
    this.archive = archive;
  }

  static fullconstructor = (id, net, link, path, archive, created_date) => {
    let p = new NetsIcon(net, link, path, archive);
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  static getAllNetsIcons = async function () {
    let data = await pool.query(`SELECT * from nets_icons`);
    let res = [];
    for (const d of data[0]) {
      let icon = NetsIcon.fullconstructor(...Object.values(d));
      res.push(icon);
    }
    return res;
  };

  static getAllNetsIconsNotArchive = async function () {
    let data = await pool.query(`SELECT * from nets_icons WHERE archive = 0`);
    let res = [];
    for (const d of data[0]) {
      let icon = NetsIcon.fullconstructor(...Object.values(d));
      res.push(icon);
    }
    return res;
  };

  static getNetsIcon = async (id) => {
    let data = await pool.query(`SELECT * from nets_icons WHERE id = ${id}`);
    return NetsIcon.fullconstructor(...data[0]);
  };

  static getAllNetsIcons = async () => {
    let data = await pool.query(
      "SELECT * from nets_icons ORDER BY archive ASC"
    );
    let res = [];
    for (const d of data[0]) {
      let icon = NetsIcon.fullconstructor(...Object.values(d));
      res.push(icon);
    }
    return res;
  };

  static setArchive = async (id, a) => {
    await pool.query(
      "update nets_icons set archive = " + a + " where id = " + id
    );
    return true;
  };
}
