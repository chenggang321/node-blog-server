import {register} from './user'

export default (app)=>{
    // user
    app.post('/register',register)
}