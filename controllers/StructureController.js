// import jwt from 'jsonwebtoken'; // шифровка данных
// import bcrypt from 'bcrypt';
import { Structure } from "../models/Structure.js";

export const getAllStructures = async (req, res) => {
  try {
    let structures = await Structure.getAllStructures();
    if (!structures) {
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
      structures,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};
