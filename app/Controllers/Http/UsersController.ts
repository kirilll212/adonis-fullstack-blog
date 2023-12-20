import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { registerValidation, registerValidationMessages } from 'App/Validations/UserRegister';
import User from 'App/Models/User'
import Token from 'App/Models/Token';
import jwt from 'jsonwebtoken'
import Config from '@ioc:Adonis/Core/Config'

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
        const { email, password, rememberMe } = request.all();
        const user = await User.findBy('email', email);
    
        if (!user) {
          return response.json({ message: 'Not found' });
        }
    
        try {
          await auth.use('web').attempt(email, password);
    
          if (rememberMe) {
            await Token.generate(user);
          }
    
          if (email === 'admin@adm.ad' && password === 'admin123qwe') {
            return response.redirect('/admin');
          }

          const token = jwt.sign({ userId: user.id }, Config.get('app.appKey'), { expiresIn: '7d' });
    
          await view.render('blog/index', { user: user.toJSON(), token });
          response.redirect('/')
        } catch (error) {
          return response.json({ message: 'Invalid credentials' });
        }
      }

    async logout({ response, auth }: HttpContextContract) {
        const user = auth.user

        if (user) {
            await Token.delete(user)
        }

        await auth.logout()
        response.redirect('/login')
    }
}
