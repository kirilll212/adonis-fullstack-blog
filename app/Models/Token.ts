import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import User from './User';
import jwt from 'jsonwebtoken';
import Config from '@ioc:Adonis/Core/Config';
import { DateTime } from 'luxon';

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public token: string;

  @column()
  public user_id: number;

  @column.dateTime()
  public expires_at: DateTime;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  public static async generate(user: User): Promise<Token> {
    const expiresIn = '7d';

    const token = jwt.sign({ userId: user.id }, Config.get('app.appKey'), { expiresIn });

    const expires_at = DateTime.local().plus({ days: 7 });

    return this.create({ token, user_id: user.id, expires_at });
  }

  public static async delete(user: User): Promise<void> {
    await this.query().where('user_id', user.id).delete();
  }
}
