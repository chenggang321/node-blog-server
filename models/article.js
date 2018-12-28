import {mongoose} from '../utils/mongodb'
import autoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema
const articleSchema = new Schema({
    // 标题
    title: {type: String, require: true, validate: /\S+/},

    // 文章关键字（SEO）
    keyword: {type: String, default: ''},

    // 作者
    author: {type: String, require: true, validate: /\S+/},

    // 文章描述
    desc: {type: String, require: true, validate: /\S+/},

    // 字数
    numbers: {type: Number, default: 0},

    // 封面
    img_url: {type: String, default: ''},

    // 文章类型（普通文章：1，简历：2，管理员介绍：3）
    type: {type: Number, default: 0},

    // 文章发布状态（草稿：0，已发布：1）
    state: {type: Number, default: 0},

    // 文章转载状态（原创：0，转载：1，混合：2）
    origin: {type: Number, default: 0},

    // 文章标签
    tags: [{type: Schema.Types.ObjectId, ref: 'Tag', required: true}],

    comments: [{type: Schema.Types.ObjectId, ref: 'Comment', required: true}],

    // 文章分类
    category: [{type: Schema.Types.ObjectId, ref: 'Category', required: true}],

    // 文章内容
    content: {type: String, default: ''},

    // 点赞的用户
    like_users: [
        {
            // 用户id
            id: { type: Schema.Types.ObjectId },

            // 名字
            name: { type: String, required: true, default: '' },

            // 用户类型(管理员：0，用户：1)
            type: { type: Number, default: 1 },

            // 个人介绍
            introduce: { type: String, default: '' },

            // 头像
            avatar: { type: String, default: 'user' },

            // 创建日期
            create_time: { type: Date, default: Date.now() },
        }
    ],

    // 其他元信息
    meta: {
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
    },

    // 创建日期
    create_time: {type: Date, default: Date.now()},

    // 修改日期
    update_time: {type: Date, default: Date.now()}
})

// 自增ID插件配置
autoIncrement.initialize(mongoose.connection)
articleSchema.plugin(autoIncrement.plugin, {
    model: 'Article',
    field: 'id',
    startAt: 1,
    incrementBy: 1
})

export default mongoose.model('Article', articleSchema)