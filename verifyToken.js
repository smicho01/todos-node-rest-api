/**
 *  Author: Seweryn Michota
 *  Date: February 2022
 */
const jsonwebtoken = require('jsonwebtoken')
const dotenv = require('dotenv')
const jwt_decode = require('jwt-decode')
const {Token, TokenDecoded} = require('./utils/Token')

const Logger = require('./utils/Logger');
const LOGGER = new Logger();

function authUser (req, res, next) {
    const tokenString = req.header('Authorization');
    const baseUrl = req.baseUrl
    if(!tokenString) {
        LOGGER.log("Access denied on base URL : " + baseUrl  , req)
        return res.status(401).send({message: "Access denied"});
    }

    const jwtToken = Token(req)
    
    try {
        const verified = jsonwebtoken.verify(jwtToken, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    } catch(err) {
        LOGGER.log("Invalid token on base URL : " + baseUrl  , req)
        return res.status(401).send({message: "Invalid token"});
    }
}

function authRole(role) {

    return (req, res, next) => {

        const tokenDecoded = TokenDecoded(req);
        const userRoles = tokenDecoded.user_roles;

        const baseUrl = req.baseUrl

        if(!userRoles.includes(role)) {
            LOGGER.log("Invalid user role on base URL : " + baseUrl  , req)
            return res.status(401).send({message: "No permission to resource. Need role: " + role})
        }
        next()
    }
}

function authOwner(entityOwnerId, req) {
        // Check if user is and admin
        const tokenDecoded = TokenDecoded(req);
        const userRoles = tokenDecoded.user_roles;

        const baseUrl = req.baseUrl

        LOGGER.log("Authorizing owner: (" + tokenDecoded.user_id + ") access for entity id: " + entityOwnerId , req)

        if(userRoles.includes("admin") || entityOwnerId === tokenDecoded.user_id) {
            return true
        }
        LOGGER.log("Unauthorized resource owner on base URL : " + baseUrl  , req)
        return false
}

function getAuthUserId(req) {
    const tokenDecoded = TokenDecoded(req);
    return tokenDecoded.user_id
}

module.exports =  { authUser,  authRole , authOwner, getAuthUserId }