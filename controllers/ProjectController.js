// import jwt from 'jsonwebtoken'; // шифровка данных
// import bcrypt from 'bcrypt';
import { Project } from "../models/Project.js";
import { Photo } from "../models/Photo.js";
import { Goal } from "../models/Goal.js";
import { User } from "../models/User.js";
import { SearchingFor } from "../models/SearchingFor.js";
import { View } from "../models/View.js";
import { Moderation } from "../models/Moderation.js";
import setAllHeader from "../utils/CORS_error.js";
import { Application } from "../models/Application.js";

export const getAllProjects = async (req, res) => {
  try {
    let projects = await Project.getAllProjects();
    if (!projects) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      projects,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const addViewForProject = async (req, res) => {
  try {
    const view = new View(req.body.project_id, req.body.user_id);
    await view.addView();
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const getProjectsForModeration = async (req, res) => {
  try {
    let projects = await Project.getProjectsForModeration();
    if (!projects) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      projects,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const filterProjectsForModeration = async (req, res) => {
  try {
    console.log(req.body.searchString, req.body.sort);
    let projects = await Project.filterProjectsForModeration(
      req.body.searchString,
      req.body.sort
    );
    if (!projects) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      projects,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const getPopularProjects = async (req, res) => {
  try {
    let views = await View.getIdsOfMostViewProjects(req.params.number);
    let projects = [];
    for (const v of views) {
      let project = await Project.getProject(v.id);
      project.views = v.count;
      projects.push(project);
    }
    if (!projects) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }

    setAllHeader(res, 200);
    res.json({
      success: true,
      projects,
    });
  } catch (err) {
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const getProjectPresentaion = async (req, res) => {
  console.log("PREPARING PRESENTATION!");
  try {
    let project = await Project.getProject(req.params.id);
    await project.prepareProjectForShowing();
    await project.getNumberOfMembers();
    let user_ids = await Project.getMembers(project.id);
    let members = [];
    for (const u of user_ids) {
      let user = await User.getUser(u.user_id);
      members.push(user);
    }
    project.members = members;
    if (!project) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      project,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const changeStatusOfProject = async (req, res) => {
  try {
    await Project.changeStatus(req.body.project_id, req.body.status_id);

    setAllHeader(res, 200);
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const createProject = async (req, res) => {
  try {
    let data = req.body.project;
    let project = new Project(
      data.name,
      data.author_id, //
      data.theme_id, //
      data.idea_text,
      data.about_author_text,
      6, //
      data.plandate_step_end,
      6, //
      data.members_goal,
      1,
      data.color1,
      data.color2,
      data.color3
    );

    await project.addProject();

    if (!project) {
      setAllHeader(res, 404);
      res.status(404).json({
        success: false,
        message: "что-то пошло не так",
      });
    }
    let searchings = [];
    for (const sf of data.searching_for) {
      let searching_for = new SearchingFor(project.id, sf);
      await searching_for.addSearchingFor();
      searchings.push(searching_for);
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      project,
      message: "Проект успешно создан",
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const addPhoto = async (req, res) => {
  try {
    let photo = new Photo(req.body.project_id, req.body.path, req.body.isMain); // 1 - главное
    let photo_id = await photo.addPhoto();
    if (photo_id) {
      setAllHeader(res, 200);
      res.json({
        success: true,
        id: photo_id,
        message: "Фото добавлено",
      });
    }
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const addGoal = async (req, res) => {
  try {
    let ph = req.body.photo_id ? req.body.photo_id : null;
    const goal = new Goal(
      req.body.project_id,
      ph,
      req.body.text,
      req.body.index
    );
    await goal.addGoal();
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const getAuthorsProject = async (req, res) => {
  try {
    let projects = await Project.getAuthorsProjects(req.params.id);
    for (const p of projects) {
      await p.getNumberOfMembers();
      await p.isNewApplications();
    }
    if (!projects) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      projects,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const getMembersProject = async (req, res) => {
  try {
    let projects = await Project.getMembersProjects(req.params.id);

    if (!projects) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      projects,
    });
  } catch (err) {
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const getApplicantsProject = async (req, res) => {
  try {
    let applications = await Application.getApplicantsProjects(req.params.id);

    if (!applications) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      applications,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const getModerationsOfProject = async (req, res) => {
  try {
    let moderations = await Moderation.getModerationsOfProject(req.params.id);

    if (!moderations) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      moderations,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const addModerationOfProject = async (req, res) => {
  try {
    let moderation = new Moderation(
      req.body.project_id,
      req.body.moderator_id,
      req.body.status_id,
      req.body.message
    );
    await moderation.createModeration();

    setAllHeader(res, 200);
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const filterProjects = async (req, res) => {
  let projects = await Project.filter(req.body.filters);

  try {
    if (!projects) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      projects,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const setProjectUserSeen = async (req, res) => {
  try {
    await Project.setUserSeen(req.params.id);
    setAllHeader(res, 200);
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};
