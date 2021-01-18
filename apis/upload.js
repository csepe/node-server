module.exports = app => {
    with (app) {

app.post("/api/upload", upload, (req, res) => {
    let url = "uploads/upload.zip"
    async function main() {
        try {
            await extract(url, { dir: __dirname })
            res.json({ msg: "Deploy complete" })
            console.log("Deploy complete")
        } catch (err) {
            res.json({ err: err })
            console.log(err)
        }
    }
    main()
})
}}