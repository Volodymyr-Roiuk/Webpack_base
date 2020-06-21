async function start() {
   return await Promise.resolve('async is working')
}


class Util {
    static id = Date.now(); 
}


start().then(console.log)

console.log('Util id: ', Util.id);

const unused = 42;

import('lodash').then(_ => { // Лейзі лоадінг або динамічний імпорт, підгружає бібліотеку лодаш окремим чанком
    console.log(_.random(0, 42, true));
})