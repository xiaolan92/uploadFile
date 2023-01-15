self.importScripts("./spark-md5.js");
self.onmessage = e => {
    const { fileChunksList } = e.data;
    const spark = new self.SparkMD5.ArrayBuffer();
    // 进度
    let percent = 0;
    // 数量
    let count = 0;

    const loadNext = index =>{
        const reader = new FileReader();
        reader.readAsArrayBuffer(fileChunksList[index]);
        reader.onload = e =>{
            count += 1;
            spark.append(e.target.result);
            if(count === fileChunksList.length){
                self.postMessage({
                    percent:100,
                    hash:spark.end()
                })
                self.close();
            }else{
                percent += 100 / fileChunksList.length;
                self.postMessage({
                    percent
                });
                loadNext(count)
            }
        }
    }
    loadNext(0);
}
