module.exports = (app) => {

    const web = __dirname + '/web/'
    const css = web + '/css/'
    const js = web + '/js/'

    app.get(['/'], (req, res) => {
        if (req.originalUrl === '/') {
            res.sendFile(web + 'index.html')
            return
        }
        res.sendFile(web + req.path  + '.html')
    })

    app.get(['/', '/index', '*.html'], (req, res) => {
        res.sendFile(web + req.path + '.html')
    })


    app.get('*.css', (req, res) => {
        res.sendFile(css + req.path)
    })

    app.get('*.js', (req, res) => {
        res.sendFile(js + req.path)
    })

}