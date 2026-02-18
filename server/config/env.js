import { config } from "dotenv";
import  env from "env-var";
import express  from "express";

 const envs ={
    PORT: env.get('PORT').required().asPortNumber(),
    HOST: env.get('HOST').default('localhost').asString(),
    DB_DATA: get('DB_DATA').required().asString(),
    DB_USER: get('DB_USER').default('root').asString(),
    DB_PASS: get('DB_PASS').default('').asString()
} 

module.exports = {
    envs
};