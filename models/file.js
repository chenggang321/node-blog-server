import {mongoose} from '../utils/mongodb'
import autoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema
const fileSchema = new Schema({
    id:{type:String,require:true},
    destination:{type:String,require:true}, // 文件路径
    original_name:{type:String,require:true}, // 文件原始名称
    filename:{type:String,require:true},// 文件生成名称
    path:{type:String,require:true},// 文件生成路径
    mime_type:{type:String,require:true},// 文件类型
    create_time:{type:Number,default:new Date().getTime()}
})

// 自增ID插件配置
autoIncrement.initialize(mongoose.connection)
fileSchema.plugin(autoIncrement.plugin,{
    model:'File',
    field:'id',
    startAt:1,
    incrementBy: 1
})

export default mongoose.model('File',fileSchema);