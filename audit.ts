const headers = new Headers();
headers.append("Host", "quaint-orbital-isle.quiknode.pro");
headers.append(
  "User-Agent",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0"
);
headers.append("Accept", "*/*");
headers.append("Accept-Language", "en-US,en;q=0.5");
headers.append("Accept-Encoding", "gzip, deflate, br");
headers.append("Content-Type", "application/json");
headers.append("Content-Length", "109");
headers.append("Referer", "https://unidexai.xyz/");
headers.append("Origin", "https://unidexai.xyz");
headers.append("Sec-Fetch-Dest", "empty");
headers.append("Sec-Fetch-Mode", "cors");
headers.append("Sec-Fetch-Site", "cross-site");
headers.append("Sec-GPC", "1");
headers.append("Connection", "keep-alive");
headers.append("TE", "trailers");

(async () => {
  try {
    const requestBody = {
      method: "gp_tokenSecurity",
      params: ["32ga4pCjWS5Z12FJYipJFCZvVPfDy2F7QAQGgdBTUFdJ"],
      id: 42,
      jsonrpc: "2.0",
    };

    const response = await fetch(
      "https://quaint-orbital-isle.quiknode.pro/139ce259bfc400c1f76445c20826eaf95d38780b/",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody), // Convert the JSON object to a string
      }
    );

    const jsonData = await response.json();
    console.log(jsonData);
  } catch (e) {
    const error = e as Error;
    const jsonData = { message: error.message } as any;
    console.log(jsonData);
  }
})();
