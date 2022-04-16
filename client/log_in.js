const signIn = document.getElementById("signIN"),
    email = document.getElementById("floatingInput"),
    password = document.getElementById("floatingPassword");

async function login(email, password){
    try{
        const response = await fetch(`login`, {
            method: 'POST',
            body: JSON.stringify({user_email: email, password: password, is_event: False}),
        });
    }
    catch{
        console.log(err);
    }
}

signIn.addEventListener("click", async (e)=>{
    const json = await login(email.value, password.value);
});