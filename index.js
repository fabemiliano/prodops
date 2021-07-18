const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')
const puppeteer = require('puppeteer')
require('dotenv').config();

app.use(bodyParser.json())

const createPdf = async (template) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const options = {
    path: `${__dirname}/certificate.pdf`,
    format: 'A4'
  }

  await page.goto(template)
  await page.pdf(options)

}

app.get('/', async (req, res, next) => {
  res.json({ teste: 'teste' })
})

app.get('/certificate', async (req, res, next) => {
  const { template, details: { nome, data, nomeCurso } } = req.body
  await createPdf(template);
  res.contentType("application/pdf");
  res.sendFile(path.join(__dirname, '/certificate.pdf'));
})

const { PORT } = process.env

app.listen(PORT, () => console.log(`escutando na porta ${PORT}`))