import {mongoose} from '../utils/mongodb'
import autoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema
const categorySchema = new Schema({
    // 分类名称
    name: {
        type: String,
        require: true,
        validate: /\S+/
    },
    // 分类描述
    desc: {
        type: String,
        default: ''
    },
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
categorySchema.plugin(autoIncrement.plugin,{
    model:'Category',
    field:'id',
    startAt:1,
    incrementBy: 1
})

export default mongoose.model('Category',categorySchema)