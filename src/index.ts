const getUser = document.querySelector("#user") as HTMLInputElement;
const formSubmit : HTMLFormElement | null = document.querySelector("#form");
const main_container = document.querySelector(".main_container") as HTMLElement;

// contract

interface UserData {
    id:number;
    login:string;
    avatar_url:string;
    location:string;
    url:string;
}

// reuse

async function myCustomeFunc<T>(url:string, option?:RequestInit):Promise<T>{
    // fetch(url,option)
    const response = await fetch(url,option);
    if(!response.ok){   
        throw new Error(
            `Network response was not ok - status: ${response.status}`
        );
    }
    const data = await response.json();
    return data;
}

// display card ui
const showResultUi =  (singleUser:UserData) => {
    const{avatar_url, login, url} = singleUser;
    main_container.insertAdjacentHTML(
        "beforeend",
        `<div class='card'>
        <img src = ${avatar_url} alt=${login}>
        <a href=${url}> Github</a>
        </div>`
    )
}

function fetchUserData(url:string){
   myCustomeFunc<UserData[]>(url,{}).then((userInfo)=>{
    for(const singleUser of userInfo){
        showResultUi(singleUser);
        console.log("login" + singleUser)
    }
   });

}


// default fucntion calling

fetchUserData("https://api.github.com/users");

// search functionality.

formSubmit?.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const searchItem = getUser.value.toLowerCase();
    try{
        const url = "https://api.github.com/users";
        const allUserData = await myCustomeFunc<UserData[]>(url,{});
        const matchingUsers = allUserData.filter((user)=>{
            return user.login.toLowerCase().includes(searchItem);
        }); 
        
        main_container.innerHTML = "";

        if(matchingUsers.length === 0){
            main_container.insertAdjacentHTML(
                'beforeend',
                `<p class="empty-msg">No matching users found.
                </p>`
            );       
        }else{
            for(const singleUser of matchingUsers){
                showResultUi(singleUser);
            }
        }
    }

    catch(error){
        console.log(error)
    }
});
