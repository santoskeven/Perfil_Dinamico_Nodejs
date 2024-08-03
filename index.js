const fs = require('fs')
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const porta = 3000;

const UserFile = path.join('./users')

const app = express();

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(express.json())

app.get('/user', (req, res) => {

    console.log(req.params)

    // const nome = w
    // const idade = w
    // const biografia = w
    // const hobbies = sd

    res.render('user', {})

})

app.post('/acess/user', (req, res) => {

    const user = req.body.user

     if(!ChecKAccounts(user)){
        return res.render('home')
    }

    const AccountData = PegarConta(user)

    const valores = {
        nome: AccountData.nome,
        idade: AccountData.idade,
        biografia: AccountData.biografia,
        hobbies: AccountData.hobbies
    }

    res.render(`user`, {valores})
})

app.get('/', (req, res) => {

    res.render('home')

})

app.listen(porta, () => {
    console.log(`servidor rodando na porta ${porta}`)
})

function ChecKAccounts(NomeConta){
    console.log(NomeConta)
    if(!fs.existsSync(`./views/users/${NomeConta}.json`)){
        console.log('A conta não existe')
        return false
    }else{
        console.log('conta encontrada com sucesso!!')
        return true
    }
}

function PegarConta(NomeConta){
    const NomeJson = fs.readFileSync(`./views/users/${NomeConta}.json`)
    return JSON.parse(NomeJson)
}