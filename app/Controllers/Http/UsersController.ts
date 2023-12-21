import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { registerValidation, registerValidationMessages } from 'App/Validations/UserRegister'
import User from 'App/Models/User'
import Token from 'App/Models/Token'
import jwt from 'jsonwebtoken'
import Config from '@ioc:Adonis/Core/Config'
import DatabaseServices from 'App/Services/DataTables'

export default class UsersController {
  public async register({ request, response, session }: HttpContextContract) {
    const { name, email, password } = request.all()

    try {
      await request.validate({
        schema: registerValidation,
        messages: registerValidationMessages,
        bail: true,
      })

      await User.create({
        name,
        email,
        password,
      })

      session.flash({
        message: 'Реєстрація успішна!',
        type: 'success',
      })

      return response.redirect('/login')
    } catch (error) {
      session.flash({
        errors: error.messages,
        type: 'danger',
      })

      return response.redirect('back')
    }
  }

  async login({ request, response, auth, view }: HttpContextContract) {
    const { email, password, rememberMe } = request.all()
    const user = await User.findBy('email', email)

    if (!user) {
      return response.json({ message: 'Not found' })
    }

    try {
      await auth.use('web').attempt(email, password)

      if (rememberMe) {
        await Token.generate(user)
      }

      if (email === 'admin@adm.ad' && password === 'admin123qwe') {
        return response.redirect('/admin')
      }

      const token = jwt.sign({ userId: user.id }, Config.get('app.appKey'), { expiresIn: '7d' })

      await view.render('blog/index', { user: user.toJSON(), token })
      response.redirect('/')
    } catch (error) {
      return response.json({ message: 'Invalid credentials' })
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

  async list({ request, response }) {
    const databaseServices = new DatabaseServices(
      User.query()
        .select('id', 'name', 'email')
        .groupBy('users.id', 'users.name')
        .orderBy('users.name', 'asc'),
      request.all()
    )

    const result = await databaseServices.result()

    return response.ok(result)
  }

  async delete({ params, response }: HttpContextContract) {
    const { id } = params

    await User.query().where('id', id).delete()

    return response.redirect('/admin/users')
  }

  async edit({ params, view }) {
    const user = await User.findBy('id', params.id)
    let title = 'Edit'
    let body = await view.render('forms/editUser', { user })

    if (params.id) {
      if (user) {
        return {
          title,
          body,
        }
      }
    }
  }

  async update({ params, request, response }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password'])
    const user = await User.findBy('id', params.id)

    user?.merge({ ...data })
    await user?.save()

    return response.redirect('/admin/users')
  }
}
