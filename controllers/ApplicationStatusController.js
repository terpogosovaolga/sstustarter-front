// import jwt from 'jsonwebtoken'; // шифровка данных
// import bcrypt from 'bcrypt';
import { ApplicationStatus } from "../models/ApplicationStatus.js";

export const getAllApplicationStatuses = async (req, res) => {
  try {
    let appstatuses = await ApplicationStatus.getAllApplicationStatuses();
    if (!appstatuses) {
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    res.json({
      success: true,
      appstatuses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};
