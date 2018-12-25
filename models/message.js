import {mongoose} from '../utils/mongodb'
import autoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema
const messageSchema = new Schema({
    // 用户 id
    user_id: {type: String, default: ''},

    // 姓名
    name: {type: String, default: ''},

    // 头像
    avatar: {type: String, default: 'user'},

    // 电话
    phone: {type: String, default: ''},

    // 留言内容
    content: {type: String, required: true},

    // 回复留言内容
    reply_list: [
        {
            content: {type: String, required: true}
        }
    ],

    // 邮箱
    email: {type: String, default: ''},

    // 状态(未处理：0，已处理：1)
    state: {type: Number, default: 0},

    // 创建日期
    create_time: {type: Date, default: Date.now()},

    // 修改日期
    update_time: {type: Date, default: Date.now()}
})

// 自增ID插件配置
autoIncrement.initialize(mongoose.connection)
messageSchema.plugin(autoIncrement.plugin, {
    model: 'Message',
    field: 'id',
    startAt: 1,
    incrementBy: 1
})

export default mongoose.model('Message', messageSchema)