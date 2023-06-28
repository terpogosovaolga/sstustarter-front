// import jwt from 'jsonwebtoken'; // шифровка данных
// import bcrypt from 'bcrypt';
import { Application } from "../models/Application.js";
import { ApplicationStatus } from "../models/ApplicationStatus.js";
import setAllHeader from "../utils/CORS_error.js";

export const getAllApplications = async (req, res) => {
  try {
    let applications = await Application.getAllApplications();
    if (!applications) {
      setAllHeader(res, 404);
      return res.json({
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
    res.json({ success: false, message: "Ошибка" });
  }
};

export const getApplicationsOfAuthor = async (req, res) => {
  try {
    let applications = await Application.getApplicationsOfAuthor(req.params.id);
    if (!applications) {
      setAllHeader(res, 404);
      return res.json({
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
    res.json({ success: false, message: "Ошибка" });
  }
};

export const changeStatusOfApplication = async (req, res) => {
  try {
    await Application.changeStatusOfApplication(
      req.body.application_id,
      req.body.appstatus_id
    );
    let appstatus = await ApplicationStatus.getApplicationStatus(
      req.body.appstatus_id
    );
    if (appstatus) {
      setAllHeader(res, 200);
      res.json({
        success: true,
        appstatus,
      });
    } else {
      setAllHeader(res, 200);
      res.json({
        success: false,
      });
    }
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.json({ success: false, message: "Ошибка" });
  }
};

export const isNewAnswersOnApplicantProjects = async (req, res) => {
  try {
    let count = await Application.getApplicantsProjectsWithNewAnswersCount(
      req.params.id
    );
    setAllHeader(res, 200);
    res.json({
      success: true,
      count,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const getNewApplicationsOfAuthorCount = async (req, res) => {
  try {
    let count = await Application.getApplicationsOfAuthorWithStatus(
      req.params.id,
      1
    );
    setAllHeader(res, 200);
    res.json({
      success: true,
      count,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const setUserSeenApplication = async (req, res) => {
  try {
    let result = await Application.setUserSeenApplication(req.params.id);
    if (!result) {
      setAllHeader(res, 500);
      res.json({
        success: false,
      });
    }
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

export const createApplication = async (req, res) => {
  try {
    const result = await Application.createApplication(req.body);
    if (!result) {
      setAllHeader(res, 500);
      res.json({
        success: false,
      });
    }
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

export const setMemberOfProject = async (req, res) => {
  try {
    const result = await Application.createMember(
      req.body.project_id,
      req.body.user_id,
      req.body.application_id
    );
    if (!result) {
      setAllHeader(res, 500);
      res.json({
        success: false,
      });
    }
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
