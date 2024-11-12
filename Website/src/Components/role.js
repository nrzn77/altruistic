const setRole = (role) => {
    window.localStorage.setItem("role", role);
}

const getRole = () => {
    if(!window.localStorage['role'] || window.localStorage['role'] == "null"){
        return null;
    }
    return window.localStorage['role'];
}

export {setRole, getRole}