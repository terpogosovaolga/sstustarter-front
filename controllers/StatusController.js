// import jwt from 'jsonwebtoken'; // шифровка данных
// import bcrypt from 'bcrypt';
import { Status } from "../models/Status.js";

export const getAllStatuses = async (req, res) => {
  try {
    let statuses = await Status.getAllStatuses();
    if (!statuses) {
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    res.json({
      success: true,
      statuses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};
