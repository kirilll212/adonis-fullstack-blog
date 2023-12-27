import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import UserRole from 'App/Models/UserRole'

export default class AdminController {
  async store({ params, request, response }: HttpContextContract) {
    const { role } = request.only(['role'])

    const data = [].concat(role)

    await UserRole.createMany(data.map((element) => ({ user_id: params.id, role_id: element })))

    return response.redirect('/admin/users')
  }

  async create({ params, view }) {
    const user_id = params.id
    const roles = await Role.query().exec()

    if (params.id) {
      return {
        title: 'Create user role',
        body: await view.render('forms/createUserRole', { user_id, roles: roles }),
      }
    }
  }

  async edit({ params, view }) {
    const user_id = params.id
    const roles = await Role.query().exec()
    const userRoles = await UserRole.query().select('role_id').where('user_id', user_id).exec()

    if (params.id) {
      return {
        title: 'Edit user role',
        body: await view.render('forms/editUserRole', {
          user_id,
          roles: roles.map((role) => role.serialize()),
          user_roles: userRoles.map((userRole) => userRole.role_id),
        }),
      }
    }
  }

  async update({ params, request, response }: HttpContextContract) {
    const user_id = params.id
    const role = request.all()
    const data = [].concat(role.role)

    await UserRole.query().where({ user_id: user_id }).delete()
    await UserRole.createMany(data.map((element) => ({ user_id: user_id, role_id: element })))

    return response.redirect('/admin/users')
  }
}
