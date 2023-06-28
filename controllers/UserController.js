import jwt from "jsonwebtoken"; // шифровка данных
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import setAllHeader from "../utils/CORS_error.js";
export const getAllUsers = async (req, res) => {
  try {
    let users = await User.getAllUsers();
    if (!users) {
      res.status(404).json({
        success: false,
        message: "Что-то пошло не так",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      users,
    });
  } catch (err) {
    setAllHeader(res, 500);
    res.json({ message: "Не удалось" });
  }
};

export const register = async (req, res) => {
  try {
    let pass = req.body.password;
    let salt = await bcrypt.genSalt(10); // алгоритм
    let passHash = await bcrypt.hash(pass, salt); // результат хэширования
    const newUser = new User(
      req.body.role_id,
      req.body.surname,
      req.body.name,
      req.body.patronymic,
      req.body.birth,
      req.body.avatar_path,
      req.body.job,
      req.body.structure_id,
      req.body.login,
      passHash
    );
    let id = await newUser.register();
    setAllHeader(res, 200);
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.json({ message: "Не удалось" });
  }
};

export const login = async (req, res) => {
  setAllHeader(res);
  let data = await User.isLogin(req.body.login);
  if (data === false) {
    setAllHeader(res, 201);
    return res.json({ success: false, message: "Неверный логин или пароль" });
  }
  let isOk = await bcrypt.compare(req.body.password, data[1]);
  if (!isOk) {
    setAllHeader(res, 201);
    return res.json({ success: false, message: "Неверный логин или пароль" });
  }

  let username = await User.getFullNameById(data[0]);
  setAllHeader(res, 200);
  res.json({
    success: true,
    id: data[0],
    name: username,
    role: data[2],
  });
};

export const getMe = async (req, res) => {
  try {
    let user = await User.getUser(req.query.userId);
    if (!user) {
      setAllHeader(res, 404);
      return res
        .status(200)
        .json({ success: false, message: "Пользователь не найден" });
    }
    user.creatorProjectsCount = await user.getCountOfCreatedProjects();
    user.memberProjectsCount = await user.getCountOfPartProjects();
    user.popularThemeId = await user.getPopularTheme();
    setAllHeader(res, 200);

    setAllHeader(res, 200);
    res.json({
      success: true,
      user: user,
    });
    return;
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
    return;
  }
};

export const editAvatarPathOfUser = async (req, res) => {
  try {
    let result = await User.editAvatarOfUser(req.params.id, req.body.url);
    if (!result) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "При изменении аватара возникла ошибка",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      url: req.body.url,
    });
    return;
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
    return;
  }
};

export const editRoleOfUser = async (req, res) => {
  try {
    let result = await User.editRoleOfUser(req.body.id, req.body.role_id);
    if (!result) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "При изменении роли возникла ошибка",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
    });
    return;
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
    return;
  }
};

export const filter = async (req, res) => {
  try {
    let role = [];
    if (req.body.role == 4) {
      role = [2, 3];
    } else role = req.body.role;
    let result = await User.filter(req.body.search, role, req.body.structure);
    if (!result) {
      setAllHeader(res, 404);
      return res.status(404).json({
        success: false,
        message: "Ошибка",
      });
    }
    setAllHeader(res, 200);
    res.json({
      success: true,
      users: result,
    });
    return;
  } catch (err) {
    console.log(err);
    setAllHeader(res, 500);
    res.status(500).json({ success: false, message: "Ошибка" });
    return;
  }
};
