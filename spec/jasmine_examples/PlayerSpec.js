var FormData = require('form-data');
var axios = require('axios');
var FS = require('fs');
var AWS = require('aws-sdk'), region = "us-east-1";

AWS.config.update({region: region});
var bucket = ''

async function buscaArquivoS3(key){

  try {
     let s3 = new AWS.S3();
     let reponse =  await s3.getObject({ Bucket: bucket, Key: key }).promise();     

     return reponse;
      
  } catch (error) {
    console.log(error);
  }
};


describe("Documento", function() {

  const API = "http://localhost:5000/api/v1/Categoria/upload?idCategoria=1";
  it("Documento PPI 300", async function(done) {

    var nomeArquivo = "teste.pdf";
    var arquivo = await buscaArquivoS3(nomeArquivo);
    const buffer = Buffer.from(arquivo.Body, "utf8");
    FS.writeFileSync(`${process.cwd()}/${nomeArquivo}`, buffer);

    const formData = new FormData();
    const data_file = FS.createReadStream(`${process.cwd()}/teste.pdf`);

    formData.append("file", data_file);

    var headers = { "Content-Type": `multipart/form-data; boundary=${formData._boundary}`};
    var response_post = await axios.post(API, formData, { headers: headers });

    expect(response_post.status).toBe(200); 
    done();
  });

});

describe("User", function(){

  const API = 'https://jsonplaceholder.typicode.com/users';

  it("return status 200", async function(done) {
      var response =  await axios.get(API);
      expect(response.status).toBe(200);
      done();
  });

  it("name equal Leanne Graham", async function(done) {
    var response =  await axios.get(API);
    var data = response.data[0];
    
    expect(data.name).toBe('Leanne Graham');
    done();
});  

}); 


