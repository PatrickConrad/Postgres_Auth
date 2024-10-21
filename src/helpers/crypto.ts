import  crypto, { pbkdf2Sync } from 'crypto';


const genRandomString = function(length: number){ 
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0,length); 
}; 
const generateHash = async function(password: string, saltNum?: number){ 
    const setSaltNum = saltNum??10
    const salt = genRandomString(setSaltNum);
    const hash = crypto.pbkdf2Sync(password, salt,setSaltNum, 64, 'sha512').toString('hex'); 
    return `$${setSaltNum}$${salt}$${hash}`; 
}; 
    
export const  hashPassword = async (userpassword: string, rounds?: number) => { 
    const hashedPassword = await generateHash(userpassword, rounds??16); 
    console.log({hashedPassword});
    return hashedPassword;
}

export const comparePassword = (passwordAttempt: string, hashedPassword: string) => {
    if(!hashedPassword.includes('$')){
        return false;
    }
    if(hashedPassword.split('$').length!==4){
        return false;
    }
    const passInfo = hashedPassword.split('$');
    const checkHash = crypto.pbkdf2Sync(passwordAttempt, passInfo[2], parseInt(passInfo[1]),64, 'sha512').toString('hex');
    return checkHash === passInfo[3]
}
