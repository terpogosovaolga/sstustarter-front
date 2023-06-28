// import jwt from 'jsonwebtoken'; // шифровка данных
// import bcrypt from 'bcrypt';
import { Role } from "../models/Role.js";

export const getAllRoles = async (req, res) => {
  try {
    let roles = await Role.getAllRoles();
    if (!roles) {
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    res.json({
      success: true,
      roles,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};
