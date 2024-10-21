import { pgQuery } from './../helpers/dbQuery';
import { Request, Response, NextFunction } from 'express';
// import moment from 'moment';

import { hashPassword, comparePassword } from '../helpers/crypto';
import {
  isValidEmail,
  validatePassword,
  empty,
  generateUserToken,
} from '../helpers/inputValidation';

import {
  errorMessage, successMessage, status,
} from '../helpers/status';
import { AuthRequest } from '../types';

/**
   * Create A Admin
   * @param {AuthRequest} req
   * @param {Response} res
   * @returns {object} reflection object
*/

const createAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const {
        email, first_name, last_name, password,
    } = req.body;

    const { is_admin } = req.user;

    const isAdmin = true;
    const created_on = new Date().getTime();

    if (!is_admin === false) {
        errorMessage.message = 'Sorry You are unauthorized to create an admin';
        return res.status(status.bad).json(errorMessage);
    }

    if (empty(email) || empty(first_name) || empty(last_name) || empty(password)) {
        errorMessage.message = 'Email, password, first name and last name field cannot be empty';
        return res.status(status.bad).json(errorMessage);
    }
    if (!isValidEmail(email)) {
        errorMessage.message = 'Please enter a valid Email';
        return res.status(status.bad).json(errorMessage);
    }
    if (!validatePassword(password)) {
        errorMessage.message = 'Password must be more than five(5) characters';
        return res.status(status.bad).json(errorMessage);
    }
    const hashedPassword = await hashPassword(password, 16);
    const createUserQuery = `INSERT INTO
      users(email, first_name, last_name, password, is_admin, created_on)
      VALUES($1, $2, $3, $4, $5, $6)
      returning *`;
    const values = [
        email,
        first_name,
        last_name,
        hashedPassword,
        isAdmin,
        created_on,
    ];

    try {
        const qrResult = await pgQuery(createUserQuery, values);
        if(qrResult==null){
            errorMessage.message = 'No result rows found';
            return res.status(status.created).json(errorMessage);
        }
        const { rows } = qrResult;
        const dbResponse = rows[0];
        delete dbResponse.password;
        const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.is_admin, dbResponse.first_name, dbResponse.last_name);
        successMessage.data = dbResponse;
        successMessage.data.token = token;
        return res.status(status.created).json(successMessage);
    } 
    catch (err: any) {
        errorMessage.message = 'Default server error'
        if (err!=null&&err.routine!=null&&err.routine === '_bt_check_unique') {
            errorMessage.message = 'Admin with that EMAIL already exist';
            return res.status(status.conflict).json(errorMessage);
        }
    }

};

/**
 * Update A User to Admin
 * @param {object} req 
 * @param {object} res 
 * @returns {object} updated user
 */
const updateUserToAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { isAdmin } = req.body;
  const { is_admin } = req.user;
  if (!is_admin === true) {
    errorMessage.message = 'Sorry You are unauthorized to make a user an admin';
    return res.status(status.bad).json(errorMessage);
  }
  if (isAdmin==null || isAdmin === '') {
    errorMessage.message = 'Admin Status is needed';
    return res.status(status.bad).json(errorMessage);
  }
  const findUserQuery = 'SELECT * FROM users WHERE id=$1';
  const updateUser = `UPDATE users
        SET is_admin=$1 WHERE id=$2 returning *`;
  try {
    const pgQueryRes = await pgQuery(findUserQuery, [id]);
    if(pgQueryRes==null){
        errorMessage.message = 'No users found'
        return res.status(status.bad).json(errorMessage)
    }
    const {rows} = pgQueryRes;
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.message = 'User Cannot be found';
      return res.status(status.notfound).json(errorMessage);
    }
    const values = [
      isAdmin,
      id,
    ];
    const pgQueryUserRes = await pgQuery(updateUser, values);
    if(pgQueryUserRes==null){
        errorMessage.message = 'Failed to update user'
        return res.status(status.bad).json(errorMessage) 
    }
    const dbResult = pgQueryUserRes.rows[0];
    delete dbResult.password;
    successMessage.data = dbResult;
    return res.status(status.success).json(successMessage);
  } 
  catch (error) {
    errorMessage.message = 'Operation was not successful';
    return res.status(status.error).json(errorMessage);
  }
};

export {
  createAdmin,
  updateUserToAdmin,
};