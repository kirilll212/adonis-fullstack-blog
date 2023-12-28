import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Action from 'App/Models/Action'
import Role from 'App/Models/Role'
import DatabaseServices from 'App/Services/DataTables'
import { Permissions } from 'Config/permission'

export default class RolesController {
  async store({ request, response }: HttpContextContract) {
    const data = request.only(['name'])
    const role = await Role.create(data)
    const { permission } = request.only(['permission'])

    await Action.createMany(permission.map((element) => ({ role_id: role.id, actions: element })))

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
    interface PermissionObj {
      name: string
      key: string
    }

    const permissions: PermissionObj[] =[]

    for (const permission in Permissions) {
      permissions.push({
        name: Permissions[permission],
        key: permission
      })
    }

    return {
      title: 'Create',
      body: await view.render('forms/createRole', { permissions })
    }
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
    interface PermissionObj {
      name: string
      key: string
    }

    const permissions: PermissionObj[] = []

    for(const permission in Permissions) {
      permissions.push({
        name: Permissions[permission],
        key: permission
      })
    }
    
    if (params.id) {
      const actions = await Action.query().where('role_id', params.id).exec()
      const actions_map = actions.map(({ actions }) => actions)
      const role = await Role.findBy('id', params.id)
      if (role) {
        return {
          title: 'Edit',
          body: await view.render('forms/editRole', { role, permissions, actions: actions_map }),
        }
      }
    }
  }
}
