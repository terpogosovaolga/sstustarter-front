// import jwt from 'jsonwebtoken'; // шифровка данных
// import bcrypt from 'bcrypt';
import { Moderation } from "../models/Moderation.js";
import setAllHeader from "../utils/CORS_error.js";

export const getModerationsOfModerator = async (req, res) => {
  try {
    let moderations = await Moderation.getModerationsOfModerator(req.params.id);
    if (!moderations) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      moderations,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const filter = async (req, res) => {
  try {
    let moderations = await Moderation.filter(
      req.body.moderator_id,
      req.body.status_id,
      req.body.sort
    );
    if (!moderations) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      moderations,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};

export const getLastModerationOfProject = async (req, res) => {
  try {
    let moderation = await Moderation.getLastModerationOfProject(req.params.id);
    if (!moderation) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      moderation,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
  }
};
