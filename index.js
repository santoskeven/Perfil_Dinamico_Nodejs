const fs = require('fs')
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const porta = 3000;

let userG;

const app = express();

const hbs = exphbs.create({
    partialsDir: ['views/partials']
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.static('public'));

app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(express.json())

app.get('/user', (req, res) => {

    res.render('user')

})

app.post('/acess/user', (req, res) => {

    const user = req.body.user
    userG = user

     if(!ChecKAccounts(user)){
        return res.render('home')
    }

    DefinirConta(user)

    const AccountData = PegarConta(user)

    if(!fs.existsSync(`./views/users/check.json`)){
        fs.writeFileSync('./views/users/check.json',`{"check": "${user}"}`)
    }else{
        fs.writeFileSync('./views/users/check.json',`{"check": "${user}"}`)
    }


    const valores = {
        nome: AccountData.nome,
        idade: AccountData.idade,
        biografia: AccountData.biografia,
        hobbies: AccountData.hobbies
    }

    res.render(`user`, {valores})
})

app.get('/perfil/editar', (req, res) => {

    const user = PegarConta('check')

    const AccountData = PegarConta(user.check)

    const valores = {
        nome: AccountData.nome,
        idade: AccountData.idade,
        biografia: AccountData.biografia,
        hobbies: AccountData.hobbies,
        user: AccountData.userbase
    }

    // console.log(valores)

    res.render('editarPerfil', {valores})

})

app.post('/perfil/editado', (req, res) => {

    const user = req.body.user

    const AccountData = PegarConta(user)

     AccountData.nome = req.body.nome;
     AccountData.idade = req.body.idade;
     AccountData.biografia = req.body.biografia;
     AccountData.hobbies = req.body.hobbies;

     const valores = {
        nome: AccountData.nome,
        idade: AccountData.idade,
        biografia: AccountData.biografia,
        hobbies: AccountData.hobbies,
        user: AccountData.userbase
    }

    fs.writeFileSync(`./views/users/${valores.user}.json`,
        JSON.stringify(AccountData),
        function(err){console.log(err)}
    )

    res.render('user', {valores})
})

app.get('/', (req, res) => {

    res.render('home')

})

function DefinirConta(conta){
    console.log('pass')
    const user = PegarConta(conta)
    user.userbase = conta
    fs.writeFileSync(`./views/users/${conta}.json`, 
        JSON.stringify(user),
        (err)=>{console.log(err)}
    )
    console.log(user)
     console.log('user definido com sucesso')
}

function ChecKAccounts(NomeConta){
    if(!fs.existsSync(`./views/users/${NomeConta}.json`)){
        console.log('A conta não existe')
        return false
    }
    return true

}

function PegarConta(NomeConta){
    const NomeJson = fs.readFileSync(`./views/users/${NomeConta}.json`)
    return JSON.parse(NomeJson)
}

app.listen(porta, () => {
    console.log(`servidor rodando na porta ${porta}`)
})