import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
    async register ({ request, response, session }: HttpContextContract) {
        const data = request.only(['name', 'email', 'password'])

        await User.create(data)

        session.flash({ message: 'Реєстрацію успішно завершено!', type: 'success' })

        return response.redirect('/login')
    }

    async login ({ request, response, auth }: HttpContextContract) {
        const { email, password} = request.all()
        const user = (await User.findBy('email', email))?.toJSON()

        if (!user) {
            response.json({ message: 'Not found' })
        }

        await auth.use('web').attempt(email, password)

        return response.redirect('/')
    }
}
