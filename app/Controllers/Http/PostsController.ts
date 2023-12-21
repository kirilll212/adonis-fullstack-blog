import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import DatabaseServices from 'App/Services/DataTables'

export default class PostsController {
  public async addPost({ request, response, auth }: HttpContextContract) {
    const { title, content } = request.only(['title', 'content'])

    const picture = request.file('image', {
      extnames: ['jpg', 'png', 'jpeg', 'svg'],
      size: '2mb',
    })

    const fileName = `${new Date().getTime()}.${picture?.extname}`

    const data = {
      title,
      content,
      user_id: auth.user?.id,
      image: fileName,
    }

    await picture?.move(Application.publicPath('uploads/post'), {
      name: fileName,
    })

    await Post.create(data)

    return response.redirect('back')
  }

  async delete({ params, response }: HttpContextContract) {
    const { id } = params
    await Post.query().where('id', id).delete()

    return response.redirect('/admin/posts')
  }

  async index({ view }) {
    const posts = await Post.query()
      .select('*')
      .orderBy('created_at', 'asc')
      .preload('user')
      .limit(10)
      .exec()

    return view.render('blog/blog', {
      posts,
    })
  }

  async update({ params, response, request }: HttpContextContract) {
    const data = request.only(['title', 'content'])
    const post = await Post.find(params.id)

    if (!post) {
      return response.status(404).json({ message: 'Post not found' })
    }

    post.title = data.title
    post.content = data.content

    await post.save()

    return response.redirect('/admin/posts')
  }

  async blog({ view }) {
    const posts = await Post.query()
      .select('*')
      .orderBy('created_at', 'asc')
      .preload('user')
      .limit(10)
      .exec()

    return view.render('blog/index', {
      posts,
    })
  }

  async single({ params, view }: HttpContextContract) {
    const post = await Post.query()
      .where('id', params.id)
      .preload('user')
      .preload('comments', (builder) => {
        builder.preload('user').orderBy('id', 'desc')
      })
      .firstOrFail()

    return view.render('blog/single', { post: post.toJSON() })
  }

  async create({ view }) {
    let title = 'Create'
    let body = await view.render('forms/createPost')

    return { title, body }
  }

  async edit({ params, view }) {
    const post = await Post.findBy('id', params.id)
    let title = 'Edit'
    let body = await view.render('forms/editPost', { post })

    if (params.id) {
      if (post) {
        return {
          title,
          body,
        }
      }
    }
  }

  async list({ response, request }) {
    const databaseServices = new DatabaseServices(
      Post.query()
        .select(['posts.id', 'posts.title', 'users.name', 'posts.created_at'])
        .leftJoin('users', 'posts.user_id', 'users.id')
        .groupBy('posts.id', 'users.name', 'posts.title', 'posts.created_at')
        .orderBy('posts.title', 'asc'),
      request.all()
    )

    const result = await databaseServices.result()

    response.ok(result)
  }
}
