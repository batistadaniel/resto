// const express = require('express');
// const mysql = require('mysql2');
// const app = express();
// const port = 3000;

// app.use(express.json());

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'senac',
//     database: 'digipass_db'

// });
// app.get('/usuarios', (req,res) =>{
//     connection.query('SELECT * FROM usuarios', (err, results ) => {
//         if (err){
//             res.status(500).send('Erro ao buscar usuarios');
//         };
//         res.json(results);
//     });
// });
// app.post('/usuarios', (req, res) => {
//     const { nome } = req.body;
//     connection.query('INSERT INTO usuarios (nome) VALUES (?)', [nome], (err, results) => {
//         if (err) {
//             res.status(500).send("Erro ao criar usuário");
//             return;
//         }
//         res.send(`Usuário ${nome} criado com sucesso!`);
//     });
// });
// app.post('/usuarios/:id', (req, res) => {
//     const { id } = req.params;
//     const { nome } = req.body;
//     connection.query('UPDATE usuarios SET nome = ? WHERE id = ?', [nome, id], (err, results) => {
//         if (err) {
//             res.status(500).send("Erro ao atualizar usuário");
//             return;
//         }
//         res.send(`Usuário ${id} atualizado com sucesso!`);
//     });
// });
// app.put('/usuarios/:id', (req, res) => {
//     const { id } = req.params;
//     const { nome } = req.body;
//     connection.query('UPDATE usuarios SET nome = ? WHERE id = ?', [nome, id], (err, results) => {
//         if (err) {
//             res.status(500).send("Erro ao atualizar usuário");
//             return;
//         }
//         res.send(`Usuário ${id} atualizado com sucesso!`);
//     });
// });

// app.listen(port, () => {
//     console.log(`Servidor rodando em http://localhost:${port}`);
// });


const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3020;

app.use(cors());
app.use(bodyParser.json());

const digipass_db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senac', 
    database: 'digipass_db'
    // port: 3306
});

digipass_db.connect((err) => {
    if (err) {
        console.log('erro ao conectar ao database' + err.stack);
        return;
    }
    console.log('Conexão bem-sucedida com o database');
});

app.post('/Cadastro', (req, res) => {
    console.log('Dados recebidos:', req.body);
    const { nome , email , senha_hash} = req.body;

    if (!nome || !email || !senha_hash) {
        return res.status(400).json({
            message: 'Preencha todos os campos!'
        });
    }



    // const queryCPF = 'SELECT * FROM tb_usuarios WHERE cpf = ?';
    // digipass_db.query(queryCPF , [cpf] , (err,result) => {
    //     if(err){
    //         console.log('Erro ao verificar CPF' ,err);
    //         return res.status(500).json({
    //             message : 'ocorreu um erro interno no sistema'
    //         });
    //     }
    //     if(result.length > 0){
    //         return res.status(400).json({
    //             message: 'CPF já cadastrado!'
    //         });
    //     }


    const queryEmail = 'SELECT * FROM usuarios WHERE email = ?';
    digipass_db.query(queryEmail , [email] , (err,results) => {
        if(err){
            console.log('Erro ao verificar email' ,err);
            return res.status(500).json({
                message : 'ocorreu um erro interno no sistema'
            });
        }
        if(results.length > 0){
            return res.status(400).json({
                message: 'email já cadastrado!'
            });
        }
        

        
    const query = 'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)';
    digipass_db.execute(query, [nome, email , senha_hash ], (err, result) => {
        if(err){
            console.log('erro ao cadastrar usuario' ,err);
            return res.status(500).json({
                message : 'ocorreu um erro interno no sistema'
            });
        }
        res.status(200).json({
            message : 'usuario cadastrado com sucesso'
        });
    });
    });
    });
// });


app.post('/Login' , (req,res) => {

    const { email, senha_hash } = req.body;

    if(!email || !senha_hash) {
        return res.status(400).json({
            message : 'preencha todos os camposs'
        });
    }

    const query = 'SELECT * FROM usuarios WHERE email = ?';
    digipass_db.query(query, [email ] , (err, result) =>{
        if(err){
            console.log('Erro ao consultar o banco de dados' , err);
            return res.status(404).json({
                message : 'erro interno'
            });
        }

        if(result.length === 0){
            return res.status(404).json({
                message : 'email ou senha estao incorretos'
            });
        }
        
        const user = result[0];
        if(user.senha_hash === senha_hash){
            return res.status(200).json({
                message : 'Login efetuado com sucesso',
                user : user,
            });
        }

        else{
            return res.status(404).json({
                message : 'email ou senha estao incorretos'
            });
        }
    });

});



app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});