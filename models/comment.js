import {mongoose} from '../utils/mongodb'
import autoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema
const commentSchema = new Schema({
    // 评论所在文章id
    article_id: {type: Schema.Types.ObjectId, require: true},

    // content
    content: {type: String, require: true, validate: /\S+/},

    // 是否置顶
    is_top: {type: Boolean, default: false},

    // 被赞数
    likes: {type: Number, default: 0},

    // 用户id
    user_id: {type: Schema.Types.ObjectId, ref: 'User', require: true},

    // 父评论的用户信息
    user: {
        // 用户id
        user_id: {type: Schema.Types.ObjectId},

        // 名字
        name: {type: String, require: true, default: ''},

        // 用户类型 管理员：0，用户：1
        type: {type: Number, default: 1},

        // 头像
        avatar: {type: String, default: 'user'}
    },

    // 第三者评论
    other_comments: [
        {
            // 评论人
            user: {
                user_id: {type: Schema.Types.ObjectId},

                // 名字
                name: {type: String, required: true, default: ''},

                // 用户类型 管理员：0，用户：1
                type: {type: Number, default: 1},

                // 头像
                avatar: {type: String, default: 'user'}
            },
            // 被评论者
            to_user: {
                user_id: {type: Schema.Types.ObjectId},

                // 名字
                name: {type: String, required: true, default: ''},

                // 用户类型 管理员：0，用户：1
                type: {type: Number, default: 1},

                // 头像
                avatar: {type: String, default: 'user'}
            },
            likes: {type: Number, default: 0},

            // content
            content: {type: String, required: true, validate: /\S+/},

            // 状态 (待审核:0, 通过正常:1,已删除:-1,垃圾评论:-2 )
            state: {type: Number, default: 1},

            // 创建日期
            create_time: {type: Date, default: Date.now()}
        }
    ],
    // 状态 (待审核:0, 通过正常:1,已删除:-1,垃圾评论:-2 )
    state: {type: Number, default: 1},

    // 创建日期
    create_time: {type: Date, default: Date.now()},

    // 修改日期
    update_time: {type: Date, default: Date.now()}
})

// 自增ID插件配置
autoIncrement.initialize(mongoose.connection)
commentSchema.plugin(autoIncrement.plugin, {
    model: 'Comment',
    field: 'id',
    startAt: 1,
    incrementBy: 1
})

export default mongoose.model('Comment', commentSchema)