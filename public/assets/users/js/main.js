/* eslint-disable no-undef */
const table = $('#customer_data').DataTable({
  processing: true,
  serverSide: true,
  paging: true,
  columns: [
    { data: 'name', name: 'users.name' },
    { data: 'email', name: 'users.email' },
    {
      data: 'actions',
      orderable: false,
      searchable: false,
      render: (value, tmp, data) => {
        const actions = [];
          actions.push(
            `<li>
              <a href="#" class="delete" data-url="/users/${data.id}/delete">${delet}</a>
             </li>
       `
          )

          actions.push(
            ` <li>
               <a href="#" class="modal-ajax" data-toggle="modal" data-target="#modal_edit" data-url="/users/form/${data.id}">${edit}</a>
              </li>`
          )

          actions.push(
            ` <li>
               <a href="#" class="modal-ajax" data-toggle="modal" data-target="#modal_edit" data-url="/users/form/editRoles/${data.id}">${roles}</a>
              </li>`
          )

          actions.push(
            ` <li>
               <a href="#" class="modal-ajax" data-toggle="modal" data-target="#modal_edit" data-url="/users/form/createRoles/${data.id}">${create}</a>
              </li>`
          )

        return `<ul class="icons-list">
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                <i class="icon-menu9"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-right">
                ${actions}
              </ul>
            </li>
          </ul>`
      }
    }
  ],
  ajax: {
    url: '/getUsers',
  },

})
