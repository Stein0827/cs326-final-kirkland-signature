// const signIn = document.getElementById("signIn"),
//     register = document.getElementById("register"),
//     email = document.getElementById("floatingInput"),
//     password = document.getElementById("floatingPassword");

// async function login(email, password){
//     try{
//         const response = await fetch('/login', {
//             method: 'POST',
//             body: JSON.stringify({user_email: email, password: password, is_event: false}),
//         });
//     }
//     catch{
//         console.log(err);
//     }
// }

// signIn.addEventListener("click", async (e)=>{
//     await login(email.value, password.value);
// });