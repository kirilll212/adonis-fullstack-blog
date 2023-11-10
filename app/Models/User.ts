import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, beforeSave, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Post from './Post'
import Hash from '@ioc:Adonis/Core/Hash'
import UserRole from './UserRole'
import Role from './Role'
import Action from './Action'
import Token from './Token'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string
  
  @column()
  public email: string
  
  @column()
  public password: string

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @belongsTo(() => UserRole)
  public roles: BelongsTo<typeof Role>

  @hasMany(() => Action)
  public actions: HasMany<typeof Action>

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>
  
  @column.dateTime({ columnName: 'createdAt', autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ columnName: 'updatedAt', autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
