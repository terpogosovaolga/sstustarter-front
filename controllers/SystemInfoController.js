// import jwt from 'jsonwebtoken'; // шифровка данных
// import bcrypt from 'bcrypt';
import { SystemInfo } from "../models/SystemInfo.js";
import { Project } from "../models/Project.js";
import setAllHeader from "../utils/CORS_error.js";

export const getAllSystemInfo = async (req, res) => {
  try {
    let infos = await SystemInfo.getAllSystemInfo();
    if (!infos) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      infos,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const getActiveSystemInfo = async (req, res) => {
  try {
    let info = await SystemInfo.getActiveSystemInfo();
    info.project_count = await Project.getCountOfProjects();
    if (!info) {
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json"); //В моем случае я получаю json
    res.setHeader("Access-Control-Allow-Origin", "*"); //Либо конкретный хост (поддерживается группа в виде массива)
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    ); //Необходимые типы запросов
    res.setHeader("Access-Control-Allow-Credentials", true); //Означает, что должен быть получен ответ
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.json({
      success: true,
      info,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const editSystemInfo = async (req, res) => {
  try {
    await SystemInfo.editSystemInfo(req.body.info);
    setAllHeader(res, 200);
    return res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const setActiveSystemInfo = async (req, res) => {
  const id = req.params.id;
  await SystemInfo.setActive(id);
  setAllHeader(res, 200);
  res.json({ success: true });
  return;
};
