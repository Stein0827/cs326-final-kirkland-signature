const fname = document.getElementById("first-name"),
    lname = document.getElementById("last-name"),
    email = document.getElementById("form-email"),
    password = document.getElementById("form-password"),
    signUp = document.getElementById("signUp");

async function signup(name, email, password){
    try{
        const response = await fetch(`/newUser`, {
            method: 'POST',
            body: JSON.stringify({user_name: name, user_email: email, password: password, is_event: false}),
        });
    }
    catch{
        console.log(err);
    }
}

signUp.addEventListener("click", async (e)=>{
    const name = fname.value + " " + lname.value;
    await signup(name, email.value, password.value);
});