$(document).ready(function () {
    fetchUsers();

    // Add or update user
    $('#userForm').on('submit', async function (e) {
        e.preventDefault();
        const id = $('#userId').val();
        const user = {
            username: $('#username').val(),
            lastname: $('#lastname').val(),
            email: $('#email').val()
        };
        try {
            if (id) {
                // Update
                await $.ajax({
                    url: `/api/users/${id}`,
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(user)
                });
                showAlert('User updated successfully!', 'success');
            } else {
                // Create
                await $.ajax({
                    url: '/api/users',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(user)
                });
                showAlert('User added successfully!', 'success');
            }
            $('#userForm')[0].reset();
            $('#userId').val('');
            $('#submitBtn').text('Add User');
            fetchUsers();
        } catch (err) {
            showAlert(err.responseJSON?.message || 'Error occurred', 'danger');
        }
    });

    // Edit user
    $('#userTableBody').on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        const username = $(this).data('username');
        const lastname = $(this).data('lastname');
        const email = $(this).data('email');
        $('#userId').val(id);
        $('#username').val(username);
        $('#lastname').val(lastname);
        $('#email').val(email);
        $('#submitBtn').text('Update User');
    });

    // Delete user
    $('#userTableBody').on('click', '.delete-btn', async function () {
        if (!confirm('Are you sure you want to delete this user?')) return;
        const id = $(this).data('id');
        try {
            await $.ajax({
                url: `/api/users/${id}`,
                method: 'DELETE'
            });
            showAlert('User deleted successfully!', 'success');
            fetchUsers();
        } catch (err) {
            showAlert(err.responseJSON?.message || 'Error occurred', 'danger');
        }
    });

    // Fetch users
    async function fetchUsers() {
        try {
            $('#userTableBody').html('<tr><td colspan="5">Loading...</td></tr>');
            const res = await $.get('/api/users');
            const users = res.data || [];
            if (users.length === 0) {
                $('#userTableBody').html('<tr><td colspan="5">No users found.</td></tr>');
                return;
            }
            let rows = '';
            users.forEach((user, idx) => {
                rows += `<tr>
                    <td>${idx + 1}</td>
                    <td>${user.username || ''}</td>
                    <td>${user.lastname || ''}</td>
                    <td>${user.email || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-btn"
                            data-id="${user.id}"
                            data-username="${user.username}"
                            data-lastname="${user.lastname}"
                            data-email="${user.email}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${user.id}">Delete</button>
                    </td>
                </tr>`;
            });
            $('#userTableBody').html(rows);
        } catch (err) {
            $('#userTableBody').html('<tr><td colspan="5">Error loading users.</td></tr>');
        }
    }

    function showAlert(message, type) {
        $('#alert').removeClass('d-none alert-success alert-danger').addClass('alert-' + type).text(message);
        setTimeout(() => $('#alert').addClass('d-none'), 3000);
    }
});