//app/helpers/validation.js
import jwt from 'jsonwebtoken'

/**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */


const isValidEmail = (email: string) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
};

/**
   * validatePassword helper method
   * @param {string} password 
   * @returns {Boolean} True or False
   */

const validatePassword = (password: string) => {
    if (password.length <= 7 || password === '') return false
    return true;
};
/**
   * isEmpty helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False 
   */

const isEmpty = (input: string) => {
    if (input === undefined || input === '') return true;
    if (input.replace(/\s/g, '').length>0) return false;
    return true;
};

/**
   * empty helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
*/

const empty = (input: string) => {
  if (input == null || input === '') return true;
};




const generateUserToken = (email: string, id: string, is_admin: boolean, first_name: string, last_name: string) => {
    const token = jwt.sign({
        email,
        user_id: id,
        is_admin,
        first_name,
        last_name
    },
    process.env.TOKEN_SECRET as string,
    {expiresIn: '3d'})

    return token
}


export {
  isValidEmail,
  validatePassword,
  empty,
  generateUserToken
};