/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.get('/', 'PostsController.blog').middleware('authCheck')

Route.on('/error').render('404')

Route.post('/register', 'UsersController.register')
Route.post('/login', 'UsersController.login')
Route.on('/login').render('login')
Route.on('/register').render('register')
Route.get('/logout', 'UsersController.logout')

Route.post('/create', 'CommentsController.create').middleware('auth')
Route.post('/add-post', 'PostsController.addPost').middleware('auth')
Route.post('/add-role', 'RolesController.store')

Route.post('/posts/:id/update', 'PostsController.update')
Route.post('/users/:id/update', 'UsersController.update')
Route.post('/roles/update/:id', 'RolesController.update')
Route.get('/posts/:id/delete', 'PostsController.delete')
Route.get('/users/:id/delete', 'UsersController.delete')
Route.get('/roles/:id/delete', 'RolesController.delete')

Route.get('/blog', 'PostsController.index')
Route.get('/post/:id', 'PostsController.single')

Route.get('/posts/form', 'PostsController.create')
Route.get('/roles/form', 'RolesController.create')
Route.get('/posts/form/:id', 'PostsController.edit')
Route.get('/users/form/:id', 'UsersController.edit')
Route.get('/users/form/editRoles/:id', 'AdminsController.edit')
Route.get('/users/form/createRoles/:id', 'AdminsController.create')
Route.post('/users/createUsersRole/:id', 'AdminsController.store')
Route.post('/users/editUsersRole/:id', 'AdminsController.update')
Route.get('/roles/form/:id', 'RolesController.edit')

Route.get('/getPosts', 'PostsController.list')
Route.get('/getUsers', 'UsersController.list')
Route.get('/getRoles', 'RolesController.list')


Route.group(() => {
  Route.on('/').render('admin/index')
  Route.on('/posts').render('admin/posts')
  Route.on('/users').render('admin/users')
  Route.on('/roles').render('admin/roles')
}).prefix('/admin')