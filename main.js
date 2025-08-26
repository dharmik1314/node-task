document.addEventListener('DOMContentLoaded', function () {
    fetchUsers();

    // Add or update user
    document.getElementById('userForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const id = document.getElementById('userId').value;
        const user = {
            username: document.getElementById('username').value,
            lastname: document.getElementById('lastname').value,
            email: document.getElementById('email').value
        };
        try {
            if (id) {
                // Update
                await fetch(`/api/users/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user)
                }).then(handleFetchError);
                showAlert('User updated successfully!', 'success');
            } else {
                // Create
                await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user)
                }).then(handleFetchError);
                showAlert('User added successfully!', 'success');
            }
            document.getElementById('userForm').reset();
            document.getElementById('userId').value = '';
            document.getElementById('submitBtn').textContent = 'Add User';
            fetchUsers();
        } catch (err) {
            showAlert(err.message || 'Error occurred', 'danger');
        }
    });

    // Edit user
    document.getElementById('userTableBody').addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-btn')) {
            const btn = e.target;
            document.getElementById('userId').value = btn.dataset.id;
            document.getElementById('username').value = btn.dataset.username;
            document.getElementById('lastname').value = btn.dataset.lastname;
            document.getElementById('email').value = btn.dataset.email;
            document.getElementById('submitBtn').textContent = 'Update User';
        }
    });

    // Delete user
    document.getElementById('userTableBody').addEventListener('click', async function (e) {
        if (e.target.classList.contains('delete-btn')) {
            if (!confirm('Are you sure you want to delete this user?')) return;
            const id = e.target.dataset.id;
            try {
                await fetch(`/api/users/${id}`, {
                    method: 'DELETE'
                }).then(handleFetchError);
                showAlert('User deleted successfully!', 'success');
                fetchUsers();
            } catch (err) {
                showAlert(err.message || 'Error occurred', 'danger');
            }
        }
    });

    // Fetch users
    async function fetchUsers() {
        try {
            document.getElementById('userTableBody').innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
            const res = await fetch('/api/users', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            });
            await handleFetchError(res);
            const data = await res.json();
            const users = data.data || [];
            if (users.length === 0) {
                document.getElementById('userTableBody').innerHTML = '<tr><td colspan="5">No users found.</td></tr>';
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
            document.getElementById('userTableBody').innerHTML = rows;
        } catch (err) {
            document.getElementById('userTableBody').innerHTML = '<tr><td colspan="5">Error loading users.</td></tr>';
        }
    }

    function showAlert(message, type) {
        const alert = document.getElementById('alert');
        alert.classList.remove('d-none', 'alert-success', 'alert-danger');
        alert.classList.add('alert-' + type);
        alert.textContent = message;
        setTimeout(() => alert.classList.add('d-none'), 3000);
    }

    // Helper to handle fetch errors
    async function handleFetchError(res) {
        if (!res.ok) {
            let msg = 'Error occurred';
            try {
                const data = await res.json();
                msg = data.message || msg;
            } catch {}
            throw new Error(msg);
        }
        return res;
    }

    function getToken() {
        return localStorage.getItem('jwtToken');
    }

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('jwtToken');
        window.location.href = 'login.html';
    });
});