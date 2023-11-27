import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class PostsController {
    public async addPost({ request, response, auth, }: HttpContextContract) {
        const { title, content } = request.only(['title', 'content']);

        const picture = request.file('image', {
          extnames: ['jpg', 'png', 'jpeg', 'svg'],
          size: '2mb',
        });

        const fileName = `${new Date().getTime()}.${picture?.extname}`
    
        const data = {
          title,
          content,
          user_id: auth.user?.id,
          image: fileName,
        };
    
        await picture?.move(Application.publicPath('uploads/post'), {
            name: fileName
        });
    
        await Post.create(data);
    
        return response.redirect('/blog');
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
