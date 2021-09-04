const express = require("express")
const https = require("https")
const request = require("request")
const bodyParser = require("body-parser")
require('dotenv').config()

const port = 3700

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})


app.post("/", (req, res) => {

    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email

    console.log(firstName, lastName, email)

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = process.env.url

    const option = {
        method: "POST",
        auth: process.env.auth
    }

    const request = https.request(url, option, (response) => {

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
    })

    request.write(jsonData)
    request.end()

})

app.post("/success", (req, res) => {
    res.redirect("/")
})

app.post("/failure", (req, res) => {
    res.redirect("/")
})

app.listen(process.env.PORT || port, () => {
    console.log(`Server started at port no. : ${port}`);
})

// const mailChimpApiKey = "359dd7740e7605b4c06eb272f0d31101-us5"
// const audience_id ="c05a3257c0"