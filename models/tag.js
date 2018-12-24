import {mongoose} from '../utils/mongodb'
import autoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema
const tagSchema = new Schema({
    // 标签名称
    name: {
        type: String,
        require: true,
        validate: /\S+/
    },
    // 标签描述
    desc: String,
    // 图标
    icon: String,

    // 创建日期
    create_time: {
        type: Date,
        default: Date.now()
    },
    // 修改日期
    update_time: {
        type: Date,
        default: Date.now()
    }
})

// 自增ID插件配置
autoIncrement.initialize(mongoose.connection)
tagSchema.plugin(autoIncrement.plugin,{
    model:'Tag',
    field:'id',
    startAt:1,
    incrementBy: 1
})

export default mongoose.model('Tag',tagSchema)