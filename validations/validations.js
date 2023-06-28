import { body } from 'express-validator';

export const registerValidator = [
    body('email', 'Неверный формат почты').isEmail(), // второй аргумент - ошибка для пользователя
    body('password').isLength({ min: 5}),
    body('surname').isLength({ min: 1 }),
    // body('avatar').optional().isURL() optional - не обязательно
];

export const loginValidator = [
    body('email', 'Неверный формат почты').isEmail(), // второй аргумент - ошибка для пользователя
    body('password').isLength({ min: 5}),
];

export const postCreateValidator = [
    body('title', 'Введите заголовок статьи').isLength({min:3}).isString(),
    body('text', 'Напишите текст статьи').isLength({min: 10}).isString(),
    body('tags', 'Неверный формат тегов (укажите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString()
]

