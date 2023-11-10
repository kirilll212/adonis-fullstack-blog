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
}
