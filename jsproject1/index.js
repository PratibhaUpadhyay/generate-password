const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay =document.querySelector("[data-password-display]");

const copybtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~!@#$%^&*(){}[]||;:/";


// initially
let password = "";
let passwordLength = 10;
let checkcount = 0;
// set color of strength color grey 
setIndicator('#ccc');


// handelslider ka kaam itna hai ki password length ki UI pe reflect krata hai 
handleSlider();
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    

    // slide krne ki funtionality
    // increment / decrement
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"


}



function setIndicator(color){
    // color set krna hai 
    indicator.style.backgroundColor = color;
    // shaddow set krna hai 
    indicator.style.boxShadow = "rgb(204, 204, 204) 0px 0px 12px 1px;"
    


}

function getRandInteger(min , max){
    return Math.floor(Math.random()*(max - min)) + min ;

}

function generaterandomNumber(){
    return getRandInteger(0,9);
}

function generateLowerCase(){
    return  String.fromCharCode(getRandInteger(97,123));

}
function gerenateUpperCase(){
    return  String.fromCharCode(getRandInteger(65,91));

}

function generateSymbol(){
   const randNum = getRandInteger(0 , symbols.length);
   return symbols.charAt(randNum);
}

function calculateStrength(){
    let hasupper = false;
    let haslower = false;
    let hasnumber = false;
    let hassymbol = false;

    if(uppercaseCheck.checked) hasupper = true;
    if(lowercaseCheck.checked) haslower = true;
    if(numberCheck.checked) hasnumber   = true;
    if(symbolCheck.checked) hassymbol   = true;

    if(hasupper && haslower && (hasnumber || hassymbol) && passwordLength>=6){
        setIndicator("#0f0");
    }
    else if(haslower && hasupper && hasnumber && passwordLength >=5){
        setIndicator('#ff0');
    }
    else if( (haslower || hasupper) && (hasnumber || hassymbol) && passwordLength >=6){
        setIndicator('#f0f');
    }
    else{
        setIndicator('#f00');
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";

    }
    catch(e){
        copyMsg.innerText = "Failed";

    }
    // to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");

    }, 2000);
    

}

function handlecheckBoxChange(){
    checkcount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkcount++;
        }
       
    });

    // corner case
    if(passwordLength < checkcount){
        passwordLength = checkcount;
        handleSlider();
    }
}


function shufflepassword(array){
    // fisher yates Method
    for(let i = array.length-1 ; i>0 ; i--){

        // finding the random j
        const j = Math.floor(Math.random() * (i+1));

        // swap at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }
    let str = "";
    array.forEach((el)=>{ str += el});
    return str ;

}



// adding event listener slider
inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
});


// adding event listner in checkbox
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handlecheckBoxChange);
})



// adding event listner in copied
copybtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

// adding event listner in generate button
generateBtn.addEventListener('click', ()=>{
    // none of checkbox are selected
    if(checkcount == 0 ){
        return ;
    }
    if(passwordLength < checkcount){
        passwordLength = checkcount;
        handleSlider();
    }
    // let's start the journey to find new password

    console.log("starting the journey");

    // remove old password
    password = "";

    // put which are in the checkbox
    // if(uppercaseCheck.checked){
    //     password += gerenateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password += generaterandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(gerenateUpperCase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numberCheck.checked){
        funcArr.push(generaterandomNumber);
    }
    if(symbolCheck.checked){
        funcArr.push(generateSymbol);
    }

    // compulsary addition
    for(let i = 0 ; i<funcArr.length ; i++){
        password += funcArr[i]();

    }

    console.log("compulsary addition done");


    // remaining addition
    for(let i = 0 ; i < passwordLength - funcArr.length ; i++){
        let randIndex = getRandInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }

    console.log("Remaining addition done");

    // shuffle the password
    password = shufflepassword(Array.from(password));

    console.log("shuffling done");


    // show in UI
    passwordDisplay.value = password;

    console.log("UI addition done");

    // pasword , ab bn gya hai strength ko call krenge
    calculateStrength();
});