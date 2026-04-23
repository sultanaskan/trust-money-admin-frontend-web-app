function validateRegister(data) {
    if (!data.firstName) return "First name is required";
    if (!data.email) return "Email is required";
    if (!data.password) return "Password is required";

    if (!data.email.includes("@")) return "Invalid email";

    if (data.password.length < 6) return "Password must be at least 6 characters";

    return null; // no error
}

function validateLogin(data) {
    if (!data.email) return "Email is required";
    if (!data.password) return "Password is required";

    if (!data.email.includes("@")) return "Invalid email";

    return null;
}