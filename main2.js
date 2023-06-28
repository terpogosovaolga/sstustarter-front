import express from "express";
import multer from "multer"; // для сохранения файлов
// import {pool} from './database.js';
import * as Validations from "./validations/validations.js";
// import {register, login, getMe } from './controllers/UserController.js'; можно так
import {
  UserController,
  ProjectController,
  ApplicationController,
  ApplicationStatusController,
  ReasonController,
  RoleController,
  StepController,
  StructureController,
  ThemeController,
  ViewController,
  SystemInfoController,
  NetsIconController,
  ModerationController,
} from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

import cors from "cors";
import { Project } from "./models/Project.js";
import setAllHeader from "./utils/CORS_error.js";
const app = express();

// описываем способ сохранения файлов
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    // путь, куда сохраняем
    cb(null, "uploads/images/");
  },
  filename: (_, file, cb) => {
    // с каким названием сохраняеем
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); // используем сторедж

app.use(express.json()); // позволяет читать в req json

// когда в адресной строке есть папка uploads, это не rest-запрос, а запрос к картинке
app.use("/uploads", express.static("uploads"));
// Готово. работает для хедера главной страницы
app.get("/systeminfo", SystemInfoController.getActiveSystemInfo);
app.get("/systeminfo/all", SystemInfoController.getAllSystemInfo);
app.post("/systeminfo/edit", SystemInfoController.editSystemInfo);
app.post("/systeminfo/setActive/:id", SystemInfoController.setActiveSystemInfo);
// готово. для футера
app.get("/netsicons/notarchive", NetsIconController.getAllNetsIconsNotArchive);
app.get("/netsicons", NetsIconController.getAllNetsIcons);
app.post("/netsicons/archive/:id/:a", NetsIconController.toggleArchiveNetIcon);
app.get("/structures", StructureController.getAllStructures);
// готово. Возвращает все проекты вместе со всеми зависимостями
app.get("/projects", ProjectController.getAllProjects);

app.get("/projects/author/:id", ProjectController.getAuthorsProject);
app.get("/projects/member/:id", ProjectController.getMembersProject);
app.get("/projects/applicant/:id", ProjectController.getApplicantsProject);
app.get("/projects/needMod", ProjectController.getProjectsForModeration);
app.post(
  "/projects/needMod/filter",
  ProjectController.filterProjectsForModeration
);
app.post("/proect/changeStatus", ProjectController.changeStatusOfProject);

app.get(
  "/projects/applicant/isNew/:id",
  ApplicationController.isNewAnswersOnApplicantProjects
);

app.post("/applications/member", ApplicationController.setMemberOfProject);

app.get("/projects/populars/:number", ProjectController.getPopularProjects);
app.post("/projects/filter", ProjectController.filterProjects);
// готово. Возвращает проект вместе со всеми зависимостями включая темы для презентационной странциы
app.get("/projects/:id", ProjectController.getProjectPresentaion);

app.post("/projects/create", ProjectController.createProject);
app.post("/projects/addphoto", ProjectController.addPhoto);
app.post("/projects/addgoal", ProjectController.addGoal);
app.get("/project/seen/:id", ProjectController.setProjectUserSeen);
app.post("/project/addview", ProjectController.addViewForProject);
// готово. Возвращает всех пользователей с зависимостями
app.get("/users", UserController.getAllUsers);

app.post("/user/editAvatar/:id", UserController.editAvatarPathOfUser);
app.post("/user/editRole", UserController.editRoleOfUser);

app.post("/users/filter", UserController.filter);
// готово. возвращает темы-родители для главной страницы
app.get("/themes", ThemeController.getMainThemes);
// готово. возвращает все темы
app.get("/themes/all", ThemeController.getAllThemes);

app.get("/moderations/:id", ProjectController.getModerationsOfProject);

app.post("/moderation/add", ProjectController.addModerationOfProject);

app.get(
  "/moderation/last/:id",
  ModerationController.getLastModerationOfProject
);

app.get(
  "/moderations/moderator/:id",
  ModerationController.getModerationsOfModerator
);
app.post("/moderations/filter", ModerationController.filter);
// готово. возвращает все темы
app.get("/steps/all", StepController.getAllSteps);

app.post("/auth/register/", UserController.register);

app.post("/auth/login", UserController.login);

app.get("/auth/me", UserController.getMe);

app.post("/upload", upload.single("image"), (req, res) => {
  setAllHeader(res, 200);
  res.json({
    success: true,
    url: `/images/${req.file.originalname}`,
  });
}); // ожидаем свйство Image

app.get(
  "/applications/author/:id",
  ApplicationController.getApplicationsOfAuthor
);

app.get(
  "/applications/author/isNew/:id",
  ApplicationController.getNewApplicationsOfAuthorCount
);

app.post(
  "/application/status",
  ApplicationController.changeStatusOfApplication
);

app.post("/application/seen/:id", ApplicationController.setUserSeenApplication);
app.post("/application/new", ApplicationController.createApplication);
// app.get("/posts", PostController.getAll);
// app.get("/posts/:id", PostController.getPostById);
// app.post(
//   "/posts",
//   checkAuth,
//   Validations.postCreateValidator,
//   handleValidationErrors,
//   PostController.create
// );
// app.delete("/posts/:id", checkAuth, PostController.remove);
// app.patch(
//   "/posts/:id",
//   checkAuth,
//   Validations.postCreateValidator,
//   handleValidationErrors,
//   PostController.update
// );
app.use(cors());
app.listen(4444, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("ok");
  }
});
