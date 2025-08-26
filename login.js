$('#loginForm').on('submit', async function(e) {
    e.preventDefault();
    const email = $('#loginEmail').val();
    try {
        const res = await $.ajax({
            url: '/api/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email }) // Only send email
        });
        localStorage.setItem('jwtToken', res.token);
        window.location.href = 'index.html'; // Redirect to main app
    } catch (err) {
        $('#loginAlert').removeClass('d-none').text(err.responseJSON?.message || 'Login failed');
    }
});