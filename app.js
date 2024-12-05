const express = require("express");
const https = require("https");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/Weather/:city", (req, res) => {
  const city = req.params.city; 
  const options = {
    method: "GET",
    hostname: "api.collectapi.com",
    port: null,
    path: `/weather/getWeather?data.lang=tr&data.city=${city}`, // Şehir parametresini API'ye ekle
    headers: {
      "content-type": "application/json",
      authorization: "apikey 4Ode7cVZnVP2l7YFFmeRCa:3bGgiIGPu5ngzeWtBgYKSs",
    },
  };

  const apiReq = https.request(options, (apiRes) => {
    let chunks = [];

    apiRes.on("data", (chunk) => {
      chunks.push(chunk);
    });

    apiRes.on("end", () => {
      const body = Buffer.concat(chunks).toString();
      const data = JSON.parse(body);

      if (data.success) {
        const result = {
          city: data.result[0].city,
          temperature: data.result[0].degree,
          condition: data.result[0].description,
          icon: data.result[0].icon,
        };
        res.json(result); 
      } else {
        res.status(404).json({ message: "Hava durumu bilgisi bulunamadı" });
      }
    });
  });

  apiReq.on("error", (error) => {
    res.status(500).json({ message: "API isteğinde hata oluştu", error: error.message });
  });

  apiReq.end();
});


const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
