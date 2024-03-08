require('dotenv').config()
const express = require('express');
const http = require('http');
const { getQuotations } = require('./db-access.js');
const { parse } = require('path');

const PORT = process.env.PORT;
const FILE_STORAGE_HOST = process.env.FILE_STORAGE_HOST;
const FILE_STORAGE_PORT = parseInt(process.env.FILE_STORAGE_PORT);

const app = express();

app.get("/image", async (req, res) => {
    const imagePath = req.query.path;
    console.log(`Image service is called for ${imagePath}`);
    const forwardRequest = http.request({
        host: FILE_STORAGE_HOST,
        port: FILE_STORAGE_PORT,
        path: `/image?path=${imagePath}`,
        method: 'GET',
        headers: req.headers
    }, 
    forwardResponse => {
        res.writeHead(forwardResponse.statusCode, forwardResponse.headers);
        forwardResponse.pipe(res);
    });
    console.log(`url: ${FILE_STORAGE_HOST}:${FILE_STORAGE_PORT}/image?path=${imagePath}`);
    req.pipe(forwardRequest);
});

app.get('/quotation', async (req, res) => {
    console.log('Quotation service is called');
    let quotations = await getQuotations();
    res.status(200).json(quotations);
});

app.listen(PORT, () => {
    console.log(`Quotation service is running on port ${PORT}`);
});