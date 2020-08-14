const fs = require('fs');
const path = require('path');


// 同步 串行 删除目录  先序
function rmdirSync(dir) {
    let statObj = fs.statSync(dir);
    if (statObj.isDirectory()) {
        // 删除的是文件夹
        let dirs = fs.readdirSync(dir);
        dirs.forEach(d => rmdirSync(path.join(dir, d)))
        fs.rmdirSync(dir);
    } else {
        // 删除的是文件
        fs.unlinkSync(dir);
    }
}
// rmdirSync('a');

// 异步 串行 删除
function rmdir(dir, cb) {
    fs.stat(dir, (err, statObj) => {
        if (statObj.isDirectory()) {
            fs.readdir(dir, (err, dirs) => {
                // 获取当前目录下的所有目录的集合
                dirs = dirs.map(item => path.join(dir, item));

                let index = 0;
                function next() {
                    if (index === dirs.length) {
                        return fs.rmdir(dir, cb);
                    }
                    let current = dirs[index++];
                    rmdir(current, next);
                }
                next()

            })
        } else {
            fs.unlink(dir, cb);
        }
    })
}
// rmdir('a', (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("删除成功");
//     }

// })

// 异步、并行 删除
function rmdir(p, cb) {
    fs.stat(p, (err, statObj) => {
        if (statObj.isDirectory()) {
            fs.readdir(p, (err, dirs) => {
                dirs = dirs.map(item => path.join(p, item));
                // 假如没有子目录就直接删除
                if (dirs.length === 0) {
                    return fs.rmdir(p, cb);
                }
                let index = 0;
                function done() {
                    if (++index == dirs.length) {
                        fs.rmdir(p, cb);
                    }
                }
                for (let i = 0; i < dirs.length; i++) { // 并发删除子目录
                    let dir = dirs[i];
                    rmdir(dir, done);
                }
            })
        } else {
            fs.unlink(dir, cb);
        }
    })
}
rmdir('a', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("删除成功");
    }
})