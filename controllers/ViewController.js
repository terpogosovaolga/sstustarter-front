// import jwt from 'jsonwebtoken'; // шифровка данных
// import bcrypt from 'bcrypt';
import { View } from "../models/View.js";

export const getAllViews = async (req, res) => {
  try {
    let views = await View.getAllViews();
    if (!views) {
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    res.json({
      success: true,
      views,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};
