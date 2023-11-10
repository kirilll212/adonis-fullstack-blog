import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment';

export default class CommentsController {
    async create({ request, response, auth }: HttpContextContract) {

        // const { ...data } = request.all()
        const { post_id, content } = request.only(['post_id', 'content'])

        const data = {
            content: content,
            post_id: post_id,
            user_id: auth.user?.id
        }

        await Comment.create(data)

        // console.log(auth.user?.id);

        response.json({ message: 'ok' })
    }
}
