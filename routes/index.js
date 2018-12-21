const helloWorld = (req,res) => {
    res.json('hello world!');
}

module.exports = app => {
    app.get('/',helloWorld);
}