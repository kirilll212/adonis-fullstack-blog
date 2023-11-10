import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
    async register ({ request, response }: HttpContextContract) {
        const data = request.only(['name', 'email', 'password'])

        await User.create(data)
        response.json({message: 'ok'})
    }

    async login ({ request, response, auth }: HttpContextContract) {
        const { email, password} = request.all()
        const user = (await User.findBy('email', email))?.toJSON()

        if (!user) {
            response.json({ message: 'Not found' })
        }

        await auth.use('web').attempt(email, password)

        response.json({message: 'ok'})
    }
}
