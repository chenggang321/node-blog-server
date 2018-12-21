import consola from 'consola'
import mongoose from 'mongoose'
import {MONGODB} from '../config/app.config'

// 去除弃用警告
mongoose.set('useFindAndModify',false)

// mongoose Promise
mongoose.Promise = global.Promise

// mongoose
exports.mongoose = mongoose

// connect
exports.connect = () => {
    // 连接数据库
    mongoose.connect(MONGODB.uri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        promiseLibrary: global.Promise
    })
    // 连接错误
    mongoose.connection.on('error', error => {
        consola.warn('数据库连接失败!', error)
    })
    // 连接成功
    mongoose.connection.once('open', () => {
        consola.ready('数据库连接成功!')
    })
    // 返回实例
    return mongoose
}

