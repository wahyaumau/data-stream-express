import express from "express";
import { db } from "./db";
const Cursor = require('pg-cursor');

const modifyData = (data: any[]) => {
    const newData = data.map((dataItem) => {
        if(dataItem.price > 1000){
            dataItem.expensive = true;
        }
        return dataItem;
    });
    return newData.map((dataItem) => `${JSON.stringify(dataItem)}`).join();
}

const app = express();
app.get('/api/query', async (req, res) => {
    const batchSize = 1000;
    const conn = await db.connect();
    const cursor = conn.client.query(new Cursor('SELECT * FROM book limit 500000')) as any;
    let rows: any[];
    try{
        rows = await cursor.read(batchSize);
    }catch(error){
        console.error(error);
        conn.done();
        return res.status(500).json("internal server error");
    }
    res.setHeader('Content-Type', 'application/json');
    res.flushHeaders();
    res.write('[');
    res.write(modifyData(rows));
    while(rows.length){
        rows = await cursor.read(batchSize);
        if(rows.length){
            res.write(',');
            res.write(modifyData(rows));
        }
    }
    cursor.close(() => conn.done());
    res.write(']');
    res.end();
});

app.get('/api/stream', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.flushHeaders();
    res.write('[');
    for(let i = 1; i <= 100_000; i++){
        res.write(JSON.stringify(`data ${i}`));
        if(i+1 <= 100_000){
            res.write(",");
        }
    }
    res.write(']');
    res.end();
});

const main = async() => {
    app.listen(3000, () => console.log("listening"));
}

main();