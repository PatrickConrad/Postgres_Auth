


//db/dev/dbConnection.js

import pool from "../config/db";
import { pgQuery } from "./dbQuery";


pool.on('connect', () => {
    console.log('connected to the db');
});
  
  /**
   * Create User Table
   * CREATE TABLE test
    (id SERIAL PRIMARY KEY, 
    name VARCHAR(100) UNIQUE NOT NULL, 
    phone VARCHAR(100));
   */
  const createUserTable = async () => {
    const userCreateQuery = `CREATE TABLE IF NOT EXISTS users
    (id SERIAL PRIMARY KEY, 
    email VARCHAR(100) UNIQUE NOT NULL, 
    first_name VARCHAR(100) NOT NULL, 
    last_name VARCHAR(100) NOT NULL, 
    password VARCHAR(100) NOT NULL,
    created_on DATE NOT NULL)`;
  
    await pgQuery(userCreateQuery);
  };
  
  /**
   * Create Buses Table
   */
  const createBusTable = async () => {
    const busCreateQuery = `CREATE TABLE IF NOT EXISTS bus
      (id SERIAL PRIMARY KEY,
      number_plate VARCHAR(100) NOT NULL,
      manufacturer VARCHAR(100) NOT NULL,
      model VARCHAR(100) NOT NULL,
      year VARCHAR(10) NOT NULL,
      capacity integer NOT NULL,
      created_on DATE NOT NULL)`;
  
      await pgQuery(busCreateQuery);
  }
  
  /**
   * Create Trip Table
   */
  const createTripTable = async () => {
    const tripCreateQuery = `CREATE TABLE IF NOT EXISTS trip
      (id SERIAL PRIMARY KEY, 
      bus_id INTEGER REFERENCES bus(id) ON DELETE CASCADE,
      origin VARCHAR(300) NOT NULL, 
      destination VARCHAR(300) NOT NULL,
      trip_date DATE NOT NULL,
      fare float NOT NULL,
      status float DEFAULT(1.00),
      created_on DATE NOT NULL)`;
  
      await pgQuery(tripCreateQuery);

  };
  
  /**
   * Create Booking Table
   */
  const createBookingTable = async () => {
    const bookingCreateQuery = `CREATE TABLE IF NOT EXISTS booking(id SERIAL, 
      trip_id INTEGER REFERENCES trip(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      bus_id INTEGER REFERENCES bus(id) ON DELETE CASCADE,
      trip_date DATE, 
      seat_number INTEGER UNIQUE,      
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,      
      created_on DATE NOT NULL,
      PRIMARY KEY (id, trip_id, user_id))`;
      await pgQuery(bookingCreateQuery)
  };
  


  /**
   * Drop User Table
   */
  const dropUserTable = async () => {
    const usersDropQuery = 'DROP TABLE IF EXISTS users';
    await pgQuery(usersDropQuery)
  };
  
  
  /**
   * Drop Bus Table
   */
  const dropBusTable = async () => {
    const busDropQuery = 'DROP TABLE IF EXISTS bus';
    await pgQuery(busDropQuery)
  };
  
  /**
   * Drop Trip Table
   */
  const dropTripTable = async () => {
    const tripDropQuery = 'DROP TABLE IF EXISTS trip';
    await pgQuery(tripDropQuery)

  };
  
  /**
   * Drop Bus Table
   */
  const dropBookingTable = async () => {
    const bookingDropQuery = 'DROP TABLE IF EXISTS booking';
    await pgQuery(bookingDropQuery)
  };
  
  
  /**
   * Create All Tables
   */
  const createAllTables = () => {
    createUserTable();
    createBusTable();
    createTripTable();
    createBookingTable();
  };
  
  
  /**
   * Drop All Tables
   */
  const dropAllTables = () => {
    dropUserTable();
    dropBusTable();
    dropTripTable();
    dropBookingTable();
  };
  
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
  
  
  export {
    createAllTables,
    dropAllTables,
  };
  
require('make-runnable');