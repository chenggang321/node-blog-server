import {mongoose} from '../utils/mongodb'
import autoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema
const chatSchema = new Schema({
    id:{type:String,require:true},
    from:{type:String,require:true},
    to:{type:String,require:true},
    read:{type:Boolean,require:true,default:false},
    content:{type:String,require:true,default:''},
    create_time:{type:Number,default:new Date().getTime()}
})

// 自增ID插件配置
autoIncrement.initialize(mongoose.connection)
chatSchema.plugin(autoIncrement.plugin,{
    model:'Chat',
    field:'id',
    startAt:1,
    incrementBy: 1
})

export default mongoose.model('Chat',chatSchema);