const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp-32/1.8);
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min-32*(5/9));
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max-32*(5/9));
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temperature;
    
}
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests("https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=9c15661a76c07032e87f7d046cbd0ba7")
      .on("data",  (chunk)=> {
        const objdata = JSON.parse(chunk);
        const arraydata = [objdata]
        // console.log(arraydata[0].main.temp);
        const realTimeData = arraydata.map((val)=> replaceVal(homeFile,val)).join("");
            res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end",  (err) =>{
        if (err) return console.log("connection closed due to errors", err);

       res.end();
      });
  } else{
    res.end("file not found");
  }
});
server.listen(8000,"127.0.0.1");