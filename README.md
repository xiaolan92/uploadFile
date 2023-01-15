人啊，不断的经历，不断的成长，随着经历的增多，人的性格也逐渐的沉稳一些。

------

很久之前就想抽点时间研究一下文件上传这一块的东西，作为一个前端开发，感叹前端这个领域实在太广了，东西多的学不完。好吧，废话不多说了，做一下笔记吧.

- 单图片上传,带预览图+上传进度(视频上传类似)

  ```
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>
  <body>
  <input type="file" name="f1" id="f1" accept="image/*,video/*">
  <div class="img-box"></div>
  <button type="button" id="btn-submit">上传文件</button>
  <script>
  
      const imgBox = document.getElementsByClassName('img-box')[0];
  
    // 上传进度
    function uploadPropress(event){
      if(event.lengthComputable){
        const completePercent = (event.loaded / event.total * 100).toFixed(2);
        console.log(completePercent);
  
      }
    }
    function ajax(url,fd){
     return new Promise((resolve,reject)=>{
       const xhr = new XMLHttpRequest();
       xhr.open("POST",url,true);
       xhr.onreadystatechange = function (){
         if(this.readyState === 4){
           resolve();
         }
       }
       xhr.upload.onprogress = uploadPropress;
       xhr.send(fd);
  
     })
    }
   async  function uploadFile (){
        const file = document.getElementById('f1').files[0];
        const formData = new FormData();
        formData.append('file',file)
        await ajax("http://localhost:8000/uploadFile/",formData);
       const img = document.createElement('img');
       img.src = window.URL.createObjectURL(file);
       img.onload = function (){
           window.URL.revokeObjectURL(this.url);
       }
       imgBox.appendChild(img);
    }
    document.getElementById('btn-submit').addEventListener('click',uploadFile);
  </script>
  
  </body>
  </html>
  
  ```

  

```
const express = require("express");
const mutilparty = require("multiparty");
const fs = require('fs');
const app = express();

const port = 8000;

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', ['mytoken','Content-Type']);

    if (req.method.toLowerCase() === 'options') {
        res.sendStatus(200);
    } else {
        next();
    }
    });

app.post("/uploadFile",function (req, res) {
    const form = new mutilparty.Form({
        uploadDir:'./uploads'
    })
    form.parse(req,function (err,fields,files){
        if(!err){
            const [file] = files.file;
            // 在根目录下手动创建uploads目录
            const uploadFilePath = "uploads/";
            fs.rename(file.path,uploadFilePath+file.originalFilename,function (err){
                if(err){
                    res.send("{'status':200, 'message': '上传失败！'}");
                }else{
                    res.send("{'status':200, 'message': '上传成功！'}");
                }
            });
        }

    })

})




app.listen(port);

```

------

- 多图片上传，上传进度

  ```
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>
  <body>
  <input type="file" name="f1" id="f1" accept="image/*,video/*" multiple>
  <button type="button" id="btn-submit">上传文件</button>
  <script>
  
  
    // 上传进度
    function uploadPropress(event){
      if(event.lengthComputable){
        const completePercent = (event.loaded / event.total * 100).toFixed(2);
        console.log(completePercent);
  
      }
    }
    function ajax(url,fd){
     return new Promise((resolve,reject)=>{
       const xhr = new XMLHttpRequest();
       xhr.open("POST",url,true);
       xhr.onreadystatechange = function (){
         if(this.readyState === 4){
           resolve();
         }
       }
       xhr.upload.onprogress = uploadPropress;
       xhr.send(fd);
  
     })
    }
   async  function uploadFile (){
        const file = document.getElementById('f1').files;
        const formData = new FormData();
        for (let i=0;i<file.length;i++){
            formData.append('file',file[i])
        }
  
        await ajax("http://localhost:8000/uploadFile/",formData);
        console.log("文件上传成功!")
    }
    document.getElementById('btn-submit').addEventListener('click',uploadFile);
  </script>
  
  </body>
  </html>
  
  ```

  ```
  const express = require("express");
  const mutilparty = require("multiparty");
  const fs = require('fs');
  const app = express();
  
  const port = 8000;
  
  app.all('*', function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header('Access-Control-Allow-Headers', ['mytoken','Content-Type']);
  
      if (req.method.toLowerCase() === 'options') {
          res.sendStatus(200);
      } else {
          next();
      }
      });
  
  app.post("/uploadFile",function (req, res) {
      const form = new mutilparty.Form({
          uploadDir:'./uploads'
      })
      form.parse(req,function (err,fields,files){
          if(!err){
              const [file] = files.file;
              // 在根目录下手动创建uploads目录
              const uploadFilePath = "uploads/";
              files.file.forEach(item =>{
                  fs.rename(item.path,uploadFilePath+item.originalFilename,function (err){
  
                  });
              })
              res.send("{'status':200, 'message': '上传成功！'}");
  
          }
  
      })
  
  })
  
  
  
  
  app.listen(port);
  
  ```

- 多图片上传(多预览)，多上传进度

  ```
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <style>
          #propress{
              height: 20px;
              width: 150px;
          }
          .red{
              display: inline-block;
              background: red;
          }
          .green{
           background: green;
          }
          .img-box img {
              width: 200px;
              height: 200px;
          }
      </style>
  </head>
  <body>
  <div>
      <input type="file" id="f1"  accept="image/*,video/*" multiple/>
      <div class="img-box"></div>
      <button type="button" id="btn-submit">上传文件</button>
  </div>
  <script>
      const imgBox = document.getElementsByClassName('img-box')[0];
      const willUploadFiles = [];
      document.getElementById('f1').addEventListener('change',function (e){
          const fileList = document.getElementById('f1').files;
          for (let i=0;i<fileList.length;i++){
              const file = fileList[i];
              const img = document.createElement('img');
              const div = document.createElement('div');
              const propress = document.createElement('div');
              propress.className='propress';
              propress.innerHTML = '<span class="red"></span><button type="button">停止上传</button>';
              div.className='item';
              img.src = window.URL.createObjectURL(file);
              img.onload = function (){
                  window.URL.revokeObjectURL(this.url);
              }
  
              div.appendChild(img);
              div.appendChild(propress);
              imgBox.appendChild(div);
              willUploadFiles.push({
                  file,
                  div,
                  propress
              });
          }
      })
  
      function onUpload ({file,propress}){
          const propressSpan =propress.firstElementChild;
          const buttonCancel = propress.getElementsByTagName('button')[0];
          const abortFn = function (){
              if(xhr && xhr.readyState !==4){
                  xhr.abort();
              }
          }
          buttonCancel.removeEventListener('click',abortFn);
          buttonCancel.addEventListener('click',abortFn);
          propressSpan.style.width='0';
          propressSpan.classList.remove('green');
  
  
  
          // 上传进度
          function updatePropress(event){
              if(event.lengthComputable){
                  const completePercent = (event.loaded / event.total * 100).toFixed(2);
                  propressSpan.style.width = completePercent + '%';
                  propressSpan.innerHTML = completePercent + '%';
                  if(completePercent > 90){
                      propressSpan.classList.add('green');
                  }
                  if(completePercent>=100){
                      xhr.uploaded = true;
                  }
  
              }
          }
          const formData = new FormData();
  
          formData.append('file',file);
          const xhr = new XMLHttpRequest();
          xhr.open('POST','http://localhost:8000/uploadFile',true);
          xhr.onreadystatechange = function (){
              if(this.readyState ===4 && this.upload){
                  console.log('上传成功')
              }
          }
          xhr.upload.onprogress = updatePropress;
          xhr.send(formData);
          return xhr;
  
  
  
      }
  
      function mutilFile (){
          willUploadFiles.forEach(item=>{
              onUpload ({
                  file:item.file,
                  propress:item.propress
              })
          })
  
      }
  
      document.getElementById('btn-submit').addEventListener('click',mutilFile);
  
  
  </script>
  
  </body>
  </html>
  
  ```

  ```
  const express = require("express");
  const mutilparty = require("multiparty");
  const fs = require('fs');
  const app = express();
  
  const port = 8000;
  
  app.all('*', function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header('Access-Control-Allow-Headers', ['mytoken','Content-Type']);
  
      if (req.method.toLowerCase() === 'options') {
          res.sendStatus(200);
      } else {
          next();
      }
      });
  
  app.post("/uploadFile",function (req, res) {
      const form = new mutilparty.Form({
          uploadDir:'./uploads'
      })
      form.parse(req,function (err,fields,files){
          if(!err){
              const [file] = files.file;
              // 在根目录下手动创建uploads目录
              const uploadFilePath = "uploads/";
              files.file.forEach(item =>{
                  fs.rename(item.path,uploadFilePath+item.originalFilename,function (err){
  
                  });
              })
              res.send("{'status':200, 'message': '上传成功！'}");
  
          }
  
      })
  
  })
  
  
  
  
  app.listen(port);
  
  ```

  ------

  - 分片上传(带上传进度)  原理:利用bolb.slice 对图片/视频进行分割，然后上传完之后发送合并请求.

    ```
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
    <input type="file" id="f1" name="file">
    <div id="totalPercent">0</div>
    <button type="button" id="btn-submit">上传文件</button>
    <script>
        function UploadFile (){
            // 大小限制为2M
            const chunkSize = 2*1024*1024;
            const file = document.getElementById('f1').files[0];
            const chunks = [];
            const token  = (+ new Date());
            let name = file.name,
                 chunkCount = 0,
                sendChunkCount = 0;
            if(file.size > chunkSize){
                let start =0,
                      end = 0;
                while (true){
                    end+=chunkSize;
                    const blob = file.slice(start,end);
                    start+=chunkSize;
    
                    if(!blob.size){
                        break;
    
                    }
                    chunks.push(blob)
                }
    
            }else{
                chunks.push(file.slice(0))
            }
            chunkCount = chunks.length;
    
            for (let i=0;i<chunkCount;i++){
                const formData= new FormData();
                formData.append('token',token);
                formData.append('file',chunks[i]);
                formData.append('index',i);
                xhrSend(formData,function (){
                    sendChunkCount +=1;
                    // 发送合并请求
                    if(sendChunkCount===chunkCount){
                        const mergeFormData = new FormData();
                        mergeFormData.append('type','merge');
                        mergeFormData.append('token',token);
                        mergeFormData.append('chunkCount',chunkCount);
                        mergeFormData.append('fileName',name);
                        xhrSend(mergeFormData);
    
                    }
                },i)
    
            }
            const uploadpercentArr = [];
            const elPropress =  document.getElementById('totalPercent')
    
            function xhrSend (fd,fn,i){
                // 上传进度
                function updatePropress(event){
                    if(event.lengthComputable){
                        const completePercent = (event.loaded / event.total).toFixed(2);
                        if(i !==undefined){
                            uploadpercentArr[i] = completePercent;
                            // 总的上传分片进度
                            let totalUpload= uploadpercentArr.map((item,index) => item * chunks[index].size).reduce((a,b)=>a+b);
                            elPropress.innerHTML = (totalUpload / file.size* 100 ).toFixed(2) +'%';
    
                        }
    
    
                    }
                }
                const xhr = new XMLHttpRequest();
                xhr.open("POST","http://localhost:8000/uploads/",true);
                xhr.onreadystatechange = function (){
                    if(this.readyState === 4){
                        fn?.();
                    }
                }
                xhr.upload.onprogress = updatePropress;
                xhr.send(fd);
    
    
            }
        }
        document.getElementById('btn-submit').addEventListener('click',UploadFile)
    
    </script>
    
    </body>
    </html>
    
    ```

    ```
    const express = require("express");
    const mutilparty = require("multiparty");
    const fs = require('fs');
    const app = express();
    
    
    
    const port = 8000;
    app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header('Access-Control-Allow-Headers', ['mytoken','Content-Type']);
        if (req.method.toLowerCase() === 'options') {
            res.sendStatus(200);
        } else {
            next();
        }
    });
    
    
    app.post('/uploads',function (req, res){
        const form = new mutilparty.Form({
            uploadDir:'./uploads'
        })
        form.parse(req,function (err,fields,files){
            if(!err){
                if(fields.type){
    
                    const [fileName] = fields.fileName;
                    const [chunkCount] = fields.chunkCount;
                    const writeStream = fs.createWriteStream(`./uploads/${fileName}`);
    
    
                    let cindex=0;
                    //合并文件
                    function fnMergeFile(){
                        const fname = `./uploads/video-${cindex}`;
                        const readStream = fs.createReadStream(fname);
                        readStream.pipe(writeStream, { end: false });
                        readStream.on("end", function () {
                            fs.unlink(fname, function (err) {
                                if (err) {
                                    throw err;
                                }
                            });
                            if (cindex+1 < chunkCount){
                                cindex += 1;
                                fnMergeFile();
                            }
                        });
                    }
                    fnMergeFile();
                    res.send("{'status':200, 'message': '上传成功！'}");
    
                }else{
                    const [file] = files.file;
                    const [index] = fields.index;
                    fs.rename(file.path,"./uploads/video-"+index,function (err){
                        if(err){
                            // res.writeHead(200,{'content-Type':'text/plain;charset=uft-8'});
                            res.send("{'status':200, 'message': '上传失败！'}");
                        }else{
                            // res.writeHead(200,{'content-Type':'text/plain;charset=uft-8'});
                            res.send("{'status':200, 'message': '上传成功！'}");
                        }
                    });
                }
    
            }
    
    
        });
    })
    app.listen(port)
    
    ```

    

    
