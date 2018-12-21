import {mongoose} from '../utils/mongodb'
// import autoIncrement from 'mongoose-auto-increment'

const userSchema = new mongoose.Schema({
    // 账户
    username: {
        type: String,
        require: true,
        default: ''
    },
    // 密码
    password: {
        type: String,
        required: true,
        default:''
    },
    // 邮箱
    email:{
        type:String
    },
    // 用户类型： 0 管理员 1 普通用户
    type:{
        type: Number,
        default: 1
    },
    create_time: {
        type:Date,
        default:Date.now()
    },
    update_time:{
        type:Date,
        default:Date.now()
    }
})

// 自增ID插件配置
// userSchema.plugin(autoIncrement.plugin,{
//     model:'User',
//     field:'id',
//     startAt:1,
//     incrementBy: 1
// })

export default mongoose.model('User',userSchema);