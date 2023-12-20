// app/Middleware/AuthCheck.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import jwt from 'jsonwebtoken';
import Config from '@ioc:Adonis/Core/Config';
import User from 'App/Models/User';

export default class AuthCheck {
  public async handle({ auth, request }: HttpContextContract, next: () => Promise<void>) {
    const token = request.header('Authorization')

    if (token) {
      try {
        const decodedToken: any = jwt.verify(token, Config.get('app.appKey'));

        const user = await User.find(decodedToken.userId);

        if (user) {
          auth.login(user);
        }
      } catch (error) {
        console.error(error);
      }
    }

    await next();
  }
}
