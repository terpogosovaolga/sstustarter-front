import mysql from "mysql2/promise";
import { pool } from "../database.js";
import { ApplicationStatus } from "./ApplicationStatus.js";
import { User } from "./User.js";
import { Project } from "./Project.js";

export class Application {
  constructor(
    project_id,
    user_id,
    appstatus_id,
    message,
    email,
    phone,
    user_seen
  ) {
    this.project_id = project_id;
    this.user_id = user_id;
    this.appstatus_id = appstatus_id;
    this.message = message;
    this.email = email;
    this.phone = phone;
    this.user_seen = user_seen;
  }

  static fullconstructor = (
    id,
    project_id,
    user_id,
    appstatus_id,
    message,
    email,
    phone,
    user_seen,
    created_date
  ) => {
    let p = new Application(
      project_id,
      user_id,
      appstatus_id,
      message,
      email,
      phone,
      user_seen
    );
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  fillDependencies = async function () {
    // appstatus
    if (this.appstatus_id) {
      this.appstatus = await ApplicationStatus.getApplicationStatus(
        this.appstatus_id
      );
    } else {
      this.appstatus = null;
    }
    // user
    if (this.user_id) {
      this.user = await User.getUser(this.user_id);
    }
    // project
    if (this.project_id) {
      this.project = await Project.getProject(this.project_id);
    }

    return this;
  };

  static getAllApplications = async function () {
    let data = await pool.query(`SELECT * from applications`);
    let res = [];
    for (const d of data[0]) {
      let newd = Application.fullconstructor(...Object.values(d));
      await newd.fillDependencies();
      res.push(newd);
    }
    return res;
  };

  static getApplicationsOfAuthor = async function (author_id) {
    let data = await pool.query(
      "SELECT a.id, a.project_id, a.user_id, a.appstatus_id, a.user_id, a.message, a.email, a.phone, a.user_seen, a.created_date FROM `applications` as a JOIN `projects` as p ON a.project_id = p.id WHERE p.author_id = " +
        author_id +
        " order by appstatus_id asc;"
    );
    let res = [];
    for (const d of data[0]) {
      let newd = Application.fullconstructor(...Object.values(d));
      await newd.fillDependencies();
      res.push(newd);
    }
    return res;
  };

  static getApplication = async (id) => {
    let data = await pool.query(`SELECT * from applications WHERE id = ${id}`);
    return Application.fullconstructor(...data[0]);
  };

  static addApplication = async (application) => {
    let data = await pool.query(
      `INSERT INTO applications VALUES(${application.project_id}, ${application.user_id}, ${application.appstatus_id}, '${application.message}', '${application.email}', '${application.phone}, '${application.user_seen}')`
    );

    return true;
  };

  static getAllApplicationsForProject = async (project_id) => {
    let data = await pool.query(
      `SELECT * FROM applications WHERE project_id = ${project_id}`
    );
    let res = data[0].map((d) =>
      Application.fullconstructor(...d).fillDependencies()
    );
    return res;
  };

  static getApplicantsProjects = async (id) => {
    let data = await pool.query(
      "SELECT a.id, a.project_id, a.user_id, a.appstatus_id, a.message, a.email, a.phone, a.user_seen, a.created_date FROM `applications` as a JOIN projects as p ON a.project_id = p.id WHERE a.user_id = " +
        id +
        " AND a.appstatus_id != 3 ORDER BY user_seen"
    );
    let res = [];
    for (const d of data[0]) {
      let newd = Application.fullconstructor(...Object.values(d));
      await newd.fillDependencies();
      res.push(newd);
    }
    return res;
  };

  static getApplicantsProjectsWithNewAnswersCount = async (id) => {
    let sql =
      "SELECT count(a.id) as count FROM `applications` as a JOIN projects as p ON a.project_id = p.id WHERE a.user_id = " +
      id +
      " AND a.user_seen = 0";
    let data = await pool.query(sql);
    return data[0][0]["count"];
  };

  static getApplicationsWithStatusOfProject = async (
    project_id,
    appstatus_id
  ) => {
    let data = await pool.query(
      `SELECT * FROM applications WHERE project_id = ${project_id} AND appstatus_id = ${appstatus_id}`
    );
    let res = data[0].map((d) =>
      Application.fullconstructor(...d).fillDependencies()
    );
    return res;
  };

  static changeStatusOfApplication = async (app_id, appstatus_id) => {
    let data = await pool.query(
      "UPDATE `applications` SET `appstatus_id`=" +
        appstatus_id +
        " WHERE id=" +
        app_id
    );

    return true;
  };

  static setUserSeenApplication = async (id) => {
    let data = await pool.query(
      "UPDATE `applications` SET `user_seen`=1  WHERE id=" + id
    );
    return true;
  };

  static getApplicationsOfAuthorWithStatus = async (
    author_id,
    appstatus_id
  ) => {
    let data = await pool.query(
      "SELECT count(a.id) as count  FROM `applications` as a JOIN `projects` as p ON a.project_id = p.id WHERE p.author_id = " +
        author_id +
        " and a.appstatus_id = " +
        appstatus_id
    );
    return data[0][0]["count"];
  };

  static createApplication = async (data) => {
    const sql =
      "INSERT INTO `applications`(`project_id`, `user_id`, `appstatus_id`, `message`, `email`, `phone`, `user_seen`) VALUES (" +
      data.projectId +
      "," +
      data.userId +
      ",1,'" +
      data.message +
      "','" +
      data.email +
      "','" +
      data.phone +
      "',1)";
    console.log(sql);
    await pool.query(sql);
    return true;
  };

  static createMember = async (project_id, user_id, app_id) => {
    await pool.query(
      "INSERT INTO `members`(`project_id`, `user_id`, `application_id`) VALUES (" +
        project_id +
        "," +
        user_id +
        "," +
        app_id +
        ")"
    );
    return true;
  };
}
