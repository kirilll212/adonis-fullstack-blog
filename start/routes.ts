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

// Route.get('/', async ({ view }) => {
//   return view.render('login')
// })

Route.get('/', 'PostsController.blog').middleware('authCheck')

Route.on('/error').render('404')

Route.post('/register', 'UsersController.register')
Route.post('/login', 'UsersController.login')
Route.on('/login').render('login')
Route.on('/register').render('register')
Route.get('/logout', 'UsersController.logout')

Route.post('/create', 'CommentsController.create').middleware('auth')
Route.post('/add-post', 'PostsController.addPost').middleware('auth')

Route.post('/posts/:id/update', 'PostsController.update')
Route.post('/users/:id/update', 'UsersController.update')
Route.get('/posts/:id/delete', 'PostsController.delete')
Route.get('/users/:id/delete', 'UsersController.delete')

Route.get('/blog', 'PostsController.index')
Route.get('/post/:id', 'PostsController.single')

Route.get('/posts/form', 'PostsController.create')
Route.get('/posts/form/:id', 'PostsController.edit')
Route.get('/users/form/:id', 'UsersController.edit')

Route.get('/getPosts', 'PostsController.list')
Route.get('/getUsers', 'UsersController.list')


Route.group(() => {
  Route.on('/').render('admin/index')
  Route.on('/posts').render('admin/posts')
  Route.on('/users').render('admin/users')
}).prefix('/admin')