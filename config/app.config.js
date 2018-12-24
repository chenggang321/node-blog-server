import path from 'path'
import argv from 'yargs'

export const APP = {
    host:'localhost',
    port:'8081',
}

export const MONGODB = {
    uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/blogDb`,
    username: argv.db_username || 'DB_username',
    password: argv.db_password || 'DB_password',
}

export const MD5_SUFFIX = '1129137164@qq.com*#@!%#'

export const CODE = {
    OK:200,
    ERR:201
}