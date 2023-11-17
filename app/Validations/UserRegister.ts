import { schema, rules } from '@ioc:Adonis/Core/Validator';

export const registerValidation = schema.create({
    name: schema.string({ trim: true }, [
        rules.required(),
        rules.maxLength(8),
        rules.regex(/^[a-zA-Z0-9]+$/),
    ]),

    email: schema.string({ trim: true }, [
        rules.required(),
        rules.email(),
        rules.maxLength(255),
        rules.regex(/^.+@.+\..+$/),
        rules.unique({ table: 'users', column: 'email' }),
    ]),

    password: schema.string({ trim: true }, [
        rules.required(),
        rules.minLength(8),
        rules.regex(/[a-z]/),
        rules.regex(/[A-Z]/),
    ]),
});

export const registerValidationMessages = {
    'name.required': 'Введіть ім\'я користувача',
    'name.maxLength': 'Ім\'я користувача не може перевищувати 8 символів',
    'name.regex': 'Ім\'я користувача може містити тільки букви та цифри',

    'email.required': 'Введіть email',
    'email.maxLength': 'Email не може перевищувати 255 символів',
    'email.email': 'Введіть дійсний email',
    'email.unique': 'Цей email вже використовується',

    'password.required': 'Введіть пароль',
    'password.minLength': 'Пароль повинен бути не менше 8 символів',
    'password.regex': 'Пароль повинен містити принаймні одну маленьку та велику літеру',
};