const setRole = (role) => {
    window.localStorage.setItem("role", role);
}

const getRole = () => {
    return window.localStorage['role'] ?? null;
}

export {setRole, getRole}