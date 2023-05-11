import fs from 'node:fs';
import { parse } from 'csv-parse';

const filePath = new URL('../assets/tasks.csv', import.meta.url)

const ReadCsvFiles = async() => { 
    let index = 1;
    const parser  =  fs.createReadStream(filePath)
    .pipe(parse ({
        delimiter : ","
    }));

    for await(const record of parser){
        if(index != 1) {
            let tasks = {title:record[0], description:record[1]};
            fetch('http://localhost:3331/tasks',{
            method:'POST',
            body: JSON.stringify(tasks),
            duplex:'half',
            headers: {
                "Content-Type": "application/json",
            },
            }).then(response => {
                return response.text()
            }).then(data => {
                console.log(data)
            })

        }
        index++
    }
}



(async () => {
    await ReadCsvFiles();
})()



