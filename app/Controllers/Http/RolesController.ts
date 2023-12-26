import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import DatabaseServices from 'App/Services/DataTables'

export default class RolesController {
  async store({ request, response }: HttpContextContract) {
    const data = request.only(['name'])

    await Role.create(data)

    return response.redirect('/admin/roles')
  }

  async list({ request, response }) {
    const databaseServices = new DatabaseServices(
      Role.query()
        .select('id', 'name')
        .groupBy('roles.id', 'roles.name')
        .orderBy('roles.id', 'asc'),
      request.all()
    )

    const result = await databaseServices.result()

    response.ok(result)
  }

  async create({ view }) {
    let title = 'Create'
    let body = await view.render('forms/createRole')

    return { title, body }
  }

  async delete({ params, response }: HttpContextContract) {
    const { id } = params

    await Role.query().where('id', id).delete()

    return response.redirect('/admin/roles')
  }

  async update({ params, request, response }: HttpContextContract) {
    const data = request.only(['name'])
    const role = await Role.findBy('id', params.id)

    role?.merge({ ...data })
    await role?.save()

    return response.redirect('/admin/roles')
  }

  async edit({ params, view }) {
    const role = await Role.findBy('id', params.id)
    let title = 'Edit'
    let body = await view.render('forms/editRole', { role })

    if (params.id) {
      if (role) {
        return {
          title,
          body,
        }
      }
    }
  }
}
