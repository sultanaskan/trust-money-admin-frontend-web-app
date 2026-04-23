function getRegisterData() {
    return {
        countryName: document.getElementById("countryName").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        role: document.getElementById("role").value,
        status: document.getElementById("status").value,
        password: document.getElementById("password").value,
        dateOfBirth: document.getElementById("dateOfBirth").value
    };
}