// import jwt from 'jsonwebtoken'; // шифровка данных
// import bcrypt from 'bcrypt';
import { Reason } from "../models/Reason.js";

export const getAllReasons = async (req, res) => {
  try {
    let reasons = await Reason.getAllReasons();
    if (!reasons) {
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    res.json({
      success: true,
      reasons,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};
