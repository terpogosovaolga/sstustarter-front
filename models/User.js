import mysql from "mysql2/promise";
import { pool } from "../database.js";
import { Role } from "./Role.js";
import { Structure } from "./Structure.js";
import { getAllUsers } from "../controllers/UserController.js";

export class User {
  constructor(
    role_id,
    surname,
    name,
    patronymic,
    birthday,
    avatar_path,
    job,
    structure_id,
    login,
    password
  ) {
    this.role_id = role_id;
    this.surname = surname;
    this.name = name;
    this.patronymic = patronymic;
    this.birthday = birthday;
    this.avatar_path = avatar_path;
    this.job = job;
    this.structure_id = structure_id;
    this.login = login;
    this.password = password;
  }

  static fullconstructor = (
    id,
    role_id,
    surname,
    name,
    patronymic,
    birthday,
    avatar_path,
    job,
    structure_id,
    login,
    password,
    created_date
  ) => {
    let u = new User(
      role_id,
      surname,
      name,
      patronymic,
      birthday,
      avatar_path,
      job,
      structure_id,
      login,
      password
    );
    u.id = id;
    u.created_date = created_date;
    return u;
  };

  fillDependencies = async function () {
    if (this.role_id) {
      this.role = await Role.getRole(this.role_id);
    }
    if (this.structure_id) {
      this.structure = await Structure.getSetOfStructure(this.structure_id);
    }
    return this;
  };

  static getAllUsers = async function () {
    let data = await pool.query("SELECT * from users ORDER BY role_id DESC");
    let res = [];
    for (const d of data[0]) {
      let user = User.fullconstructor(...Object.values(d));
      await user.fillDependencies();
      res.push(user);
    }
    return res;
  };

  static getUser = async function (id) {
    let data = await pool.query("SELECT * FROM users WHERE id = " + id);
    if (data[0].length == 0) {
      return false;
    }
    let user = User.fullconstructor(...Object.values(data[0][0]));
    return user.fillDependencies();
  };

  static getFullNameById = async function (id) {
    let data = await pool.query(
      "SELECT CONCAT(surname, ' ', SUBSTRING(name, 1, 1), '. ', SUBSTRING(patronymic, 1, 1), '.') as 'fullname' FROM `users` WHERE id=" +
        id
    );
    return data[0][0]["fullname"];
  };

  static isLogin = async function (login) {
    let data = await pool.query(
      `SELECT * from users WHERE login = '${login}' LIMIT 1 `
    );
    if (data[0].length > 0) {
      return [data[0][0]["id"], data[0][0]["password"], data[0][0]["role_id"]];
    } else {
      return false;
    }
  };

  register = async function () {
    let q = `INSERT INTO  users ( role_id ,  surname ,  name ,  patronymic ,  birthday ,  avatar_path ,  job ,  structure_id ,  login ,  password ) VALUES (${
      this.role_id
    },'${this.surname}','${this.name}',${
      this.patronymic ? "'" + this.patronymic + "'" : "NULL"
    },${this.birthday ? "'" + this.birthday + "'" : "NULL"},${
      this.avatar_path ? "'" + this.avatar_path + "'" : "NULL"
    },'${this.job}',${this.structure_id},'${this.login}','${this.password}')`;
    let data = await pool.query(q);
    let id = await User.getLastUserId();
    return id;
  };

  static getLastUserId = async function () {
    let data = await pool.query(
      "SELECT id FROM users ORDER BY id DESC LIMIT 1"
    );
    return data[0][0]["id"];
  };

  getCountOfCreatedProjects = async function () {
    let data = await pool.query(
      "SELECT COUNT(id) as 'count' FROM `projects` WHERE author_id=" + this.id
    );
    return data[0][0]["count"];
  };

  getCountOfPartProjects = async function () {
    let data = await pool.query(
      "SELECT COUNT(project_id) as 'count' FROM `members` WHERE user_id=" +
        this.id
    );
    return data[0][0]["count"];
  };

  getPopularTheme = async function () {
    let data = await pool.query(
      "SELECT count(project_id) as 'count_p', count(t.id) as 'count_t', max(t.id) as 'theme_id' FROM `members` as m JOIN `projects` as p ON m.project_id = p.id JOIN themes as t ON p.theme_id = t.id WHERE user_id=" +
        this.id +
        " GROUP BY t.id"
    );
    if (data[0].length > 0) {
      let ids = data[0].map((d) => d.theme_id);
      return Math.max(...Object.values(ids));
    } else {
      return false;
    }
  };

  static editAvatarOfUser = async function (id, url) {
    let data = await pool.query(
      "UPDATE `users` SET `avatar_path`='" + url + "' WHERE id = " + id
    );
    return true;
  };

  static editRoleOfUser = async function (id, role_id) {
    let data = await pool.query(
      "UPDATE `users` SET `role_id`='" + role_id + "' WHERE id = " + id
    );
    return true;
  };

  static filter = async function (search, role, structure) {
    if (!(search || role || structure)) {
      return await User.getAllUsers();
    }
    let where = "WHERE ";
    let were = false;
    if (role.length == 1) {
      where += "role_id = " + role[0];
      were = true;
    } else if (role.length > 1) {
      where += "(role_id = " + role[0] + " OR role_id = " + role[1] + ") ";
      were = true;
    }
    if (search) {
      where += were ? " AND " : "";
      where +=
        " CONCAT(surname, ' ', name, ' ', patronymic, ' ', job) LIKE '%" +
        search +
        "%' ";
    }

    if (structure) {
      where += were ? " AND " : "";
      where += " structure_id = " + structure;
    }

    const sql = "SELECT * FROM `users`" + where + " ORDER BY role_id DESC";
    let data = await pool.query(sql);
    let res = [];
    for (const d of data[0]) {
      let user = User.fullconstructor(...Object.values(d));
      await user.fillDependencies();
      res.push(user);
    }
    return res;
  };
}
