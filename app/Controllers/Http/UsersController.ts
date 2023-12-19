import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { registerValidation, registerValidationMessages } from 'App/Validations/UserRegister';
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

    async login({ request, response, auth, view }: HttpContextContract) {
        const { email, password } = request.all()
        const user = (await User.findBy('email', email))?.toJSON()

        if (!user) {
            response.json({ message: 'Not found' })
        }
        
        await auth.use('web').attempt(email, password)
        
        if(email == 'admin@adm.ad' && password == 'admin123qwe') {
            return response.redirect('/admin')
        }

        await view.render('blog/index', { user })
        return response.redirect('/main')
    }

    async logout({ response, auth }: HttpContextContract) {
        await auth.logout()
        response.redirect('/login')
    }
}
