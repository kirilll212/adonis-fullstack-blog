import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserRole from 'App/Models/UserRole'

export default class AdminController {
    async store({ params, request, response }: HttpContextContract) {
        const { role } = request.only(['role'])

        const data = [].concat(role)

        await UserRole.createMany(data.map((element) => ({ user_id: params.id, role: element})))

        return response.redirect('/admin/users')
    }

    async create({ params, view }) {
        const user = await User.findBy('id', params.id)
        const title = "Create user role"
        const body = await view.render('forms/createUserRole', { user })

        if (params.id) {
            if (user) {
                return {
                    title,
                    body
                }
            }
        }
    }

    async edit({ params, view }) {
        const user = await User.findBy('id', params.id)
        const title = "Edit user role"
        const body = await view.render('forms/editUserRole', { user })

        if (params.id) {
            if (user) {
                return {
                    title,
                    body
                }
            }
        }
    }
}