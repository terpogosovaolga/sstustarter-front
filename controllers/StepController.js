// import jwt from 'jsonwebtoken'; // шифровка данных
// import bcrypt from 'bcrypt';
import { Step } from "../models/Step.js";
import setAllHeader from "../utils/CORS_error.js";

export const getAllSteps = async (req, res) => {
  try {
    let steps = await Step.getAllSteps();
    if (!steps) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      steps,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};
