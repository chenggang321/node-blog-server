import {mongoose} from '../utils/mongodb'
import autoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema
const timeAxisSchema = new Schema({
    // 标题
    title: {type: String, require: true},

    // 时间轴内容
    content: {type: String, require: true},

    // 状态（已完成：1，正在进行：2，没完成：3）
    state: {type: Number, default: 1},

    // 创建日期
    create_time: {type: Date, default: Date.now()},

    // 结束日期
    end_time: {type: Date, default: Date.now()},

    // 修改日期
    update_time: {type: Date, default: Date.now()}
})

// 自增ID插件配置
autoIncrement.initialize(mongoose.connection)
timeAxisSchema.plugin(autoIncrement.plugin, {
    model: 'TimeAxis',
    field: 'id',
    startAt: 1,
    incrementBy: 1
})

export default mongoose.model('TimeAxis', timeAxisSchema)