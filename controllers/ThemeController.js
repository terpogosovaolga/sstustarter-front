// import jwt from 'jsonwebtoken'; // шифровка данных
// import bcrypt from 'bcrypt';
import { Theme } from "../models/Theme.js";
import setAllHeader from "../utils/CORS_error.js";

export const getAllThemes = async (req, res) => {
  try {
    let themes = await Theme.getAllThemes();
    if (!themes) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      themes,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const getMainThemes = async (req, res) => {
  try {
    let themes = await Theme.getMainThemes();

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
    if (!themes) {
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    res.json({
      success: true,
      themes,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};
