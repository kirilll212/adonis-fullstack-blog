import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { registerValidation, registerValidationMessages } from 'App/Validations/UserRegister';
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

export default class UsersController {
    public async register({ request, response, session }: HttpContextContract) {
        const { name, email, password } = request.all();

        try {
            await request.validate({
                schema: registerValidation,
                messages: registerValidationMessages,
                bail: true,
            });

            const existingUser = await Database.from('users').where('email', email).first();

            if (existingUser) {
                session.flash({
                    message: 'Цей email вже використовується',
                    type: 'danger',
                });
                return response.redirect('back');
            }

            await User.create({
                name,
                email,
                password,
            });

            session.flash({
                message: 'Реєстрація успішна!',
                type: 'success',
            });

            return response.redirect('/login');
        } catch (error) {
            session.flash({
                errors: error.messages,
                type: 'danger',
            });

            return response.redirect('back');
        }

    }

    async login({ request, response, auth }: HttpContextContract) {
        const { email, password } = request.all()
        const user = (await User.findBy('email', email))?.toJSON()

        if (!user) {
            response.json({ message: 'Not found' })
        }

        await auth.use('web').attempt(email, password)

        return response.redirect('/blog')
    }
}
