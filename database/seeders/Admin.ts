import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    const existingAdmin = await User.query().where('email', 'admin@adm.ad').first()

    if(!existingAdmin) {
      await User.createMany([{
        name: 'Admin',
        email:'admin@adm.ad',
        password: 'admin123qwe'
      }]) 
    } else {
      console.log('Admins account is already exist');
    }
  }
}
