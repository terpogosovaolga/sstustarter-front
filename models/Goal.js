import mysql from "mysql2/promise";
import { pool } from "../database.js";
import { Photo } from "./Photo.js";

export class Goal {
  constructor(project_id, photo_id, text, number_of_goal) {
    this.project_id = project_id;
    this.photo_id = photo_id;
    this.text = text;
    this.number_of_goal = number_of_goal;
  }

  static fullconstructor = (
    id,
    project_id,
    photo_id,
    text,
    number_of_goal,
    created_date
  ) => {
    let p = new Goal(project_id, photo_id, text, number_of_goal);
    p.id = id;
    p.created_date = created_date;
    return p;
  };

  fillDependencies = async function () {
    let photo = null;
    if (this.photo_id) {
      photo = await Photo.getPhoto(this.photo_id);
    }
    this.photo = photo;
  };

  static getAllGoals = async function () {
    let data = await pool.query(`SELECT * from goals`);
    let res = [];
    for (const d of data[0]) {
      let goal = Goal.fullconstructor(...Object.values(d));
      await goal.fillDependencies();
      res.push(goal);
    }
    return res;
  };

  static getGoal = async (id) => {
    let data = await pool.query(`SELECT * from goals WHERE id = ${id}`);
    return Goal.fullconstructor(...data[0]);
  };

  static getListOfGoalsForProject = async (project_id) => {
    let data = await pool.query(
      `SELECT * from goals WHERE project_id = ${project_id} ORDER BY number_of_goal`
    );
    let res = [];
    for (const d of data[0]) {
      let goal = Goal.fullconstructor(...Object.values(d));
      await goal.fillDependencies();
      res.push(goal);
    }
    return Goal.sortByNumber(res);
  };

  addGoal = async function () {
    let data = pool.query(
      `INSERT INTO  goals ( project_id ,  photo_id ,  text ,  number_of_goal ) VALUES (${
        this.project_id
      }, ${this.photo_id ? this.photo_id : null}, '${this.text}', ${
        this.number_of_goal
      })`
    );
    let id = await Goal.getIdOfLastGoal();
    this.id = id;
    return id;
  };

  static getIdOfLastGoal = async function () {
    let data = await pool.query(
      `select id from goals order by id desc LIMIT 1`
    );
    return data[0][0]["id"];
  };

  static sortByNumber = (goals) => {
    let result = [];
    let searching_for_number = Math.min(...goals.map((g) => g.number_of_goal));
    while (result.length != goals.length) {
      result.push(Goal.findGoalByNumber(searching_for_number, goals));
      searching_for_number++;
    }

    return result;
  };

  static findGoalByNumber = (number, goals) => {
    for (const goal of goals) {
      if (goal.number_of_goal === number) {
        return goal;
      }
    }
    return null;
  };
}
