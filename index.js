const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')
const puppeteer = require('puppeteer')
require('dotenv').config();

var Handlebars = require('handlebars');

app.use(bodyParser.urlencoded({ extended: true }));

const createPdf = async (template) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const options = {
    path: `${__dirname}/certificate.pdf`,
    format: 'A4'
  }
  await page.goto(template)
  await page.pdf(options)
  page.close()
}

app.get('/home', async (req, res, next) => {
  res.sendFile(`${__dirname}/form.html`)
})

let name;
let date;
let course;

app.post('/home', (req, res) => {
  const { nome, data, nomeCurso } = req.body
  name = nome;
  date = data;
  course = nomeCurso;
  res.redirect('/certificate');
})


app.get('/certificate', async (req, res, next) => {
  const source = `<h1>Certificado de Conclusão de Curso</h1>
                    <h2>{{course}}</h2>
                    <h3>{{name}}</h3>
                    <h4>{{date}}</h4>`;
  const template = Handlebars.compile(source);

  const data =
  {
    name,
    date,
    course,
  };
  const result = template(data);

  res.send(result)

  await createPdf('http://localhost:3000/certificate');
  res.contentType("application/pdf");
  res.sendFile(path.join(__dirname, '/certificate.pdf'));
  res.end();
})


const { PORT } = process.env


app.listen(PORT, () => console.log(`escutando na porta ${PORT}`))