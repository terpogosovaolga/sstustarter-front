import mysql from "mysql2/promise";
import { pool } from "../database.js";
import { User } from "./User.js";
import { Theme } from "./Theme.js";
import { Step } from "./Step.js";
import { Status } from "./Status.js";
import { SearchingFor } from "./SearchingFor.js";
import { Photo } from "./Photo.js";
import { Goal } from "./Goal.js";

export class Project {
  constructor(
    name,
    author_id,
    theme_id,
    idea_text,
    about_author_text,
    step_id,
    plandate_step_end,
    status_id,
    members_goal,
    user_seen,
    color1,
    color2,
    color3
  ) {
    this.name = name;
    this.author_id = author_id;
    this.theme_id = theme_id;
    this.idea_text = idea_text;
    this.about_author_text = about_author_text;
    this.step_id = step_id;
    this.plandate_step_end = plandate_step_end;
    this.status_id = status_id;
    this.members_goal = members_goal;
    this.user_seen = user_seen;
    this.color1 = color1;
    this.color2 = color2;
    this.color3 = color3;
  }

  static fullconstructor = (
    id,
    name,
    author_id,
    theme_id,
    idea_text,
    about_author_text,
    step_id,
    plandate_step_end,
    status_id,
    members_goal,
    user_seen,
    color1,
    color2,
    color3,
    created_date
  ) => {
    let p = new Project(
      name,
      author_id, //
      theme_id, //
      idea_text,
      about_author_text,
      step_id, //
      plandate_step_end,
      status_id, //
      members_goal,
      user_seen,
      color1,
      color2,
      color3
    );
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  fillDependencies = async function () {
    this.author = await User.getUser(this.author_id);
    this.theme = await Theme.getSetOfThemes(this.theme_id);
    this.step = await Step.getStep(this.step_id);
    this.status = await Status.getStatus(this.status_id);

    return this;
  };

  fillPhoto = async function () {
    this.main_photo = await Photo.getMainPhotoOfProject(this.id);
  };
  setModerationsCount = async function () {
    let data = await pool.query(
      "select count(id) as count from moderations where project_id = " + this.id
    );
    this.moderations_count = data[0][0]["count"];
    return data[0]["count"];
  };

  static getProject = async (id) => {
    let data = await pool.query(`SELECT * from projects WHERE id=${id}`);
    let p = Project.fullconstructor(...Object.values(data[0][0]));
    await p.fillDependencies();
    await p.fillPhoto();
    return p;
  };

  static getAllProjects = async () => {
    let data = await pool.query(`SELECT * from projects where status_id=3`);
    let res = [];
    for (const d of data[0]) {
      let newd = Project.fullconstructor(...Object.values(d));
      await newd.fillDependencies();
      await newd.fillPhoto();
      res.push(newd);
    }
    return res;
  };

  static getProjectsForModeration = async () => {
    let data = await pool.query(
      `SELECT * from projects where status_id=6 order by created_date desc`
    );
    let res = [];
    for (const d of data[0]) {
      let newd = Project.fullconstructor(...Object.values(d));
      await newd.fillDependencies();
      await newd.fillPhoto();
      await newd.setModerationsCount();
      res.push(newd);
    }
    return res;
  };

  static filterProjectsForModeration = async (srch, sort) => {
    let sql = `SELECT * from projects where status_id=6`;

    let order_by = "";
    if (sort) {
      order_by += " ORDER BY ";
      if (sort == "new") {
        order_by += "created_date DESC";
      } else if (sort == "old") {
        order_by += "created_date ASC";
      } else {
        order_by = "";
      }
    }

    if (srch) {
      sql =
        "SELECT p.id, p.name, p.author_id, p.theme_id, p.idea_text, p.about_author_text, p.step_id, p.plandate_step_end, p.status_id, p.members_goal, p.user_seen, p.color1, p.color2, p.color3,  p.created_date, CONCAT(u.name, u.surname) as 'authorname' FROM `projects` as p JOIN users as u on p.author_id = u.id WHERE p.name LIKE '%" +
        srch.trim() +
        "%' OR CONCAT(u.name, ' ', u.surname) LIKE '%" +
        srch.trim() +
        "%' ";
    }
    console.log(sql + order_by);
    let data = await pool.query(sql + order_by);
    let res = [];
    for (const d of data[0]) {
      let newd = Project.fullconstructor(...Object.values(d));
      await newd.fillDependencies();
      await newd.fillPhoto();
      await newd.setModerationsCount();
      res.push(newd);
    }
    console.log(res.map((r) => r.id));
    return res;
  };

  static getAuthorsProjects = async (id) => {
    let data = await pool.query(
      `SELECT * from projects WHERE author_id=` +
        id +
        ` ORDER BY user_seen ASC, status_id ASC`
    );
    let res = [];
    for (const d of data[0]) {
      let newd = Project.fullconstructor(...Object.values(d));
      await newd.fillDependencies();
      await newd.fillPhoto();
      res.push(newd);
    }
    return res;
  };

  static changeStatus = async (id, status) => {
    await pool.query(
      "UPDATE `projects` SET `status_id`=" + status + " WHERE id=" + id
    );
    return true;
  };

  static getMembersProjects = async (id) => {
    let data = await pool.query(
      "SELECT p.id, p.name, p.author_id, p.theme_id, p.idea_text, p.about_author_text, p.step_id, p.plandate_step_end, p.status_id, p.members_goal, p.user_seen, p.color1, p.color2, p.color3, p.created_date FROM projects as p JOIN `members` as m ON m.project_id = p.id JOIN applications as a on m.application_id = a.id JOIN application_statuses as aps on a.appstatus_id = aps.id WHERE m.user_id=" +
        id +
        " AND aps.id = 3;"
    );
    let res = [];
    for (const d of data[0]) {
      let newd = Project.fullconstructor(...Object.values(d));
      await newd.fillDependencies();
      await newd.fillPhoto();
      res.push(newd);
    }
    return res;
  };

  prepareProjectForShowing = async function () {
    this.photos = await Photo.getAllPhotosOfProject(this.id);
    this.searchingFor = await SearchingFor.getAllSearchingForOfProject(this.id);
    this.goals = await Goal.getListOfGoalsForProject(this.id);
  };

  static getIdOfLastProject = async function () {
    let data = await pool.query(
      `select id from projects order by id desc LIMIT 1`
    );
    return data[0][0]["id"];
  };

  addProject = async function () {
    // let date =

    let data = await pool.query(
      `INSERT INTO  projects ( name ,  author_id ,  theme_id ,  idea_text ,  about_author_text ,  step_id ,  plandate_step_end ,  status_id , members_goal, user_seen, color1 ,  color2 ,  color3 ) VALUES ('${
        this.name
      }', ${this.author_id}, ${this.theme_id}, '${this.idea_text}', ${
        this.about_author_text ? "'" + this.about_author_text + "'" : "NULL"
      },${this.step_id}, ${
        this.plandate_step_end ? "'" + this.plandate_step_end + "'" : "NULL"
      },${this.status_id}, ${this.members_goal}, ${this.user_seen}, '${
        this.color1
      }', '${this.color2}', '${this.color3}')`
    );

    let id = await Project.getIdOfLastProject();
    this.id = id;
    return id;
  };

  getNumberOfMembers = async function () {
    let data = await pool.query(
      `select count(id) as 'count' from members where project_id = ` + this.id
    );
    this.membersCount = data[0][0]["count"];
    return data[0][0]["count"];
  };

  checkParentTheme = async function (par_theme) {};

  static getMembers = async function (id) {
    let data = await pool.query(
      `select user_id from members where project_id = ` + id
    );
    return data[0];
  };

  isNewApplications = async function () {
    let data = await pool.query(
      "SELECT count(id) as 'count' FROM `applications` WHERE project_id=" +
        this.id +
        " AND appstatus_id = 1"
    );
    this.newApplications = data[0][0]["count"];
    return data[0][0]["count"];
  };

  static getCountOfProjects = async () => {
    let data = await pool.query(`SELECT count(id) as 'count' FROM projects`);
    return data[0][0]["count"];
  };

  static filter = async (data) => {
    let order_by = "";
    if (data.sort == "new") {
      order_by += " ORDER BY created_date DESC";
    } else if (data.sort === "old") {
      order_by += " ORDER BY created_date ASC";
    } else if (data.sort === "pop") {
      console.log("populars");
    }

    let where = "";
    let isEmpty = true; // true - where is empty, false - wheres not empty
    if (data.vacsOnly) {
    }

    if (data.step != 0) {
      where += " AND step_id = " + data.step;
    }

    if (data.createdBy == "студентом") {
      where += " AND a.job LIKE '%студент%'";
    }

    if (data.createdBy == "сотрудником") {
      where += " AND a.job NOT LIKE '%студент%'";
    }

    let sql =
      "SELECT p.`id`, p.`name`, p.`author_id`, p.`theme_id`, p.`idea_text`, p.`about_author_text`, p.`step_id`, p.`plandate_step_end`, p.`status_id`, p.`members_goal`, user_seen, p.`color1`, p.`color2`, p.`color3`, p.`created_date`, count(m.id) as members_count FROM `projects` as p LEFT JOIN members as m  ON m.project_id = p.id JOIN users as a ON p.author_id = a.id  WHERE p.status_id = 3 " +
      where +
      " GROUP BY m.project_id, p.id  " +
      order_by;

    let data2 = await pool.query(sql);
    let res = [];
    for (const d of data2[0]) {
      let newd = Project.fullconstructor(...Object.values(d));
      await newd.fillDependencies();
      await newd.fillPhoto();
      res.push(newd);
    }
    if (data.vacOnly) {
      res = res.filter((r) => r.members_goal > r.membersCount);
    }

    if (data.theme != 0) {
      let res2 = [];
      for (const d of res) {
        let pr_themes = d.theme; // массив тем
        let ids = pr_themes.map((t) => t.id); // массив id тем
        if (ids.includes(data.theme)) {
          res2.push(d);
        }
      }
      res = res2;
    }

    if (data.structure != 0) {
      let res2 = [];
      for (const d of res) {
        let pr_structures = d.author.structure; // массив structure
        let ids = pr_structures.map((t) => t.id); // массив id structure
        if (ids.includes(data.structure)) {
          res2.push(d);
        }
      }
      res = res2;
    }

    return res;
  };

  static setUserSeen = async (id) => {
    await pool.query("update projects set user_seen = 1 where id = " + id);
    return true;
  };
}
