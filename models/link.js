import {mongoose} from '../utils/mongodb'
import autoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema
const linkSchema = new Schema({
    // 链接名称
    name: {type: String, require: true, validate: /\S+/},

    // 链接描述
    desc: {type: String, default: ''},

    // 链接 url
    url: {type: String, require: true, validate: /\S+/, default: ''},

    // 图标
    icon: {type: String, default: ''},

    // 类型 (用户链接:1, 管理员链接:2)
    type: {type: Number, default: 1},

    // 状态（ 不向外展示：0，向外展示：1）
    state: {type: Number, default: 1},

    // 创建日期
    create_time: {type: Date, default: Date.now()},

    // 修改日期
    update_time: {type: Date, default: Date.now()}
})

// 自增ID插件配置
autoIncrement.initialize(mongoose.connection)
linkSchema.plugin(autoIncrement.plugin, {
    model: 'Link',
    field: 'id',
    startAt: 1,
    incrementBy: 1
})

export default mongoose.model('Link', linkSchema)