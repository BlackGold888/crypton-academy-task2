fs = require('fs');

async function readFile(fileName) {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile(fileName, 'utf8', function (err, data) {
                if (err) {
                    reject(err)
                }

                let users = data.split("\r\n");
                let temp = users.reduce((previousValue, currentValue) => {
                    if (currentValue.length) {
                        let temp = currentValue.split(" ");
                        console.log(temp)
                        return [...previousValue,{
                            name: temp[0],
                            requestPerHour: temp[1],
                            totalHours: temp[2],
                            info: temp.slice(3,).toString().split(',').join(' ')
                        }]
                    }
                    return [...previousValue];
                }, [])
                let result = temp.reduce((previousValue, currentValue) => {
                    let temp = previousValue.find(user => user.name === currentValue.name)
                    if (temp) {
                        temp.requestPerHour = +temp.requestPerHour + +currentValue.requestPerHour;
                        temp.totalHours = +temp.totalHours + +currentValue.totalHours;
                        return [...previousValue]
                    }else{
                        return [...previousValue, {...currentValue}];
                    }
                }, [])

                resolve(result)
            });
        } catch (e) {
            console.log(e);
        }
    });
}

function writeFile(fileName, data) {
    data = data.sort((a, b) =>
    {
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
    });
    let res = data.reduce((prev, cur) => {
        return prev + `${cur.name} ${cur.requestPerHour} ${cur.totalHours} ${cur.info}\r\n`;
    },"");

    fs.writeFile(fileName, `${res}`, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('\x1b[32m%s\x1b[0m', '[TASK 2] Successfully done');
    });
}

(async function () {
    let data = await readFile('users.txt');
    writeFile('outUser.txt', data);
})();