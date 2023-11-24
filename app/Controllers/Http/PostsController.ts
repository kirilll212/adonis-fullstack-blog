import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class PostsController {
    async addPost({ request, response, auth }: HttpContextContract) {
        const { title, content } = request.only(['title', 'content'])

        const data = {
            title,
            content,
            user_id: auth.user?.id
        }

        await Post.create(data)

        response.json('added')
    }

    async index({ view }) {
        const posts = await Post.query()
            .select('*')
            .orderBy('created_at', 'asc')
            .preload('user')
            .limit(10)
            .exec()

        return view.render('blog/blog', {
            posts
        })
    }

    async blog({ view }) {
        const posts = await Post.query()
            .select('*')
            .orderBy('created_at', 'asc')
            .preload('user')
            .limit(10)
            .exec()

        return view.render('blog/index', {
            posts
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
}
